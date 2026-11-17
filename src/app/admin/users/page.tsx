"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  DollarSign,
  UserCheck,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { PRESET_USERS, ActiveUser } from "@/context/MarketplaceContext";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      if (data.success && data.users) {
        // Merge with preset balances
        const merged: ActiveUser[] = data.users.map((u: any) => {
          const preset = PRESET_USERS.find((p) => p.phone === u.phone);
          return {
            id: u.id,
            name: u.name,
            phone: u.phone,
            role: u.role,
            city: u.city || "Adama",
            kebele: u.kebele || "Bole",
            landmark: u.landmark,
            avatarUrl: u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
            rating: u.rating || 5.0,
            completedTrades: u.completedTrades || 0,
            walletBalance: u.walletBalance || preset?.walletBalance || 0,
          };
        });
        setUsers(merged);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.kebele && u.kebele.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">User &amp; Merchant Directory</h1>
            <span className="text-xs bg-[#2a1a0f] text-blue-300 px-2.5 py-0.5 rounded-full border border-[#442c1c] font-mono">
              {users.length} Registered Accounts
            </span>
          </div>
          <p className="text-xs text-[#a89078] mt-1">
            Manage verified merchants and active buyers trading in Adama
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="p-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white border border-[#442c1c] transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8c6b51] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone number, or kebele..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#19100a] border border-[#442c1c] text-xs text-white placeholder-[#8c6b51] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "MERCHANT", "BUYER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === r
                  ? "bg-[#332014] text-white border border-[#52361f]"
                  : "text-[#8c6b51] hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-[#24170f] p-5 rounded-2xl border border-[#3a271a] space-y-4 shadow-2xs hover:border-[#52361f] transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#442c1c]"
                />
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{user.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#a89078] mt-0.5">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span className="font-mono">{user.phone}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                  user.role === "MERCHANT"
                    ? "bg-blue-950 text-blue-300 border-blue-700/60"
                    : user.role === "DRIVER"
                    ? "bg-purple-950 text-purple-300 border-purple-700/60"
                    : user.role === "ADMIN"
                    ? "bg-amber-950 text-amber-300 border-amber-700/60"
                    : "bg-emerald-950 text-emerald-300 border-emerald-700/60"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="bg-[#19100a] p-3 rounded-xl border border-[#3a271a] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8c6b51]">
                <span>Kebele / Hub:</span>
                <span className="text-white font-semibold">{user.kebele}, Adama</span>
              </div>
              <div className="flex justify-between text-[#8c6b51]">
                <span>Reputation:</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{user.rating} ({user.completedTrades} deals)</span>
                </span>
              </div>
              <div className="flex justify-between text-[#8c6b51]">
                <span>Telebirr Wallet:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {user.walletBalance.toLocaleString()} ETB
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>KYC Verified</span>
              </span>

              <Link
                href={`/seller/${user.id}`}
                target="_blank"
                className="text-blue-400 hover:underline font-bold"
              >
                Public Profile &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
