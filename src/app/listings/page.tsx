"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MOCK_LISTINGS, CATEGORIES } from "@/data/mockData";
import { ProductListing } from "@/types/marketplace";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  Search,
  Filter,
  Repeat,
  ShieldCheck,
  MapPin,
  Tag,
  ArrowUpDown,
  CheckCircle,
  Heart,
  Grid,
  List,
  Phone,
  MessageSquare,
  Star,
} from "lucide-react";

function ListingsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialKebele = searchParams.get("kebele") || "All";

  const { isFavorite, toggleFavorite, listings } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedKebele, setSelectedKebele] = useState(initialKebele);
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchWish = item.wishlist.toLowerCase().includes(q);
        const matchSub = item.subcategory.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchWish && !matchSub) return false;
      }

      // Category filter
      if (selectedCategory && item.categorySlug !== selectedCategory) {
        return false;
      }

      // Location filter
      if (
        selectedKebele !== "All" &&
        selectedKebele !== "All Ethiopia" &&
        item.city !== selectedKebele &&
        item.kebele !== selectedKebele
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
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedKebele, selectedCondition, onlyBarter, onlyVerified, sortBy, minPrice, maxPrice]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Bar (Clean Modern Slate) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Classifieds &amp; Barter Marketplace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse products available across Ethiopia for direct cash purchase or direct barter trade-in with verified sellers
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              href="/listings/create"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors text-center flex-1 sm:flex-none cursor-pointer"
            >
              + Post Free Ad
            </Link>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Search by product name, model, or wishlist (e.g. iPhone, Dell, Mitad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedKebele}
              onChange={(e) => setSelectedKebele(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="All">All Ethiopia (መላው ኢትዮጵያ)</option>
              <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
              <option value="Adama">Adama (አዳማ)</option>
              <option value="Hawassa">Hawassa (ሀዋሳ)</option>
              <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
              <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
              <option value="Mekelle">Mekelle (መቐለ)</option>
              <option value="Jimma">Jimma (ጅማ)</option>
              <option value="Gondar">Gondar (ጎንደር)</option>
              <option value="Bishoftu">Bishoftu (ቢሾፍቱ)</option>
              <option value="Dessie">Dessie (ደሴ)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-500">Quick Filter:</span>
          <button
            onClick={() => {
              setOnlyBarter(false);
              setOnlyVerified(false);
              setMinPrice("");
              setMaxPrice("");
              setSelectedCategory("");
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-colors cursor-pointer text-xs ${
              !onlyBarter && !onlyVerified && !selectedCategory
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({listings.length})
          </button>
          <button
            onClick={() => setOnlyBarter(!onlyBarter)}
            className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs ${
              onlyBarter
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Open for Barter</span>
          </button>
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs ${
              onlyVerified
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Sellers</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Listings Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter Listings
              </span>
              {(selectedCategory || selectedKebele !== "All" || selectedCondition !== "All" || onlyBarter || onlyVerified || minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedKebele("All");
                    setSelectedCondition("All");
                    setOnlyBarter(false);
                    setOnlyVerified(false);
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Condition Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Item Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="All">Any Condition</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Price Range (ETB)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Safety Box (Blue Clean) */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-4 text-xs space-y-2">
            <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Safe Trading Tips
            </span>
            <ul className="text-blue-800 space-y-1 list-disc list-inside leading-relaxed text-[11px]">
              <li>Never send upfront bank transfers without inspecting the item in person.</li>
              <li>Inspect IMEI, battery health, and test charger before completing deal.</li>
              <li>Meet at daylight public landmarks and CBE bank branches in your city.</li>
            </ul>
          </div>
        </aside>

        {/* Listings Feed */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredListings.length}</strong> verified listings across Ethiopia
            </span>
            <span>
              Showing <strong className="text-[#2b1c11]">{filteredListings.length}</strong> listings in Adama
            </span>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">View:</span>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg border transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#3d2717] text-white border-[#3d2717]"
                    : "bg-[#faf5ed] text-[#52361f] border-[#dfd2be]"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg border transition-colors ${
                  viewMode === "list"
                    ? "bg-[#3d2717] text-white border-[#3d2717]"
                    : "bg-[#faf5ed] text-[#52361f] border-[#dfd2be]"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900">No listings match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing some filters or searching with a different term.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredListings.map((item) => {
                const saved = isFavorite(item.id);
                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Photo Container */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Landmark Tag */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-900 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span>{item.city} &bull; {item.landmark || item.kebele}</span>
                        </div>

                        {/* Favorite Heart Button */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-xs transition-transform active:scale-90 cursor-pointer"
                          title={saved ? "Remove from saved" : "Save ad"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${saved ? "fill-rose-600 text-rose-600" : "text-slate-600"}`} />
                        </button>

                        {/* Condition Badge */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="text-[10px] font-black uppercase text-white bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            {item.condition}
                          </span>
                        </div>

                        {item.allowBarter && (
                          <div className="absolute bottom-2.5 right-2.5">
                            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                              <Repeat className="w-3 h-3" /> Barter
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="font-mono font-black text-lg text-slate-900">
                            {item.price.toLocaleString()}{" "}
                            <span className="text-xs font-extrabold text-blue-600">ETB</span>
                          </div>
                          {item.isNegotiable && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              Negotiable
                            </span>
                          )}
                        </div>

                        <Link href={`/listings/${item.id}`} className="block group-hover:text-blue-600 transition-colors">
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Wishlist */}
                        {item.allowBarter && item.wishlist && (
                          <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                            <div className="font-bold flex items-center gap-1 text-[10px]">
                              <Repeat className="w-3 h-3 text-amber-600" />
                              <span>Trade Wishlist:</span>
                            </div>
                            <p className="text-[10px] text-amber-800 line-clamp-1">
                              {item.wishlist}
                            </p>
                          </div>
                        )}

                        {/* Seller Trust Bar */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={item.seller.avatar}
                              alt={item.seller.name}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-[11px] truncate flex items-center gap-1">
                                <span>{item.seller.name}</span>
                                {item.seller.isVerified && (
                                  <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block">
                                {item.city} &bull; {item.landmark || item.kebele}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 shrink-0">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{item.seller.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Contact Action Bar */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${item.seller.phone}`}
                        className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call</span>
                      </a>

                      {item.allowBarter ? (
                        <Link
                          href={`/trades/new?target=${item.id}`}
                          className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/listings/${item.id}`}
                          className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                        >
                          <span>View Ad</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-3">
              {filteredListings.map((item) => {
                const saved = isFavorite(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-slate-900/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {item.condition}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 uppercase text-[10px]">
                            {item.subcategory}
                          </span>
                          <span className="text-[11px] text-slate-500">&bull; {item.postedDate}</span>
                          {item.allowBarter && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Swap / Barter
                            </span>
                          )}
                        </div>
                        <Link href={`/listings/${item.id}`}>
                          <h3 className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="text-base font-black text-slate-900">
                          {item.price.toLocaleString()} ETB
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.city} &bull; {item.landmark || item.kebele} &bull; Seller: {item.seller.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 self-stretch sm:self-auto justify-end">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          saved ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                        title="Save ad"
                      >
                        <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                      </button>
                      <Link
                        href={`/listings/${item.id}`}
                        className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap shadow-xs"
                      >
                        View &amp; Contact
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading listings...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
