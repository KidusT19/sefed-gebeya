"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
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
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";

interface Message {
  id: string;
  conversationId?: string;
  senderId?: string;
  senderName?: string;
  receiverId?: string;
  sender?: "me" | "them";
  text: string;
  time: string;
  createdAt?: number;
}

interface Conversation {
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
  unreadCount?: number;
  messages: Message[];
  quickReplies: string[];
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedListingId = searchParams.get("listing");
  const requestedSellerId = searchParams.get("seller");
  const { currentUser, isLoggedIn, isAuthReady, showToast, listings } = useMarketplace();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isLoggedIn) {
      showToast("Please sign in to access your direct messages.", "info");
      router.replace(`/auth/login?redirect=/messages${requestedListingId ? `?listing=${requestedListingId}` : ""}`);
    }
  }, [isAuthReady, isLoggedIn, router, showToast, requestedListingId]);

  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");
  const [inputText, setInputText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");

  // Filter conversations according to tab
  const buyingConvs = conversations.filter((c) => !c.sellerId || c.sellerId !== currentUser.id);
  const sellingConvs = conversations.filter((c) => c.sellerId === currentUser.id);
  const displayedConvs = activeTab === "selling" ? sellingConvs : buyingConvs;

  const activeConv =
    conversations.find((c) => c.id === activeConvId) ||
    displayedConvs[0] ||
    conversations[0];

  // Auto-scroll messages stream to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages?.length]);

  // Fetch real persistent conversations from API on mount & on user change
  useEffect(() => {
    if (!currentUser?.id) return;

    async function loadConversations() {
      let loadedConvs: Conversation[] = [];
      try {
        const res = await fetch(`/api/messages?userId=${currentUser.id}`);
        const data = await res.json();
        if (data.success && data.conversations?.length > 0) {
          loadedConvs = data.conversations;
        }
      } catch {
        // use fallback initial state
      }

      // If user came to message a specific listing seller
      if (requestedListingId) {
        const targetListing = listings.find((l) => l.id === requestedListingId);
        if (targetListing) {
          const isOwner = targetListing.seller.id === currentUser.id;
          
          if (!isOwner) {
            // Buyer contacting seller
            const threadId = `conv_${targetListing.id}_${currentUser.id}`;
            const existing = loadedConvs.find((c) => c.id === threadId || c.listingId === requestedListingId);
            if (!existing) {
              const newConv: Conversation = {
                id: threadId,
                buyerId: currentUser.id,
                sellerId: targetListing.seller.id,
                participantName: targetListing.seller.name,
                participantRole: ((targetListing.seller as any).role as "seller" | "merchant") || "seller",
                participantKebele: `${targetListing.kebele || targetListing.city}, ${targetListing.city}`,
                participantPhone: targetListing.seller.phone || "+2519...",
                itemTitle: targetListing.title,
                itemPrice: targetListing.price,
                itemImage: targetListing.images[0] || "",
                listingId: targetListing.id,
                quickReplies: [
                  `Is this ${targetListing.title} available?`,
                  `Can we meet at a safe landmark in ${targetListing.city}?`,
                  `Are you open to a device swap with cash difference?`,
                  `I want to buy via Telebirr or CBE escrow.`,
                ],
                messages: [],
              };
              loadedConvs = [newConv, ...loadedConvs];
              setActiveConvId(newConv.id);
            } else {
              setActiveConvId(existing.id);
            }
          } else {
            // Current user is the seller viewing their post messages
            setActiveTab("selling");
            const existing = loadedConvs.find((c) => c.listingId === requestedListingId);
            if (existing) {
              setActiveConvId(existing.id);
            }
          }
        }
      } else if (loadedConvs.length > 0 && !activeConvId) {
        // If current user is primarily a seller with buyer requests, switch tab
        const hasSellerReqs = loadedConvs.some((c) => c.sellerId === currentUser.id);
        const hasBuyerReqs = loadedConvs.some((c) => c.buyerId === currentUser.id);
        if (hasSellerReqs && !hasBuyerReqs) {
          setActiveTab("selling");
        }
        setActiveConvId(loadedConvs[0].id);
      }

      setConversations(loadedConvs);
    }

    loadConversations();
  }, [currentUser?.id, requestedListingId, listings]);

  // Live polling for the active conversation (every 3 seconds)
  useEffect(() => {
    if (!activeConvId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeConvId}`);
        const data = await res.json();
        if (data.success && data.conversation?.messages) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId ? { ...c, messages: data.conversation.messages } : c
            )
          );
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const messageText = inputText.trim();
    setInputText("");

    const isMeSeller = activeConv.sellerId === currentUser.id;
    const receiverId = isMeSeller ? activeConv.buyerId : activeConv.sellerId;

    const tempMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
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
          senderId: currentUser.id,
          senderName: currentUser.name,
          receiverId,
          buyerId: activeConv.buyerId || (!isMeSeller ? currentUser.id : undefined),
          sellerId: activeConv.sellerId || (isMeSeller ? currentUser.id : undefined),
          participantName: activeConv.participantName,
          participantPhone: activeConv.participantPhone,
          participantKebele: activeConv.participantKebele,
          itemTitle: activeConv.itemTitle,
          itemPrice: activeConv.itemPrice,
          itemImage: activeConv.itemImage,
          listingId: activeConv.listingId,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? {
                  ...c,
                  messages: [
                    ...c.messages.filter((m) => m.id !== tempMsg.id),
                    data.message,
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
        <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xl shadow-slate-900/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-inner border border-amber-200/50">
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
              className="w-full min-h-[46px] py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-amber-400" />
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
      {/* Back Button */}
      <div className="relative z-10 pt-1">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#0f172a] font-bold bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-slate-50 transition-all cursor-pointer group"
          title="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#0f172a]" />
            Sefed Direct Messenger
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Negotiate prices, agree on barter top-ups, and coordinate safe public meetups across Ethiopia.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200">
          <button
            onClick={() => setActiveTab("buying")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "buying"
                ? "bg-[#0f172a] text-white shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            My Inquiries ({buyingConvs.length})
          </button>
          <button
            onClick={() => setActiveTab("selling")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "selling"
                ? "bg-[#0f172a] text-white shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            Buyer Requests ({sellingConvs.length})
          </button>
        </div>
      </div>

      {/* Main Chat Layout or Clean Empty State */}
      {displayedConvs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xl shadow-slate-900/5 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 mx-auto flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-slate-700" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900">
              {activeTab === "selling" ? "No Buyer Requests Yet" : "No Messages Yet"}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              {activeTab === "selling"
                ? "When buyers send you questions or barter proposals on your posts, they will appear here for you to chat in real time."
                : "Find any product on the marketplace and click 'Message Seller' to negotiate prices or propose a swap."}
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Browse Products &amp; Message Sellers</span>
          </Link>
        </div>
      ) : activeConv && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-900/5 grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          {/* Conversations Sidebar (4 cols) */}
          <aside className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/70">
            <div className="p-3.5 border-b border-slate-200 bg-white font-black text-xs text-slate-900 flex items-center justify-between">
              <span>{activeTab === "selling" ? "Buyer Inquiries" : "Conversations"}</span>
              <span className="text-[10px] font-bold text-slate-800 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                {displayedConvs.length} Active
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
              {displayedConvs.map((conv) => {
                const isSelected = conv.id === activeConv.id;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const displayName =
                  conv.sellerId === currentUser.id && conv.messages.length > 0 && conv.messages[0].senderId !== currentUser.id
                    ? conv.messages[0].senderName || conv.participantName
                    : conv.participantName;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3.5 cursor-pointer space-y-1 transition-all ${
                      isSelected
                        ? "bg-white border-l-4 border-[#0f172a] shadow-xs"
                        : "hover:bg-slate-100/70 transition-colors"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold text-xs ${
                          isSelected ? "text-slate-950 font-black" : "text-slate-800"
                        }`}
                      >
                        {displayName}
                      </span>
                      <span className={`text-[10px] ${isSelected ? "text-slate-600 font-semibold" : "text-slate-400"}`}>
                        {lastMsg?.time || "Active"}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{conv.itemTitle}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-normal">
                      {lastMsg?.text || "No messages yet"}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" /> {conv.participantKebele}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Active Chat Main Area (8 cols) */}
          <main className="md:col-span-8 flex flex-col justify-between bg-white">
            {/* Top Deal Header Bar */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                {activeConv.itemImage ? (
                  <img
                    src={activeConv.itemImage}
                    alt=""
                    width={48}
                    height={48}
                    style={{ width: "48px", height: "48px", objectFit: "cover" }}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-slate-900 truncate">
                      {activeConv.sellerId === currentUser.id && activeConv.messages.length > 0 && activeConv.messages[0].senderId !== currentUser.id
                        ? activeConv.messages[0].senderName || activeConv.participantName
                        : activeConv.participantName}
                    </h3>
                    {activeConv.participantPhone && (
                      <a
                        href={`tel:${activeConv.participantPhone}`}
                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-700 line-clamp-1">
                    {activeConv.itemTitle}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {activeConv.itemPrice ? (
                      <span className="font-black text-slate-900">
                        {activeConv.itemPrice.toLocaleString()} ETB
                      </span>
                    ) : null}
                    <span className="ml-2">&bull; {activeConv.participantKebele}</span>
                  </div>
                </div>
              </div>

              {/* Contextual Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {activeConv.listingId ? (
                  <>
                    <Link
                      href={`/trades/new?target=${activeConv.listingId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 transition-colors shadow-xs cursor-pointer"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Swap</span>
                    </Link>
                    <Link
                      href={`/checkout/escrow?listing=${activeConv.listingId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white transition-colors shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Escrow</span>
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            {/* Messages Stream - Clean Bright Backdrop with High-Contrast Crisp Bubbles */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 max-h-[400px] bg-slate-50/70">
              {activeConv.messages.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">
                    Send a message to start direct communication.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Negotiate price, agree on barter devices, or schedule a meetup at a public landmark.
                  </p>
                </div>
              ) : (
                activeConv.messages.map((m) => {
                  const isMe = m.senderId ? m.senderId === currentUser.id : m.sender === "me";

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                        {isMe ? "You" : (m.senderName || activeConv.participantName)}
                      </div>
                      <div
                        className={`max-w-md p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                          isMe
                            ? "bg-[#0f172a] text-white rounded-br-xs font-medium"
                            : "bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs font-normal"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1 font-medium">
                        {m.time} {isMe && <CheckCheck className="w-3.5 h-3.5 text-amber-400" />}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Strip */}
            {activeConv.quickReplies?.length > 0 && (
              <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-slate-400 font-bold whitespace-nowrap text-[10px] uppercase tracking-wider">Suggested:</span>
                {activeConv.quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickReply(qr)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium whitespace-nowrap transition-colors text-[11px] cursor-pointer shadow-2xs"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-3.5 border-t border-slate-200 flex items-center gap-2.5 bg-white"
            >
              <input
                type="text"
                placeholder={`Type a message to ${activeConv.participantName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-amber-400 hover:text-amber-300 transition-colors shadow-xs flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </main>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500 font-medium">Loading Sefed Direct Messenger...</div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
