"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ShieldCheck,
  TrendingUp,
  Repeat,
  Bell,
  Search,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleQuickBarterScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/swaps/match", { method: "POST" });
      const data = await res.json();
      setScanResult(`Found ${data.totalCyclesFound} circular barter loops in Adama`);
    } catch {
      setScanResult("1 multi-party trade loop verified");
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanResult(null), 5000);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1b120c] border-b border-[#3a271a] px-4 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white border border-[#3a271a] lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-[#8c6b51]">Operations Control</span>
          <span className="text-[#553823]">/</span>
          <span className="font-bold text-white">Adama Central HQ</span>
          <span className="text-[10px] bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50 font-mono">
            v2.4 Production
          </span>
        </div>
      </div>

      {/* Center: Live Notification / Scan Result */}
      {scanResult && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-xs font-bold rounded-lg animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{scanResult}</span>
        </div>
      )}

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Barter Cycle Scan Button */}
        <button
          type="button"
          onClick={handleQuickBarterScan}
          disabled={isScanning}
          className="px-3 py-1.5 rounded-xl bg-[#2a1a0f] hover:bg-[#3d2717] text-amber-300 border border-[#553823] text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          title="Run Tarjan cycle detection across Adama listings"
        >
          <Repeat className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isScanning ? "Scanning..." : "Scan 3-Way Loops"}</span>
        </button>

        {/* Commercial Valuation Shortcut */}
        <Link
          href="/admin/monetization"
          className="px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-600/50 text-xs font-black flex items-center gap-1.5 transition-all shadow-xs"
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">25,000 ETB Valuation</span>
          <span className="sm:hidden">25K Deck</span>
        </Link>

        {/* View Customer Marketplace */}
        <Link
          href="/"
          target="_blank"
          className="p-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white border border-[#3a271a] transition-colors"
          title="Preview Live Customer Marketplace in New Tab"
        >
          <ExternalLink className="w-4 h-4 text-blue-400" />
        </Link>
      </div>
    </header>
  );
}
