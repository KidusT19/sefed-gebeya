import { NextResponse } from "next/server";

export interface ApiMessage {
  id: string;
  conversationId: string;
  sender: "me" | "them";
  senderName: string;
  text: string;
  time: string;
  createdAt: number;
}

export interface ApiConversation {
  id: string;
  participantName: string;
  participantRole: "seller" | "merchant";
  participantKebele: string;
  participantPhone: string;
  itemTitle: string;
  itemPrice?: number;
  itemImage?: string;
  listingId?: string;
  quickReplies: string[];
  messages: ApiMessage[];
}

// In-memory persistent store (shared across sessions in server runtime)
let STORED_CONVERSATIONS: ApiConversation[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (conversationId) {
    const conv = STORED_CONVERSATIONS.find((c) => c.id === conversationId);
    if (!conv) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, conversation: conv });
  }

  return NextResponse.json({
    success: true,
    conversations: STORED_CONVERSATIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, text, sender = "me" } = body;

    if (!conversationId || !text?.trim()) {
      return NextResponse.json(
        { success: false, error: "conversationId and text are required" },
        { status: 400 }
      );
    }

    let convIndex = STORED_CONVERSATIONS.findIndex((c) => c.id === conversationId);
    if (convIndex === -1) {
      const newConv: ApiConversation = {
        id: conversationId,
        participantName: body.participantName || "Seller",
        participantRole: body.participantRole || "seller",
        participantKebele: body.participantKebele || "Public Meetup",
        participantPhone: body.participantPhone || "+2519...",
        itemTitle: body.itemTitle || "Product",
        itemPrice: body.itemPrice,
        itemImage: body.itemImage,
        listingId: body.listingId,
        quickReplies: [
          "Is this still available?",
          "Can we meet at a public CBE branch?",
          "Are you open to a device swap with cash top-up?",
          "I want to inspect in person.",
        ],
        messages: [],
      };
      STORED_CONVERSATIONS.push(newConv);
      convIndex = STORED_CONVERSATIONS.length - 1;
    }

    const newMsg: ApiMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender,
      senderName: sender === "me" ? "Buyer" : STORED_CONVERSATIONS[convIndex].participantName,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
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
