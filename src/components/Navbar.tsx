"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  MapPin,
  X,
  Menu,
  ChevronDown,
  Sparkles,
  PhoneCall,
  LogIn,
  UserPlus,
  Home,
  Tag,
  Info,
  Phone,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { MOCK_LISTINGS, CATEGORIES } from "@/data/mockData";
import SideDrawer from "@/components/SideDrawer";
import SefedLogo from "@/components/SefedLogo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  const {
    selectedKebele,
    setSelectedKebele,
    language,
    setLanguage,
    currentUser,
    isLoggedIn,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);

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
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  // Close search and dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      const catParam = selectedCategory !== "all" ? `&category=${selectedCategory}` : "";
      router.push(`/listings?q=${encodeURIComponent(searchQuery.trim())}${catParam}`);
    }
  };

  // Dynamic active state: green shifts between Login and Sign Up based on route
  const isLoginPage = pathname === "/auth/login";
  const isSignupPage = pathname === "/auth/signup";

  return (
    <>
      {/* Mobile Slide Navigation Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-100">
        {/* Top Slim Utility Bar */}
        <div className="bg-[#0b3d26] text-white text-[11px] sm:text-xs px-4 py-1.5 transition-colors">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Left: Location and Slogan */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-medium text-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Deliver to:</span>
                <select
                  value={selectedKebele}
                  onChange={(e) => setSelectedKebele(e.target.value)}
                  className="bg-transparent font-bold text-white focus:outline-none cursor-pointer border-b border-emerald-400/40 pb-0.5 max-w-[140px] sm:max-w-[200px] truncate"
                  aria-label="Select delivery city"
                >
                  <option value="All Ethiopia" className="text-slate-900">All Ethiopia (መላው ኢትዮጵያ)</option>
                  <option value="Addis Ababa" className="text-slate-900">Addis Ababa (አዲስ አበባ)</option>
                  <option value="Adama" className="text-slate-900">Adama (አዳማ)</option>
                  <option value="Hawassa" className="text-slate-900">Hawassa (ሀዋሳ)</option>
                  <option value="Bahir Dar" className="text-slate-900">Bahir Dar (ባህር ዳር)</option>
                  <option value="Dire Dawa" className="text-slate-900">Dire Dawa (ድሬዳዋ)</option>
                  <option value="Gondar" className="text-slate-900">Gondar (ጎንደር)</option>
                  <option value="Mekelle" className="text-slate-900">Mekelle (መቐለ)</option>
                </select>
              </div>

              <span className="text-emerald-500/50 hidden md:inline">|</span>
              <span className="text-emerald-100/90 hidden md:inline font-normal">
                🇪🇹 Ethiopia&apos;s National E-Commerce &amp; Barter Marketplace
              </span>
            </div>

            {/* Right: Hotline & Multi-Language Toggle */}
            <div className="flex items-center gap-4 text-emerald-100">
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold">
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span>Support: 8082 (Toll-Free)</span>
              </div>

              <span className="text-emerald-500/50 hidden sm:inline">|</span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold" aria-label="Language selection">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === "en" ? "bg-amber-400 text-[#0b3d26] font-black" : "hover:text-white text-emerald-200"
                  }`}
                >
                  EN
                </button>
                <span className="text-emerald-500/40">/</span>
                <button
                  type="button"
                  onClick={() => setLanguage("am")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === "am" ? "bg-amber-400 text-[#0b3d26] font-black" : "hover:text-white text-emerald-200"
                  }`}
                >
                  አማ
                </button>
                <span className="text-emerald-500/40">/</span>
                <button
                  type="button"
                  onClick={() => setLanguage("om")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === "om" ? "bg-amber-400 text-[#0b3d26] font-black" : "hover:text-white text-emerald-200"
                  }`}
                >
                  Oromoo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Row: Logo + Search + Dynamic Shifting Auth Buttons */}
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Mobile Drawer Trigger & Sefed Brand Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Sefed Market Brand Logo */}
              <SefedLogo size="md" showTagline={true} />
            </div>

            {/* Center: Search Bar with Integrated Category Filter and Search Button */}
            <div ref={searchContainerRef} className="flex-1 max-w-2xl hidden md:block relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="relative flex-1 flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Search className="w-4 h-4 text-emerald-700" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search for products, electronics, groceries, fashion..."
                    className="w-full pl-10 pr-24 py-2.5 rounded-l-full bg-slate-50 border-2 border-r-0 border-emerald-600/30 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dark Green Pill Search Button */}
                <button
                  type="submit"
                  className="bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-r-full border-2 border-[#0e623a] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
                  {matchingCategories.length > 0 && (
                    <div className="p-3 bg-emerald-50/50">
                      <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block mb-1.5">
                        Matched Categories
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {matchingCategories.map((c) => (
                          <Link
                            key={c.id}
                            href={`/listings?category=${c.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-3 py-1 rounded-full bg-white hover:bg-emerald-700 hover:text-white text-xs font-bold text-slate-800 border border-emerald-200 transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingListings.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 block mb-1">
                        Products &amp; Verified Ads
                      </span>
                      {matchingListings.map((item) => (
                        <Link
                          key={item.id}
                          href={`/listings/${item.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/60 transition-colors group"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[11px] font-black text-emerald-700">
                              {item.price.toLocaleString()} ETB
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700">
                            View →
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No immediate match. Press Search to view all catalog results.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Distinct Auth Buttons with Dynamic Green Shift (No Cart!) */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {isLoggedIn ? (
                <div className="relative group">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    <img
                      src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                      alt={currentUser.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-emerald-600"
                    />
                    <div className="hidden xl:block text-left text-xs leading-tight">
                      <div className="font-bold text-slate-900 line-clamp-1">{currentUser.name.split(" ")[0]}</div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        {currentUser.walletBalance?.toLocaleString()} ETB
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2.5">
                  {/* Login Button: Green when on Login page; Outlined otherwise */}
                  <Link
                    href="/auth/login"
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition-all shadow-xs ${
                      isLoginPage
                        ? "bg-[#0e623a] hover:bg-[#0b4d2e] text-white ring-2 ring-[#0e623a]/30"
                        : "border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 bg-white"
                    }`}
                    title="Sign into your existing account"
                  >
                    <LogIn className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLoginPage ? "text-white" : "text-emerald-700"}`} />
                    <span>Login</span>
                  </Link>

                  {/* Sign Up Button: Green when on Sign Up or default; Outlined when on Login page */}
                  <Link
                    href="/auth/signup"
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition-all shadow-xs ${
                      isLoginPage
                        ? "border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 bg-white"
                        : "bg-[#0e623a] hover:bg-[#0b4d2e] text-white ring-2 ring-[#0e623a]/30"
                    }`}
                    title="Create a new customer account"
                  >
                    <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products in Ethiopia..."
                className="w-full pl-9 pr-20 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#0e623a] text-white text-xs font-bold px-3 py-1.5 rounded-full"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Secondary Category & Quick Links Bar */}
        <nav className="bg-[#fcfdfd] border-t border-slate-200/80 px-4 py-2 hidden sm:block" aria-label="Primary Navigation">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 lg:gap-3 text-xs font-bold">
              {/* Home Pill (Active dark green pill matching design) */}
              <Link
                href="/"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                  pathname === "/"
                    ? "bg-[#0b3d26] text-white shadow-xs font-extrabold"
                    : "text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>

              {/* Categories Dropdown Trigger */}
              <div ref={categoriesDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoriesMenuOpen(!isCategoriesMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isCategoriesMenuOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Product Categories
                    </div>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/listings?category=${cat.slug}`}
                        onClick={() => setIsCategoriesMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{cat.subcategories?.length || 0} subcategories</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <Link
                        href="/listings"
                        onClick={() => setIsCategoriesMenuOpen(false)}
                        className="block px-3.5 py-2 text-xs font-bold text-emerald-700 hover:underline"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Deals */}
              <Link
                href="/listings?tab=deals"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Deals</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  Hot
                </span>
              </Link>

              {/* Swaps & Circular Barter */}
              <Link
                href="/swaps"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Device Swap</span>
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>About Us</span>
              </Link>

              {/* Contact */}
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Right: Sell / List an Item CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/listings/create"
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xs transition-all"
              >
                <span>+ Post Free Product</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
