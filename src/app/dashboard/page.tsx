"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
import { MOCK_LISTINGS } from "@/data/mockData";
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
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ads";

  const { favorites, toggleFavorite, offers, deliveries, currentUser } = useMarketplace();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(currentUser?.walletBalance || 14250);
  const [depositAmount, setDepositAmount] = useState<string>("500");
  const [walletSuccessMsg, setWalletSuccessMsg] = useState<string | null>(null);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(depositAmount);
    if (amt > 0) {
      setWalletBalance((prev) => prev + amt);
      setWalletSuccessMsg(`Successfully credited ${amt.toLocaleString()} ETB from Telebirr (+2519...)!`);
      setTimeout(() => setWalletSuccessMsg(null), 4000);
    }
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
      kebele: "Bole",
      allowBarter: true,
    },
  ]);

  // Saved listings from favorites
  const savedListings = MOCK_LISTINGS.filter((l) => favorites.includes(l.id));

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOtp(type);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

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
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Header Box (Coffee Brown & Trusted Blue) */}
      <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                width={64}
                height={64}
                style={{ width: "64px", height: "64px", objectFit: "cover" }}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#52361f] shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#52361f] text-white flex items-center justify-center font-black text-2xl shadow-xs border border-[#3d2717] flex-shrink-0">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "HT"}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#2b1c11]">{currentUser?.name || "Henok Tadesse"}</h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1e40af] bg-[#dbeafe] px-2 py-0.5 rounded-full border border-[#bfdbfe]">
                  <ShieldCheck className="w-3 h-3 text-[#1d4ed8]" />
                  {currentUser?.role === "MERCHANT" ? "Verified Merchant" : "Verified Trader"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#785437]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1d4ed8]" /> {currentUser?.kebele || "Bole"} Kebele, Adama
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#1d4ed8]" /> {currentUser?.phone || "+251 91 144 8822"}
                </span>
                <span>&bull;</span>
                <span className="font-semibold text-emerald-700">★ {currentUser?.rating || 4.9} Rating</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick Telebirr Wallet Badge */}
            <div className="bg-[#ede4d6] px-3.5 py-2 rounded-xl border border-[#dfd2be] text-right flex-1 sm:flex-none">
              <div className="text-[10px] text-[#785437] font-bold uppercase">Telebirr Wallet</div>
              <div className="text-base font-black text-[#1d4ed8] font-mono">
                {walletBalance.toLocaleString()} ETB
              </div>
            </div>

            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-1 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Ad</span>
            </Link>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#dfd2be]">
          <div className="bg-[#ede4d6] p-3 rounded-xl">
            <span className="text-[11px] font-bold text-[#785437] block">Active Listings</span>
            <span className="text-lg font-black text-[#2b1c11]">
              {myAds.filter((a) => a.status === "ACTIVE").length}
            </span>
          </div>
          <div className="bg-[#ede4d6] p-3 rounded-xl">
            <span className="text-[11px] font-bold text-[#785437] block">Saved Ads</span>
            <span className="text-lg font-black text-[#2b1c11]">{favorites.length}</span>
          </div>
          <div className="bg-[#ede4d6] p-3 rounded-xl">
            <span className="text-[11px] font-bold text-[#785437] block">Barter Offers</span>
            <span className="text-lg font-black text-[#6a4727]">{offers.length + 1}</span>
          </div>
          <div className="bg-[#ede4d6] p-3 rounded-xl">
            <span className="text-[11px] font-bold text-[#785437] block">Telebirr Balance</span>
            <span className="text-lg font-black text-[#1d4ed8]">{walletBalance.toLocaleString()} ETB</span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2 border-b border-[#dfd2be] overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab("ads")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "ads"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#faf5ed] text-[#52361f] hover:bg-[#eee4d5] border border-[#dfd2be]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Ads ({myAds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "saved"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#faf5ed] text-[#52361f] hover:bg-[#eee4d5] border border-[#dfd2be]"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Ads ({savedListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trades")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "trades"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#faf5ed] text-[#52361f] hover:bg-[#eee4d5] border border-[#dfd2be]"
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Trade & Offers ({offers.length + 1})</span>
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === "wallet"
              ? "bg-[#1d4ed8] text-white shadow-xs"
              : "bg-[#faf5ed] text-[#1d4ed8] hover:bg-[#dbeafe] border border-[#bfdbfe]"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Telebirr Wallet ({walletBalance.toLocaleString()} ETB)</span>
        </button>
      </div>

      {/* TAB 1: MY ADS */}
      {activeTab === "ads" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-black text-[#2b1c11]">Manage Your Listings</h2>
            <span className="text-xs text-[#785437]">Click to mark as sold or delete</span>
          </div>

          <div className="space-y-3">
            {myAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-[#ba9663] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-20 h-16 rounded-xl object-cover bg-[#ede4d6] flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          ad.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {ad.status === "ACTIVE" ? "Active on Market" : "Sold / Swapped"}
                      </span>
                      {ad.allowBarter && (
                        <span className="text-[10px] font-bold text-[#1e40af] bg-[#dbeafe] px-1.5 py-0.5 rounded">
                          Swap Enabled
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#2b1c11] line-clamp-1">{ad.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#785437] mt-0.5">
                      <span className="font-black text-[#1d4ed8]">{ad.price.toLocaleString()} ETB</span>
                      <span>&bull;</span>
                      <span>{ad.views} Views</span>
                      <span>&bull;</span>
                      <span>{ad.postedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={() => toggleAdStatus(ad.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#dfd2be] bg-[#ede4d6] hover:bg-[#e4d6c2] text-[#3d2717] transition-colors"
                  >
                    {ad.status === "ACTIVE" ? "Mark as Sold" : "Re-activate"}
                  </button>
                  <Link
                    href={`/listings/${ad.id}`}
                    className="p-2 rounded-lg border border-[#dfd2be] hover:bg-[#ede4d6] text-[#52361f]"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Delete ad"
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-black text-[#2b1c11]">Your Bookmarked Ads ({savedListings.length})</h2>
            <Link href="/listings" className="text-xs font-bold text-[#1d4ed8] hover:underline">
              Find more ads &rarr;
            </Link>
          </div>

          {savedListings.length === 0 ? (
            <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-8 text-center space-y-3">
              <Heart className="w-10 h-10 text-[#ba9663] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#2b1c11]">No saved ads yet</p>
              <p className="text-xs text-[#785437]">
                Click the heart icon on any product in Adama to keep track of it here.
              </p>
              <Link
                href="/listings"
                className="inline-block bg-[#1d4ed8] text-white font-bold text-xs px-4 py-2 rounded-xl mt-2"
              >
                Browse Listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] overflow-hidden p-3.5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#eee4d5]">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200"
                        title="Remove from saved"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#1d4ed8] uppercase">{item.subcategory}</span>
                      <h4 className="font-bold text-sm text-[#2b1c11] line-clamp-1">{item.title}</h4>
                      <div className="text-base font-black text-[#2b1c11] mt-0.5">
                        {item.price.toLocaleString()} ETB
                      </div>
                      <span className="text-[11px] text-[#785437] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#1d4ed8]" /> {item.kebele}, Adama
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#dfd2be]">
                    <Link
                      href={`/listings/${item.id}`}
                      className="w-full text-center py-2 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-xs transition-colors"
                    >
                      View Details
                    </Link>
                    {item.allowBarter ? (
                      <Link
                        href={`/trades/new?target=${item.id}`}
                        className="w-full text-center py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Repeat className="w-3.5 h-3.5" /> Swap Deal
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout/escrow?listing=${item.id}`}
                        className="w-full text-center py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors"
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



      {/* TAB 4: TRADE OFFERS */}
      {activeTab === "trades" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-[#2b1c11]">Barter Proposals & Cash Offers</h2>
              <p className="text-xs text-[#785437]">Track incoming device trade offers and cash price bargaining</p>
            </div>
            <Link href="/swaps" className="text-xs font-bold text-[#1d4ed8] hover:underline">
              Circular 3-Way Loops &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {/* Mock Incoming Offer */}
            <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-4.5 space-y-3 shadow-2xs">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Incoming Barter Proposal
                  </span>
                  <h3 className="font-bold text-sm text-[#2b1c11] mt-1">
                    Trade Proposal for: <strong>iPhone 13 Pro 128GB</strong>
                  </h3>
                </div>
                <span className="text-xs text-[#785437]">1 hour ago</span>
              </div>

              <div className="bg-[#ede4d6] p-3 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#785437]">Offered Item:</span>
                  <span className="font-bold text-[#2b1c11]">Samsung Galaxy S21 5G (Good Condition)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#785437]">Cash Top-Up Offered to You:</span>
                  <span className="font-black text-emerald-700 text-sm">+ 18,000 ETB (Telebirr)</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#dfd2be]">
                  <span className="text-[#785437]">Proposed by:</span>
                  <span className="font-semibold text-[#2b1c11]">Chaltu Girma (Kebele 04, Adama)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-1">
                <Link
                  href="/trades/tr-801"
                  className="px-4 py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors"
                >
                  Open Deal Room & Negotiate
                </Link>
              </div>
            </div>

            {/* Custom Sent Offers */}
            {offers.map((off) => (
              <div
                key={off.id}
                className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-4.5 space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Sent Cash Offer
                    </span>
                    <h3 className="font-bold text-sm text-[#2b1c11] mt-1">{off.listingTitle}</h3>
                  </div>
                  <span className="text-xs text-[#785437]">{off.date}</span>
                </div>

                <div className="bg-[#ede4d6] p-3 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#785437]">List Price:</span>
                    <span className="text-[#2b1c11]">{off.listingPrice.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#785437]">Your Cash Offer:</span>
                    <span className="font-black text-[#1d4ed8] text-sm">{off.offeredPrice.toLocaleString()} ETB</span>
                  </div>
                  <div className="text-[11px] text-[#52361f] pt-1 border-t border-[#dfd2be] italic">
                    &ldquo;{off.message}&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#785437] pt-1">
                  <span>Seller: {off.sellerName}</span>
                  <a
                    href={`tel:${off.sellerPhone}`}
                    className="font-bold text-[#1d4ed8] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {off.sellerPhone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TELEBIRR WALLET */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          <div className="bg-[#ede4d6] rounded-2xl border border-[#dfd2be] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-[#785437] uppercase tracking-wider block">
                  Telebirr Digital Wallet
                </span>
                <div className="text-3xl font-black text-[#1d4ed8] font-mono mt-1">
                  {walletBalance.toLocaleString()} ETB
                </div>
                <p className="text-xs text-[#6a4727] mt-0.5">
                  Connected to registered phone: <strong>{currentUser?.phone || "+251 91 144 8822"}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-Escrow Settlement Active
                </span>
              </div>
            </div>

            {walletSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{walletSuccessMsg}</span>
              </div>
            )}

            {/* Quick Deposit Form */}
            <form onSubmit={handleDeposit} className="pt-3 border-t border-[#dfd2be] space-y-3">
              <label className="text-xs font-bold text-[#2b1c11] block">
                Top Up Wallet via Telebirr (Simulated Test)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {["500", "1000", "2500", "5000"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      depositAmount === preset
                        ? "bg-[#1d4ed8] text-white shadow-xs"
                        : "bg-[#faf5ed] text-[#52361f] border border-[#dfd2be] hover:bg-[#e6d7bc]"
                    }`}
                  >
                    +{preset} ETB
                  </button>
                ))}

                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-xl bg-[#faf5ed] border border-[#d2ba92] text-xs font-bold text-[#2b1c11] text-right"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Escrow Protections Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#faf5ed] p-4.5 rounded-2xl border border-[#dfd2be] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1d4ed8]">
                <ShieldCheck className="w-4 h-4" />
                <span>Dual-OTP Protected Transactions</span>
              </div>
              <p className="text-xs text-[#785437] leading-relaxed">
                When you buy an item, funds are deducted from this wallet and frozen in platform escrow. 
                They are released to the seller only when you inspect the item in person and authorize the release.
              </p>
            </div>

            <div className="bg-[#faf5ed] p-4.5 rounded-2xl border border-[#dfd2be] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1d4ed8]">
                <ShieldCheck className="w-4 h-4" />
                <span>Direct In-Person Handover</span>
              </div>
              <p className="text-xs text-[#785437] leading-relaxed">
                Meet the seller in person at a verified public landmark in Adama (Posta Bet, Arada, Bole). 
                Inspect and test the device thoroughly before confirming your purchase.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-[#785437]">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
