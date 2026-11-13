"use client";

import Link from "next/link";
import { ShieldCheck, ShoppingBag, Plus } from "lucide-react";

export default function DriverRegisterPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 py-12 pb-16 text-center">
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-8 shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#dbeafe] text-[#1d4ed8] mx-auto flex items-center justify-center">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-black text-[#2b1c11]">
          Direct Commerce Platform
        </h1>
        <p className="text-xs text-[#785437] max-w-sm mx-auto leading-relaxed">
          Sebez Market connects buyers directly with sellers for local Adama classifieds and device swaps.
          Driver registrations are not required.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Ads</span>
          </Link>
          <Link
            href="/listings/create"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post Free Ad</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
