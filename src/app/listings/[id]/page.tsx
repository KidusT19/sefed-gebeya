"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_LISTINGS } from "@/data/mockData";
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
  AlertTriangle,
  BadgePercent,
  X,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Truck,
  UserCheck,
} from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params?.id as string;

  const { isFavorite, toggleFavorite, addOffer } = useMarketplace();

  const [listing, setListing] = useState<ProductListing>(() => {
    return MOCK_LISTINGS.find((l) => l.id === listingId) || MOCK_LISTINGS[0];
  });

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

  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

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

  // Smart Barter Matcher state
  const myDevices = [
    {
      id: "my-1",
      title: "Samsung Galaxy S21 5G (128GB)",
      value: 36000,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "my-2",
      title: "HP Pavilion Gaming Laptop (Core i5)",
      value: 48000,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    },
  ];
  const [selectedMyDeviceId, setSelectedMyDeviceId] = useState(myDevices[0].id);
  const selectedDevice = myDevices.find((d) => d.id === selectedMyDeviceId) || myDevices[0];
  const tradeCashDiff = listing.price - selectedDevice.value;

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
          <Link
            href="/listings"
            className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-700" />
            <span>Back to All Listings</span>
          </Link>

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
                          ? "border-[#0e623a] scale-95 ring-2 ring-emerald-600/30"
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
                  <span className="uppercase font-extrabold text-emerald-800 tracking-wider">
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
                  <span className="text-2xl sm:text-3xl font-black text-[#0e623a]">
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
                    onClick={() => setShowOfferModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors ml-auto cursor-pointer"
                  >
                    <BadgePercent className="w-3.5 h-3.5 text-emerald-700" />
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

              {/* SMART BARTER MATCHER */}
              {listing.allowBarter && (
                <div className="bg-emerald-50/60 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h3 className="font-black text-sm text-emerald-950">
                        Smart Swap Calculator: See What You Can Trade
                      </h3>
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Instant Match
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Select one of your registered devices:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {myDevices.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setSelectedMyDeviceId(d.id)}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            selectedMyDeviceId === d.id
                              ? "bg-white border-emerald-600 shadow-xs ring-2 ring-emerald-600/30"
                              : "bg-white/80 border-slate-200 hover:bg-white"
                          }`}
                        >
                          <img src={d.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 truncate">{d.title}</div>
                            <div className="text-[11px] font-extrabold text-emerald-800">
                              Value: {d.value.toLocaleString()} ETB
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculation Result */}
                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Calculated Fair Top-Up:</span>
                      <div className="text-base font-black text-[#0b4d2e] mt-0.5">
                        {tradeCashDiff > 0
                          ? `You add +${tradeCashDiff.toLocaleString()} ETB cash`
                          : tradeCashDiff < 0
                          ? `Seller pays you +${Math.abs(tradeCashDiff).toLocaleString()} ETB cash`
                          : "Even Direct Swap (0 ETB)"}
                      </div>
                    </div>

                    <Link
                      href={`/trades/new?target=${listing.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-xs shadow-xs transition-colors whitespace-nowrap self-stretch sm:self-auto justify-center"
                    >
                      <span>Propose This Trade</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Location & Kebele Landmark */}
              <div className="space-y-2 pt-2">
                <h3 className="font-extrabold text-sm text-slate-900">Location</h3>
                <div className="flex items-start gap-2.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
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
                  onClick={() => setShowReviewModal(true)}
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
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
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
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base text-slate-900">
                      {listing.seller.name}
                    </span>
                    {listing.seller.isVerified && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    )}
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
                {showPhone ? (
                  <a
                    href={`tel:${listing.seller.phone}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Phone className="w-4 h-4" />
                    Call: {listing.seller.phone}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPhone(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Show Phone Number
                  </button>
                )}

                <a
                  href={`https://wa.me/${listing.seller.whatsapp.replace("+", "")}?text=Hello%20${listing.seller.name},%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(listing.title)}%20on%20Sefed%20Market.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>

                <Link
                  href={`/messages?seller=${listing.seller.id}&listing=${listing.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  In-App Chat / Message
                </Link>
              </div>
            </div>

            {/* Three Integrated Buying/Trading Actions */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <h3 className="font-black text-slate-900 text-sm">Choose How to Transact</h3>

              {/* 1. Buy with Telebirr / CBE Escrow */}
              <Link
                href={`/checkout/escrow?listing=${listing.id}&mode=cash`}
                className="block p-3.5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> 1. Buy with Telebirr / CBE Escrow
                  </span>
                  <span className="text-[11px] font-black text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 font-medium leading-relaxed">
                  Funds are safely held in escrow until you inspect the item and provide your release OTP.
                </p>
              </Link>

              {/* 2. Swap Deal with Cash Difference */}
              {listing.allowBarter && (
                <Link
                  href={`/trades/new?target=${listing.id}`}
                  className="block p-3.5 rounded-2xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 transition-colors group"
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
                </Link>
              )}

              {/* 3. Direct In-Person Meetup */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-600" /> 3. Direct In-Person Handover
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
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
              <Link href="/listings" className="text-xs font-bold text-emerald-700 hover:underline">
                View All Catalog &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {similarListings.map((sim) => (
                <Link
                  key={sim.id}
                  href={`/listings/${sim.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-3 hover:border-emerald-500 transition-all group shadow-2xs"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img src={sim.images[0]} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">{sim.subcategory || sim.categorySlug}</span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{sim.title}</h4>
                  <div className="font-black text-sm text-[#0e623a] mt-1">{sim.price.toLocaleString()} ETB</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" /> {sim.city}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Above MobileBottomNav) */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center gap-2">
        <a
          href={`tel:${listing.seller.phone}`}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200"
          title="Call Seller"
        >
          <Phone className="w-4 h-4 text-emerald-700" />
        </a>

        {listing.allowBarter ? (
          <Link
            href={`/trades/new?target=${listing.id}`}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs text-center flex items-center justify-center gap-1"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Swap</span>
          </Link>
        ) : null}

        <Link
          href={`/checkout/escrow?listing=${listing.id}&mode=cash`}
          className="flex-2 py-2.5 px-4 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Buy with Escrow ({listing.price.toLocaleString()} ETB)</span>
        </Link>
      </div>

      {/* MAKE AN OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-emerald-700" />
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
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                    className="w-1/2 py-2.5 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-bold text-xs transition-colors shadow-xs"
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
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                    className="w-1/2 py-2.5 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
