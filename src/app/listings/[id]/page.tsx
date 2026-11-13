"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_LISTINGS } from "@/data/mockData";
import { ProductListing } from "@/types/marketplace";
import { useMarketplace } from "@/context/MarketplaceContext";
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
  Smartphone,
  MessageSquare,
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
  const [reviewKebele, setReviewKebele] = useState("Bole");
  const [reviewSent, setReviewSent] = useState(false);

  // Customer Reviews state
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      author: "Chaltu Girma",
      kebele: "Bole Kebele",
      rating: 5,
      date: "3 days ago",
      comment: "Met outside Posta Bet, verified device IMEI and battery health. 100% genuine seller in Adama!",
      verifiedBuyer: true,
    },
    {
      id: "rev-2",
      author: "Dawit B.",
      kebele: "Arada Market",
      rating: 5,
      date: "1 week ago",
      comment: "Met outside Posta Bet near Arada Market. Tested device IMEI and battery health in person. 100% genuine seller in Adama!",
      verifiedBuyer: true,
    },
    {
      id: "rev-3",
      author: "Yonas Studio",
      kebele: "Kebele 04",
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
    (l) => l.id !== listing.id && (l.categorySlug === listing.categorySlug || l.kebele === listing.kebele)
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
    <div className="space-y-8 pb-16">
      {/* Back to listings breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#785437]">
        <Link href="/listings" className="inline-flex items-center gap-1 hover:text-[#1d4ed8] font-bold">
          <ChevronLeft className="w-4 h-4" /> Back to Listings in Adama
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`p-2 rounded-xl border flex items-center gap-1 transition-colors ${
              saved
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-[#faf5ed] border-[#dfd2be] hover:bg-[#eee4d5] text-[#52361f]"
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            <span className="text-xs font-semibold">{saved ? "Saved" : "Save"}</span>
          </button>
          <button
            onClick={() => alert("Listing link copied to clipboard!")}
            className="p-2 rounded-xl border bg-[#faf5ed] border-[#dfd2be] hover:bg-[#eee4d5] text-[#52361f] flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-semibold">Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Details (Left 7 cols) + Seller & Actions (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photos & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-4 shadow-2xs space-y-3">
            <div className="relative aspect-[16/10] bg-[#eee4d5] rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={listing.images[activeImage] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#2b1c11]/85 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Condition: {listing.condition}
              </span>
              {listing.allowBarter && (
                <span className="absolute top-3 right-3 bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe] text-xs font-black px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5 text-[#1d4ed8]" /> Barter Accepted
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? "border-[#1d4ed8] scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Item Specs */}
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-6 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#785437] mb-1">
                <span className="uppercase font-bold text-[#1d4ed8] tracking-wider">
                  {listing.subcategory}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Posted {listing.postedDate}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {listing.views} views
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#2b1c11] leading-snug">
                {listing.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-3xl font-black text-[#2b1c11]">
                  {listing.price.toLocaleString()} ETB
                </span>
                {listing.isNegotiable && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]">
                    Negotiable
                  </span>
                )}
                {/* Make Offer Button */}
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1d4ed8] bg-[#eff6ff] hover:bg-[#dbeafe] border border-[#bfdbfe] px-3 py-1 rounded-lg transition-colors ml-auto"
                >
                  <BadgePercent className="w-3.5 h-3.5" /> Make Cash Offer
                </button>
              </div>
            </div>

            <hr className="border-[#dfd2be]" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-[#2b1c11]">Description</h3>
              <p className="text-sm text-[#52361f] leading-relaxed whitespace-pre-line font-medium">
                {listing.description}
              </p>
            </div>

            {/* Trade Wishlist */}
            {listing.allowBarter && (
              <div className="bg-[#ede4d6] border border-[#dfd2be] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#3d2717] uppercase tracking-wide">
                  <Repeat className="w-4 h-4 text-[#845e32]" />
                  Seller&apos;s Barter / Trade-in Wishlist
                </div>
                <p className="text-xs text-[#2b1c11] leading-relaxed font-bold">
                  {listing.wishlist}
                </p>
                <p className="text-[11px] text-[#785437] italic">
                  * Have a device of different value? You can propose cash top-up difference directly!
                </p>
              </div>
            )}

            {/* SMART BARTER MATCHER (Instant Device Trade Comparison) */}
            {listing.allowBarter && (
              <div className="bg-[#eff6ff] border-2 border-[#bfdbfe] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#1d4ed8]" />
                    <h3 className="font-black text-sm text-[#1e3a8a]">
                      Smart Swap Calculator: See What You Can Trade
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#1e40af] bg-[#dbeafe] px-2 py-0.5 rounded">
                    Instant Match
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1e3a8a] block">
                    Select one of your registered devices:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {myDevices.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedMyDeviceId(d.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          selectedMyDeviceId === d.id
                            ? "bg-[#faf5ed] border-[#1d4ed8] shadow-xs ring-2 ring-[#1d4ed8]"
                            : "bg-[#faf5ed]/70 border-[#bfdbfe] hover:bg-[#faf5ed]"
                        }`}
                      >
                        <img src={d.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-[#2b1c11] line-clamp-1">{d.title}</div>
                          <div className="text-[11px] text-[#785437]">
                            Value: {d.value.toLocaleString()} ETB
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Result */}
                <div className="bg-[#faf5ed] p-3.5 rounded-xl border border-[#bfdbfe] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[#785437]">Calculated Top-Up:</span>
                    <div className="text-base font-black text-[#1d4ed8] mt-0.5">
                      {tradeCashDiff > 0
                        ? `You add +${tradeCashDiff.toLocaleString()} ETB cash`
                        : tradeCashDiff < 0
                        ? `Seller pays you +${Math.abs(tradeCashDiff).toLocaleString()} ETB cash`
                        : "Even Swap (Zero cash top-up)"}
                    </div>
                  </div>

                  <Link
                    href={`/trades/new?target=${listing.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap self-stretch sm:self-auto justify-center"
                  >
                    <span>Propose This Trade</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Location & Landmark */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-sm text-[#2b1c11]">Location in Adama</h3>
              <div className="flex items-start gap-2.5 text-xs text-[#52361f] bg-[#eee4d5] p-3 rounded-xl border border-[#dfd2be]">
                <MapPin className="w-4 h-4 text-[#1d4ed8] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[#2b1c11]">
                    {listing.kebele} Kebele, {listing.city}
                  </div>
                  <div className="text-[#785437] mt-0.5">
                    Landmark: <span className="font-semibold text-[#3d2717]">{listing.landmark}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOMER REVIEWS & SELLER REPUTATION SECTION */}
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfd2be]">
              <div>
                <h3 className="font-black text-base text-[#2b1c11] flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
                  Buyer Reviews for {listing.seller.name}
                </h3>
                <span className="text-xs text-[#785437]">
                  {listing.seller.rating} out of 5 &bull; {listing.seller.completedDeals} completed trades in Adama
                </span>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#ede4d6] hover:bg-[#e4d6c2] border border-[#dfd2be] text-[#3d2717] font-bold text-xs transition-colors"
              >
                + Write a Review
              </button>
            </div>

            <div className="space-y-3.5">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#2b1c11]">{rev.author}</span>
                      <span className="text-[10px] text-[#785437]">({rev.kebele})</span>
                      {rev.verifiedBuyer && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-600">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#785437] ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#52361f] leading-normal font-medium">
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
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfd2be]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#785437]">
                Seller Information
              </span>
              <span className="text-[11px] text-[#8d7159]">Member since {listing.seller.memberSince}</span>
            </div>

            <div className="flex items-center gap-3.5">
              <Link href={`/seller/${listing.seller.id}`} className="hover:opacity-90 transition-opacity">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#dfd2be]"
                />
              </Link>
              <div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/seller/${listing.seller.id}`} className="font-bold text-base text-[#2b1c11] hover:text-[#1d4ed8] transition-colors">
                    {listing.seller.name}
                  </Link>
                  {listing.seller.isVerified && (
                    <span className="text-[#1d4ed8]" title="Verified Trader">
                      <CheckCircle className="w-4 h-4 fill-blue-100" />
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#785437] flex items-center gap-2 mt-0.5 font-medium">
                  <span>★ {listing.seller.rating} Rating</span>
                  <span>&bull;</span>
                  <span>{listing.seller.completedDeals} deals completed</span>
                </div>
                <div className="text-[11px] text-[#8d7159] mt-0.5 flex items-center gap-2">
                  <span>{listing.seller.kebele}, {listing.seller.city}</span>
                  <span>&bull;</span>
                  <Link href={`/seller/${listing.seller.id}`} className="text-[#1d4ed8] font-bold hover:underline">
                    View Profile &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Actions in Brown & Blue */}
            <div className="space-y-2 pt-2">
              {showPhone ? (
                <a
                  href={`tel:${listing.seller.phone}`}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  Call: {listing.seller.phone}
                </a>
              ) : (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 text-blue-300" />
                  Show Phone Number
                </button>
              )}

              <a
                href={`https://wa.me/${listing.seller.whatsapp.replace("+", "")}?text=Hello%20${listing.seller.name},%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(listing.title)}%20on%20Sebez%20Market.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              <Link
                href={`/messages?seller=${listing.seller.id}&listing=${listing.id}`}
                className="w-full py-2 px-4 rounded-xl bg-[#eee4d5] hover:bg-[#e4d6c2] text-[#3d2717] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#dfd2be]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#785437]" />
                In-App Chat / Message
              </Link>
            </div>
          </div>

          {/* Three Integrated Buying/Trading Actions */}
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-5 shadow-2xs space-y-3.5">
            <h3 className="font-extrabold text-[#2b1c11] text-sm">Choose How to Transact</h3>

            {/* 1. Buy with Telebirr Escrow */}
            <Link
              href={`/checkout/escrow?listing=${listing.id}&mode=cash`}
              className="block p-3.5 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] hover:bg-[#dbeafe] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1e3a8a] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1d4ed8]" /> 1. Buy with Telebirr / CBE Escrow
                </span>
                <span className="text-[11px] font-black text-[#1d4ed8] group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </div>
              <p className="text-[11px] text-[#2563eb] mt-1 font-medium">
                Pay securely. Your money is held in escrow until you inspect the item in person and provide your handover OTP.
              </p>
            </Link>

            {/* 2. Swap Deal with Cash Difference */}
            {listing.allowBarter && (
              <Link
                href={`/trades/new?target=${listing.id}`}
                className="block p-3.5 rounded-xl border border-[#dfd2be] bg-[#ede4d6] hover:bg-[#e6d7bc] transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#3d2717] flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-[#845e32]" /> 2. Propose Barter / Swap Deal
                  </span>
                  <span className="text-[11px] font-black text-[#6a4727] group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </div>
                <p className="text-[11px] text-[#6a4727] mt-1 font-medium">
                  Offer one of your devices in exchange and use our calculator to balance the cash top-up.
                </p>
              </Link>
            )}

            {/* 3. Direct In-Person Meetup */}
            <div className="p-3.5 rounded-xl border border-[#dfd2be] bg-[#faf5ed]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2b1c11] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1d4ed8]" /> 3. Direct In-Person Handover
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-[#785437] mt-1 font-medium">
                Call or message {listing.seller.name} to arrange a meetup at a public spot in {listing.kebele} (e.g. Posta Bet, Arada Market, or cafe). Inspect and pay directly!
              </p>
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="bg-[#ede4d6] border border-[#dfd2be] rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-[#2b1c11] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#845e32]" /> Safe Trading Checklist for Adama
            </span>
            <ul className="text-[#6a4727] space-y-1 text-[11px] list-disc list-inside font-medium">
              <li>Meet at safe daytime public spots (e.g. Arada Posta, Stadium, Bank branches).</li>
              <li>Test smartphone IMEI, iCloud/Google accounts, and charging before final handover.</li>
              <li>Only release the 4-digit OTP code once you are fully satisfied with the device.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MAKE AN OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-[#2b1c11]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#dfd2be]">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-[#1d4ed8]" />
                <h3 className="font-black text-base text-[#2b1c11]">Bargain Price / Make Cash Offer</h3>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-1 rounded-lg hover:bg-[#ede4d6] text-[#785437]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {offerSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-[#2b1c11]">Offer Sent to Seller!</h4>
                <p className="text-xs text-[#785437]">
                  Your cash offer of <strong>{Number(offerPrice).toLocaleString()} ETB</strong> has been sent to {listing.seller.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="bg-[#ede4d6] p-3 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#785437]">Current Asking Price:</span>
                    <span className="font-bold text-[#2b1c11]">{listing.price.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#785437]">Seller:</span>
                    <span className="font-semibold text-[#2b1c11]">{listing.seller.name} ({listing.kebele})</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2b1c11] block">
                    Your Offered Price (ETB)
                  </label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    min={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-sm font-black text-[#2b1c11] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                    required
                  />
                  <span className="text-[10px] text-[#785437] block">
                    Suggested realistic offer: between {Math.round(listing.price * 0.85).toLocaleString()} ETB and {listing.price.toLocaleString()} ETB
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2b1c11] block">Note to Seller</label>
                  <textarea
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-xs text-[#2b1c11] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                  ></textarea>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-[#dfd2be] bg-[#ede4d6] text-[#52361f] font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Submit Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-[#2b1c11]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#dfd2be]">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-base text-[#2b1c11]">Review {listing.seller.name}</h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg hover:bg-[#ede4d6] text-[#785437]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-[#2b1c11]">Review Published!</h4>
                <p className="text-xs text-[#785437]">
                  Thank you for helping keep the Adama trade community transparent and trustworthy.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                {/* Star rating selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2b1c11] block">Your Rating</label>
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
                            star <= reviewRating ? "text-amber-500 fill-amber-500" : "text-[#dfd2be]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-[#2b1c11] ml-2">{reviewRating} of 5 Stars</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2b1c11] block">Your Kebele in Adama</label>
                  <select
                    value={reviewKebele}
                    onChange={(e) => setReviewKebele(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-xs font-semibold text-[#2b1c11] focus:outline-none"
                  >
                    <option value="Bole">Bole Kebele</option>
                    <option value="Arada">Arada</option>
                    <option value="Kebele 04">Kebele 04</option>
                    <option value="Posta Bet">Posta Bet</option>
                    <option value="Amede">Amede</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2b1c11] block">Your Experience &amp; Feedback</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the in-person meetup, item condition, or seller communication..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-xs text-[#2b1c11] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                  ></textarea>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-[#dfd2be] bg-[#ede4d6] text-[#52361f] font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Similar Listings Section */}
      {similarListings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#dfd2be]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-[#2b1c11]">Similar Ads in Adama</h2>
            <Link href="/listings" className="text-xs font-bold text-[#1d4ed8] hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarListings.map((sim) => (
              <Link
                key={sim.id}
                href={`/listings/${sim.id}`}
                className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] overflow-hidden p-3 hover:border-[#1d4ed8] transition-all group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#eee4d5] mb-2.5">
                  <img src={sim.images[0]} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-bold text-[#1d4ed8] uppercase">{sim.subcategory}</span>
                <h4 className="font-bold text-xs text-[#2b1c11] line-clamp-1 group-hover:text-[#1d4ed8] transition-colors">{sim.title}</h4>
                <div className="font-black text-sm text-[#2b1c11] mt-1">{sim.price.toLocaleString()} ETB</div>
                <div className="text-[10px] text-[#785437] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#1d4ed8]" /> {sim.kebele}, Adama
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
