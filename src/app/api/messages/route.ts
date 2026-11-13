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
let STORED_CONVERSATIONS: ApiConversation[] = [
  {
    id: "conv-1",
    participantName: "Henok Tadesse",
    participantRole: "seller",
    participantKebele: "Bole Kebele, Adama",
    participantPhone: "+251911448822",
    itemTitle: "iPhone 13 Pro 128GB - Sierra Blue",
    itemPrice: 55000,
    itemImage:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&auto=format&fit=crop&q=80",
    listingId: "lst-1",
    quickReplies: [
      "Is this still available in Bole?",
      "Can we meet at Bole High School Gate?",
      "Are you open to barter swap + cash top-up?",
      "I want to buy via Telebirr Escrow today.",
    ],
    messages: [
      {
        id: "m-1-1",
        conversationId: "conv-1",
        sender: "them",
        senderName: "Henok Tadesse",
        text: "Hello! Yes, the iPhone 13 Pro is available with original box and 89% battery health in Bole.",
        time: "10:15 AM",
        createdAt: Date.now() - 3600000,
      },
      {
        id: "m-1-2",
        conversationId: "conv-1",
        sender: "me",
        senderName: "Buyer",
        text: "Great! Are you open to a barter swap with Samsung S21 or cash via Telebirr escrow?",
        time: "10:18 AM",
        createdAt: Date.now() - 3400000,
      },
      {
        id: "m-1-3",
        conversationId: "conv-1",
        sender: "them",
        senderName: "Henok Tadesse",
        text: "Yes, I am happy to accept S21 with fair cash top-up! You can send me a swap proposal directly through the platform.",
        time: "10:20 AM",
        createdAt: Date.now() - 3200000,
      },
    ],
  },
  {
    id: "conv-2",
    participantName: "Dawit Bekele (Arada Tech)",
    participantRole: "merchant",
    participantKebele: "Arada Electronics Center, Stall 14",
    participantPhone: "+251922771133",
    itemTitle: "Dell XPS 13 (Core i7 11th Gen, 16GB RAM)",
    itemPrice: 68000,
    itemImage:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80",
    listingId: "lst-2",
    quickReplies: [
      "Can I inspect the laptop at Arada Market?",
      "Can you top up 8,000 ETB for the swap?",
      "Does it come with original Dell type-C charger?",
    ],
    messages: [
      {
        id: "m-2-1",
        conversationId: "conv-2",
        sender: "them",
        senderName: "Dawit Bekele",
        text: "Selam! I saw your barter proposal. The Dell XPS 13 is thoroughly tested and has 7+ hours battery.",
        time: "Yesterday",
        createdAt: Date.now() - 86400000,
      },
      {
        id: "m-2-2",
        conversationId: "conv-2",
        sender: "me",
        senderName: "Buyer",
        text: "Can I inspect the laptop at your shop in Arada before releasing the Telebirr escrow?",
        time: "Yesterday",
        createdAt: Date.now() - 86000000,
      },
      {
        id: "m-2-3",
        conversationId: "conv-2",
        sender: "them",
        senderName: "Dawit Bekele",
        text: "Absolutely! You are welcome anytime at Stall 14 in Arada Market to inspect and test it.",
        time: "Yesterday",
        createdAt: Date.now() - 85000000,
      },
    ],
  },
  {
    id: "conv-3",
    participantName: "Chaltu Girma",
    participantRole: "seller",
    participantKebele: "Kebele 04, Adama",
    participantPhone: "+251933556677",
    itemTitle: "Sony WH-1000XM4 Wireless Headphones",
    itemPrice: 19000,
    itemImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    listingId: "lst-3",
    quickReplies: [
      "Is the noise cancellation working perfectly?",
      "Can we meet at Posta Bet tomorrow?",
      "Would you accept 17,500 ETB cash?",
    ],
    messages: [
      {
        id: "m-3-1",
        conversationId: "conv-3",
        sender: "them",
        senderName: "Chaltu Girma",
        text: "Selam! Yes, the Sony WH-1000XM4 is in mint condition with active noise cancellation and carry case.",
        time: "2 days ago",
        createdAt: Date.now() - 172800000,
      },
      {
        id: "m-3-2",
        conversationId: "conv-3",
        sender: "me",
        senderName: "Buyer",
        text: "Can we meet at Posta Bet so I can test the sound quality before purchasing?",
        time: "2 days ago",
        createdAt: Date.now() - 172000000,
      },
      {
        id: "m-3-3",
        conversationId: "conv-3",
        sender: "them",
        senderName: "Chaltu Girma",
        text: "Sure! I am available around 3:00 PM near Posta Bet. Let me know when you arrive.",
        time: "2 days ago",
        createdAt: Date.now() - 171000000,
      },
    ],
  },
];

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

    const convIndex = STORED_CONVERSATIONS.findIndex((c) => c.id === conversationId);
    if (convIndex === -1) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
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

    // Contextual auto-reply simulation
    let autoReply: ApiMessage | null = null;
    const conv = STORED_CONVERSATIONS[convIndex];

    if (sender === "me") {
      let replyText = "Understood! Let's complete this transaction safely via Sebez Escrow.";
      const lower = text.toLowerCase();

      if (lower.includes("meet") || lower.includes("arada") || lower.includes("posta")) {
        replyText =
          "Sounds great. Let's meet at the agreed public landmark in Adama so you can test the device in person.";
      } else if (lower.includes("telebirr") || lower.includes("escrow") || lower.includes("buy")) {
        replyText =
          "Telebirr escrow works best for me as well. Once you authorize the hold, we can meet up to hand it over!";
      } else if (lower.includes("price") || lower.includes("offer") || lower.includes("etb")) {
        replyText =
          "I can consider that price if you pay via Telebirr or include an acceptable phone barter top-up.";
      }

      autoReply = {
        id: `msg-reply-${Date.now() + 1}`,
        conversationId,
        sender: "them",
        senderName: conv.participantName,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now() + 1000,
      };

      STORED_CONVERSATIONS[convIndex].messages.push(autoReply);
    }

    return NextResponse.json({
      success: true,
      message: newMsg,
      autoReply,
      conversation: STORED_CONVERSATIONS[convIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
