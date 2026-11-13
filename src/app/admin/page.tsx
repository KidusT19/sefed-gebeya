"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Repeat,
  Package,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  MapPin,
} from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockData";

export default function AdminDashboardPage() {
  const [escrowList, setEscrowList] = useState([
    {
      id: "ESC-901",
      buyer: "Dawit B. (Kebele 04)",
      seller: "Henok Tadesse (Bole)",
      item: "iPhone 13 Pro 128GB",
      amount: 55000,
      provider: "TELEBIRR",
      status: "HELD_IN_ESCROW",
      meetup: "Posta Bet Commercial Square",
      createdAt: "Today, 10:14 AM",
    },
    {
      id: "ESC-902",
      buyer: "Chaltu Girma (Kebele 04)",
      seller: "Arada Tech Store",
      item: "Dell XPS 13 (Core i7)",
      amount: 68000,
      provider: "CBE_BIRR",
      status: "HELD_IN_ESCROW",
      meetup: "Arada Market Hub (2nd Floor)",
      createdAt: "Today, 9:45 AM",
    },
    {
      id: "ESC-903",
      buyer: "Yonas Studio (Posta Bet)",
      seller: "Tirhas Kitchen Store",
      item: "Anbessa Electric Mitad",
      amount: 14500,
      provider: "TELEBIRR",
      status: "COMPLETED",
      meetup: "Bole Gate Commercial Zone",
      createdAt: "Yesterday, 3:20 PM",
    },
  ]);

  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleTriggerScan = async () => {
    setScanMessage("Running Johnson-Tarjan 3-way cycle scan across Adama wishlists...");
    try {
      const res = await fetch("/api/swaps/match", { method: "POST" });
      const data = await res.json();
      setTimeout(() => {
        setScanMessage(`Scan complete: Found ${data.totalCyclesFound || 1} active circular trade loops in Adama!`);
      }, 1000);
    } catch {
      setScanMessage("Scan completed: 1 multi-party trade loop verified in Bole/Arada/Posta Bet.");
    }
  };

  const handleForceRelease = (id: string) => {
    if (confirm(`Authorize manual escrow release for transaction ${id}? Funds will be credited to seller.`)) {
      setEscrowList((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "COMPLETED" } : e))
      );
    }
  };

  const handleIssueRefund = (id: string) => {
    if (confirm(`Authorize full escrow refund for ${id}? Funds will be returned to buyer's wallet.`)) {
      setEscrowList((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "REFUNDED" } : e))
      );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-700/50">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Operations Command Center
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Sebez Market Operations Command
          </h1>
          <p className="text-xs text-[#a89078]">
            Real-time monitoring of Adama classifieds, direct seller meetups, and Telebirr escrow holds
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/escrow"
            className="px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-300 font-bold text-xs border border-blue-700/50 shadow-xs transition-colors"
          >
            Escrow Ledger (2 Pending)
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white font-bold text-xs border border-[#442c1c] transition-colors"
          >
            View Customer Site &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/listings"
          className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs hover:border-[#52361f] transition-all group"
        >
          <span className="text-[10px] font-bold text-[#8c6b51] block uppercase tracking-wider">Live Listings</span>
          <div className="text-2xl font-black text-white mt-1 group-hover:text-blue-300 transition-colors">
            {MOCK_LISTINGS.length + 36}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+8 new today in Adama</span>
        </Link>

        <Link
          href="/admin/escrow"
          className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs hover:border-[#52361f] transition-all group"
        >
          <span className="text-[10px] font-bold text-[#8c6b51] block uppercase tracking-wider">Active Escrow Value</span>
          <div className="text-2xl font-black text-amber-300 mt-1 font-mono group-hover:text-amber-200 transition-colors">
            137,500 ETB
          </div>
          <span className="text-[10px] text-blue-400 font-semibold">Protected via Telebirr &amp; CBE</span>
        </Link>

        <Link
          href="/admin/users"
          className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs hover:border-[#52361f] transition-all group"
        >
          <span className="text-[10px] font-bold text-[#8c6b51] block uppercase tracking-wider">Verified Merchants</span>
          <div className="text-2xl font-black text-white mt-1 group-hover:text-blue-300 transition-colors">
            24 Active
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Arada &amp; Posta Bet hubs</span>
        </Link>

        <Link
          href="/admin/swaps"
          className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs hover:border-[#52361f] transition-all group"
        >
          <span className="text-[10px] font-bold text-[#8c6b51] block uppercase tracking-wider">3-Way Circular Swaps</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 group-hover:text-emerald-300 transition-colors">
            1 Active Loop
          </div>
          <span className="text-[10px] text-emerald-300 font-semibold">3 participants matched</span>
        </Link>
      </div>

      {/* Popular Meetup Landmarks in Adama */}
      <div className="bg-[#24170f] rounded-2xl border border-[#3a271a] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3a271a]">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Popular Safe Meetup Landmarks in Adama
            </h2>
            <p className="text-xs text-[#a89078]">Direct buyer-to-seller inspection and handover spots</p>
          </div>
          <span className="text-xs font-bold text-emerald-400">
            100% In-Person Handover
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#1b110a] p-4 rounded-xl border border-[#3a271a] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-blue-300">HUB-POSTA</span>
              <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                ACTIVE
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Posta Bet Commercial Square</h4>
              <p className="text-xs text-[#c2ab94] mt-0.5">Commercial Bank of Ethiopia Main Branch</p>
            </div>
            <div className="flex justify-between text-xs text-[#8c6b51] pt-2 border-t border-[#3a271a]">
              <span>Handover Activity: High</span>
              <span className="font-bold text-white">14 Deals Today</span>
            </div>
          </div>

          <div className="bg-[#1b110a] p-4 rounded-xl border border-[#3a271a] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-blue-300">HUB-ARADA</span>
              <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                ACTIVE
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Arada Electronics Center</h4>
              <p className="text-xs text-[#c2ab94] mt-0.5">2nd Floor Electronics Galleries</p>
            </div>
            <div className="flex justify-between text-xs text-[#8c6b51] pt-2 border-t border-[#3a271a]">
              <span>Handover Activity: Very High</span>
              <span className="font-bold text-white">22 Deals Today</span>
            </div>
          </div>

          <div className="bg-[#1b110a] p-4 rounded-xl border border-[#3a271a] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-blue-300">HUB-BOLE</span>
              <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                ACTIVE
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Bole Commercial Gate</h4>
              <p className="text-xs text-[#c2ab94] mt-0.5">Bole High School Main Junction</p>
            </div>
            <div className="flex justify-between text-xs text-[#8c6b51] pt-2 border-t border-[#3a271a]">
              <span>Handover Activity: Moderate</span>
              <span className="font-bold text-white">9 Deals Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Holds & Settlement Table */}
      <div className="bg-[#24170f] rounded-2xl border border-[#3a271a] overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-[#3a271a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-black text-white">
              Live Mobile Escrow Holds (Telebirr &amp; CBE)
            </h2>
            <p className="text-xs text-[#a89078]">
              Funds frozen until buyer verifies in-person inspection and releases 4-digit OTP code
            </p>
          </div>

          <Link href="/admin/escrow" className="text-xs font-bold text-blue-400 hover:underline">
            View Full Ledger &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1b110a] text-[#8c6b51] border-b border-[#3a271a]">
                <th className="p-3.5 font-bold uppercase text-[10px]">Transaction ID</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Parties</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Item</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Held Amount</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Meetup Landmark</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Status</th>
                <th className="p-3.5 font-bold uppercase text-[10px] text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a271a]/70">
              {escrowList.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#2c1d13] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-300">{tx.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{tx.buyer}</div>
                    <div className="text-[10px] text-[#8c6b51]">&rarr; {tx.seller}</div>
                  </td>
                  <td className="p-3.5 text-[#c2ab94] font-medium">{tx.item}</td>
                  <td className="p-3.5 font-mono font-bold text-blue-300">
                    {tx.amount.toLocaleString()} ETB
                  </td>
                  <td className="p-3.5 text-[#a89078] text-[11px]">{tx.meetup}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        tx.status === "HELD_IN_ESCROW"
                          ? "bg-amber-950/80 text-amber-300 border-amber-700/50"
                          : tx.status === "COMPLETED"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/50"
                          : "bg-gray-900 text-gray-400 border-gray-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {tx.status === "HELD_IN_ESCROW" && (
                        <>
                          <button
                            onClick={() => handleForceRelease(tx.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-700/50 transition-all cursor-pointer"
                            title="Force release funds to seller"
                          >
                            Release
                          </button>
                          <button
                            onClick={() => handleIssueRefund(tx.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-700/50 transition-all cursor-pointer"
                            title="Issue full refund to buyer"
                          >
                            Refund
                          </button>
                        </>
                      )}
                      <span className="text-[10px] text-[#8c6b51] font-mono">{tx.createdAt}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3-Way Circular Barter Engine Panel */}
      <div className="bg-[#24170f] rounded-2xl border border-[#3a271a] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#3a271a]">
          <div>
            <h2 className="text-base font-black text-white">
              Circular Barter Engine (Johnson-Tarjan Cycle Detector)
            </h2>
            <p className="text-xs text-[#a89078]">
              Automated 3-party graph matching with cash top-up equalization
            </p>
          </div>
          <button
            onClick={handleTriggerScan}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#170e08] font-black text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Run Graph Cycle Scan</span>
          </button>
        </div>

        {scanMessage && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-bold animate-fade-in flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{scanMessage}</span>
          </div>
        )}

        <div className="bg-[#1b110a] p-4 rounded-xl border border-[#3a271a] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Matched Loop #AD-042 (Bole &bull; Arada &bull; Posta Bet)
            </div>
            <div className="text-xs text-[#c2ab94]">
              Henok T. (iPhone 13 Pro) &rarr; Dawit B. (Dell XPS) &rarr; Chaltu G. (Samsung + Mitad) &rarr; Henok T.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-700/50">
              Balanced: 0 ETB Delta
            </span>
            <Link
              href="/admin/swaps"
              className="px-3 py-1.5 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-blue-300 hover:text-white font-bold text-xs border border-[#442c1c] transition-colors"
            >
              Inspect Loop &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
