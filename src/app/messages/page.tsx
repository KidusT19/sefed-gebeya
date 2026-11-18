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
  Image as ImageIcon,
  Paperclip,
  X,
  ZoomIn,
} from "lucide-react";

interface Message {
  id: string;
  conversationId?: string;
  senderId?: string;
  senderName?: string;
  receiverId?: string;
  sender?: "me" | "them";
  text: string;
  imageUrl?: string;
  isRead?: boolean;
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
  const { currentUser, isLoggedIn, isAuthReady, showToast, listings, refreshUnreadCount } = useMarketplace();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [viewingImage, setViewingImage] = useState<string | null>(null);

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

  const sellerUnreadCount = sellingConvs.reduce(
    (acc, c) => acc + (c.messages.some((m) => m.receiverId === currentUser.id && !m.isRead) ? 1 : 0),
    0
  );
  const buyerUnreadCount = buyingConvs.reduce(
    (acc, c) => acc + (c.messages.some((m) => m.receiverId === currentUser.id && !m.isRead) ? 1 : 0),
    0
  );

  const handleTabChange = (tab: "buying" | "selling") => {
    setActiveTab(tab);
    const targetList = tab === "selling" ? sellingConvs : buyingConvs;
    if (targetList.length > 0) {
      setActiveConvId(targetList[0].id);
    }
  };

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
        // If current user has seller requests (especially unread), default to selling tab
        const sellerConvs = loadedConvs.filter((c) => c.sellerId === currentUser.id);
        const buyerConvs = loadedConvs.filter((c) => !c.sellerId || c.sellerId !== currentUser.id);
        const hasSellerUnread = sellerConvs.some((c) =>
          c.messages.some((m) => m.receiverId === currentUser.id && !m.isRead)
        );

        if (hasSellerUnread || (sellerConvs.length > 0 && buyerConvs.length === 0)) {
          setActiveTab("selling");
          setActiveConvId(sellerConvs[0]?.id || loadedConvs[0].id);
        } else {
          setActiveConvId(loadedConvs[0].id);
        }
      }

      setConversations(loadedConvs);
    }

    loadConversations();
  }, [currentUser?.id, requestedListingId, listings]);

  // Mark active conversation messages as read and sync unread count
  useEffect(() => {
    if (!activeConvId || !currentUser?.id) return;

    fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeConvId, userId: currentUser.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          refreshUnreadCount();
        }
      })
      .catch(() => {});
  }, [activeConvId, currentUser?.id, refreshUnreadCount]);

  // Live polling for the active conversation (every 3 seconds)
  useEffect(() => {
    if (!activeConvId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeConvId}&userId=${currentUser.id}`);
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
  }, [activeConvId, currentUser?.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image screenshot (PNG, JPG, WEBP).", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Screenshot is too large. Please select an image under 10MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;
      if (rawData) {
        // Optimize on canvas to max 1200px width/height for fast transmission
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            setSelectedImage(compressed);
            setSelectedImageName(file.name);
            showToast("Payment screenshot attached! Ready to send.", "info");
          } else {
            setSelectedImage(rawData);
            setSelectedImageName(file.name);
          }
        };
        img.src = rawData;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || !activeConv) return;

    const messageText = inputText.trim();
    const imageToSend = selectedImage;
    setInputText("");
    setSelectedImage(null);
    setSelectedImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const isMeSeller = activeConv.sellerId === currentUser.id;
    const receiverId = isMeSeller ? activeConv.buyerId : activeConv.sellerId;

    const tempMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text: messageText || (imageToSend ? "Attached payment screenshot" : ""),
      imageUrl: imageToSend || undefined,
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
          imageUrl: imageToSend,
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
            onClick={() => handleTabChange("buying")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "buying"
                ? "bg-[#0f172a] text-white shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            <span>My Inquiries ({buyingConvs.length})</span>
            {buyerUnreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-200" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("selling")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "selling"
                ? "bg-[#0f172a] text-white shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            <span>Buyer Requests ({sellingConvs.length})</span>
            {sellerUnreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] animate-pulse">
                {sellerUnreadCount} new
              </span>
            )}
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
                      <div className="flex items-center gap-1.5">
                        {conv.messages.some((m) => m.receiverId === currentUser.id && !m.isRead) && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-100" />
                        )}
                        <span className={`text-[10px] ${isSelected ? "text-slate-600 font-semibold" : "text-slate-400"}`}>
                          {lastMsg?.time || "Active"}
                        </span>
                      </div>
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
                        {m.imageUrl && (
                          <div className="mb-2 space-y-1.5">
                            <div
                              onClick={() => setViewingImage(m.imageUrl || null)}
                              className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-black/10 hover:opacity-95 transition-all shadow-xs"
                            >
                              <img
                                src={m.imageUrl}
                                alt="Payment screenshot"
                                className="max-h-64 max-w-full rounded-xl object-contain mx-auto transition-transform group-hover:scale-[1.01]"
                              />
                              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                                <ZoomIn className="w-4 h-4" />
                                <span>Click to View Full Size</span>
                              </div>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isMe
                                  ? "text-amber-300 bg-white/10"
                                  : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Payment Receipt / Screenshot</span>
                            </div>
                          </div>
                        )}
                        {m.text && <div>{m.text}</div>}
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

            {/* Attached Payment Screenshot Preview */}
            {selectedImage && (
              <div className="px-4 py-2.5 bg-amber-50/90 border-t border-amber-200 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-300 bg-white shrink-0 shadow-xs">
                    <img
                      src={selectedImage}
                      alt="Payment Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Payment Screenshot Attached</span>
                    </div>
                    <p className="text-[11px] text-amber-800/80 truncate font-medium">
                      {selectedImageName || "payment-receipt.jpg"} &bull; Ready to send to seller
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveSelectedImage}
                  className="p-1.5 rounded-lg text-amber-800 hover:text-rose-600 hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Remove screenshot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Message Input Bar with Attach Image beside Send */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-3.5 border-t border-slate-200 flex items-center gap-2 bg-white"
            >
              <input
                type="text"
                placeholder={
                  selectedImage
                    ? "Add a note with your payment screenshot (e.g., Telebirr transaction ID)..."
                    : `Type a message to ${activeConv.participantName}...`
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:border-transparent transition-all"
              />

              {/* Hidden File Input for Payment Screenshot Attachment */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="chat-attach-image-input"
              />

              {/* Image Attach Button placed right beside Send Icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  selectedImage
                    ? "bg-amber-100 border-amber-300 text-amber-950 shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
                title="Attach payment receipt or screenshot"
              >
                <ImageIcon className="w-4 h-4 text-amber-600" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() && !selectedImage}
                className="p-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-amber-400 hover:text-amber-300 transition-colors shadow-xs flex items-center justify-center cursor-pointer shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </main>
        </div>
      )}

      {/* Full-Screen Payment Screenshot Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setViewingImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Verified Payment Screenshot / Receipt</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={viewingImage}
                alt="Enlarged Payment Screenshot"
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
              />
            </div>
            <div className="p-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Inspect Telebirr / CBE transaction reference, amount &amp; timestamp</span>
              <a
                href={viewingImage}
                download="payment-screenshot.jpg"
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                Download Receipt
              </a>
            </div>
          </div>
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
