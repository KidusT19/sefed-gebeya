"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketplace, ActiveUser } from "@/context/MarketplaceContext";
import { MOCK_LISTINGS } from "@/data/mockData";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import {
  User,
  ShoppingBag,
  Package,
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
  ArrowLeft,
  Lock,
  Camera,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialParam = searchParams.get("tab");
  const initialTab = initialParam === "wallet" ? "ads" : (initialParam || "ads");

  const {
    favorites,
    toggleFavorite,
    offers,
    deliveries,
    currentUser,
    isLoggedIn,
    isAuthReady,
    updateUserProfile,
    showToast,
    listings,
    deleteListing,
    toggleListingStatus,
  } = useMarketplace();

  // Authentication Guard: Redirect to login if user is not logged in (only after auth is ready)
  useEffect(() => {
    if (!isAuthReady) return;
    if (!isLoggedIn) {
      showToast("Please sign in to access your personal dashboard and account details.", "info");
      router.replace(`/auth/login?redirect=/dashboard${initialTab ? `?tab=${initialTab}` : ""}`);
    }
  }, [isAuthReady, isLoggedIn, router, showToast, initialTab]);

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editEmail, setEditEmail] = useState(currentUser?.email || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editCity, setEditCity] = useState(currentUser?.city || "Addis Ababa");
  const [editKebele, setEditKebele] = useState(currentUser?.kebele || "Bole");
  const [editBusinessName, setEditBusinessName] = useState(currentUser?.businessName || "");
  const [editBio, setEditBio] = useState(currentUser?.bio || "");
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditEmail(currentUser.email || "");
      setEditPhone(currentUser.phone || "");
      setEditCity(currentUser.city || "Addis Ababa");
      setEditKebele(currentUser.kebele || "Bole");
      setEditBusinessName(currentUser.businessName || "");
      setEditBio(currentUser.bio || "");
      setEditAvatarUrl(currentUser.avatarUrl || "");
    }
  }, [currentUser]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, WEBP).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image file is too large. Please select a file under 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (dataUrl) {
        // Optimize on canvas to ~256x256 for fast loading & local storage
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 256;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
            const optimized = canvas.toDataURL("image/jpeg", 0.85);
            setEditAvatarUrl(optimized);
            updateUserProfile({ avatarUrl: optimized });
            showToast("Profile picture updated successfully!", "success");
          }
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setEditAvatarUrl("");
    updateUserProfile({ avatarUrl: "" });
    showToast("Profile picture removed. Initials will be used.", "info");
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
      avatarUrl: editAvatarUrl || "",
    });
    setIsSavingProfile(false);
  };

  // User's own ads loaded dynamically from live marketplace listings
  const userListings = useMemo(() => {
    let localCreatedIds: string[] = [];
    try {
      localCreatedIds = JSON.parse(localStorage.getItem("sefed_user_created_listings") || "[]");
    } catch {}

    const matched = listings.filter((l) => {
      // 1. Created by this browser session
      if (localCreatedIds.includes(l.id)) return true;

      // 2. Belongs to the current authenticated user
      if (currentUser) {
        if (
          l.seller?.id &&
          (l.seller.id === currentUser.id ||
            l.seller.id === currentUser.id.replace("usr-", "sel-") ||
            l.seller.id === currentUser.id.replace("sel-", "usr-"))
        ) {
          return true;
        }
        if (
          currentUser.phone &&
          l.seller?.phone &&
          (l.seller.phone === currentUser.phone ||
            l.seller.phone.replace(/\D/g, "") === currentUser.phone.replace(/\D/g, ""))
        ) {
          return true;
        }
        if (
          currentUser.email &&
          l.seller?.email &&
          l.seller.email.toLowerCase() === currentUser.email.toLowerCase()
        ) {
          return true;
        }
        if (
          currentUser.name &&
          l.seller?.name &&
          l.seller.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase()
        ) {
          return true;
        }
        // Match first name for demo accounts e.g. "Kidus"
        const currentFirstName = currentUser.name?.trim().toLowerCase().split(" ")[0];
        const sellerFirstName = l.seller?.name?.trim().toLowerCase().split(" ")[0];
        if (
          currentFirstName &&
          sellerFirstName &&
          currentFirstName === sellerFirstName &&
          l.id === "82270859-b3e6-4daa-a276-bbda1305930e"
        ) {
          return true;
        }
      }
      return false;
    });

    return matched;
  }, [listings, currentUser]);

  // Saved listings from favorites
  const savedListings = listings.filter((l) => favorites.includes(l.id));

  const toggleAdStatus = (id: string) => {
    toggleListingStatus(id);
  };

  const deleteAd = (id: string) => {
    if (confirm("Are you sure you want to remove this listing from Sefed Market?")) {
      deleteListing(id);
    }
  };

  // If user is not authenticated, render secure gatekeeper view
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xl shadow-slate-900/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-inner border border-amber-200/50">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Personal Account Protected
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
              Access to your personal listings, barter deals, and account details requires you to sign in.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/auth/login?redirect=/dashboard${initialTab ? `?tab=${initialTab}` : ""}`}
              className="w-full min-h-[46px] py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-amber-400" />
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
      {/* Top Navigation & Back Action */}
      <div className="relative z-10 flex items-center justify-between pt-1">
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

      {/* Main Profile Header Banner */}
      <div className="relative z-10 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* User Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#0f172a] shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0f172a] text-amber-400 border-2 border-amber-400/40 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                  {currentUser?.name ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
                </div>
              )}
              <label
                htmlFor="header-avatar-input"
                className="absolute inset-0 bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-opacity backdrop-blur-2xs"
                title="Change Profile Photo"
              >
                <Camera className="w-5 h-5 text-amber-300 mb-0.5" />
                <span>Upload</span>
              </label>
              <input
                id="header-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser?.name || "My Account"}
                </h1>
              </div>

              {currentUser?.businessName && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentUser.businessName}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {currentUser?.kebele ? `${currentUser.kebele}, ` : ""}{currentUser?.city || "Ethiopia"}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {currentUser?.phone || "No phone linked"}
                </span>
                <span>&bull;</span>
                <span className="font-bold text-amber-600">★ {currentUser?.rating || 4.9} Rating</span>
                {currentUser?.memberSince && (
                  <>
                    <span>&bull;</span>
                    <span>Member since {currentUser.memberSince}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all flex-1 sm:flex-none cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3] text-amber-400" />
              <span>Post Free Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Mobile Tab Selector */}
      <div className="relative z-10 flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab("ads")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "ads"
              ? "bg-[#0f172a] text-white shadow-md font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>My Posts ({userListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "saved"
              ? "bg-[#0f172a] text-white shadow-md font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Saved Items ({savedListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trades")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "trades"
              ? "bg-[#0f172a] text-white shadow-md font-black"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Repeat className="w-4 h-4 text-amber-400" />
          <span>Barter &amp; Deals ({offers.length + 1})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#0f172a] text-white shadow-md font-black"
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

          {userListings.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200/60 shadow-xs">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">No Products Posted Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  You have not published any products or device swaps on your account yet.
                </p>
              </div>
              <Link
                href="/listings/create"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3] text-amber-400" />
                <span>+ Post Your First Free Product</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userListings.map((ad) => {
                const imageSrc =
                  ad.images && ad.images.length > 0
                    ? ad.images[0]
                    : (ad as any).image ||
                      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80";
                const isSold = ad.status === "SOLD";

                return (
                  <div
                    key={ad.id}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-amber-400/50 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={imageSrc}
                        alt={ad.title}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              !isSold
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {!isSold ? "Active on Marketplace" : "Marked Sold"}
                          </span>
                          {ad.allowBarter && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                              Swap Enabled
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            📍 {ad.kebele || ad.city || "Adama"}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">{ad.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-black text-[#0f172a] text-sm font-mono">
                            {ad.price.toLocaleString()} ETB
                          </span>
                          <span>&bull;</span>
                          <span>{ad.views || 1} Views</span>
                          <span>&bull;</span>
                          <span>{ad.postedDate || "Recently"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={() => toggleAdStatus(ad.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        {!isSold ? "Mark Sold" : "Re-activate"}
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
                );
              })}
            </div>
          )}
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
            {offers.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                  <Repeat className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">No Barter Proposals or Offers Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    When you propose a device swap with cash top-up or receive offers from buyers on your listings, they will appear here.
                  </p>
                </div>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Explore Marketplace &rarr;
                </Link>
              </div>
            ) : (
              offers.map((off) => (
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
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: EDIT PROFILE */}
      {activeTab === "profile" && (
        <div className="relative z-10 space-y-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900">
                Personal &amp; Store Profile Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your display name, profile photo, contact numbers, and store location for buyer discovery
              </p>
            </div>

            {/* Profile Picture Management Section */}
            <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                {editAvatarUrl ? (
                  <img
                    src={editAvatarUrl}
                    alt="Profile Avatar"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#0f172a] shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#0f172a] text-amber-400 border-2 border-amber-400/40 flex items-center justify-center font-black text-2xl shadow-sm">
                    {editName ? editName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Your Profile Photo</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your own photo or business logo (PNG, JPG, WEBP). This replaces the default initials across your listings and chats.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label
                    htmlFor="profile-tab-avatar-input"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload New Photo</span>
                  </label>
                  <input
                    id="profile-tab-avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />

                  {editAvatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>
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
                    placeholder="e.g. Kidus Electronics & Trade Hub"
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
