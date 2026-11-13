"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  Store,
  MapPin,
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function AdminMerchantKYCPage() {
  const [merchants, setMerchants] = useState([
    {
      id: "KYC-M801",
      name: "Dawit Bekele",
      shopName: "Arada Tech Store",
      phone: "+251 92 277 1133",
      kebele: "Arada Market",
      idType: "Kebele ID (Adama City Administration)",
      submittedDate: "Today, 08:30 AM",
      status: "PENDING",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "KYC-M802",
      name: "Tirhas Gebre",
      shopName: "Tirhas Kitchenwares",
      phone: "+251 95 566 7788",
      kebele: "Amede Market",
      idType: "National ID (Fayda Digital)",
      submittedDate: "Yesterday",
      status: "APPROVED",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    },
  ]);

  const handleApprove = (id: string) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "APPROVED" } : m))
    );
  };

  const handleReject = (id: string) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "REJECTED" } : m))
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            Merchant Trust Verification
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Merchant &amp; Seller KYC Approvals
          </h1>
          <p className="text-xs text-[#a89078]">
            Verify identity documents of local shops in Adama for official verified badges
          </p>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white font-bold text-xs border border-[#442c1c] transition-colors"
        >
          &larr; Back to Command Center
        </Link>
      </div>

      {/* Verification Cards */}
      <div className="space-y-3">
        {merchants.map((m) => (
          <div
            key={m.id}
            className="bg-[#24170f] p-5 rounded-2xl border border-[#3a271a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={m.avatarUrl}
                alt={m.name}
                width={48}
                height={48}
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
                className="w-12 h-12 rounded-full object-cover border border-[#52361f]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white">{m.name}</h3>
                  <span className="text-[10px] text-amber-300 font-bold bg-[#332014] px-2 py-0.5 rounded">
                    {m.shopName}
                  </span>
                </div>
                <div className="text-xs text-[#c2ab94] mt-0.5">
                  {m.phone} &bull; {m.kebele}
                </div>
                <div className="text-[11px] text-blue-400 mt-1 font-mono">
                  {m.idType} &bull; Submitted {m.submittedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              {m.status === "PENDING" ? (
                <>
                  <button
                    onClick={() => handleApprove(m.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve KYC
                  </button>
                  <button
                    onClick={() => handleReject(m.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800 transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-700/50">
                  {m.status} ✓
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
