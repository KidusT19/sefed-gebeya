"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MOCK_LISTINGS, DEFAULT_USER_BARTER_INVENTORY } from "@/data/mockData";
import { ProductListing } from "@/types/marketplace";
import { useMarketplace } from "@/context/MarketplaceContext";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import {
  MapPin,
  Phone,
  MessageCircle,
  Repeat,
  ShieldCheck,
  CheckCircle,
  Clock,
  Eye,
  Share2,
  Heart,
  ChevronLeft,
  ArrowLeft,
  AlertTriangle,
  BadgePercent,
  X,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Truck,
  UserCheck,
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;

  const { isFavorite, toggleFavorite, addOffer, isLoggedIn } = useMarketplace();

  const [listing, setListing] = useState<ProductListing>(() => {
    return MOCK_LISTINGS.find((l) => l.id === listingId) || MOCK_LISTINGS[0];
  });

  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  // Authentication Prompt Modal (Triggered only when attempting to buy, barter, or contact seller)
  const [authPrompt, setAuthPrompt] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    icon: "call" | "chat" | "buy" | "offer" | "trade" | "review";
    redirectUrl: string;
  }>({
    isOpen: false,
    title: "Sign In Required",
    description: "",
    icon: "call",
    redirectUrl: `/listings/${listingId}`,
  });

  // Action Auth Guard: Visitors can watch/browse freely; signing in is asked when contacting/buying
  const handleActionWithAuth = (
    action: "call" | "whatsapp" | "chat" | "buy" | "offer" | "trade" | "review",
    onSuccess?: () => void
  ) => {
    if (isLoggedIn) {
      if (onSuccess) onSuccess();
      return;
    }

    let title = "Sign In to Contact Seller";
    let description = `Please sign in or create an account to connect with ${listing.seller.name}.`;
    let redirectUrl = `/listings/${listing.id}`;
    let icon: "call" | "chat" | "buy" | "offer" | "trade" | "review" = "call";

    if (action === "call") {
      title = "Sign In to Call Seller";
      description = `Sign in to reveal ${listing.seller.name}'s verified phone number and call directly.`;
      redirectUrl = `/listings/${listing.id}?action=call`;
      icon = "call";
    } else if (action === "whatsapp") {
      title = "Sign In to Chat on WhatsApp";
      description = `Sign in to start a direct WhatsApp conversation with verified seller ${listing.seller.name}.`;
      redirectUrl = `/listings/${listing.id}?action=whatsapp`;
      icon = "chat";
    } else if (action === "chat") {
      title = "Sign In to Message Seller";
      description = `Sign in to start an encrypted in-app chat with ${listing.seller.name} about "${listing.title}".`;
      redirectUrl = `/messages?seller=${listing.seller.id}&listing=${listing.id}`;
      icon = "chat";
    } else if (action === "buy") {
      title = "Sign In to Buy with Escrow";
      description = `Your payment is 100% protected in Telebirr or CBE escrow until you inspect "${listing.title}". Please sign in to proceed.`;
      redirectUrl = `/checkout/escrow?listing=${listing.id}&mode=cash`;
      icon = "buy";
    } else if (action === "offer") {
      title = "Sign In to Make Cash Offer";
      description = `Sign in to submit your custom cash offer directly to ${listing.seller.name}.`;
      redirectUrl = `/listings/${listing.id}?action=offer`;
      icon = "offer";
    } else if (action === "trade") {
      title = "Sign In to Propose Barter Deal";
      description = `Sign in to select your registered device and calculate automated fair cash difference top-ups.`;
      redirectUrl = `/trades/new?target=${listing.id}`;
      icon = "trade";
    } else if (action === "review") {
      title = "Sign In to Write a Review";
      description = `Only registered community members with verified phone numbers can review Ethiopian sellers.`;
      redirectUrl = `/listings/${listing.id}?action=review`;
      icon = "review";
    }

    setAuthPrompt({
      isOpen: true,
      title,
      description,
      icon,
      redirectUrl,
    });
  };

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.listings) {
          const match = data.listings.find((l: ProductListing) => l.id === listingId);
          if (match) {
            setListing(match);
            setOfferPrice(match.price > 5000 ? match.price - 3000 : match.price - 500);
          }
        }
      })
      .catch(() => {});
  }, [listingId]);

  const saved = isFavorite(listing.id);

  // Auto-trigger intended action if returning from login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const action = sp.get("action");
      if (isLoggedIn) {
        if (action === "call") {
          setShowPhone(true);
        } else if (action === "offer") {
          setShowOfferModal(true);
        } else if (action === "review") {
          setShowReviewModal(true);
        }
      }
    }
  }, [isLoggedIn]);

  // Make Offer Modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(listing.price > 5000 ? listing.price - 3000 : listing.price - 500);
  const [offerMessage, setOfferMessage] = useState("I am ready to buy via Telebirr today if you accept this price.");
  const [offerSent, setOfferSent] = useState(false);

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewKebele, setReviewKebele] = useState(listing.kebele || "Bole");
  const [reviewSent, setReviewSent] = useState(false);

  // Customer Reviews state
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      author: "Chaltu Girma",
      kebele: "Bole",
      city: "Addis Ababa",
      rating: 5,
      date: "3 days ago",
      comment: "Met outside Posta Bet, verified device IMEI and battery health. 100% genuine seller!",
      verifiedBuyer: true,
    },
    {
      id: "rev-2",
      author: "Dawit B.",
      kebele: "Posta Bet",
      city: "Adama",
      rating: 5,
      date: "1 week ago",
      comment: "Tested device IMEI and battery health in person. Telebirr escrow released seamlessly.",
      verifiedBuyer: true,
    },
    {
      id: "rev-3",
      author: "Yonas Studio",
      kebele: "Kebele 04",
      city: "Hawassa",
      rating: 4,
      date: "2 weeks ago",
      comment: "Fair barter swap with cash top-up. Handover was transparent and easy.",
      verifiedBuyer: true,
    },
  ]);

  // Smart Multi-Item Barter Matcher state
  const [selectedBarterItemIds, setSelectedBarterItemIds] = useState<string[]>(["inv-1", "inv-2"]);
  const selectedBarterItems = DEFAULT_USER_BARTER_INVENTORY.filter((item) => selectedBarterItemIds.includes(item.id));
  const totalBarterGoodsValue = selectedBarterItems.reduce((acc, item) => acc + item.estimatedValue, 0);
  const tradeCashDiff = listing.price - totalBarterGoodsValue;

  const toggleBarterItem = (id: string) => {
    setSelectedBarterItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Similar listings
  const similarListings = MOCK_LISTINGS.filter(
    (l) => l.id !== listing.id && (l.categorySlug === listing.categorySlug || l.city === listing.city)
  ).slice(0, 3);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    addOffer(listing.id, Number(offerPrice), offerMessage);
    setOfferSent(true);

    try {
      await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          listingPrice: listing.price,
          offeredPrice: Number(offerPrice),
          sellerName: listing.seller.name,
          sellerPhone: listing.seller.phone,
          message: offerMessage,
        }),
      });
    } catch {
      // optimistic update maintained
    }

    setTimeout(() => {
      setShowOfferModal(false);
      setOfferSent(false);
    }, 1800);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: "Verified Trader",
      kebele: reviewKebele,
      city: listing.city,
      rating: reviewRating,
      date: "Just now",
      comment: reviewComment,
      verifiedBuyer: true,
    };

    setReviews([newRev, ...reviews]);
    setReviewSent(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: listing.seller.id,
          author: "Verified Trader",
          kebele: reviewKebele,
          city: listing.city,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
    } catch {
      // optimistic update maintained
    }

    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSent(false);
      setReviewComment("");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-28 sm:pb-20">
      {/* Sefed Watermark Background */}
      <SefedWatermarkBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Breadcrumb & Quick Actions Header */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-black bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-slate-50 transition-all cursor-pointer group"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(listing.id)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-bold ${
                saved
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? "fill-rose-600" : ""}`} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Listing link copied to clipboard!");
                }
              }}
              className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Gallery & Details (Left 7 cols) + Seller & Actions (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Photo Gallery */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-3 sm:p-4 shadow-xs space-y-3">
              <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={listing.images[activeImage] || listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />

                {/* Condition Tag */}
                <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  Condition: {listing.condition}
                </span>

                {/* Barter Accepted Tag */}
                {listing.allowBarter && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                    <Repeat className="w-3.5 h-3.5" /> Barter Accepted
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImage === idx
                          ? "border-[#0f172a] scale-95 ring-2 ring-slate-900/20"
                          : "border-transparent opacity-65 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Item Specs */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
                  <span className="uppercase font-extrabold text-amber-700 tracking-wider">
                    {listing.subcategory || listing.categorySlug}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> Posted {listing.postedDate}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Eye className="w-3 h-3" /> {listing.views || 48} views
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
                  {listing.title}
                </h1>

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-[#0f172a]">
                    {listing.price.toLocaleString()} ETB
                  </span>

                  {listing.isNegotiable && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Negotiable
                    </span>
                  )}

                  {/* Make Offer Button */}
                  <button
                    type="button"
                    onClick={() => handleActionWithAuth("offer", () => setShowOfferModal(true))}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-full transition-colors ml-auto cursor-pointer"
                  >
                    <BadgePercent className="w-3.5 h-3.5 text-amber-600" />
                    <span>Make Cash Offer</span>
                  </button>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900">Description</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {listing.description}
                </p>
              </div>

              {/* Trade Wishlist */}
              {listing.allowBarter && (
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wide">
                    <Repeat className="w-4 h-4 text-amber-700" />
                    <span>Seller&apos;s Barter / Trade-in Wishlist</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-bold">
                    {listing.wishlist}
                  </p>
                  <p className="text-[11px] text-amber-800 italic">
                    * Have a different device? Propose a trade with automatic cash difference top-up below.
                  </p>
                </div>
              )}

              {/* SMART MULTI-ITEM BARTER MATCHER */}
              {listing.allowBarter && (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h3 className="font-black text-sm text-slate-900">
                        Multi-Item Barter Matcher: Select 1, 2, or 3 Items to Trade
                      </h3>
                    </div>
                    <span className="text-[10px] font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full">
                      {selectedBarterItems.length} Selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Choose products from your available posts to bundle:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {DEFAULT_USER_BARTER_INVENTORY.map((d) => {
                        const isSelected = selectedBarterItemIds.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => toggleBarterItem(d.id)}
                            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-50/60 border-amber-400 shadow-xs ring-2 ring-amber-400/20"
                                : "bg-white border-slate-200 hover:bg-slate-100/70"
                            }`}
                          >
                            <div className="shrink-0 text-amber-600">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-amber-600 fill-amber-100" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <img src={d.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-slate-900 truncate">{d.title}</div>
                              <div className="text-[11px] font-extrabold text-[#0f172a]">
                                {d.estimatedValue.toLocaleString()} ETB
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calculation Result */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {selectedBarterItems.length} Products ({totalBarterGoodsValue.toLocaleString()} ETB) &bull; Fair Top-Up Balance:
                      </div>
                      <div className="text-base font-black text-[#0f172a] mt-0.5">
                        {tradeCashDiff > 0
                          ? `You add +${tradeCashDiff.toLocaleString()} ETB cash`
                          : tradeCashDiff < 0
                          ? `Seller pays you +${Math.abs(tradeCashDiff).toLocaleString()} ETB cash`
                          : "100% Even Barter (0 ETB Cash)"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleActionWithAuth("trade", () => router.push(`/trades/new?target=${listing.id}`))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-colors whitespace-nowrap self-stretch sm:self-auto justify-center cursor-pointer"
                    >
                      <Repeat className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Multi-Item Barter Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Location & Kebele Landmark */}
              <div className="space-y-2 pt-2">
                <h3 className="font-extrabold text-sm text-slate-900">Location</h3>
                <div className="flex items-start gap-2.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-[#0f172a] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-black text-slate-900">
                      {listing.kebele} Kebele, {listing.city}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Landmark: <span className="font-bold text-slate-700">{listing.landmark || "Town Center"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CUSTOMER REVIEWS & SELLER REPUTATION SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    Buyer Reviews for {listing.seller.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {listing.seller.rating} out of 5 &bull; {listing.seller.completedDeals} verified deals
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleActionWithAuth("review", () => setShowReviewModal(true))}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  + Write a Review
                </button>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        <span className="text-[10px] text-slate-400">({rev.city})</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[9px] font-bold text-amber-950 bg-amber-100 px-1.5 py-0.2 rounded-full">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Seller Profile & Actions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Seller Profile Box */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Seller Information
                </span>
                <span className="text-[11px] text-slate-500">Member since {listing.seller.memberSince}</span>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0f172a]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base text-slate-900">
                      {listing.seller.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                    <span>★ {listing.seller.rating} Rating</span>
                    <span>&bull;</span>
                    <span>{listing.seller.completedDeals} deals completed</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {listing.seller.kebele}, {listing.seller.city}
                  </div>
                </div>
              </div>

              {/* Direct Contact Actions */}
              <div className="space-y-2 pt-1">
                {showPhone && isLoggedIn ? (
                  <a
                    href={`tel:${listing.seller.phone}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Phone className="w-4 h-4" />
                    Call: {listing.seller.phone}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleActionWithAuth("call", () => setShowPhone(true))}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Show Phone Number
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleActionWithAuth("whatsapp", () => {
                      window.open(
                        `https://wa.me/${listing.seller.whatsapp.replace("+", "")}?text=Hello%20${listing.seller.name},%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(listing.title)}%20on%20Sefed%20Market.`,
                        "_blank"
                      );
                    })
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleActionWithAuth("chat", () => {
                      router.push(`/messages?seller=${listing.seller.id}&listing=${listing.id}`);
                    })
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-slate-700" />
                  In-App Chat / Message
                </button>
              </div>
            </div>

            {/* Three Integrated Buying/Trading Actions */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <h3 className="font-black text-slate-900 text-sm">Choose How to Transact</h3>

              {/* 1. Buy with Telebirr / CBE Escrow */}
              <button
                type="button"
                onClick={() =>
                  handleActionWithAuth("buy", () => {
                    router.push(`/checkout/escrow?listing=${listing.id}&mode=cash`);
                  })
                }
                className="w-full text-left block p-3.5 rounded-2xl border-2 border-[#0f172a] bg-slate-50 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> 1. Buy with Telebirr / CBE Escrow
                  </span>
                  <span className="text-[11px] font-black text-slate-950 group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                  Funds are safely held in escrow until you inspect the item and provide your release OTP.
                </p>
              </button>

              {/* 2. Swap Deal with Cash Difference */}
              {listing.allowBarter && (
                <button
                  type="button"
                  onClick={() =>
                    handleActionWithAuth("trade", () => {
                      router.push(`/trades/new?target=${listing.id}`);
                    })
                  }
                  className="w-full text-left block p-3.5 rounded-2xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-amber-950 flex items-center gap-1.5">
                      <Repeat className="w-4 h-4 text-amber-700" /> 2. Propose Barter / Swap Deal
                    </span>
                    <span className="text-[11px] font-black text-amber-800 group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 font-medium leading-relaxed">
                    Offer your device in trade and use our calculator to settle the cash difference.
                  </p>
                </button>
              )}

              {/* 3. Direct In-Person Meetup */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-600" /> 3. Direct In-Person Handover
                  </span>
                  <span className="text-[10px] font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                  Arrange a meetup at a public landmark in {listing.city} (e.g. CBE Bank branch, cafe, or post office).
                </p>
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-4 text-xs space-y-2">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" /> Safe Trading Checklist
              </span>
              <ul className="text-amber-900 space-y-1 text-[11px] list-disc list-inside font-medium leading-relaxed">
                <li>Meet in daylight at safe public spots (e.g. CBE bank branch, main town post office).</li>
                <li>Test device IMEI, iCloud/Google accounts, and camera before handover.</li>
                <li>Only release your Telebirr escrow OTP after 100% satisfaction.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Listings Section */}
        {similarListings.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Similar Verified Items</h2>
              <Link href="/listings" className="text-xs font-bold text-[#0f172a] hover:underline">
                View All Catalog &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {similarListings.map((sim) => (
                <Link
                  key={sim.id}
                  href={`/listings/${sim.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-3 hover:border-amber-400 transition-all group shadow-2xs"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img src={sim.images[0]} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase">{sim.subcategory || sim.categorySlug}</span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-[#0f172a] transition-colors">{sim.title}</h4>
                  <div className="font-black text-sm text-[#0f172a] mt-1">{sim.price.toLocaleString()} ETB</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" /> {sim.city}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Above MobileBottomNav) */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            handleActionWithAuth("call", () => {
              window.location.href = `tel:${listing.seller.phone}`;
            })
          }
          className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer"
          title="Call Seller"
        >
          <Phone className="w-4 h-4 text-slate-800" />
        </button>

        {listing.allowBarter ? (
          <button
            type="button"
            onClick={() =>
              handleActionWithAuth("trade", () => {
                router.push(`/trades/new?target=${listing.id}`);
              })
            }
            className="flex-1 py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={() =>
            handleActionWithAuth("buy", () => {
              router.push(`/checkout/escrow?listing=${listing.id}&mode=cash`);
            })
          }
          className="flex-2 py-2.5 px-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Buy with Escrow ({listing.price.toLocaleString()} ETB)</span>
        </button>
      </div>

      {/* MAKE AN OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base text-slate-900">Make Cash Offer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {offerSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-slate-900">Offer Sent to Seller!</h4>
                <p className="text-xs text-slate-500">
                  Your cash offer of <strong>{Number(offerPrice).toLocaleString()} ETB</strong> has been sent to {listing.seller.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Asking Price:</span>
                    <span className="font-bold text-slate-900">{listing.price.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seller:</span>
                    <span className="font-semibold text-slate-900">{listing.seller.name} ({listing.city})</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Your Offered Price (ETB)
                  </label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    min={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Suggested offer: between {Math.round(listing.price * 0.85).toLocaleString()} ETB and {listing.price.toLocaleString()} ETB
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Message to Seller</label>
                  <textarea
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                  ></textarea>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Send Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-base text-slate-900">Review {listing.seller.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-slate-900">Review Published!</h4>
                <p className="text-xs text-slate-500">
                  Thank you for keeping Sefed Market safe and transparent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating ? "text-amber-500 fill-amber-500" : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-900 ml-2">{reviewRating} of 5 Stars</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Your City</label>
                  <input
                    type="text"
                    value={reviewKebele}
                    onChange={(e) => setReviewKebele(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    placeholder="e.g. Addis Ababa or Adama"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Your Experience &amp; Feedback</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the handover, item condition, or seller communication..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                  ></textarea>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SIGN IN REQUIRED MODAL (Triggered when unauthenticated guest tries to buy or contact seller) */}
      {authPrompt.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Close cross */}
            <button
              type="button"
              onClick={() => setAuthPrompt((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Close modal and keep watching"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Free Watching Reassurance Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
              <span>👁️ Public Browsing is 100% Free</span>
            </div>

            {/* Action Header */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#0f172a] flex items-center justify-center shrink-0">
                  {authPrompt.icon === "call" && <Phone className="w-5 h-5 text-[#0f172a]" />}
                  {authPrompt.icon === "chat" && <MessageCircle className="w-5 h-5 text-[#0f172a]" />}
                  {authPrompt.icon === "buy" && <ShieldCheck className="w-5 h-5 text-amber-500" />}
                  {authPrompt.icon === "offer" && <BadgePercent className="w-5 h-5 text-amber-600" />}
                  {authPrompt.icon === "trade" && <Repeat className="w-5 h-5 text-amber-600" />}
                  {authPrompt.icon === "review" && <Star className="w-5 h-5 text-amber-500 fill-amber-400" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                    {authPrompt.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Sefed Market Buyer &amp; Seller Protection
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                {authPrompt.description}
              </p>
            </div>

            {/* Protection Benefits */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Why sign in is required for this action:</span>
              </div>
              <ul className="text-[11px] space-y-1 text-slate-600 pl-4 list-disc font-medium">
                <li>Protects personal contact info &amp; stops anonymous spam</li>
                <li>Enables 100% Telebirr and CBE Escrow money protection</li>
                <li>Connects you with verified sellers across Addis Ababa &amp; Ethiopia</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(authPrompt.redirectUrl)}`}
                className="w-full min-h-[46px] py-3 rounded-full bg-[#0f172a] hover:bg-[#1e293b] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href={`/auth/signup?redirect=${encodeURIComponent(authPrompt.redirectUrl)}`}
                className="w-full min-h-[42px] py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors text-center"
              >
                Create Free Sefed Account
              </Link>

              <button
                type="button"
                onClick={() => setAuthPrompt((prev) => ({ ...prev, isOpen: false }))}
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Keep Watching &amp; Browsing Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
