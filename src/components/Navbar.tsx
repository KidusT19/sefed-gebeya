"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Plus,
  MessageSquare,
  Repeat,
  Heart,
  X,
  ArrowRight,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { MOCK_LISTINGS, CATEGORIES } from "@/data/mockData";
import SideDrawer from "@/components/SideDrawer";

export default function Navbar() {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const {
    selectedKebele,
    setSelectedKebele,
    language,
    setLanguage,
    favorites,
    t,
    currentUser,
    isLoggedIn,
    logout,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Suggestions filtered based on query
  const matchingListings = searchQuery.trim()
    ? MOCK_LISTINGS.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.categorySlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingCategories = searchQuery.trim()
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Side Navigation Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        {/* Top Utility Bar - Clean, Customer Focused */}
        <div className="bg-[#0a0f1d] text-xs text-slate-300 px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="font-semibold text-amber-300">📍 Nationwide Ethiopia</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 hidden sm:inline">
                Ethiopia&apos;s peer-to-peer marketplace &amp; device barter
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 text-slate-300">
              <Link
                href="/safety"
                className="hover:text-blue-300 transition-colors text-[11px] sm:text-xs flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">Safety & Escrow</span>
              </Link>
              <span className="text-slate-600">•</span>
              {/* Language switcher */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                <button
                  onClick={() => setLanguage("en")}
                  className={`transition-colors ${
                    language === "en" ? "text-white font-bold underline" : "text-slate-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <span className="text-slate-600">/</span>
                <button
                  onClick={() => setLanguage("am")}
                  className={`transition-colors ${
                    language === "am" ? "text-white font-bold underline" : "text-slate-400 hover:text-white"
                  }`}
                >
                  አማ
                </button>
                <span className="text-slate-600">/</span>
                <button
                  onClick={() => setLanguage("om")}
                  className={`transition-colors ${
                    language === "om" ? "text-white font-bold underline" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Oromoo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2.5 sm:gap-5">
            {/* Left: Side Menu Hamburger Button & Brand Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                title="Open side navigation menu"
              >
                <Menu className="w-4 h-4 text-slate-700" />
                <span className="hidden md:inline font-bold">Menu</span>
              </button>

              {/* Brand Logo with Ethiopian Sefed Emblem */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 shadow-xs group-hover:scale-105 transition-transform bg-white flex items-center justify-center flex-shrink-0">
                  <img
                    src="/images/sefed-icon.jpg"
                    alt="Ethiopian Sefed Emblem"
                    width={40}
                    height={40}
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 block leading-none">
                      Sebez<span className="text-blue-600 font-black">Market</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded leading-tight">
                      ሰበዝ
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold tracking-wide block mt-0.5">
                    Ethiopia&apos;s National Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Location Picker + Global Search */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl text-xs text-slate-800 border border-slate-200 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold">City:</span>
              <select
                value={selectedKebele}
                onChange={(e) => setSelectedKebele(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-800"
              >
                <option value="All Ethiopia">All Ethiopia (መላው ኢትዮጵያ)</option>
                <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                <option value="Adama">Adama (አዳማ)</option>
                <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                <option value="Mekelle">Mekelle (መቐለ)</option>
                <option value="Gondar">Gondar (ጎንደር)</option>
                <option value="Jimma">Jimma (ጅማ)</option>
                <option value="Bishoftu">Bishoftu (ቢሾፍቱ)</option>
                <option value="Dessie">Dessie (ደሴ)</option>
              </select>
            </div>

            {/* Search Bar with Live Autocomplete */}
            <div ref={searchContainerRef} className="flex-1 max-w-lg hidden sm:block relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="I am looking for... (e.g. iPhone 13, Dell laptop, Sofa)"
                  className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                  {/* Matched Categories */}
                  {matchingCategories.length > 0 && (
                    <div className="p-2.5 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                        Categories
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/listings?category=${cat.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 hover:text-white text-xs font-semibold text-slate-800 border border-slate-200 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Listings */}
                  {matchingListings.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                        Matching Ads in Ethiopia
                      </span>
                      {matchingListings.map((item) => (
                        <Link
                          key={item.id}
                          href={`/listings/${item.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <img
                            src={item.images[0]}
                            alt=""
                            width={40}
                            height={40}
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="font-black text-blue-600">{item.price.toLocaleString()} ETB</span>
                              <span>&bull;</span>
                              <span>{item.city}</span>
                            </div>
                          </div>
                          {item.allowBarter && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                              Swap
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No immediate match. Press Enter to search all classifieds.
                    </div>
                  )}

                  {/* Footer View All Link */}
                  <div className="p-2.5 bg-slate-50 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Action Shortcuts & Post Ad Button */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Quick 1: Buy Direct */}
              <Link
                href="/listings"
                className="hidden xl:inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 transition-colors"
                title="Browse all items for direct purchase"
              >
                Buy Direct
              </Link>

              {/* Quick 2: Swap / Exchange */}
              <Link
                href="/swaps"
                className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
                title="Swap or barter products directly"
              >
                <Repeat className="w-3.5 h-3.5 text-amber-600" />
                <span>Swap</span>
              </Link>

              {/* Saved Items Link with Badge */}
              <Link
                href="/dashboard?tab=saved"
                className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                title="Saved Ads"
              >
                <Heart className="w-4 h-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* In-app Messages */}
              <Link
                href="/messages"
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                title="Direct Messages"
              >
                <MessageSquare className="w-4 h-4" />
              </Link>

              {/* User Dashboard / Auth Trigger */}
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900 transition-all"
                  title={`Signed in as ${currentUser.name}`}
                >
                  <img
                    src={
                      currentUser.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={currentUser.name}
                    width={24}
                    height={24}
                    style={{ width: "24px", height: "24px", objectFit: "cover" }}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                  />
                  <div className="hidden lg:block text-left text-[11px] leading-tight">
                    <div className="font-bold text-slate-900 line-clamp-1">{currentUser.name.split(" ")[0]}</div>
                    <div className="text-[9px] font-semibold text-blue-600">
                      {currentUser.walletBalance?.toLocaleString()} ETB
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href="/auth/login"
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="hidden sm:inline-block text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Primary Action: Post Free Ad */}
              <Link
                href="/listings/create"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition-transform active:scale-95 whitespace-nowrap ml-1"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ List Ad</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="mt-2.5 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, laptops, electronics across Ethiopia..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        </div>
      </header>
    </>
  );
}
