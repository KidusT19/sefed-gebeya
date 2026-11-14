"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketplace, ActiveUser } from "@/context/MarketplaceContext";
import { MOCK_LISTINGS } from "@/data/mockData";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import {
  User,
  ShoppingBag,
  Heart,
  Repeat,
  ShieldCheck,
  CheckCircle,
  Clock,
  Phone,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  MapPin,
  AlertCircle,
  Copy,
  Check,
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Upload,
  BadgeCheck,
  Building2,
  Sparkles,
  Edit3,
  Save,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Lock,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ads";

  const {
    favorites,
    toggleFavorite,
    offers,
    deliveries,
    currentUser,
    isLoggedIn,
    updateUserProfile,
    submitSellerVerification,
    showToast,
  } = useMarketplace();

  // Authentication Guard: Redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      showToast("Please sign in to access your personal dashboard and account details.", "info");
      router.replace(`/auth/login?redirect=/dashboard${initialTab ? `?tab=${initialTab}` : ""}`);
    }
  }, [isLoggedIn, router, showToast, initialTab]);

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [walletBalance, setWalletBalance] = useState<number>(currentUser?.walletBalance || 14250);
  const [depositAmount, setDepositAmount] = useState<string>("500");
  const [walletSuccessMsg, setWalletSuccessMsg] = useState<string | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editEmail, setEditEmail] = useState(currentUser?.email || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editCity, setEditCity] = useState(currentUser?.city || "Addis Ababa");
  const [editKebele, setEditKebele] = useState(currentUser?.kebele || "Bole");
  const [editBusinessName, setEditBusinessName] = useState(currentUser?.businessName || "");
  const [editBio, setEditBio] = useState(currentUser?.bio || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // KYC Verification Form State
  const [kycDocType, setKycDocType] = useState<"KEBELE_ID" | "PASSPORT" | "TRADE_LICENSE" | "TIN_CERTIFICATE">("KEBELE_ID");
  const [kycDocNumber, setKycDocNumber] = useState("");
  const [kycBusinessName, setKycBusinessName] = useState("");
  const [kycTinNumber, setKycTinNumber] = useState("");
  const [kycFileFront, setKycFileFront] = useState<string | null>(null);
  const [kycFileBack, setKycFileBack] = useState<string | null>(null);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(depositAmount);
    if (amt > 0) {
      setWalletBalance((prev) => prev + amt);
      setWalletSuccessMsg(`Successfully credited ${amt.toLocaleString()} ETB via Telebirr account (${currentUser?.phone || "+2519..."})!`);
      setTimeout(() => setWalletSuccessMsg(null), 4000);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    updateUserProfile({
      name: editName.trim(),
      email: editEmail.trim() || undefined,
      phone: editPhone.trim(),
      city: editCity,
      kebele: editKebele.trim(),
      businessName: editBusinessName.trim() || undefined,
      bio: editBio.trim() || undefined,
    });
    setIsSavingProfile(false);
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycDocNumber.trim()) {
      showToast("Please enter your document or license number", "error");
      return;
    }
    setIsSubmittingKyc(true);
    setTimeout(() => {
      submitSellerVerification({
        docType: kycDocType,
        docNumber: kycDocNumber.trim(),
        businessName: kycBusinessName.trim() || undefined,
        tinNumber: kycTinNumber.trim() || undefined,
        frontImageUrl: kycFileFront || undefined,
        backImageUrl: kycFileBack || undefined,
      });
      setIsSubmittingKyc(false);
      setKycDocNumber("");
    }, 800);
  };

  // User's own mock ads
  const [myAds, setMyAds] = useState([
    {
      id: "lst-1",
      title: "iPhone 13 Pro 128GB - Sierra Blue (Factory Unlocked)",
      price: 55000,
      status: "ACTIVE",
      views: 142,
      postedDate: "2 hours ago",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&auto=format&fit=crop&q=80",
      city: "Addis Ababa",
      kebele: "Bole",
      allowBarter: true,
    },
    {
      id: "lst-custom-1",
      title: "Samsung 43-inch 4K Smart Crystal UHD TV",
      price: 34000,
      status: "ACTIVE",
      views: 89,
      postedDate: "Yesterday",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&auto=format&fit=crop&q=80",
      city: "Addis Ababa",
      kebele: "Bole",
      allowBarter: false,
    },
    {
      id: "lst-custom-2",
      title: "Apple Watch Series 7 (45mm Midnight Aluminum)",
      price: 21000,
      status: "SOLD",
      views: 240,
      postedDate: "1 week ago",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80",
      city: "Addis Ababa",
      kebele: "Bole",
      allowBarter: true,
    },
  ]);

  // Saved listings from favorites
  const savedListings = MOCK_LISTINGS.filter((l) => favorites.includes(l.id));

  const toggleAdStatus = (id: string) => {
    setMyAds((prev) =>
      prev.map((ad) =>
        ad.id === id ? { ...ad, status: ad.status === "ACTIVE" ? "SOLD" : "ACTIVE" } : ad
      )
    );
  };

  const deleteAd = (id: string) => {
    if (confirm("Are you sure you want to remove this listing?")) {
      setMyAds((prev) => prev.filter((ad) => ad.id !== id));
      showToast("Listing removed successfully", "info");
    }
  };

  // Verification Badge Helper
  const renderVerificationBadge = () => {
    const status = currentUser?.verificationStatus || "VERIFIED";
    if (status === "OFFICIAL_STORE") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Official Flagship Store</span>
        </span>
      );
    }
    if (status === "VERIFIED") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>{currentUser?.sellerTier || "Verified Seller"}</span>
        </span>
      );
    }
    if (status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Verification In Review</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
        <span>Unverified Trader</span>
      </span>
    );
  };

  // If user is not authenticated, render secure gatekeeper view
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
              Personal Account Protected
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
              Access to your personal listings, Telebirr escrow wallet, seller verification documents, and barter deals requires you to sign in.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/auth/login?redirect=/dashboard${initialTab ? `?tab=${initialTab}` : ""}`}
              className="w-full min-h-[46px] py-3.5 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href={`/auth/signup?redirect=/dashboard${initialTab ? `?tab=${initialTab}` : ""}`}
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
    <div className="relative min-h-screen space-y-6 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Sefed Authentic Watermark Background */}
      <SefedWatermarkBackground opacity={0.14} blur="md" />

      {/* Main Profile Header Banner */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl border border-emerald-900/10 p-5 sm:p-7 shadow-xl shadow-emerald-950/5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* User Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#0e623a] shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0e623a] text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || "SM"}
                </div>
              )}
              {currentUser?.verificationStatus === "VERIFIED" && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full border-2 border-white shadow-xs">
                  <BadgeCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser?.name || "Henok Tadesse"}
                </h1>
                {renderVerificationBadge()}
              </div>

              {currentUser?.businessName && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0e623a]">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentUser.businessName}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {currentUser?.kebele || "Bole"}, {currentUser?.city || "Addis Ababa"}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  {currentUser?.phone || "+251 91 144 8822"}
                </span>
                <span>&bull;</span>
                <span className="font-bold text-emerald-700">★ {currentUser?.rating || 4.9} Rating</span>
                {currentUser?.memberSince && (
                  <>
                    <span>&bull;</span>
                    <span>Member since {currentUser.memberSince}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Wallet Pill */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Telebirr Balance Card */}
            <div className="bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-200/80 text-right flex-1 sm:flex-none">
              <div className="text-[10px] text-emerald-800 font-black uppercase tracking-wider">
                Telebirr Balance
              </div>
              <div className="text-base sm:text-lg font-black text-[#0e623a] font-mono">
                {walletBalance.toLocaleString()} ETB
              </div>
            </div>

            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0e623a] hover:bg-[#0b4d2e] active:scale-[0.99] text-white font-black text-xs sm:text-sm px-5 py-3 rounded-full shadow-lg shadow-emerald-900/15 transition-all flex-1 sm:flex-none cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post New Ad</span>
            </Link>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block">Active Listings</span>
            <span className="text-xl font-black text-slate-900">
              {myAds.filter((a) => a.status === "ACTIVE").length}
            </span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block">Saved Ads</span>
            <span className="text-xl font-black text-slate-900">{favorites.length}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block">Barter Proposals</span>
            <span className="text-xl font-black text-[#0e623a]">{offers.length + 1}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block">Escrow Protected</span>
            <span className="text-xl font-black text-[#0e623a] font-mono">
              {walletBalance.toLocaleString()} ETB
            </span>
          </div>
        </div>
      </div>

      {/* Modern Mobile Tab Selector */}
      <div className="relative z-10 flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab("ads")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "ads"
              ? "bg-[#0e623a] text-white shadow-md shadow-emerald-900/10 font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Ads ({myAds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "saved"
              ? "bg-[#0e623a] text-white shadow-md shadow-emerald-900/10 font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Items ({savedListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trades")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "trades"
              ? "bg-[#0e623a] text-white shadow-md shadow-emerald-900/10 font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Barter &amp; Deals ({offers.length + 1})</span>
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "wallet"
              ? "bg-[#0e623a] text-white shadow-md shadow-emerald-900/10 font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Telebirr Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab("kyc")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "kyc"
              ? "bg-[#0e623a] text-white shadow-md shadow-emerald-900/10 font-black"
              : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
          }`}
        >
          <BadgeCheck className="w-4 h-4 text-amber-600" />
          <span>Seller Verification</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#0e623a] text-white shadow-md shadow-emerald-900/10 font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* TAB 1: MY ADS */}
      {activeTab === "ads" && (
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Your Active Products &amp; Swaps</h2>
              <p className="text-xs text-slate-500">Easily update your items or toggle between Active and Sold</p>
            </div>
            <Link
              href="/listings/create"
              className="text-xs font-black text-[#0e623a] hover:underline flex items-center gap-1"
            >
              <span>+ Add Product</span>
            </Link>
          </div>

          <div className="space-y-3">
            {myAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-emerald-600/30 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          ad.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {ad.status === "ACTIVE" ? "Active on Marketplace" : "Marked Sold"}
                      </span>
                      {ad.allowBarter && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                          Swap Enabled
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">{ad.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-black text-[#0e623a] text-sm font-mono">
                        {ad.price.toLocaleString()} ETB
                      </span>
                      <span>&bull;</span>
                      <span>{ad.views} Views</span>
                      <span>&bull;</span>
                      <span>{ad.postedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => toggleAdStatus(ad.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  >
                    {ad.status === "ACTIVE" ? "Mark Sold" : "Re-activate"}
                  </button>
                  <Link
                    href={`/listings/${ad.id}`}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SAVED ADS */}
      {activeTab === "saved" && (
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Your Bookmarked Items ({savedListings.length})
            </h2>
            <Link href="/listings" className="text-xs font-bold text-[#0e623a] hover:underline">
              Explore more listings &rarr;
            </Link>
          </div>

          {savedListings.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No saved items yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tap the heart button on any product or device to keep track of price drops and barter opportunities.
              </p>
              <Link
                href="/listings"
                className="inline-block bg-[#0e623a] text-white font-black text-xs px-5 py-2.5 rounded-full mt-2"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {savedListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 space-y-3 flex flex-col justify-between shadow-xs hover:border-emerald-600/30 transition-all"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-600 shadow-xs cursor-pointer"
                        title="Remove from saved"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#0e623a] uppercase">{item.subcategory}</span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                      <div className="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">
                        {item.price.toLocaleString()} ETB
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-emerald-700" /> {item.kebele}, {item.city}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <Link
                      href={`/listings/${item.id}`}
                      className="w-full text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      View
                    </Link>
                    {item.allowBarter ? (
                      <Link
                        href={`/trades/new?target=${item.id}`}
                        className="w-full text-center py-2 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Repeat className="w-3 h-3" /> Swap
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout/escrow?listing=${item.id}`}
                        className="w-full text-center py-2 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-bold text-xs transition-colors"
                      >
                        Buy Now
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BARTER & DEALS */}
      {activeTab === "trades" && (
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Barter Proposals &amp; Cash Offers</h2>
              <p className="text-xs text-slate-500">Track device trades and cash top-up negotiations</p>
            </div>
            <Link href="/swaps" className="text-xs font-bold text-[#0e623a] hover:underline">
              3-Way Loop Swaps &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {/* Mock Incoming Offer */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-5 space-y-3 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Incoming Barter Proposal
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                    Trade Proposal for: <strong>iPhone 13 Pro 128GB</strong>
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">1 hour ago</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Offered Item:</span>
                  <span className="font-bold text-slate-900">Samsung Galaxy S21 5G (Like New)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cash Top-Up Offered to You:</span>
                  <span className="font-black text-[#0e623a] text-sm font-mono">+ 18,000 ETB (Telebirr)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Proposed by:</span>
                  <span className="font-bold text-slate-900">Chaltu Girma (Piazza, Hawassa)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-1">
                <Link
                  href="/trades/tr-801"
                  className="px-5 py-2.5 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-black text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Open Deal Room &amp; Negotiate
                </Link>
              </div>
            </div>

            {/* Custom Sent Offers */}
            {offers.map((off) => (
              <div
                key={off.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-5 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Sent Cash Offer
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">{off.listingTitle}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{off.date}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">List Price:</span>
                    <span className="text-slate-900 font-mono">{off.listingPrice.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Your Cash Offer:</span>
                    <span className="font-black text-[#0e623a] text-sm font-mono">{off.offeredPrice.toLocaleString()} ETB</span>
                  </div>
                  <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 italic">
                    &ldquo;{off.message}&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Seller: {off.sellerName}</span>
                  <a
                    href={`tel:${off.sellerPhone}`}
                    className="font-bold text-[#0e623a] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {off.sellerPhone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TELEBIRR WALLET */}
      {activeTab === "wallet" && (
        <div className="relative z-10 space-y-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-emerald-900/10 p-6 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                  Telebirr &amp; CBE Escrow Wallet
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#0e623a] font-mono mt-1">
                  {walletBalance.toLocaleString()} ETB
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Linked Phone: <strong className="font-mono text-slate-800">{currentUser?.phone || "+251 91 144 8822"}</strong>
                </p>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dual-OTP Escrow Protection Active</span>
              </span>
            </div>

            {walletSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{walletSuccessMsg}</span>
              </div>
            )}

            {/* Quick Deposit Form */}
            <form onSubmit={handleDeposit} className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Top Up Balance via Telebirr (Simulated Deposit)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {["500", "1000", "2500", "5000", "10000"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      depositAmount === preset
                        ? "bg-[#0e623a] text-white shadow-xs font-black"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    +{Number(preset).toLocaleString()} ETB
                  </button>
                ))}

                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-32 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Escrow Protections Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black text-[#0e623a]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Dual-OTP Protected Transactions</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you purchase or barter an item, payment is held safely in Sefed escrow. The funds are released to the seller only after both parties share their one-time delivery release OTP.
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black text-[#0e623a]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Handover Inspection</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet sellers at designated public hubs (Bole, Piassa, Arada, Megenagna) or select verified Bajaj delivery. Test devices before confirming final exchange.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SELLER VERIFICATION (KYC) */}
      {activeTab === "kyc" && (
        <div className="relative z-10 space-y-6">
          {/* Verification Status Overview Banner */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-emerald-900/10 p-6 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                  Sefed Trust &amp; Seller KYC Portal
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Identity &amp; Business Verification
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Verified sellers receive 4x more customer inquiries, higher search ranking, and instant buyer trust.
                </p>
              </div>

              {renderVerificationBadge()}
            </div>

            {/* Verification Tiers Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#0e623a] flex items-center justify-center font-black text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Phone Verified</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Confirmed Ethiopian mobile number via SMS OTP. Basic listing and buying privileges.
                </p>
                <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active for your account
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-emerald-950">Verified Seller</h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  Government Kebele ID or Ethiopian Passport verified. Green badge on all listings and search.
                </p>
                <div className="text-[10px] font-bold text-[#0e623a] flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> High Buyer Trust
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-amber-950">Official Merchant</h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  Registered Ethiopian Trade License &amp; TIN number. Gold badge &amp; unlimited product limits.
                </p>
                <div className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Store Flagship Status
                </div>
              </div>
            </div>
          </div>

          {/* Verification Submission Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900">
                Submit Documents for Verification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your official Ethiopian identification document to unlock verified badges
              </p>
            </div>

            <form onSubmit={handleSubmitKyc} className="space-y-5">
              {/* Document Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Select Document Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "KEBELE_ID", label: "Kebele National ID", desc: "የቀበሌ መታወቂያ" },
                    { id: "PASSPORT", label: "Ethiopian Passport", desc: "የኢትዮጵያ ፓስፖርት" },
                    { id: "TRADE_LICENSE", label: "Trade License", desc: "ንግድ ፈቃድ (Business)" },
                    { id: "TIN_CERTIFICATE", label: "TIN Certificate", desc: "የግብር ከፋይ ቁጥር" },
                  ].map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setKycDocType(doc.id as any)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        kycDocType === doc.id
                          ? "bg-[#0e623a] text-white border-[#0e623a] shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-600"
                      }`}
                    >
                      <span className="text-xs font-black">{doc.label}</span>
                      <span className="text-[10px] opacity-80 mt-1">{doc.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Number & Business Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    {kycDocType === "TRADE_LICENSE"
                      ? "Trade License Registration Number"
                      : kycDocType === "PASSPORT"
                      ? "Passport Number"
                      : "Kebele ID Card Number"}
                  </label>
                  <input
                    type="text"
                    required
                    value={kycDocNumber}
                    onChange={(e) => setKycDocNumber(e.target.value)}
                    placeholder={
                      kycDocType === "TRADE_LICENSE"
                        ? "e.g. TL-AA-094821"
                        : kycDocType === "PASSPORT"
                        ? "e.g. EP1234567"
                        : "e.g. ADD-BOL-882194"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                </div>

                {(kycDocType === "TRADE_LICENSE" || kycDocType === "TIN_CERTIFICATE") && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Registered Business / Shop Name
                    </label>
                    <input
                      type="text"
                      required
                      value={kycBusinessName}
                      onChange={(e) => setKycBusinessName(e.target.value)}
                      placeholder="e.g. Arada Tech Electronics PLC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                    />
                  </div>
                )}
              </div>

              {/* Upload Dropzones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Front Side Photo
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#0e623a] rounded-2xl p-5 text-center bg-slate-50/60 transition-colors cursor-pointer space-y-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-700">
                      Tap or drag front image
                    </div>
                    <p className="text-[10px] text-slate-400">JPG, PNG, or PDF up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setKycFileFront(URL.createObjectURL(e.target.files[0]));
                          showToast("Front document attached", "info");
                        }
                      }}
                      className="hidden"
                      id="upload-front"
                    />
                    <label
                      htmlFor="upload-front"
                      className="inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0e623a] cursor-pointer hover:bg-slate-50 shadow-2xs"
                    >
                      {kycFileFront ? "✓ Attached" : "Choose File"}
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Back Side / Official Stamp
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#0e623a] rounded-2xl p-5 text-center bg-slate-50/60 transition-colors cursor-pointer space-y-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-700">
                      Tap or drag back image
                    </div>
                    <p className="text-[10px] text-slate-400">Showing kebele stamp &amp; validity</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setKycFileBack(URL.createObjectURL(e.target.files[0]));
                          showToast("Back document attached", "info");
                        }
                      }}
                      className="hidden"
                      id="upload-back"
                    />
                    <label
                      htmlFor="upload-back"
                      className="inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0e623a] cursor-pointer hover:bg-slate-50 shadow-2xs"
                    >
                      {kycFileBack ? "✓ Attached" : "Choose File"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Verification Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingKyc}
                  className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingKyc ? (
                    <span>Validating Document...</span>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: EDIT PROFILE */}
      {activeTab === "profile" && (
        <div className="relative z-10 space-y-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900">
                Personal &amp; Store Profile Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your display name, contact numbers, and store location for buyer discovery
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Store / Business Name</label>
                  <input
                    type="text"
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    placeholder="e.g. Henok Electronics Bole"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Mobile Phone (Telebirr)</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">City</label>
                  <select
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  >
                    <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                    <option value="Adama">Adama (አዳማ)</option>
                    <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                    <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                    <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                    <option value="Mekelle">Mekelle (መቐለ)</option>
                    <option value="Jimma">Jimma (ጅማ)</option>
                    <option value="Gondar">Gondar (ጎንደር)</option>
                    <option value="Bishoftu">Bishoftu (ቢሾፍቱ)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Kebele / Landmark</label>
                  <input
                    type="text"
                    value={editKebele}
                    onChange={(e) => setEditKebele(e.target.value)}
                    placeholder="e.g. Bole Medhanialem"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Store / Seller Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell buyers about your products, warranty policies, and location..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? "Saving..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-bold text-[#0e623a]">
          Loading Sefed Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
