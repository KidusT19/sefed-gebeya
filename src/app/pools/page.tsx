"use client";

import Link from "next/link";
import { ShieldCheck, MapPin, ShoppingBag, ArrowRight, CheckCircle, Plus } from "lucide-react";

export default function PooledRunsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 pb-16 text-center">
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-8 sm:p-12 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#dbeafe] text-[#1d4ed8] mx-auto flex items-center justify-center shadow-xs">
          <MapPin className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-[#dbeafe] px-3 py-1 rounded-full border border-[#bfdbfe]">
            Direct Handover Model
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2b1c11] tracking-tight mt-2">
            Direct Buyer-to-Seller Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[#785437] max-w-md mx-auto mt-2 leading-relaxed">
            In Sebez Market, transactions happen directly between buyer and seller. 
            Meet in person at safe public Adama landmarks (Posta Bet, Arada Market, Bole Gate) 
            to physically test items before paying. Zero middleman fees!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto pt-2">
          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be]">
            <div className="font-bold text-xs text-[#2b1c11] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Direct Buyer Contact
            </div>
            <p className="text-[11px] text-[#785437] mt-1">
              Call or message the seller directly via phone or WhatsApp.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be]">
            <div className="font-bold text-xs text-[#2b1c11] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              100% Escrow Protection
            </div>
            <p className="text-[11px] text-[#785437] mt-1">
              Release Telebirr funds only after holding and inspecting the product.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/listings"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Classifieds</span>
          </Link>

          <Link
            href="/listings/create"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Free Ad</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
