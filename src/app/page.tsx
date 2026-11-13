"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar";
import AdamaRouteMap from "@/components/AdamaRouteMap";
import { useMarketplace, PRESET_USERS } from "@/context/MarketplaceContext";
import {
  ShoppingBag,
  Plus,
  Repeat,
  RefreshCw,
  Heart,
  MapPin,
  ArrowRight,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle,
  Zap,
  Star,
  Search,
  ArrowLeftRight,
  User,
  Wallet,
  LogIn,
  SlidersHorizontal,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    isFavorite,
    toggleFavorite,
    selectedKebele,
    setSelectedKebele,
    listings,
    currentUser,
    isLoggedIn,
    login,
    showToast,
  } = useMarketplace();

  const [activeFeedTab, setActiveFeedTab] = useState<"all" | "swap" | "budget">("all");
  const [heroSearchQuery, setHeroSearchQuery] = useState("");

  // Barter Simulator Interactive State
  const [simMyDevice, setSimMyDevice] = useState("samsung-s21");
  const [simTargetDevice, setSimTargetDevice] = useState("iphone-13");

  // Hero Integrated Auth & Barter Card State
  const [heroAuthTab, setHeroAuthTab] = useState<"register" | "login" | "demo" | "equalizer">("register");
  const [heroRegName, setHeroRegName] = useState("");
  const [heroRegPhone, setHeroRegPhone] = useState("+251 9");
  const [heroRegCity, setHeroRegCity] = useState("Addis Ababa");
  const [heroRegPassword, setHeroRegPassword] = useState("");
  const [heroRegShowPass, setHeroRegShowPass] = useState(false);

  const [heroLoginPhone, setHeroLoginPhone] = useState("+251 911 448822");
  const [heroLoginPassword, setHeroLoginPassword] = useState("password123");
  const [heroLoginShowPass, setHeroLoginShowPass] = useState(false);

  const handleHeroRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroRegName.trim()) {
      showToast("Please enter your full name", "error");
      return;
    }
    const cleanPhone = heroRegPhone.replace(/\s+/g, "");
    if (cleanPhone.length < 12) {
      showToast("Please enter a valid Ethiopian phone (+251 9...)", "error");
      return;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: heroRegName.trim(),
      phone: cleanPhone,
      role: "BUYER" as const,
      city: heroRegCity,
      kebele: "Central",
      landmark: `${heroRegCity} Center`,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      rating: 5.0,
      completedTrades: 0,
      walletBalance: 0,
    };
    login(newUser);
    showToast(`Welcome to Sebez Market, ${newUser.name}!`, "success");
  };

  const handleHeroLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = heroLoginPhone.replace(/\s+/g, "");
    const matching = PRESET_USERS.find((u) => u.phone.includes(cleanPhone.slice(-6))) || PRESET_USERS[0];
    login(matching);
    showToast(`Welcome back, ${matching.name}!`, "success");
  };

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

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(heroSearchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
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
    if (activeFeedTab === "swap") {
      return item.allowBarter;
    }
    if (activeFeedTab === "budget") {
      return item.price <= 25000;
    }
    return true;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* =========================================================================
          1. BRIGHT, MODERN, PREMIUM HERO SECTION
      ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        {/* Soft background glow accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-8">
          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ethiopia&apos;s Peer-to-Peer Marketplace &bull; ሰበዝ ማርኬት</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
              <span className="hidden sm:inline">📍 Safe Handover at Bank Branches Nationwide</span>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                0% Broker Fee
              </span>
            </div>
          </div>

          {/* Master Hero Grid: Left Pitch & Search + Right Interactive Auth & Barter Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 7 Columns: Headline, Subtitle, 4 Trust Pills & Prominent Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                  Direct National Trade. Fair Value.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                    Smart Device Barter.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
                  The peer-to-peer marketplace built for all of Ethiopia. Buy and sell verified smartphones, laptops, electronics, and home items directly from sellers in Addis Ababa, Adama, Hawassa, Bahir Dar, Dire Dawa, and nationwide. Post free ads in under 60 seconds, or swap devices with automatic cash-difference balancing.
                </p>
              </div>

              {/* The 4 Core Trust & Capability Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>100% Direct</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Call seller directly with 0% middleman fees</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Repeat className="w-3.5 h-3.5 text-amber-600" />
                    <span>1-to-1 Barter</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Swap phone + auto cash difference balance</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>3-Way Loops</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Multi-trader circular exchange (0 ETB net)</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safe Meetups</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">Public handovers at CBE bank branches</p>
                </div>
              </div>

              {/* Master Search Bar Container */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex flex-col sm:flex-row gap-2 max-w-xl"
              >
                <div className="flex-1 relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    placeholder="Search phones, laptops, electric mitad across Ethiopia..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-slate-50 sm:bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedKebele}
                    onChange={(e) => setSelectedKebele(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 border-none focus:outline-none cursor-pointer"
                  >
                    <option value="All Ethiopia">All Ethiopia</option>
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

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick Popular Search Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-700 mr-1">Popular:</span>
                {[
                  { label: "iPhone 13", query: "iPhone 13" },
                  { label: "Core i7 Laptop", query: "laptop" },
                  { label: "Samsung S21", query: "Samsung" },
                  { label: "Electric Mitad", query: "mitad" },
                  { label: "Sony Camera", query: "camera" },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setHeroSearchQuery(chip.query);
                      router.push(`/listings?q=${encodeURIComponent(chip.query)}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Interactive Multi-Tab Auth & Barter Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xl space-y-4">
                {/* 4 Interactive Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setHeroAuthTab("register")}
                    className={`flex-1 py-1.5 px-2 rounded-xl transition-all text-center text-[11px] sm:text-xs ${
                      heroAuthTab === "register"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Register Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroAuthTab("login")}
                    className={`flex-1 py-1.5 px-2 rounded-xl transition-all text-center text-[11px] sm:text-xs ${
                      heroAuthTab === "login"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroAuthTab("demo")}
                    className={`flex-1 py-1.5 px-2 rounded-xl transition-all text-center text-[11px] sm:text-xs ${
                      heroAuthTab === "demo"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Demo Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroAuthTab("equalizer")}
                    className={`flex-1 py-1.5 px-2 rounded-xl transition-all text-center text-[11px] sm:text-xs ${
                      heroAuthTab === "equalizer"
                        ? "bg-white text-amber-700 shadow-xs font-black"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Barter Calc
                  </button>
                </div>

                {/* If Logged In: Show Live User Status Banner */}
                {isLoggedIn && (
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900">{currentUser.name}</div>
                        <div className="text-[10px] text-blue-700 font-semibold">
                          {currentUser.city} &bull; {currentUser.rating} ★ Verified Trader
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs"
                    >
                      Dashboard &rarr;
                    </Link>
                  </div>
                )}

                {/* TAB CONTENT 1: REGISTER FREE */}
                {heroAuthTab === "register" && (
                  <form onSubmit={handleHeroRegister} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={heroRegName}
                          onChange={(e) => setHeroRegName(e.target.value)}
                          placeholder="e.g. Henok Tadesse"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">Ethiopian Mobile Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={heroRegPhone}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith("+251")) val = "+251 ";
                            setHeroRegPhone(val);
                          }}
                          placeholder="+251 911 223344"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">Your City</label>
                        <select
                          value={heroRegCity}
                          onChange={(e) => setHeroRegCity(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                        >
                          <option value="Addis Ababa">Addis Ababa</option>
                          <option value="Adama">Adama</option>
                          <option value="Hawassa">Hawassa</option>
                          <option value="Bahir Dar">Bahir Dar</option>
                          <option value="Dire Dawa">Dire Dawa</option>
                          <option value="Mekelle">Mekelle</option>
                          <option value="Jimma">Jimma</option>
                          <option value="Gondar">Gondar</option>
                          <option value="Bishoftu">Bishoftu</option>
                          <option value="Dessie">Dessie</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">Password</label>
                        <div className="relative">
                          <input
                            type={heroRegShowPass ? "text" : "password"}
                            required
                            value={heroRegPassword}
                            onChange={(e) => setHeroRegPassword(e.target.value)}
                            placeholder="Min 4 chars"
                            className="w-full px-2.5 py-2 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setHeroRegShowPass(!heroRegShowPass)}
                            className="text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2"
                          >
                            {heroRegShowPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <span>Create Account &amp; Start Trading</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500 font-medium">
                      Zero broker commissions &bull; Safe landmark meetups nationwide
                    </p>
                  </form>
                )}

                {/* TAB CONTENT 2: SIGN IN */}
                {heroAuthTab === "login" && (
                  <form onSubmit={handleHeroLogin} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">Ethiopian Mobile Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={heroLoginPhone}
                          onChange={(e) => setHeroLoginPhone(e.target.value)}
                          placeholder="+251 911 223344"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-700 block">Password</label>
                        <Link href="/auth/login" className="text-[10px] text-blue-600 hover:underline font-semibold">
                          Forgot?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={heroLoginShowPass ? "text" : "password"}
                          required
                          value={heroLoginPassword}
                          onChange={(e) => setHeroLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => setHeroLoginShowPass(!heroLoginShowPass)}
                          className="text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2"
                        >
                          {heroLoginShowPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <span>Sign In to Sebez</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* TAB CONTENT 3: 1-CLICK DEMO ACCESS */}
                {heroAuthTab === "demo" && (
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-500 block">Select a verified Ethiopian trader profile:</span>
                    <div className="space-y-2">
                      {PRESET_USERS.slice(0, 3).map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            login(user);
                            showToast(`Logged in as ${user.name} (${user.city})`, "info");
                          }}
                          className="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-300"
                            />
                            <div>
                              <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                {user.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {user.city} &bull; {user.role === "MERCHANT" ? "Verified Shop" : "Individual Trader"}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full border border-slate-200 group-hover:border-blue-400">
                            Login &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 4: BARTER EQUALIZER CALCULATOR */}
                {heroAuthTab === "equalizer" && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">Device You Have:</span>
                      <select
                        value={simMyDevice}
                        onChange={(e) => setSimMyDevice(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="samsung-s21">Samsung Galaxy S21 5G (36,000 ETB)</option>
                        <option value="redmi-note">Redmi Note 12 Pro (24,500 ETB)</option>
                        <option value="iphone-13">iPhone 13 Pro 128GB (55,000 ETB)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-center -my-1">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <ArrowLeftRight className="w-3 h-3" />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">Device You Want:</span>
                      <select
                        value={simTargetDevice}
                        onChange={(e) => setSimTargetDevice(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="iphone-13">iPhone 13 Pro 128GB (55,000 ETB)</option>
                        <option value="dell-xps">Dell XPS 13 Core i7 (68,000 ETB)</option>
                        <option value="sony-camera">Sony Alpha A6400 Camera (62,000 ETB)</option>
                      </select>
                    </div>

                    {/* Difference Card */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wide">
                          Calculated Cash Top-Up
                        </span>
                        <div className="text-sm sm:text-base font-black text-slate-900">
                          {barterDifference > 0 ? (
                            <>
                              You add <span className="text-amber-600 font-mono">+{barterDifference.toLocaleString()} ETB</span>
                            </>
                          ) : (
                            <span className="text-emerald-600">Even Swap (0 ETB Cash)</span>
                          )}
                        </div>
                      </div>
                      <Link
                        href="/swaps"
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors shadow-2xs whitespace-nowrap"
                      >
                        Trade &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE 4 CORE USER INTENT CARDS (Clear, Visual, Direct)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              What would you like to do today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The 4 main ways people across Ethiopia buy, sell, and trade on Sebez
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Directly Buy */}
          <Link
            href="/listings"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    Buy Directly
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Direct Contact
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse phones, laptops, and appliances. Call the seller directly and arrange a safe in-person test at public bank branches in your city.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Browse Classifieds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Sell an Item */}
          <Link
            href="/listings/create"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Sell for Free
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    60 Seconds
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Turn unused electronics into cash. Snap photos, choose your city, set your ETB price, and reach local buyers immediately.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Post a Free Ad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: 1-to-1 Device Swap */}
          <Link
            href="/swaps"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Repeat className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    1-to-1 Swap
                  </h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Fair Top-up
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exchange your current device for an upgrade. Our automatic equalizer calculates the fair cash difference so both parties win.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Swaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: 3-Way Circular Swaps */}
          <Link
            href="/swaps"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                    Circular Loops
                  </h3>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    0 ETB Cash
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-trader closed exchange loops (A &rarr; B &rarr; C &rarr; A) when cash is scarce across the country. Everyone upgrades simultaneously.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Trade Loops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. CATEGORIES BENTO GRID
      ========================================================================= */}
      <section>
        <CategoryBar />
      </section>

      {/* =========================================================================
          4. TRENDING VERIFIED LISTINGS FEED
      ========================================================================= */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verified Marketplace Listings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Available for direct purchase or device barter across Ethiopia:
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFeedTab("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFeedTab === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
              }`}
            >
              All Items ({listings.length})
            </button>
            <button
              onClick={() => setActiveFeedTab("swap")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                activeFeedTab === "swap"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Open for Swap ({listings.filter((l) => l.allowBarter).length})</span>
            </button>
            <button
              onClick={() => setActiveFeedTab("budget")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFeedTab === "budget"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
              }`}
            >
              Under 25,000 ETB
            </button>
          </div>
        </div>

        {/* Listings Grid (4 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredListings.slice(0, 8).map((item) => {
            const hasFavorite = isFavorite(item.id);

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Floating Landmark Tag */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-900 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-200">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>{item.landmark || item.city}</span>
                    </div>

                    {/* Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-xs cursor-pointer"
                      title="Save item"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          hasFavorite ? "fill-rose-600 text-rose-600" : "text-slate-600"
                        }`}
                      />
                    </button>

                    {/* Condition Pill */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[10px] font-black uppercase text-white bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {item.condition}
                      </span>
                    </div>

                    {item.allowBarter && (
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Repeat className="w-3 h-3 text-blue-600" /> Swap
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-black text-lg text-slate-900">
                        {item.price.toLocaleString()}{" "}
                        <span className="text-xs font-extrabold text-blue-600">ETB</span>
                      </div>
                      {item.isNegotiable && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Negotiable
                        </span>
                      )}
                    </div>

                    <Link href={`/listings/${item.id}`} className="block group-hover:text-blue-600 transition-colors">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    {item.allowBarter && item.wishlist && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                        <div className="font-bold flex items-center gap-1 text-[10px]">
                          <Repeat className="w-3 h-3 text-amber-600" />
                          <span>Wants Trade:</span>
                        </div>
                        <p className="text-[10px] text-amber-800 line-clamp-1">
                          {item.wishlist}
                        </p>
                      </div>
                    )}

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
                            {item.kebele ? `${item.kebele}, ` : ""}{item.city}
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

                <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${item.seller.phone}`}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Seller</span>
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

        {/* View All Button */}
        <div className="text-center pt-2">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <span>View All Classifieds in Ethiopia ({listings.length} Available)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. NATIONWIDE SAFE LANDMARK HANDOVER PROTOCOL & INTERACTIVE MAP
      ========================================================================= */}
      <section>
        <AdamaRouteMap />
      </section>

      {/* =========================================================================
          6. HOW IT WORKS (3 SIMPLE STEPS)
      ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Simple &bull; Transparent &bull; Safe
          </span>
          <h2 className="text-2xl font-black text-slate-900">How Trading Works on Sebez</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Designed for convenience, trust, and complete security across Ethiopia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">Browse or Post for Free</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore verified items or post your unused phone or laptop in 60 seconds with photos and ETB pricing. Zero listing fees.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">Direct Contact or Barter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Call the seller directly or propose a swap using our automatic cash difference equalizer. No middlemen or broker commissions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">Meet &amp; Inspect Safely</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Meet at CBE branches, Telebirr centers, or commercial landmarks in your city. Inspect the item, test hardware and battery in person before paying.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. THE ETHIOPIAN SEFED COMMERCE STATEMENT & FINAL CTA
      ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rooted in Ethiopia &bull; ሰበዝ ማርኬት</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Inspired by the Ethiopian ሰፌድ (Sefed)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In Ethiopian culture, individual woven strands (ሰበዝ) intertwine into an unbreakable circle.
            Sebez Market connects neighbors, traders, and students across Addis Ababa, Adama, Hawassa, and all over Ethiopia to exchange value directly without losing money to middlemen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm transition-colors shadow-md"
          >
            Create Free Account
          </Link>
          <Link
            href="/listings/create"
            className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors"
          >
            + Post a Free Ad
          </Link>
        </div>
      </section>
    </div>
  );
}
