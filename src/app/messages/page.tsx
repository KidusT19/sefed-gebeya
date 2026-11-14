"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import { MOCK_LISTINGS } from "@/data/mockData";
import {
  Send,
  MapPin,
  Repeat,
  ShieldCheck,
  CheckCheck,
  User,
  MessageSquare,
  ShoppingBag,
  Phone,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: "seller" | "merchant";
  participantKebele: string;
  participantPhone: string;
  itemTitle: string;
  itemPrice?: number;
  itemImage?: string;
  listingId?: string;
  unreadCount?: number;
  messages: Message[];
  quickReplies: string[];
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedListingId = searchParams.get("listing");
  const { isLoggedIn, showToast } = useMarketplace();

  useEffect(() => {
    if (!isLoggedIn) {
      showToast("Please sign in to access your direct messages.", "info");
      router.replace(`/auth/login?redirect=/messages${requestedListingId ? `?listing=${requestedListingId}` : ""}`);
    }
  }, [isLoggedIn, router, showToast, requestedListingId]);

  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");
  const [inputText, setInputText] = useState("");

  const [conversations, setConversations] = useState<Conversation[]>([
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
          sender: "them",
          text: "Hello! Yes, the iPhone 13 Pro is available with original box and 89% battery health in Bole.",
          time: "10:15 AM",
        },
        {
          id: "m-1-2",
          sender: "me",
          text: "Great! Are you open to a barter swap with Samsung S21 or cash via Telebirr escrow?",
          time: "10:18 AM",
        },
        {
          id: "m-1-3",
          sender: "them",
          text: "Yes, I am happy to accept S21 with fair cash top-up! You can send me a swap proposal directly through the platform.",
          time: "10:20 AM",
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
          sender: "them",
          text: "Selam! I saw your barter proposal. The Dell XPS 13 is thoroughly tested and has 7+ hours battery.",
          time: "Yesterday",
        },
        {
          id: "m-2-2",
          sender: "me",
          text: "Can I inspect the laptop at your shop in Arada before releasing the Telebirr escrow?",
          time: "Yesterday",
        },
        {
          id: "m-2-3",
          sender: "them",
          text: "Absolutely! You are welcome anytime at Stall 14 in Arada Market to inspect and test it.",
          time: "Yesterday",
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
          sender: "them",
          text: "Selam! Yes, the Sony WH-1000XM4 is in mint condition with active noise cancellation and carry case.",
          time: "2 days ago",
        },
        {
          id: "m-3-2",
          sender: "me",
          text: "Can we meet at Posta Bet so I can test the sound quality before purchasing?",
          time: "2 days ago",
        },
        {
          id: "m-3-3",
          sender: "them",
          text: "Sure! I am available around 3:00 PM near Posta Bet. Let me know when you arrive.",
          time: "2 days ago",
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>(
    requestedListingId === "lst-2" ? "conv-2" : "conv-1"
  );

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Fetch real persistent conversations from API on mount
  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        if (data.success && data.conversations?.length > 0) {
          setConversations(data.conversations);
        }
      } catch {
        // use fallback initial state
      }
    }
    loadConversations();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText("");

    const tempMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, messages: [...c.messages, tempMsg] } : c))
    );

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          text: messageText,
          sender: "me",
        }),
      });

      const data = await res.json();
      if (data.success && data.autoReply) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? {
                  ...c,
                  messages: [
                    ...c.messages.filter((m) => m.id !== tempMsg.id),
                    data.message,
                    data.autoReply,
                  ],
                }
              : c
          )
        );
      }
    } catch {
      // keep optimistic message
    }
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-12">
        <SefedWatermarkBackground opacity={0.15} blur="md" />
        <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl border border-emerald-900/10 p-8 text-center space-y-5 shadow-xl shadow-emerald-950/5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0e623a] mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Direct Messages Protected
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
              Direct chats, contact numbers, and price negotiation rooms are confidential and require you to sign in.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/auth/login?redirect=/messages${requestedListingId ? `?listing=${requestedListingId}` : ""}`}
              className="w-full min-h-[46px] py-3.5 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href={`/auth/signup?redirect=/messages${requestedListingId ? `?listing=${requestedListingId}` : ""}`}
              className="w-full min-h-[44px] py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
            >
              Create Free Sefed Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-4 pb-16">
      <SefedWatermarkBackground opacity={0.12} blur="md" />
      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#0e623a]" />
            Sefed Direct Messenger
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Negotiate prices, agree on barter top-ups, and coordinate safe public meetups across Ethiopia.
          </p>
        </div>

        <div className="flex bg-[#eee4d5] p-1 rounded-xl text-xs font-semibold text-[#52361f] border border-[#dfd2be]">
          <button
            onClick={() => setActiveTab("buying")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "buying" ? "bg-[#faf5ed] text-[#2b1c11] shadow-2xs font-bold" : "hover:text-[#2b1c11]"
            }`}
          >
            My Inquiries (3)
          </button>
          <button
            onClick={() => setActiveTab("selling")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "selling" ? "bg-[#faf5ed] text-[#2b1c11] shadow-2xs font-bold" : "hover:text-[#2b1c11]"
            }`}
          >
            Buyer Requests (0)
          </button>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] overflow-hidden shadow-2xs grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Conversations Sidebar (4 cols) */}
        <aside className="md:col-span-4 border-r border-[#dfd2be] flex flex-col bg-[#ede4d6]/60">
          <div className="p-3.5 border-b border-[#dfd2be] bg-[#faf5ed] font-black text-xs text-[#3d2717] flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[10px] font-bold text-[#1d4ed8] bg-[#dbeafe] px-2 py-0.5 rounded-full">
              {conversations.length} Active
            </span>
          </div>

          <div className="divide-y divide-[#dfd2be] overflow-y-auto flex-1">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConv.id;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer space-y-1 transition-all ${
                    isSelected
                      ? "bg-[#faf5ed] border-l-4 border-[#1d4ed8] shadow-2xs"
                      : "hover:bg-[#ede4d6] opacity-85"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-xs ${
                        isSelected ? "text-[#1e3a8a]" : "text-[#2b1c11]"
                      }`}
                    >
                      {conv.participantName}
                    </span>
                    <span className="text-[10px] text-[#785437]">{lastMsg?.time || "Active"}</span>
                  </div>

                  <p className="text-xs font-semibold text-[#52361f] line-clamp-1">{conv.itemTitle}</p>
                  <p className="text-[11px] text-[#785437] line-clamp-1">
                    {lastMsg?.text || "No messages yet"}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#8d7159] pt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#1d4ed8]" /> {conv.participantKebele}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Active Chat Main Area (8 cols) */}
        <main className="md:col-span-8 flex flex-col justify-between bg-[#faf5ed]">
          {/* Top Deal Header Bar */}
          <div className="p-3.5 border-b border-[#dfd2be] flex items-center justify-between bg-[#ede4d6] gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {activeConv.itemImage ? (
                <img
                  src={activeConv.itemImage}
                  alt=""
                  width={48}
                  height={48}
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                  className="w-12 h-12 rounded-xl object-cover border border-[#dfd2be] flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#3d2717] text-white flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-xs text-[#2b1c11] truncate">
                    {activeConv.participantName}
                  </h3>
                  <a
                    href={`tel:${activeConv.participantPhone}`}
                    className="text-[#1d4ed8] hover:text-[#1e40af]"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="text-xs font-bold text-[#52361f] line-clamp-1">
                  {activeConv.itemTitle}
                </div>
                <div className="text-[11px] text-[#785437]">
                  {activeConv.itemPrice ? (
                    <span className="font-black text-[#1d4ed8]">
                      {activeConv.itemPrice.toLocaleString()} ETB
                    </span>
                  ) : null}
                  <span className="ml-2 font-medium">&bull; {activeConv.participantKebele}</span>
                </div>
              </div>
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {activeConv.listingId ? (
                <>
                  <Link
                    href={`/trades/new?target=${activeConv.listingId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#3d2717] text-white hover:bg-[#52361f] transition-colors shadow-2xs"
                  >
                    <Repeat className="w-3 h-3 text-amber-300" />
                    <span>Swap</span>
                  </Link>
                  <Link
                    href={`/checkout/escrow?listing=${activeConv.listingId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-colors shadow-2xs"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Escrow</span>
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-3.5 overflow-y-auto flex-1 max-h-[380px]">
            {activeConv.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "me"
                      ? "bg-[#1d4ed8] text-white rounded-br-xs shadow-xs"
                      : "bg-[#ede4d6] text-[#2b1c11] border border-[#dfd2be] rounded-bl-xs shadow-2xs font-medium"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#8d7159] mt-1 px-1 flex items-center gap-1">
                  {m.time} {m.sender === "me" && <CheckCheck className="w-3.5 h-3.5 text-[#1d4ed8]" />}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Replies Strip */}
          <div className="px-4 py-2 bg-[#ede4d6] border-t border-[#dfd2be] flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[#785437] font-bold whitespace-nowrap">Suggested:</span>
            {activeConv.quickReplies.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickReply(qr)}
                className="px-3 py-1 rounded-full bg-[#faf5ed] border border-[#dfd2be] hover:border-[#1d4ed8] text-[#3d2717] font-semibold whitespace-nowrap hover:bg-[#eff6ff] transition-colors"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#dfd2be] flex items-center gap-2 bg-[#faf5ed]"
          >
            <input
              type="text"
              placeholder={`Message ${activeConv.participantName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-xs text-[#2b1c11] placeholder-[#8d7159] focus:bg-[#faf5ed] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-[#785437]">Loading Adama Messenger...</div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
