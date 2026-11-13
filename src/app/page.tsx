"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SefedHero from "@/components/landing/SefedHero";
import SefedTrustBar from "@/components/landing/SefedTrustBar";
import SefedCategories from "@/components/landing/SefedCategories";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import AdamaRouteMap from "@/components/AdamaRouteMap";
import { useMarketplace, PRESET_USERS } from "@/context/MarketplaceContext";
import {
  ShoppingBag,
  Plus,
  Repeat,
  Heart,
  MapPin,
  ArrowRight,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle,
  Star,
  Search,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const trendingRef = useRef<HTMLDivElement>(null);

  const {
    isFavorite,
    toggleFavorite,
    selectedKebele,
    listings,
    currentUser,
    isLoggedIn,
    login,
    showToast,
  } = useMarketplace();

  const [activeFeedTab, setActiveFeedTab] = useState<"all" | "electronics" | "fashion" | "swap" | "budget">("all");

  // Barter Calculator Interactive State
  const [simMyDevice, setSimMyDevice] = useState("samsung-s21");
  const [simTargetDevice, setSimTargetDevice] = useState("iphone-13");

  const SIM_DEVICES: Record<string, { name: string; value: number; image: string }> = {
    "samsung-s21": {
      name: "Samsung Galaxy S21 5G",
      value: 36000,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80",
    },
    "iphone-13": {
      name: "iPhone 13 Pro 128GB",
      value: 55000,
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=300&auto=format&fit=crop&q=80",
    },
    "dell-xps": {
      name: "Dell XPS 13 (Core i7)",
      value: 68000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80",
    },
    "sony-camera": {
      name: "Sony Alpha A6400 Camera",
      value: 62000,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80",
    },
    "redmi-note": {
      name: "Redmi Note 12 Pro",
      value: 24500,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80",
    },
  };

  const myDeviceObj = SIM_DEVICES[simMyDevice] || SIM_DEVICES["samsung-s21"];
  const targetDeviceObj = SIM_DEVICES[simTargetDevice] || SIM_DEVICES["iphone-13"];
  const barterDifference = targetDeviceObj.value - myDeviceObj.value;

  const handleScrollToProducts = () => {
    trendingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter listings based on active tab and city/location
  const filteredListings = listings.filter((item) => {
    if (
      selectedKebele !== "All Ethiopia" &&
      selectedKebele !== "All" &&
      item.city !== selectedKebele &&
      item.kebele !== selectedKebele
    ) {
      return false;
    }
    if (activeFeedTab === "electronics") {
      return item.categorySlug === "electronics" || item.categorySlug === "phones" || item.categorySlug === "laptops";
    }
    if (activeFeedTab === "fashion") {
      return item.categorySlug === "fashion";
    }
    if (activeFeedTab === "swap") {
      return item.allowBarter;
    }
    if (activeFeedTab === "budget") {
      return item.price <= 25000;
    }
    return true;
  });

  return (
    <div className="w-full bg-white pb-16 relative overflow-hidden">
      {/* Authentic Ethiopian Sefed (ሰፌድ) Blurred Background Watermark */}
      <SefedWatermarkBackground />

      {/* 1. Official Sefed Market Hero Section (Mockup Match) */}
      <SefedHero onShopNowClick={handleScrollToProducts} />

      {/* 2. 4-Pillar Trust & Confidence Bar */}
      <SefedTrustBar />

      {/* 3. "Shop by Category" Grid (Pastel Cards Matching Mockup) */}
      <SefedCategories />

      {/* 4. Trending Verified Products Showcase */}
      <section ref={trendingRef} id="trending-products" className="py-12 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Classifieds &amp; Direct Purchases</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Marketplace Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hand-picked listings available for direct purchase or instant device barter across Ethiopia
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveFeedTab("all")}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFeedTab === "all"
                    ? "bg-[#0e623a] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                All Items ({listings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFeedTab("electronics")}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFeedTab === "electronics"
                    ? "bg-[#0e623a] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Electronics &amp; Phones
              </button>
              <button
                type="button"
                onClick={() => setActiveFeedTab("swap")}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeFeedTab === "swap"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Device Swap ({listings.filter((l) => l.allowBarter).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFeedTab("budget")}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFeedTab === "budget"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Under 25,000 ETB
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredListings.slice(0, 8).map((item) => {
              const isFav = isFavorite(item.id);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Product Image Frame */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <Link href={`/listings/${item.id}`} className="block w-full h-full">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* City Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-900 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-200">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{item.city}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-transform active:scale-90 ${
                          isFav ? "bg-rose-50 text-rose-600" : "bg-white/90 text-slate-400 hover:text-rose-500"
                        } shadow-xs`}
                        title="Save item"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                      </button>

                      {/* Swap Badge if Barter is Allowed */}
                      {item.allowBarter && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-400/95 px-2 py-0.5 rounded-full shadow-xs">
                          <Repeat className="w-3 h-3 stroke-[2.5]" />
                          <span>Swap Available</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{item.subcategory || item.categorySlug}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <Link href={`/listings/${item.id}`} className="block">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Price in ETB */}
                      <div className="pt-1">
                        <span className="text-base sm:text-lg font-black text-[#0e623a]">
                          {item.price.toLocaleString()} ETB
                        </span>
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700 truncate">{item.seller?.name || "Direct Seller"}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Purchase / View & Device Swap */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    {item.allowBarter ? (
                      <>
                        <Link
                          href={`/trades/new?target=${item.id}`}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs"
                        >
                          <Repeat className="w-3.5 h-3.5 text-amber-700" />
                          <span>Swap</span>
                        </Link>
                        <Link
                          href={`/listings/${item.id}`}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-xs text-center flex items-center justify-center gap-1 transition-colors shadow-xs"
                        >
                          <span>Buy Direct</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </>
                    ) : (
                      <Link
                        href={`/listings/${item.id}`}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Buy Direct from Seller</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Products Link */}
          <div className="text-center pt-6">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
            >
              <span>Explore All {listings.length}+ Listings in Ethiopia</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Smart Device Swap & Equalizer Feature Card */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                  <Repeat className="w-3.5 h-3.5 text-amber-700" />
                  <span>Sefed Circular Barter Engine</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Swap Your Device with Fair Value Equalizer
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Have an existing smartphone or laptop and want an upgrade? No need to sell for cheap cash. 
                  Our algorithm calculates the fair market price difference so both traders walk away happy with zero middleman cuts.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Hardware Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Automatic Fair Top-Up</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Bank Branch Meetups</span>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/swaps"
                    className="inline-flex items-center gap-2 bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-sm px-6 py-3 rounded-full shadow-md transition-all"
                  >
                    <span>Try Device Barter Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Interactive Barter Calculator Card */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4">
                <h3 className="font-black text-sm text-slate-900 flex items-center justify-between">
                  <span>Quick Barter Simulator</span>
                  <span className="text-xs text-emerald-700 font-bold">Live Calculator</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Your Device */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">Device You Have</label>
                    <select
                      value={simMyDevice}
                      onChange={(e) => setSimMyDevice(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="samsung-s21">Samsung Galaxy S21 (36,000 ETB)</option>
                      <option value="redmi-note">Redmi Note 12 Pro (24,500 ETB)</option>
                      <option value="iphone-13">iPhone 13 Pro (55,000 ETB)</option>
                      <option value="dell-xps">Dell XPS 13 (68,000 ETB)</option>
                    </select>
                    <div className="text-[11px] font-bold text-slate-600 pt-1">
                      Estimated: <span className="text-emerald-700">{myDeviceObj.value.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  {/* Target Device */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">Target Upgrade</label>
                    <select
                      value={simTargetDevice}
                      onChange={(e) => setSimTargetDevice(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="iphone-13">iPhone 13 Pro (55,000 ETB)</option>
                      <option value="dell-xps">Dell XPS 13 (68,000 ETB)</option>
                      <option value="sony-camera">Sony Alpha Camera (62,000 ETB)</option>
                      <option value="samsung-s21">Samsung Galaxy S21 (36,000 ETB)</option>
                    </select>
                    <div className="text-[11px] font-bold text-slate-600 pt-1">
                      Estimated: <span className="text-emerald-700">{targetDeviceObj.value.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Equalizer Result */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Calculated Fair Cash Top-Up
                  </span>
                  <div className="text-2xl font-black text-[#0b4d2e]">
                    {barterDifference > 0
                      ? `+ ${barterDifference.toLocaleString()} ETB Cash Needed`
                      : barterDifference < 0
                      ? `+ ${Math.abs(barterDifference).toLocaleString()} ETB Cash to You!`
                      : "Even Direct Swap (0 ETB)"}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Trade your {myDeviceObj.name} for {targetDeviceObj.name} safely
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Hyperlocal Kebele Logistics & Route Coverage */}
      <section className="py-8 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdamaRouteMap />
        </div>
      </section>

      {/* 7. Bottom Promotional & Seller Onboarding Banner */}
      <section className="pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0b3d26] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-amber-400 text-xs font-black uppercase tracking-wider block">
                Sefed Market — Shop Smart · Live Better
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Start Selling or Shopping on Ethiopia&apos;s National Marketplace Today
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Join thousands of verified shoppers and merchants in Addis Ababa, Adama, Hawassa, and beyond. 
                List your products for free or enjoy safe shopping with Telebirr escrow protection.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-[#0b3d26] font-black text-xs sm:text-sm shadow-md transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/listings/create"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  + Post Free Product
                </Link>
              </div>
            </div>

            {/* Background Graphic Decor */}
            <div className="absolute right-0 bottom-0 w-80 h-80 opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" fill="currentColor">
                <circle cx="100" cy="100" r="80" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
