"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Search,
  Filter,
  DollarSign,
  Lock,
  KeyRound,
  Download,
} from "lucide-react";

export default function AdminEscrowPage() {
  const [escrows, setEscrows] = useState<
    {
      id: string;
      buyer: string;
      buyerPhone: string;
      buyerKebele: string;
      seller: string;
      sellerPhone: string;
      sellerKebele: string;
      item: string;
      amount: number;
      platformFee: number;
      deliveryFee: number;
      provider: string;
      landmark: string;
      status: string;
      merchantOtp: string;
      deliveryOtp: string;
      createdAt: string;
    }[]
  >([]);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleForceRelease = (id: string, seller: string, amount: number) => {
    if (confirm(`Authorize manual escrow release of ${amount.toLocaleString()} ETB to ${seller}?`)) {
      setEscrows((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "COMPLETED" } : e))
      );
      setActionNotice(`Escrow ${id} successfully released to ${seller}.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleForceRefund = (id: string, buyer: string, amount: number) => {
    if (confirm(`Authorize full escrow refund of ${amount.toLocaleString()} ETB back to ${buyer}'s wallet?`)) {
      setEscrows((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "REFUNDED" } : e))
      );
      setActionNotice(`Escrow ${id} refunded to buyer ${buyer}.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const filtered = escrows.filter((e) => {
    if (filterStatus === "ALL") return true;
    return e.status === filterStatus;
  });

  const totalHeld = escrows
    .filter((e) => e.status === "HELD_IN_ESCROW")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalFees = escrows.reduce((sum, e) => sum + e.platformFee, 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Escrow &amp; Telebirr Settlements</h1>
            <span className="text-xs bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-600/50 font-mono">
              Dual-OTP Security
            </span>
          </div>
          <p className="text-xs text-[#a89078] mt-1">
            Real-time audit log of funds locked, released, or disputed across Adama deals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#24170f] px-3.5 py-2 rounded-xl border border-[#3a271a] text-right">
            <div className="text-[10px] text-[#8c6b51] uppercase font-bold">Total Platform Cuts</div>
            <div className="text-base font-black text-emerald-400 font-mono">+{totalFees.toLocaleString()} ETB</div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#8c6b51] uppercase">Locked in Escrow</span>
          <div className="text-2xl font-black text-amber-300 font-mono">{totalHeld.toLocaleString()} ETB</div>
          <span className="text-[10px] text-amber-400 font-semibold">2 pending delivery verification</span>
        </div>

        <div className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#8c6b51] uppercase">Active Payment Rails</span>
          <div className="text-2xl font-black text-blue-300 font-mono">Telebirr &amp; CBE</div>
          <span className="text-[10px] text-blue-400 font-semibold">100% Mobile Money Handoff</span>
        </div>

        <div className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#8c6b51] uppercase">Dispute Rate</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">0.4%</div>
          <span className="text-[10px] text-emerald-300 font-semibold">Resolved under 2 hours</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#3a271a] pb-2 text-xs">
        {["ALL", "HELD_IN_ESCROW", "COMPLETED", "DISPUTED", "REFUNDED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === st
                ? "bg-[#332014] text-white border border-[#52361f]"
                : "text-[#8c6b51] hover:text-white"
            }`}
          >
            {st.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Escrow Table */}
      <div className="bg-[#24170f] rounded-2xl border border-[#3a271a] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1b110a] text-[#a89078] border-b border-[#3a271a]">
                <th className="p-3.5 font-bold uppercase text-[10px]">Escrow ID</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Item / Deal</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Amount / Cut</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Buyer &rarr; Seller</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Meetup Landmark</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Dual-OTP Codes</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Status</th>
                <th className="p-3.5 font-bold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a271a]/70">
              {filtered.map((escrow) => (
                <tr key={escrow.id} className="hover:bg-[#2c1d13] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-300">{escrow.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-white max-w-xs truncate">{escrow.item}</div>
                    <div className="text-[10px] text-[#8c6b51] font-mono">{escrow.createdAt}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-blue-300">{escrow.amount.toLocaleString()} ETB</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Cut: +{escrow.platformFee} ETB</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-white font-medium">
                      {escrow.buyer} <span className="text-[#8c6b51]">({escrow.buyerKebele})</span>
                    </div>
                    <div className="text-amber-300 font-medium">
                      &rarr; {escrow.seller} <span className="text-[#8c6b51]">({escrow.sellerKebele})</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#c2ab94] font-medium">{escrow.landmark}</td>
                  <td className="p-3.5">
                    <div className="font-mono text-[10px] space-y-0.5">
                      <div className="text-amber-300">M-OTP: {escrow.merchantOtp}</div>
                      <div className="text-blue-300">C-OTP: {escrow.deliveryOtp}</div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    {escrow.status === "HELD_IN_ESCROW" && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                        Held in Escrow
                      </span>
                    )}
                    {escrow.status === "COMPLETED" && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                        ✓ Released
                      </span>
                    )}
                    {escrow.status === "DISPUTED" && (
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/50">
                        ⚠ Disputed
                      </span>
                    )}
                    {escrow.status === "REFUNDED" && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                        Refunded
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {escrow.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleForceRelease(escrow.id, escrow.seller, escrow.amount)}
                          className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-700/50 transition-all"
                          title="Authorize manual payout release"
                        >
                          Release
                        </button>
                      )}
                      {escrow.status !== "REFUNDED" && (
                        <button
                          onClick={() => handleForceRefund(escrow.id, escrow.buyer, escrow.amount)}
                          className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-700/50 transition-all"
                          title="Authorize full refund back to buyer"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
