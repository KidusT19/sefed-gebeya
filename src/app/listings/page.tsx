"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/data/mockData";
import { ProductListing } from "@/types/marketplace";
import { useMarketplace } from "@/context/MarketplaceContext";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import {
  Search,
  Filter,
  Repeat,
  ShieldCheck,
  MapPin,
  ArrowUpDown,
  CheckCircle,
  Heart,
  Grid,
  List,
  Star,
  X,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function ListingsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialKebele = searchParams.get("kebele") || searchParams.get("city") || "All";

  const { isFavorite, toggleFavorite, listings, selectedKebele: globalKebele, setSelectedKebele: setGlobalKebele } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialKebele !== "All" ? initialKebele : globalKebele || "All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedCity && selectedCity !== "All" && selectedCity !== "All Ethiopia") count++;
    if (selectedCondition !== "All") count++;
    if (onlyBarter) count++;
    if (onlyVerified) count++;
    if (minPrice || maxPrice) count++;
    return count;
  }, [selectedCategory, selectedCity, selectedCondition, onlyBarter, onlyVerified, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedCity("All");
    setSelectedCondition("All");
    setOnlyBarter(false);
    setOnlyVerified(false);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchWish = item.wishlist?.toLowerCase().includes(q);
          const matchSub = item.subcategory?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchWish && !matchSub) return false;
        }

        // Category filter
        if (selectedCategory && item.categorySlug !== selectedCategory) {
          return false;
        }

        // Location filter
        if (
          selectedCity !== "All" &&
          selectedCity !== "All Ethiopia" &&
          item.city !== selectedCity &&
          item.kebele !== selectedCity
        ) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== "All" && item.condition !== selectedCondition) {
          return false;
        }

        // Barter filter
        if (onlyBarter && !item.allowBarter) {
          return false;
        }

        // Verified seller filter
        if (onlyVerified && !item.seller.isVerified) {
          return false;
        }

        // Price filter
        if (minPrice && item.price < Number(minPrice)) return false;
        if (maxPrice && item.price > Number(maxPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
        return 0; // Default: newest / priority order
      });
  }, [searchQuery, selectedCategory, selectedCity, selectedCondition, onlyBarter, onlyVerified, sortBy, minPrice, maxPrice, listings]);

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-20 sm:pb-16">
      {/* Sefed Watermark Background */}
      <SefedWatermarkBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Top Header Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-bold mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Verified Classifieds &amp; Barter</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Ethiopian Marketplace Catalog
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse authentic items across Ethiopia with Telebirr escrow protection and fair device swaps.
              </p>
            </div>

            <Link
              href="/listings/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95"
            >
              <span>+ Post Free Product</span>
            </Link>
          </div>

          {/* Search Input Bar with Clear Button */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, brand, or model (e.g. iPhone, Dell, Samsung, Clothes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Chips Bar (Horizontal Scrollable for Mobile Thumbs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                selectedCategory === ""
                  ? "bg-[#0e623a] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                  selectedCategory === cat.slug
                    ? "bg-[#0e623a] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyBarter(!onlyBarter)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs flex items-center gap-1 ${
                onlyBarter
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              <Repeat className="w-3 h-3" />
              <span>Device Swap</span>
            </button>
          </div>
        </div>

        {/* Mobile Control Bar: Filters Trigger + Sort + Count */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            {/* Mobile Filter Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0e623a] text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs text-slate-600 font-medium">
              <strong className="text-slate-900 font-extrabold">{filteredListings.length}</strong> items
              {selectedCity !== "All" && selectedCity !== "All Ethiopia" && ` in ${selectedCity}`}
            </span>
          </div>

          {/* Sort Dropdown & Grid/List View Toggles */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                aria-label="Sort listings"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-xl bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
                aria-label="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Desktop Sidebar Filters + Listings Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4 sticky top-24">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-emerald-700" /> Filter Catalog
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Reset All ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* City / Kebele Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Location / City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setGlobalKebele(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="All">All Ethiopia (መላው ኢትዮጵያ)</option>
                  <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                  <option value="Adama">Adama (አዳማ)</option>
                  <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                  <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                  <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                  <option value="Gondar">Gondar (ጎንደር)</option>
                  <option value="Mekelle">Mekelle (መቐለ)</option>
                  <option value="Jimma">Jimma (ጅማ)</option>
                  <option value="Dessie">Dessie (ደሴ)</option>
                </select>
              </div>

              {/* Item Condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="All">Any Condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                </select>
              </div>

              {/* Price Range (ETB) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Price Range (ETB)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ETB"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="number"
                    placeholder="Max ETB"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={onlyBarter}
                    onChange={(e) => setOnlyBarter(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <span>Open for Device Swap (Barter)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <span>Verified Sellers Only</span>
                </label>
              </div>
            </div>

            {/* Sefed Escrow Guarantee Card */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-4 text-xs space-y-2">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Sefed Escrow Protection
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Pay securely via Telebirr or CBE Birr. Funds are held in escrow until you inspect your item.
              </p>
            </div>
          </aside>

          {/* Listings Grid: Mobile 2-Cols / Desktop 3-Cols */}
          <main className="lg:col-span-3">
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-black text-slate-900 text-lg">No items match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filter options or searching with a broader keyword.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2 rounded-full bg-[#0e623a] text-white text-xs font-bold hover:bg-[#0b4d2e] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4"
                    : "space-y-3"
                }
              >
                {filteredListings.map((item) => {
                  const saved = isFavorite(item.id);

                  if (viewMode === "list") {
                    return (
                      <div
                        key={item.id}
                        className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all p-3 flex flex-col sm:flex-row gap-3.5"
                      >
                        <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-700 shadow-xs active:scale-90"
                            aria-label="Save listing"
                          >
                            <Heart className={`w-3.5 h-3.5 ${saved ? "fill-rose-600 text-rose-600" : ""}`} />
                          </button>
                        </div>
                        <div className="flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="font-bold text-emerald-800">{item.subcategory || item.categorySlug}</span>
                              <span className="flex items-center gap-1 font-bold text-slate-700">
                                <MapPin className="w-3 h-3 text-emerald-700" />
                                {item.city} &bull; {item.kebele}
                              </span>
                            </div>
                            <Link href={`/listings/${item.id}`} className="block mt-1">
                              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 line-clamp-2">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-black text-lg text-[#0e623a]">
                              {item.price.toLocaleString()} ETB
                            </span>
                            <div className="flex items-center gap-2">
                              {item.allowBarter && (
                                <Link
                                  href={`/trades/new?target=${item.id}`}
                                  className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold"
                                >
                                  Swap
                                </Link>
                              )}
                              <Link
                                href={`/listings/${item.id}`}
                                className="px-3.5 py-1.5 rounded-lg bg-[#0e623a] text-white text-xs font-bold hover:bg-[#0b4d2e]"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        {/* Photo Container */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* City & Kebele Badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-slate-900 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-2xs border border-slate-200 max-w-[130px] truncate">
                            <MapPin className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                            <span className="truncate">{item.city}</span>
                          </div>

                          {/* Favorite Heart Button */}
                          <button
                            type="button"
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-xs transition-transform active:scale-90 cursor-pointer"
                            title={saved ? "Remove from saved" : "Save item"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${saved ? "fill-rose-600 text-rose-600" : "text-slate-600"}`} />
                          </button>

                          {/* Bottom Badges: Condition & Barter */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-white bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded">
                              {item.condition}
                            </span>
                          </div>

                          {item.allowBarter && (
                            <div className="absolute bottom-2 right-2">
                              <span className="bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                                <Repeat className="w-2.5 h-2.5" /> Barter
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Details */}
                        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-black text-sm sm:text-base text-[#0e623a]">
                              {item.price.toLocaleString()} ETB
                            </div>
                            {item.isNegotiable && (
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                                Neg.
                              </span>
                            )}
                          </div>

                          <Link href={`/listings/${item.id}`} className="block group-hover:text-emerald-800 transition-colors">
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 leading-snug">
                              {item.title}
                            </h3>
                          </Link>

                          {/* Seller & Verification */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <img
                                src={item.seller.avatar}
                                alt={item.seller.name}
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <span className="font-semibold text-slate-700 truncate">{item.seller.name}</span>
                            </div>
                            {item.seller.isVerified && (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="p-2 sm:p-3 pt-0">
                        {item.allowBarter ? (
                          <div className="grid grid-cols-2 gap-1.5">
                            <Link
                              href={`/trades/new?target=${item.id}`}
                              className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                            >
                              <Repeat className="w-3 h-3" />
                              <span>Swap</span>
                            </Link>
                            <Link
                              href={`/listings/${item.id}`}
                              className="py-1.5 px-2 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-[11px] text-center flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Buy Direct</span>
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={`/listings/${item.id}`}
                            className="w-full py-1.5 px-2 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-extrabold text-[11px] sm:text-xs text-center flex items-center justify-center gap-1 transition-colors shadow-2xs"
                          >
                            <span>Buy Direct from Seller</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet / Slide-Over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <h3 className="font-black text-sm text-slate-900">Filter Products</h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* City Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Select City</label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setGlobalKebele(e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <option value="All">All Ethiopia (መላው ኢትዮጵያ)</option>
                <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                <option value="Adama">Adama (አዳማ)</option>
                <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                <option value="Gondar">Gondar (ጎንደር)</option>
                <option value="Mekelle">Mekelle (መቐለ)</option>
                <option value="Jimma">Jimma (ጅማ)</option>
                <option value="Dessie">Dessie (ደሴ)</option>
              </select>
            </div>

            {/* Category Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Price Range (ETB)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ETB"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max ETB"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyBarter}
                  onChange={(e) => setOnlyBarter(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700"
                />
                <span>Open for Device Swap (Barter)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700"
                />
                <span>Verified Sellers Only</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-3 grid grid-cols-2 gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetFilters}
                className="py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="py-2.5 rounded-xl bg-[#0e623a] font-extrabold text-xs text-white shadow-xs"
              >
                Show Results ({filteredListings.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading Ethiopian marketplace catalog...
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
