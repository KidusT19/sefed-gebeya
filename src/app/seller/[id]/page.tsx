"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  ShieldCheck,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Repeat,
  Calendar,
  Clock,
  Heart,
  ChevronLeft,
  Award,
  AlertCircle,
  Check,
  Send,
  MessageSquare,
} from "lucide-react";

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = (params?.id as string) || "";

  const { listings, isFavorite, toggleFavorite } = useMarketplace();

  // Find seller info from active listings
  const sellerListing = listings.find((l) => l.seller.id === sellerId || l.seller.name.toLowerCase() === sellerId.toLowerCase()) || listings[0];
  const seller = sellerListing?.seller;

  // Find all listings belonging to this seller
  const sellerListings = seller ? listings.filter((l) => l.seller.id === seller.id || l.seller.name === seller.name) : [];
  const displayListings = sellerListings.length > 0 ? sellerListings : sellerListing ? [sellerListing] : [];

  const [activeTab, setActiveTab] = useState<"listings" | "reviews" | "badges">("listings");
  const [showPhone, setShowPhone] = useState(false);

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewKebele, setReviewKebele] = useState("Bole");
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  // Initial customer reviews (clean for real users)
  const [reviewsList, setReviewsList] = useState<
    {
      id: string;
      author: string;
      kebele: string;
      rating: number;
      date: string;
      dealType: string;
      comment: string;
    }[]
  >([]);

  // Fetch real reviews from API on mount
  useEffect(() => {
    async function loadReviews() {
      if (!seller) return;
      try {
        const res = await fetch(`/api/reviews?sellerId=${seller.id}`);
        const data = await res.json();
        if (data.success && data.reviews?.length > 0) {
          setReviewsList(data.reviews);
        }
      } catch {
        // fallback to default
      }
    }
    loadReviews();
  }, [seller?.id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      sellerId: seller.id,
      author: "Verified Trader",
      kebele: reviewKebele,
      rating: reviewRating,
      date: "Just now",
      dealType: "Verified Deal",
      comment: reviewComment,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsReviewSubmitted(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: seller.id,
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
      setIsReviewSubmitted(false);
      setReviewComment("");
    }, 1500);
  };

  if (!seller) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Seller Not Found</h2>
        <p className="text-xs text-slate-500">There are currently no listings or seller profile associated with this account.</p>
        <Link href="/listings" className="inline-block px-5 py-2.5 bg-[#0f172a] text-white text-xs font-bold rounded-full">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#785437]">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 hover:text-[#1d4ed8] font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>
        <span className="text-[11px] text-[#8d7159]">Verified Seller Directory &bull; Nationwide Ethiopia</span>
      </div>

      {/* Main Seller Profile Header Card */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#dfd2be]">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#dfd2be] shadow-2xs"
              />
              {seller.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-[#1d4ed8] text-white p-1 rounded-full shadow-xs border-2 border-[#faf5ed]"
                  title="National ID & Phone Verified"
                >
                  <CheckCircle className="w-4 h-4 fill-white text-[#1d4ed8]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#2b1c11]">{seller.name}</h1>
                {seller.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1e40af] bg-[#dbeafe] border border-[#bfdbfe] px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3" /> {seller.kebele} Kebele
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#52361f] font-medium">
                <div className="flex items-center text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-500 mr-1" />
                  <span>{seller.rating}</span>
                  <span className="text-[#785437] font-normal ml-1">({reviewsList.length} reviews)</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1 text-[#52361f]">
                  <Award className="w-3.5 h-3.5 text-[#1d4ed8]" />
                  <span>{seller.completedDeals} completed trades</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1 text-[#785437]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {seller.memberSince}</span>
                </div>
              </div>

              <p className="text-xs text-[#785437]">
                Trusted local trader in {seller.city}. Supports direct cash purchases, bilateral swaps with cash top-up, and safe public landmark meetups.
              </p>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto flex-shrink-0">
            {showPhone ? (
              <a
                href={`tel:${seller.phone}`}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call {seller.phone}</span>
              </a>
            ) : (
              <button
                onClick={() => setShowPhone(true)}
                className="py-2.5 px-5 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-blue-300" />
                <span>Show Phone Number</span>
              </button>
            )}

            <a
              href={`https://wa.me/${seller.whatsapp.replace("+", "")}?text=Hello%20${encodeURIComponent(
                seller.name
              )},%20I%20saw%20your%20seller%20profile%20on%20Sebez%20Market.`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Message</span>
            </a>

            <Link
              href={`/messages?seller=${seller.id}`}
              className="py-2 px-4 rounded-xl bg-[#eee4d5] hover:bg-[#e4d6c2] text-[#3d2717] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#dfd2be]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#785437]" />
              <span>In-App Chat</span>
            </Link>
          </div>
        </div>

        {/* Seller Highlights / Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-center">
          <div className="p-3 rounded-2xl bg-[#ede4d6] border border-[#dfd2be]">
            <div className="text-[11px] text-[#785437] font-semibold">Response Speed</div>
            <div className="text-sm font-black text-[#2b1c11] mt-0.5 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1d4ed8]" />
              <span>&lt; 15 Mins</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#ede4d6] border border-[#dfd2be]">
            <div className="text-[11px] text-[#785437] font-semibold">Inspection Pass Rate</div>
            <div className="text-sm font-black text-emerald-800 mt-0.5 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>100% Clean</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#ede4d6] border border-[#dfd2be]">
            <div className="text-[11px] text-[#785437] font-semibold">Barter Deals</div>
            <div className="text-sm font-black text-[#845e32] mt-0.5 flex items-center justify-center gap-1">
              <Repeat className="w-3.5 h-3.5" />
              <span>11 Swaps Done</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#ede4d6] border border-[#dfd2be]">
            <div className="text-[11px] text-[#785437] font-semibold">Meetup Landmark</div>
            <div className="text-sm font-black text-[#1d4ed8] mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Posta Bet / Arada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#dfd2be] pb-2">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-xl font-black text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "listings"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#ede4d6] text-[#52361f] hover:bg-[#e4d6c2]"
          }`}
        >
          <span>Active Listings</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
            {displayListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded-xl font-black text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "reviews"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#ede4d6] text-[#52361f] hover:bg-[#e4d6c2]"
          }`}
        >
          <span>Buyer Reviews & Ratings</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
            {reviewsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 rounded-xl font-black text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "badges"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#ede4d6] text-[#52361f] hover:bg-[#e4d6c2]"
          }`}
        >
          <span>Verification & Safety</span>
        </button>
      </div>

      {/* TAB CONTENT 1: Active Listings */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#2b1c11]">
              Items Listed by {seller.name} in Adama
            </h2>
            <span className="text-xs text-[#785437]">All items tested & verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayListings.map((item) => (
              <div
                key={item.id}
                className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="relative aspect-4/3 bg-[#ede4d6] overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#faf5ed]/90 text-[#3d2717] hover:bg-[#faf5ed] transition-colors shadow-xs"
                      aria-label="Save listing"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(item.id) ? "fill-rose-600 text-rose-600" : "text-[#785437]"
                        }`}
                      />
                    </button>

                    {item.allowBarter && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#3d2717]/90 text-white font-bold text-[10px] flex items-center gap-1 backdrop-blur-xs">
                        <Repeat className="w-3 h-3 text-[#dbeafe]" /> Swap (+Cash)
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#785437]">
                      <span className="font-semibold">{item.condition}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1d4ed8]" />
                        {item.kebele}
                      </span>
                    </div>

                    <Link href={`/listings/${item.id}`} className="block">
                      <h3 className="font-bold text-sm text-[#2b1c11] line-clamp-2 hover:text-[#1d4ed8] transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="text-base font-black text-[#1d4ed8]">
                      {item.price.toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/listings/${item.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-[#ede4d6] hover:bg-[#e4d6c2] text-[#3d2717] font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-[#dfd2be]"
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Buyer Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#dfd2be]">
              <div>
                <h2 className="text-base font-black text-[#2b1c11] flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
                  Reputation & Verified Transactions ({reviewsList.length})
                </h2>
                <p className="text-xs text-[#785437] mt-0.5">
                  Every review is tied to a verified deal or direct transaction in Adama.
                </p>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>+ Write Review for {seller.name}</span>
              </button>
            </div>

            {/* Reviews Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#ede4d6] rounded-2xl border border-[#dfd2be] p-4 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-[#2b1c11]">{rev.author}</span>
                        <span className="text-[10px] text-[#785437]">({rev.kebele})</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ✓ {rev.dealType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-amber-600">
                      <div className="flex">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#785437]">{rev.date}</span>
                    </div>

                    <p className="text-xs text-[#52361f] leading-relaxed font-medium">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="text-[10px] text-[#785437] flex items-center gap-1 pt-2 border-t border-[#dfd2be]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified Adama Resident</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Badges & Trust Rules */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-6 space-y-4">
            <h3 className="font-black text-base text-[#2b1c11] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1d4ed8]" />
              Trust & Identity Verification
            </h3>
            <p className="text-xs text-[#785437] leading-relaxed">
              Sebez Market authenticates sellers before allowing transactions with high-value electronics and device swaps.
            </p>

            <ul className="space-y-3 text-xs text-[#52361f]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#2b1c11]">National ID (Fayda / Kebele ID) Verified:</strong>
                  <p className="text-[#785437] text-[11px]">Identity matched against official Kebele registry.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#2b1c11]">Phone Number Verified:</strong>
                  <p className="text-[#785437] text-[11px]">Directly reachable for calls, SMS, and in-person meetups.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#2b1c11]">Transparent In-Person Deals:</strong>
                  <p className="text-[#785437] text-[11px]">
                    Meets in safe public locations and allows full physical device inspection.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#eff6ff] rounded-2xl border border-[#bfdbfe] p-6 space-y-4">
            <h3 className="font-black text-base text-[#1e3a8a] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1d4ed8]" />
              Safe In-Person Inspection Routine in Adama
            </h3>
            <p className="text-xs text-[#1e40af] leading-relaxed">
              When dealing with {seller.name}, you have 2 protected ways to complete your transaction:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/70 border border-[#bfdbfe]">
                <div className="font-bold text-[#1e3a8a]">1. Public Landmark Direct Inspection</div>
                <div className="text-[11px] text-[#3b82f6] mt-0.5">
                  Meet at designated Adama landmarks (Posta Bet, Arada Market, Bole Gate). Test the item thoroughly before making direct payment to the seller.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 border border-[#bfdbfe]">
                <div className="font-bold text-[#1e3a8a]">2. Bilateral Swap Handover</div>
                <div className="text-[11px] text-[#3b82f6] mt-0.5">
                  Meet at designated Adama landmarks (Posta Bet, Arada Market, Bole Square) to inspect both devices.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 border border-[#bfdbfe]">
                <div className="font-bold text-[#1e3a8a]">3. Zero Risk &amp; In-Person Test</div>
                <div className="text-[11px] text-[#3b82f6] mt-0.5">
                  If the item doesn&apos;t match the description or photos, decline the purchase on the spot with zero obligation.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#faf5ed] border-2 border-[#3d2717] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfd2be]">
              <h3 className="font-black text-base text-[#2b1c11] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
                Review {seller.name}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-[#785437] hover:text-[#2b1c11] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {isReviewSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-base text-[#2b1c11]">Review Submitted!</h4>
                <p className="text-xs text-[#785437]">
                  Thank you for keeping Sebez Market safe and transparent in Adama.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2b1c11] mb-1.5">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-2 text-amber-600">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating ? "fill-amber-500 text-amber-600" : "text-[#dfd2be]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#3d2717] ml-2">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b1c11] mb-1">
                    Your Adama Kebele:
                  </label>
                  <select
                    value={reviewKebele}
                    onChange={(e) => setReviewKebele(e.target.value)}
                    className="w-full text-xs bg-[#ede4d6] border border-[#dfd2be] rounded-xl px-3 py-2 text-[#2b1c11] font-bold focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                  >
                    <option value="Bole">Bole Kebele</option>
                    <option value="Kebele 04">Kebele 04</option>
                    <option value="Arada">Arada Market</option>
                    <option value="Posta Bet">Posta Bet</option>
                    <option value="Amede">Amede</option>
                    <option value="Ganda Hara">Ganda Hara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b1c11] mb-1">
                    Your Experience:
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Verified phone battery and camera near Posta Bet. Fast delivery and genuine device."
                    required
                    className="w-full text-xs bg-[#ede4d6] border border-[#dfd2be] rounded-xl p-3 text-[#2b1c11] font-medium placeholder-[#8d7159] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#ede4d6] text-[#3d2717] font-bold text-xs hover:bg-[#e4d6c2] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Review</span>
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
