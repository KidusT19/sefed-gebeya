"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Star,
  Trash2,
  ExternalLink,
  Plus,
  Tag,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { ProductListing } from "@/types/marketplace";
export default function AdminListingsPage() {
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKebele, setSelectedKebele] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/listings");
      const data = await res.json();
      if (data.success && data.listings) {
        setListings(data.listings);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteListing = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete listing "${title}"?`)) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      setStatusMessage(`Listing "${title}" removed from marketplace.`);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleToggleFeatured = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFeatured: !l.isFeatured } : l))
    );
    setStatusMessage(`Listing promotion status updated.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const filtered = listings.filter((l) => {
    if (selectedKebele !== "All" && l.kebele !== selectedKebele) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.seller.name.toLowerCase().includes(q) ||
        l.categorySlug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Classified Listings Moderation</h1>
            <span className="text-xs bg-[#2a1a0f] text-blue-300 px-2.5 py-0.5 rounded-full border border-[#442c1c] font-mono">
              {listings.length} Active in Adama
            </span>
          </div>
          <p className="text-xs text-[#a89078] mt-1">
            Review, feature, or remove classified ads across all Adama kebeles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchListings}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white border border-[#442c1c] transition-all"
            title="Refresh from SQLite Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/listings/create"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#24170f] p-4 rounded-2xl border border-[#3a271a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8c6b51] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, seller, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#19100a] border border-[#442c1c] text-xs text-white placeholder-[#8c6b51] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8c6b51] font-semibold whitespace-nowrap">Filter Kebele:</span>
          <select
            value={selectedKebele}
            onChange={(e) => setSelectedKebele(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#19100a] border border-[#442c1c] text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="All">All Kebeles</option>
            <option value="Arada">Arada (አራዳ)</option>
            <option value="Bole">Bole (ቦሌ)</option>
            <option value="Kebele 04">Kebele 04</option>
            <option value="Posta Bet">Posta Bet</option>
            <option value="Amede">Amede Market</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-[#24170f] rounded-2xl border border-[#3a271a] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1b110a] text-[#a89078] border-b border-[#3a271a]">
                <th className="p-3.5 font-bold uppercase text-[10px]">Product / Title</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Price</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Trade Mode</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Seller / Kebele</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Condition</th>
                <th className="p-3.5 font-bold uppercase text-[10px]">Status</th>
                <th className="p-3.5 font-bold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a271a]/70">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#2c1d13] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover bg-[#19100a] shrink-0 border border-[#442c1c]"
                      />
                      <div className="min-w-0 max-w-xs">
                        <div className="font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-[#8c6b51] capitalize">{item.categorySlug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-300">
                    {item.price.toLocaleString()} ETB
                  </td>
                  <td className="p-3.5">
                    {item.allowBarter ? (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                        Barter Enabled
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8c6b51]">Cash Only</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{item.seller.name}</div>
                    <div className="text-[10px] text-[#8c6b51] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.kebele}, Adama</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#c2ab94] font-medium">{item.condition}</td>
                  <td className="p-3.5">
                    {item.isFeatured ? (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/50">
                        ★ Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleFeatured(item.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.isFeatured
                            ? "bg-amber-950 text-amber-300 border-amber-600"
                            : "bg-[#1f130b] text-[#8c6b51] hover:text-amber-300 border-[#3a271a]"
                        }`}
                        title={item.isFeatured ? "Unpin featured" : "Promote to Featured"}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/listings/${item.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-[#1f130b] text-[#8c6b51] hover:text-blue-300 border border-[#3a271a] transition-all"
                        title="View Live Listing Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(item.id, item.title)}
                        className="p-1.5 rounded-lg bg-[#1f130b] text-[#8c6b51] hover:text-rose-400 border border-[#3a271a] transition-all"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
