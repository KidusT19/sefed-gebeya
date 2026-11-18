import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface ApiMessage {
  id: string;
  conversationId: string;
  senderId?: string;
  senderName: string;
  receiverId?: string;
  sender?: "me" | "them";
  text: string;
  imageUrl?: string;
  isRead?: boolean;
  time: string;
  createdAt: number;
}

export interface ApiConversation {
  id: string;
  buyerId?: string;
  sellerId?: string;
  participantName: string;
  participantRole: "seller" | "merchant" | "buyer";
  participantKebele: string;
  participantPhone: string;
  itemTitle: string;
  itemPrice?: number;
  itemImage?: string;
  listingId?: string;
  quickReplies: string[];
  messages: ApiMessage[];
  updatedAt?: number;
}

// In-memory fallback and metadata cache
let STORED_CONVERSATIONS: ApiConversation[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const userId = searchParams.get("userId");
  const markRead = searchParams.get("markRead") === "true";

  try {
    // Automatically mark conversation messages as read when viewing with userId
    if (conversationId && userId && markRead !== false) {
      try {
        await prisma.chatMessage.updateMany({
          where: {
            conversationId,
            receiverId: userId,
            isRead: false,
          },
          data: { isRead: true },
        });
      } catch {}
    }

    // Calculate unread senders count for the current user
    let unreadSendersCount = 0;
    if (userId) {
      try {
        const unreadMsgs = await prisma.chatMessage.findMany({
          where: {
            receiverId: userId,
            isRead: false,
          },
          select: { senderId: true },
        });
        unreadSendersCount = new Set(unreadMsgs.map((m) => m.senderId)).size;
      } catch {}
    }

    // 1. Specific Conversation Messages
    if (conversationId) {
      let dbMessages: any[] = [];
      try {
        dbMessages = await prisma.chatMessage.findMany({
          where: { conversationId },
          orderBy: { createdAt: "asc" },
        });
      } catch (dbErr) {
        // Fallback to in-memory if db is busy
      }

      const cachedConv = STORED_CONVERSATIONS.find((c) => c.id === conversationId);

      // Merge messages from DB with cached conversation
      const formattedMessages: ApiMessage[] = dbMessages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.senderName,
        receiverId: m.receiverId || undefined,
        text: m.text,
        imageUrl: m.imageUrl || undefined,
        isRead: m.isRead,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: new Date(m.createdAt).getTime(),
      }));

      // If DB had messages, use them; otherwise use memory
      const messagesToReturn =
        formattedMessages.length > 0 ? formattedMessages : (cachedConv?.messages || []);

      if (cachedConv) {
        cachedConv.messages = messagesToReturn;
        return NextResponse.json({ success: true, conversation: cachedConv, unreadSendersCount });
      }

      // If conversation wasn't in memory yet, return a basic conversation shell
      const shellConv: ApiConversation = {
        id: conversationId,
        participantName: "Trader",
        participantRole: "seller",
        participantKebele: "Adama, Ethiopia",
        participantPhone: "",
        itemTitle: "Product Exchange",
        quickReplies: [],
        messages: messagesToReturn,
      };

      return NextResponse.json({ success: true, conversation: shellConv, unreadSendersCount });
    }

    // 2. All Conversations for User or All Platform Conversations Reconstructed from Prisma SQLite
    const convMap = new Map<string, any[]>();
    try {
      const allDbMsgs = await prisma.chatMessage.findMany({
        where: userId
          ? {
              OR: [{ senderId: userId }, { receiverId: userId }],
            }
          : {},
        orderBy: { createdAt: "asc" },
      });

      for (const m of allDbMsgs) {
        if (!convMap.has(m.conversationId)) {
          convMap.set(m.conversationId, []);
        }
        convMap.get(m.conversationId)!.push(m);
      }
    } catch (dbErr) {
      console.warn("Prisma conversation query error:", dbErr);
    }

    // Load users and listings to enrich conversations with titles, prices, and avatars
    let allUsers: any[] = [];
    let allListings: any[] = [];
    try {
      [allUsers, allListings] = await Promise.all([
        prisma.user.findMany(),
        prisma.listing.findMany(),
      ]);
    } catch {}

    const reconstructedConvs: ApiConversation[] = [];

    for (const [convId, msgs] of convMap.entries()) {
      const parts = convId.split("_");
      const listingId = parts[1];
      const buyerIdFromId = parts[2];

      const otherMsg = msgs.find((m) => m.senderId !== userId);
      const otherId = otherMsg ? otherMsg.senderId : (msgs[0].receiverId || buyerIdFromId);
      const otherUser = allUsers.find((u) => u.id === otherId);
      const listing = allListings.find((l) => l.id === listingId);

      const isSeller = listing ? listing.userId === userId : false;

      let parsedImages: string[] = [];
      if (listing?.imageUrls) {
        try {
          parsedImages = JSON.parse(listing.imageUrls);
        } catch {
          parsedImages = [listing.imageUrls];
        }
      }

      const formattedMsgs: ApiMessage[] = msgs.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.senderName,
        receiverId: m.receiverId || undefined,
        text: m.text,
        imageUrl: m.imageUrl || undefined,
        isRead: m.isRead,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: new Date(m.createdAt).getTime(),
      }));

      const cached = STORED_CONVERSATIONS.find((c) => c.id === convId);

      const conv: ApiConversation = {
        id: convId,
        buyerId: isSeller ? otherId : (userId || buyerIdFromId),
        sellerId: isSeller ? (userId || listing?.userId) : (listing?.userId || otherId),
        participantName: otherUser ? otherUser.name : (otherMsg ? otherMsg.senderName : (cached?.participantName || "Trader")),
        participantRole: isSeller ? "buyer" : "seller",
        participantKebele: otherUser?.kebele || otherUser?.city || listing?.kebele || listing?.city || "Adama, Ethiopia",
        participantPhone: otherUser?.phone || cached?.participantPhone || "",
        itemTitle: listing ? listing.title : (cached?.itemTitle || "Product Exchange"),
        itemPrice: listing ? listing.price : cached?.itemPrice,
        itemImage: parsedImages[0] || cached?.itemImage || "",
        listingId: listing?.id || listingId,
        quickReplies: cached?.quickReplies || [
          "Is this item still available?",
          "Can we meet at a safe landmark in town?",
          "Are you open to a device swap with cash difference?",
        ],
        messages: formattedMsgs,
        updatedAt: formattedMsgs[formattedMsgs.length - 1]?.createdAt || Date.now(),
      };

      reconstructedConvs.push(conv);
    }

    // Also include any cached conversations that might not have DB messages yet
    for (const cached of STORED_CONVERSATIONS) {
      if (!reconstructedConvs.some((c) => c.id === cached.id)) {
        if (!userId || cached.buyerId === userId || cached.sellerId === userId) {
          reconstructedConvs.push(cached);
        }
      }
    }

    // Sort conversations by latest message timestamp descending
    reconstructedConvs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    return NextResponse.json({
      success: true,
      conversations: reconstructedConvs,
      unreadSendersCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      conversationId,
      text,
      imageUrl,
      senderId,
      senderName,
      receiverId,
      buyerId,
      sellerId,
      participantName,
      participantPhone,
      participantKebele,
      itemTitle,
      itemPrice,
      itemImage,
      listingId,
    } = body;

    const messageText = (text || "").trim();
    if (!conversationId || (!messageText && !imageUrl)) {
      return NextResponse.json(
        { success: false, error: "conversationId and either text or imageUrl are required" },
        { status: 400 }
      );
    }

    // 1. Find or create in-memory conversation metadata
    let convIndex = STORED_CONVERSATIONS.findIndex((c) => c.id === conversationId);
    if (convIndex === -1) {
      const newConv: ApiConversation = {
        id: conversationId,
        buyerId: buyerId || senderId,
        sellerId: sellerId || receiverId,
        participantName: participantName || "Trader",
        participantRole: "seller",
        participantKebele: participantKebele || "Public Landmark Meetup",
        participantPhone: participantPhone || "+2519...",
        itemTitle: itemTitle || "Product",
        itemPrice,
        itemImage,
        listingId,
        quickReplies: [
          "Is this item still available?",
          "Can we meet at a safe landmark in town?",
          "Are you open to a device swap with cash difference?",
        ],
        messages: [],
        updatedAt: Date.now(),
      };
      STORED_CONVERSATIONS.unshift(newConv);
      convIndex = 0;
    } else {
      STORED_CONVERSATIONS[convIndex].updatedAt = Date.now();
      if (buyerId) STORED_CONVERSATIONS[convIndex].buyerId = buyerId;
      if (sellerId) STORED_CONVERSATIONS[convIndex].sellerId = sellerId;
    }

    // 2. Persist real message to Prisma SQLite database
    let createdDbMsg: any = null;
    try {
      createdDbMsg = await prisma.chatMessage.create({
        data: {
          conversationId,
          senderId: senderId || "user",
          senderName: senderName || "Trader",
          receiverId: receiverId || null,
          text: messageText || (imageUrl ? "Attached payment screenshot" : ""),
          imageUrl: imageUrl || null,
        },
      });
    } catch (dbErr) {
      // Fallback: continue with in-memory creation if SQLite write has lock
    }

    const newMsg: ApiMessage = {
      id: createdDbMsg?.id || `msg-${Date.now()}`,
      conversationId,
      senderId: createdDbMsg?.senderId || senderId || "user",
      senderName: createdDbMsg?.senderName || senderName || "Trader",
      receiverId: createdDbMsg?.receiverId || receiverId,
      text: messageText || (imageUrl ? "Attached payment screenshot" : ""),
      imageUrl: createdDbMsg?.imageUrl || imageUrl || undefined,
      time: createdDbMsg
        ? new Date(createdDbMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: createdDbMsg ? new Date(createdDbMsg.createdAt).getTime() : Date.now(),
    };

    STORED_CONVERSATIONS[convIndex].messages.push(newMsg);

    return NextResponse.json({
      success: true,
      message: newMsg,
      conversation: STORED_CONVERSATIONS[convIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, userId } = body;

    if (conversationId && userId) {
      try {
        await prisma.chatMessage.updateMany({
          where: {
            conversationId,
            receiverId: userId,
            isRead: false,
          },
          data: { isRead: true },
        });
      } catch {}
    }

    let unreadSendersCount = 0;
    if (userId) {
      try {
        const unreadMsgs = await prisma.chatMessage.findMany({
          where: {
            receiverId: userId,
            isRead: false,
          },
          select: { senderId: true },
        });
        unreadSendersCount = new Set(unreadMsgs.map((m) => m.senderId)).size;
      } catch {}
    }

    return NextResponse.json({
      success: true,
      unreadSendersCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update read status" },
      { status: 500 }
    );
  }
}
