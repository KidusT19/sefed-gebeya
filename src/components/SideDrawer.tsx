"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
import SefedLogo from "@/components/SefedLogo";
import {
  X,
  ShoppingBag,
  Plus,
  Repeat,
  RefreshCw,
  Heart,
  MessageSquare,
  User,
  ShieldCheck,
  HelpCircle,
  Smartphone,
  Laptop,
  Car,
  Home,
  ChevronRight,
  Wallet,
  Info,
  LogOut,
  LogIn,
} from "lucide-react";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const pathname = usePathname();
  const { currentUser, language, setLanguage, favorites, isLoggedIn, logout } = useMarketplace();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl h-full flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <SefedLogo size="sm" showTagline={true} />
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card or Login / Register Switcher */}
        {isLoggedIn ? (
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition-all shadow-2xs"
            >
              <img
                src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt={currentUser.name}
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                className="w-10 h-10 rounded-full object-cover border border-slate-300"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  <span>{currentUser.walletBalance?.toLocaleString()} ETB</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <div className="flex items-center justify-between text-xs px-1 pt-1">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700"
              >
                Switch Account
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-center font-bold text-xs text-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/auth/signup"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-center font-bold text-xs text-white transition-colors shadow-xs"
            >
              Register Free
            </Link>
          </div>
        )}

        {/* THE 4 DIRECT CUSTOMER PILLARS */}
        <div className="p-3.5 space-y-2 border-b border-slate-200">
          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider px-1 block">
            What would you like to do?
          </span>

          {/* 1. Directly Buy from Seller */}
          <Link
            href="/listings"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                Buy Directly from Seller
              </div>
              <div className="text-[10px] text-slate-500">
                Browse phones, laptops & meet sellers nationwide
              </div>
            </div>
          </Link>

          {/* 2. Sell Product */}
          <Link
            href={isLoggedIn ? "/listings/create" : "/auth/login?redirect=/listings/create"}
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0e623a] text-white flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                Sell an Item
              </div>
              <div className="text-[10px] text-slate-500">
                Post free ad with photos in 1 minute
              </div>
            </div>
          </Link>

          {/* 3. Direct Barter Swap */}
          <Link
            href="/swaps"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Repeat className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-amber-600">
                Direct Swap (1-to-1)
              </div>
              <div className="text-[10px] text-slate-500">
                Exchange items + optional cash top-up
              </div>
            </div>
          </Link>

          {/* 4. Circular 3-Way Swaps */}
          <Link
            href="/swaps"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-600">
                Circular Swaps (3-Way)
              </div>
              <div className="text-[10px] text-slate-500">
                Multi-trader loops when cash is tight
              </div>
            </div>
          </Link>
        </div>

        {/* BROWSE CATEGORIES */}
        <div className="p-3.5 space-y-1.5 border-b border-slate-200">
          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider px-1 block">
            Popular Categories
          </span>
          <Link
            href="/listings?category=smartphones"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" /> Mobile Phones & Tablets
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/listings?category=laptops"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-700" /> Laptops & Computers
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/listings?category=vehicles"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-700" /> Cars, Motorcycles & Parts
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/listings?category=furniture"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-600" /> Home & Furniture
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* PERSONAL LINKS */}
        <div className="p-3.5 space-y-1.5 border-b border-slate-200">
          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider px-1 block">
            My Account
          </span>
          <Link
            href="/dashboard?tab=ads"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" /> My Listings
            </span>
          </Link>
          <Link
            href="/dashboard?tab=kyc"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Seller Verification (KYC)
            </span>
          </Link>
          <Link
            href="/dashboard?tab=wallet"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-700" /> Telebirr Wallet
            </span>
          </Link>
          <Link
            href="/messages"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" /> Direct Messages
            </span>
          </Link>
          <Link
            href="/dashboard?tab=saved"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" /> Saved Ads ({favorites.length})
            </span>
          </Link>
        </div>

        {/* CUSTOMER SAFETY & HELP */}
        <div className="p-3.5 mt-auto bg-slate-50 space-y-2">
          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider px-1 block">
            Customer Help & Safety
          </span>

          <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-600">
            <Link href="/safety" onClick={onClose} className="hover:underline flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Safe Meetups
            </Link>
            <Link href="/faq" onClick={onClose} className="hover:underline flex items-center gap-1 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" /> FAQs
            </Link>
            <Link href="/about" onClick={onClose} className="hover:underline flex items-center gap-1 font-semibold">
              <Info className="w-3.5 h-3.5 text-emerald-700" /> About
            </Link>
          </div>

          {/* Language Switcher in Drawer */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-200 text-xs">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 rounded ${language === "en" ? "bg-slate-900 text-white font-bold" : "text-slate-600"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("am")}
              className={`px-2 py-0.5 rounded ${language === "am" ? "bg-slate-900 text-white font-bold" : "text-slate-600"}`}
            >
              አማ
            </button>
            <button
              onClick={() => setLanguage("om")}
              className={`px-2 py-0.5 rounded ${language === "om" ? "bg-slate-900 text-white font-bold" : "text-slate-600"}`}
            >
              Oromoo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
