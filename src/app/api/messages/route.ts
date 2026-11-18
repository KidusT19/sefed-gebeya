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

  try {
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
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: new Date(m.createdAt).getTime(),
      }));

      // If DB had messages, use them; otherwise use memory
      const messagesToReturn =
        formattedMessages.length > 0 ? formattedMessages : (cachedConv?.messages || []);

      if (cachedConv) {
        cachedConv.messages = messagesToReturn;
        return NextResponse.json({ success: true, conversation: cachedConv });
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

      return NextResponse.json({ success: true, conversation: shellConv });
    }

    // 2. All Conversations for User or All Platform Conversations
    let allConvs = [...STORED_CONVERSATIONS];

    // Filter by userId if requested (user is either buyer, seller, sender, or receiver)
    if (userId) {
      allConvs = allConvs.filter(
        (c) =>
          !c.buyerId ||
          !c.sellerId ||
          c.buyerId === userId ||
          c.sellerId === userId ||
          c.messages.some((m) => m.senderId === userId || m.receiverId === userId)
      );
    }

    // Sync latest messages for each conversation from DB
    try {
      for (const conv of allConvs) {
        const msgs = await prisma.chatMessage.findMany({
          where: { conversationId: conv.id },
          orderBy: { createdAt: "asc" },
        });
        if (msgs.length > 0) {
          conv.messages = msgs.map((m) => ({
            id: m.id,
            conversationId: m.conversationId,
            senderId: m.senderId,
            senderName: m.senderName,
            receiverId: m.receiverId || undefined,
            text: m.text,
            imageUrl: m.imageUrl || undefined,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: new Date(m.createdAt).getTime(),
          }));
        }
      }
    } catch {}

    return NextResponse.json({
      success: true,
      conversations: allConvs,
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
