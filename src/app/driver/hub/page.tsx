"use client";

import Link from "next/link";
import { ShieldCheck, MapPin, ShoppingBag, ArrowRight } from "lucide-react";

export default function DriverHubPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 py-12 pb-16 text-center">
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-8 shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#dbeafe] text-[#1d4ed8] mx-auto flex items-center justify-center">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-black text-[#2b1c11]">
          Direct Customer-to-Seller Marketplace
        </h1>
        <p className="text-xs text-[#785437] max-w-sm mx-auto leading-relaxed">
          Sebez Market operates on a direct buyer-to-seller model in Adama. 
          Buyers and sellers meet in person at safe public landmarks without courier intermediaries.
        </p>
        <div className="pt-2">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
