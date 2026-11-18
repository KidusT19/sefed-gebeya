"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BarterInventoryItem } from "@/data/mockData";
import { ProductListing } from "@/types/marketplace";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  Repeat,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Lock,
  ArrowRight,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
  ShoppingBag,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

function NewTradeOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = searchParams.get("target") || "";

  const { isLoggedIn, isAuthReady, showToast, listings, currentUser } = useMarketplace();

  // Authentication Guard: Redirect only after auth state has hydrated from localStorage
  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast("Please sign in or register to make a device barter proposal.", "info");
      router.replace(`/auth/login?redirect=/trades/new?target=${targetId}`);
    }
  }, [isAuthReady, isLoggedIn, router, showToast, targetId]);

  // Target listing state with graceful async resolution on page reload
  const [targetListing, setTargetListing] = useState<ProductListing | null>(() => {
    return listings.find((l) => l.id === targetId) || null;
  });
  const [isLoadingListing, setIsLoadingListing] = useState<boolean>(() => !listings.some((l) => l.id === targetId));

  useEffect(() => {
    const match = listings.find((l: ProductListing) => l.id === targetId);
    if (match) {
      setTargetListing(match);
      setIsLoadingListing(false);
    } else {
      fetch("/api/listings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.listings && data.listings.length > 0) {
            const m = data.listings.find((l: ProductListing) => l.id === targetId) || data.listings[0];
            if (m) {
              setTargetListing(m);
            }
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingListing(false));
    }
  }, [targetId, listings]);

  // User's available barter inventory derived from real posted products
  const myInventory: BarterInventoryItem[] = useMemo(() => {
    let localCreatedIds: string[] = [];
    try {
      localCreatedIds = JSON.parse(localStorage.getItem("sefed_user_created_listings") || "[]");
    } catch {}

    const myPosts = listings.filter((l) => {
      if (targetListing && l.id === targetListing.id) return false;
      if (localCreatedIds.includes(l.id)) return true;
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
          l.seller?.phone &&
          currentUser.phone &&
          l.seller.phone.replace(/\D/g, "") === currentUser.phone.replace(/\D/g, "")
        ) {
          return true;
        }
      }
      return false;
    });

    return myPosts.map((l) => ({
      id: l.id,
      title: l.title,
      estimatedValue: l.price,
      condition: l.condition,
      category: l.subcategory || l.categorySlug || "Product",
      image: l.images[0] || "/placeholder.png",
      specs: `${l.condition} · ${l.subcategory || l.categorySlug} · ${l.city}`,
    }));
  }, [listings, currentUser, targetListing]);

  // Multi-item selection starts empty
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const selectedItems = myInventory.filter((item) => selectedItemIds.includes(item.id));
  const totalGoodsValue = selectedItems.reduce((acc, item) => acc + item.estimatedValue, 0);

  // Safe target price calculation
  const targetPrice = targetListing?.price || 0;

  // Raw benchmark mathematical difference
  const rawDifference = targetPrice - totalGoodsValue;

  const [customTopUp, setCustomTopUp] = useState<string>(rawDifference.toString());
  const [meetupLandmark, setMeetupLandmark] = useState("CBE Main Branch (Edna Mall / Bole / Mexico)");
  const [proposalNotes, setProposalNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Keep customTopUp synchronized when targetListing resolves
  useEffect(() => {
    if (targetListing) {
      setCustomTopUp((targetListing.price - totalGoodsValue).toString());
    }
  }, [targetListing?.id, targetListing?.price]);

  // When selection changes, update the proposed cash top-up
  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      const nextItems = myInventory.filter((i) => next.includes(i.id));
      const nextSum = nextItems.reduce((acc, i) => acc + i.estimatedValue, 0);
      setCustomTopUp(((targetListing?.price || 0) - nextSum).toString());
      return next;
    });
  };

  const selectAll = () => {
    const allIds = myInventory.map((i) => i.id);
    setSelectedItemIds(allIds);
    const sum = myInventory.reduce((acc, i) => acc + i.estimatedValue, 0);
    setCustomTopUp(((targetListing?.price || 0) - sum).toString());
  };

  const clearSelection = () => {
    setSelectedItemIds([]);
    setCustomTopUp((targetListing?.price || 0).toString());
  };

  const numericTopUp = Number(customTopUp) || 0;
  const totalOfferedValue = totalGoodsValue + numericTopUp;

  // Percentage calculations for dynamic balance meter - safe from undefined targetListing
  const goodsPercentage =
    targetPrice > 0 ? Math.min(100, Math.round((totalGoodsValue / targetPrice) * 100)) : 0;
  const cashPercentage = Math.max(0, 100 - goodsPercentage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemIds.length === 0 && numericTopUp <= 0) {
      showToast("Please select at least 1 item or specify a cash offer.", "error");
      return;
    }
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/swaps");
    }, 2800);
  };

  // Loading state during auth hydration or listing fetch
  if (!isAuthReady || isLoadingListing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 animate-pulse shadow-inner">
          <Repeat className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Loading Barter Deal Room...</h2>
        <p className="text-xs text-slate-500 font-medium">
          Retrieving target item and calculating fair trade values...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xl shadow-slate-900/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-inner border border-amber-200/50">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Propose Barter Deals
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
              Sefed multi-item device swaps and direct barter require verified seller and buyer accounts.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/auth/login?redirect=/trades/new?target=${targetId}`}
              className="w-full min-h-[46px] py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-amber-400" />
            </Link>

            <Link
              href={`/auth/signup?redirect=/trades/new?target=${targetId}`}
              className="w-full min-h-[44px] py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
            >
              Create Free Sefed Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!targetListing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you requested for trade is no longer available.</p>
        <Link href="/" className="px-5 py-2.5 rounded-full bg-[#0f172a] text-white font-bold text-xs hover:bg-slate-800 transition-colors">
          Browse Marketplace Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Breadcrumb & Room Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push(`/listings/${targetListing.id}`);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-black font-bold bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs hover:bg-slate-50 transition-all cursor-pointer group"
          title="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to {targetListing.title.slice(0, 28)}...</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-slate-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-700" /> Multi-Item Barter Deal Room
          </span>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            Direct Handover
          </span>
        </div>
      </div>

      {/* Main Deal Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-8">
        {/* Title Header */}
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Repeat className="w-7 h-7 text-amber-500" />
            Multi-Product Barter &amp; Cash Top-Up Proposal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Select 1, 2, 3 or more of your previously posted items to exchange for{" "}
            <strong className="text-slate-900">{targetListing.seller?.name || "Seller"}</strong>&apos;s product. Sefed calculates the exact cash top-up so both sides achieve 100% fair value equivalence.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Barter Bundle Proposal Submitted!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
              <strong>{targetListing.seller?.name || "Seller"}</strong> has received your bundle offer containing{" "}
              <strong>{selectedItems.length} of your posted items</strong> plus{" "}
              <strong>{numericTopUp > 0 ? `${numericTopUp.toLocaleString()} ETB cash` : "direct swap"}</strong>.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl max-w-md mx-auto border border-slate-200 text-xs text-slate-700 space-y-1 text-left">
              <div className="font-bold text-slate-900">What Happens Next:</div>
              <div>&bull; The seller can accept your offer or counter-select other items from your post inventory.</div>
              <div>&bull; Cash top-ups and devices are exchanged directly during the physical landmark inspection.</div>
            </div>
            <p className="text-xs text-[#0f172a] font-bold animate-pulse pt-2">
              Redirecting to your barter deal dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. TARGET ITEM CARD (What You Want to Receive) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                  Target Item You Receive
                </span>
                <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                  Target Price: {targetListing.price.toLocaleString()} ETB
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3.5">
                  <img
                    src={targetListing.images?.[0] || "/placeholder.png"}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                  />
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 line-clamp-1">
                      {targetListing.title}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Seller: <strong className="text-slate-800">{targetListing.seller?.name || "Seller"}</strong> &bull; {targetListing.kebele || ""}{targetListing.city ? `, ${targetListing.city}` : ""}
                    </div>
                    <div className="text-[11px] text-amber-700 font-bold bg-amber-50 inline-block px-2 py-0.5 rounded-md mt-1 border border-amber-200">
                      Wishlist: {targetListing.wishlist || "Open to fair offers"}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-5 shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">Full Value</div>
                  <div className="text-xl sm:text-2xl font-black text-[#0f172a]">
                    {targetListing.price.toLocaleString()} <span className="text-xs font-bold text-slate-500">ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BUYER'S POSTED INVENTORY MULTI-SELECT BASKET */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-500" />
                    Select from Your Previously Posted Products
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Pick 1, 2, 3 or more of your available posts to bundle together for this swap:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Grid of User's Posts */}
              {myInventory.length === 0 ? (
                <div className="p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-3">
                  <Repeat className="w-10 h-10 text-amber-700 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900">No products available in your barter inventory</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Post your device or item for free on Sefed to bundle it into this trade proposal, or negotiate pure cash directly.
                    </p>
                  </div>
                  <Link
                    href="/listings/create"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    <span>+ Post Free Product to Trade</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {myInventory.map((item) => {
                    const isChecked = selectedItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemSelection(item.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 relative ${
                          isChecked
                            ? "bg-amber-50/50 border-amber-400 shadow-xs ring-2 ring-amber-400/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="shrink-0 text-amber-600">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-amber-600 fill-amber-100" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        <img
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {item.condition}
                            </span>
                          </div>
                          <h4 className="font-black text-xs text-slate-900 truncate mt-0.5">
                            {item.title}
                          </h4>
                          {item.specs && (
                            <p className="text-[10px] text-slate-500 truncate">{item.specs}</p>
                          )}
                          <div className="text-xs font-black text-[#0f172a] mt-1">
                            {item.estimatedValue.toLocaleString()} ETB
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Barter Bundle Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    {selectedItems.length}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    Products Selected in Your Barter Basket:
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {selectedItems.map((i) => i.title.split(" ")[0]).join(", ") || "None"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 mr-2">Total Goods Value:</span>
                  <span className="text-base font-black text-amber-400">
                    {totalGoodsValue.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            {/* 3. DYNAMIC VALUATION & CASH TOP-UP ENGINE */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Automated Fair-Value &amp; Cash Top-Up Balance
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Sefed balances product value deltas with transparent fair-trade top-ups.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    Mathematical Difference
                  </span>
                  <span className="text-lg font-black text-[#0f172a]">
                    {rawDifference > 0
                      ? `+${rawDifference.toLocaleString()} ETB`
                      : rawDifference < 0
                      ? `-${Math.abs(rawDifference).toLocaleString()} ETB`
                      : "0 ETB (Even)"}
                  </span>
                </div>
              </div>

              {/* Visual Equivalence Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    Your {selectedItems.length} Barter Products ({totalGoodsValue.toLocaleString()} ETB &bull; {goodsPercentage}%)
                  </span>
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a] inline-block"></span>
                    Cash Top-Up ({numericTopUp.toLocaleString()} ETB &bull; {cashPercentage}%)
                  </span>
                </div>

                <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${goodsPercentage}%` }}
                    className="bg-amber-400 transition-all duration-300 flex items-center justify-center text-[9px] font-black text-slate-950"
                  >
                    {goodsPercentage > 15 ? `${goodsPercentage}% Goods` : ""}
                  </div>
                  <div
                    style={{ width: `${cashPercentage}%` }}
                    className="bg-[#0f172a] transition-all duration-300 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {cashPercentage > 15 ? `${cashPercentage}% Cash` : ""}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Combined Offer Value: <strong className="text-slate-900">{totalOfferedValue.toLocaleString()} ETB</strong></span>
                  <span>Target Value: <strong className="text-slate-900">{targetListing.price.toLocaleString()} ETB</strong></span>
                </div>
              </div>

              {/* Adjustable Cash Top-Up Field */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <label className="text-xs font-black text-slate-900 block">
                  Proposed Cash Top-Up Amount (ETB directly paid to seller)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={customTopUp}
                      onChange={(e) => setCustomTopUp(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ETB
                    </span>
                  </div>

                  <div className="p-2.5 px-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-900 shrink-0">
                    {numericTopUp > 0
                      ? "You Pay Cash to Seller"
                      : numericTopUp < 0
                      ? "Seller Pays You Cash"
                      : "100% Equal Item Barter"}
                  </div>
                </div>

                {/* Explanation of the Deal */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedItems.length > 0 ? (
                    <>
                      <strong>Deal Summary:</strong> You are giving{" "}
                      <span className="font-bold text-slate-900">
                        {selectedItems.map((i) => i.title).join(" + ")}
                      </span>
                      {numericTopUp > 0 && (
                        <>
                          {" "}plus{" "}
                          <span className="font-black text-[#0f172a]">
                            {numericTopUp.toLocaleString()} ETB cash top-up
                          </span>
                        </>
                      )}{" "}
                      in exchange for the{" "}
                      <span className="font-bold text-slate-900">{targetListing.title}</span>.
                    </>
                  ) : (
                    "Please select at least one of your posted products above to initiate a barter exchange."
                  )}
                </div>
              </div>

              {/* Seller View Notice (Multi-Item Transparency) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Seller Review &amp; Counter-Selection:</strong> The seller of the {targetListing.title} will see all your selected items, plus they will have visibility into your full posted inventory. If they prefer your other posts (e.g., your Nike shoes or AirPods), they can propose a counter-selection directly in chat!
                </div>
              </div>
            </div>

            {/* 4. SAFE PUBLIC MEETUP LANDMARK */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-900 block">
                Select Safe In-Person Inspection Landmark (Bank Branch / Commercial Mall)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  "CBE Main Branch (Edna Mall / Bole / Mexico)",
                  "CBE Posta Bet / Arada Commercial Area",
                  "CBE Piazza / Lake Commercial Center",
                ].map((spot) => (
                  <div
                    key={spot}
                    onClick={() => setMeetupLandmark(spot)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      meetupLandmark === spot
                        ? "border-[#0f172a] bg-slate-50 shadow-xs ring-2 ring-slate-900/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{spot}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">
                      Public landmark with security guards for safe physical device inspection and direct deal completion.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. NOTE TO SELLER */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 block">
                Message to Seller (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Both the Lenovo ThinkPad and Samsung S21 are in great condition with original chargers. Ready to meet today at CBE."
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
              />
            </div>

            {/* 6. SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Repeat className="w-4 h-4 text-amber-400" />
                <span>
                  Send Multi-Item Barter Proposal ({selectedItems.length} Products + {numericTopUp.toLocaleString()} ETB)
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400 ml-1" />
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-2 font-medium">
                Inspect and test all devices thoroughly in person before completing the exchange.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function NewTradeOfferPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading multi-item barter deal room...</div>}>
      <NewTradeOfferContent />
    </Suspense>
  );
}
