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
  User,
  Settings,
  LogOut,
  Package,
  Repeat,
  ShieldCheck,
  MessageSquare,
  Wallet,
  CheckCircle2,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { CATEGORIES } from "@/data/mockData";
import SideDrawer from "@/components/SideDrawer";
import SefedLogo from "@/components/SefedLogo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const {
    selectedKebele,
    setSelectedKebele,
    language,
    setLanguage,
    currentUser,
    isLoggedIn,
    logout,
    listings,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Suggestions filtered based on query
  const matchingListings = searchQuery.trim()
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.categorySlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingCategories = searchQuery.trim()
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  // Close search and dropdowns on outside click or route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
    setIsCategoriesMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
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
        <div className="bg-[#0f172a] text-white text-[11px] sm:text-xs px-4 py-1.5 transition-colors">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Left: Location and Slogan */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Deliver to:</span>
                <select
                  value={selectedKebele}
                  onChange={(e) => setSelectedKebele(e.target.value)}
                  className="bg-transparent font-bold text-white focus:outline-none cursor-pointer border-b border-amber-400/40 pb-0.5 max-w-[110px] sm:max-w-[200px] truncate text-[10px] sm:text-xs"
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

              <span className="text-slate-600 hidden md:inline">|</span>
              <span className="text-slate-200 hidden md:inline font-normal">
                🇪🇹 Ethiopia&apos;s National E-Commerce &amp; Barter Marketplace
              </span>
            </div>

            {/* Right: Hotline & Multi-Language Toggle */}
            <div className="flex items-center gap-2 sm:gap-4 text-slate-300 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold">
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span>Support: 8082 (Toll-Free)</span>
              </div>

              <span className="text-slate-600 hidden sm:inline">|</span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold" aria-label="Language selection">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === "en" ? "bg-amber-400 text-slate-950 font-black" : "hover:text-white text-slate-400"
                  }`}
                >
                  EN
                </button>
                <span className="text-slate-600">/</span>
                <button
                  type="button"
                  onClick={() => setLanguage("am")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === "am" ? "bg-amber-400 text-slate-950 font-black" : "hover:text-white text-slate-400"
                  }`}
                >
                  አማ
                </button>
                <span className="text-slate-600">/</span>
                <button
                  type="button"
                  onClick={() => setLanguage("om")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === "om" ? "bg-amber-400 text-slate-950 font-black" : "hover:text-white text-slate-400"
                  }`}
                  title="Afaan Oromoo"
                >
                  <span className="sm:hidden">OM</span>
                  <span className="hidden sm:inline">Oromoo</span>
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
                    <Search className="w-4 h-4 text-slate-400" />
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
                    className="w-full pl-10 pr-24 py-2.5 rounded-l-full bg-slate-50 border-2 border-r-0 border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#0f172a] transition-colors"
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

                {/* Saffron Gold Search Button */}
                <button
                  type="submit"
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-r-full border-2 border-[#f59e0b] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
                  {matchingCategories.length > 0 && (
                    <div className="p-3 bg-slate-50">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Matched Categories
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {matchingCategories.map((c) => (
                          <Link
                            key={c.id}
                            href={`/listings?category=${c.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-3 py-1 rounded-full bg-white hover:bg-[#0f172a] hover:text-white text-xs font-bold text-slate-800 border border-slate-300 transition-colors"
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
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-900 group-hover:text-[#0f172a] line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[11px] font-black text-[#0f172a]">
                              {item.price.toLocaleString()} ETB
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0f172a]">
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

            {/* Right: Distinct Auth Buttons with Midnight Navy & Gold Palette */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {isLoggedIn ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-expanded={isUserMenuOpen}
                    aria-label="User account menu"
                    className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  >
                    <div className="relative">
                      <img
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                        alt={currentUser.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#0f172a] shadow-2xs"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="hidden xl:block text-left text-xs leading-tight">
                      <div className="font-bold text-slate-900 line-clamp-1">{currentUser.name.split(" ")[0]}</div>
                      <div className="text-[10px] font-bold text-[#0f172a]">
                        {currentUser.walletBalance?.toLocaleString()} ETB
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180 text-[#0f172a]" : ""}`} />
                  </button>

                  {/* Vertical Pro Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
                      {/* User Header Profile Card */}
                      <div className="p-3.5 bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e293b] text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                            alt={currentUser.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-black text-sm text-white truncate">
                                {currentUser.name}
                              </h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                            </div>
                            <p className="text-[11px] font-medium text-slate-300 truncate">
                              {currentUser.phone || currentUser.email || "Verified Member"}
                            </p>
                            <span className="inline-block px-2 py-0.5 mt-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                              {currentUser.role === "MERCHANT" ? "Verified Merchant" : "Active Member"}
                            </span>
                          </div>
                        </div>

                        {/* Telebirr / CBE Escrow Balance Strip */}
                        <Link
                          href="/dashboard?tab=wallet"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="mt-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-between transition-colors shadow-2xs group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                              <Wallet className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Escrow Wallet</div>
                              <div className="text-xs font-black text-amber-400">
                                {currentUser.walletBalance?.toLocaleString()} ETB
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                            Manage →
                          </span>
                        </Link>
                      </div>

                      {/* Vertical Menu Options */}
                      <div className="p-1.5 space-y-0.5 text-xs font-bold text-slate-700">
                        <Link
                          href="/dashboard?tab=profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-800 flex items-center justify-center transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="leading-tight">My Profile</div>
                            <div className="text-[10px] text-slate-400 font-normal">View &amp; edit personal bio and ratings</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-700" />
                        </Link>

                        <Link
                          href="/dashboard?tab=ads"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-800 flex items-center justify-center transition-colors">
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="leading-tight">My Product Posts</div>
                            <div className="text-[10px] text-slate-400 font-normal">Manage active listings and bump ads</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-700" />
                        </Link>

                        <Link
                          href="/dashboard?tab=trades"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors">
                            <Repeat className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="leading-tight">My Device Swaps</div>
                            <div className="text-[10px] text-slate-400 font-normal">Active trade proposals &amp; cash equalizer</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-700" />
                        </Link>

                        <Link
                          href="/messages"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-800 flex items-center justify-center transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="leading-tight">Messages &amp; Inquiries</div>
                            <div className="text-[10px] text-slate-400 font-normal">Chat with buyers and sellers</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-700" />
                        </Link>

                        <Link
                          href="/dashboard?tab=saved"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-50 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="leading-tight">Saved &amp; Watchlist</div>
                            <div className="text-[10px] text-slate-400 font-normal">Products you saved for later</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-700" />
                        </Link>

                        <Link
                          href="/dashboard?tab=profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-800 flex items-center justify-center transition-colors">
                            <Settings className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="leading-tight">Settings</div>
                            <div className="text-[10px] text-slate-400 font-normal">Security &amp; notifications</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-700" />
                        </Link>
                      </div>

                      {/* Log Out Button */}
                      <div className="p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-50 group-hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="flex-1 text-left">Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2.5">
                  {/* Login Button */}
                  <Link
                    href="/auth/login"
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition-all shadow-xs ${
                      isLoginPage
                        ? "bg-[#0f172a] hover:bg-[#1e293b] text-white ring-2 ring-slate-900/20"
                        : "border border-slate-300 hover:border-slate-800 hover:bg-slate-50 text-slate-800 bg-white"
                    }`}
                    title="Sign into your existing account"
                  >
                    <LogIn className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLoginPage ? "text-white" : "text-slate-800"}`} />
                    <span>Login</span>
                  </Link>

                  {/* Sign Up Button */}
                  <Link
                    href="/auth/signup"
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition-all shadow-xs ${
                      isLoginPage
                        ? "border border-slate-300 hover:border-slate-800 hover:bg-slate-50 text-slate-800 bg-white"
                        : "bg-[#0f172a] hover:bg-[#1e293b] text-white ring-2 ring-slate-900/20"
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
                className="w-full pl-9 pr-20 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full transition-colors"
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
              {/* Home Pill */}
              <Link
                href="/"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                  pathname === "/"
                    ? "bg-[#0f172a] text-white shadow-xs font-extrabold"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
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
                        className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-950 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{cat.subcategories?.length || 0} subcategories</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <Link
                        href="/listings"
                        onClick={() => setIsCategoriesMenuOpen(false)}
                        className="block px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:text-amber-600 transition-colors"
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Device Swap</span>
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>About Us</span>
              </Link>

              {/* Contact */}
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Right: Sell / List an Item CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href={isLoggedIn ? "/listings/create" : "/auth/login?redirect=/listings/create"}
                className="inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-[13px] px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all whitespace-nowrap active:scale-[0.98]"
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
