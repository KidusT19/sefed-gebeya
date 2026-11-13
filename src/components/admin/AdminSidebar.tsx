"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Repeat,
  Package,
  Users,
  Award,
  ArrowLeft,
  DollarSign,
  Activity,
  Server,
  ChevronRight,
  Database,
  ExternalLink,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { currentUser } = useMarketplace();

  const navLinks = [
    {
      name: "Command Center",
      href: "/admin",
      icon: LayoutDashboard,
      badge: "Live",
      badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    },
    {
      name: "Listings Moderation",
      href: "/admin/listings",
      icon: Package,
    },
    {
      name: "Escrow & Settlements",
      href: "/admin/escrow",
      icon: ShieldCheck,
      badge: "2 Pending",
      badgeColor: "bg-amber-900/60 text-amber-300 border-amber-700/50",
    },
    {
      name: "Circular Barter Engine",
      href: "/admin/swaps",
      icon: Repeat,
    },
    {
      name: "User & Merchant Directory",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Commercial 25K Deck",
      href: "/admin/monetization",
      icon: Award,
      badge: "25,000 ETB",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/50",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1b120c] border-r border-[#3a271a] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#3a271a] bg-[#140c07]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-xs bg-[#faf5ed] flex items-center justify-center shrink-0">
              <img
                src="/images/sefed-icon.jpg"
                alt="Sebez Sefed Emblem"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white block leading-none">
                  Sebez<span className="text-[#3b82f6]">Ops</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/40">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-[#b8a088] font-medium block mt-1">
                Adama Central Operations HQ
              </span>
            </div>
          </div>
        </div>

        {/* Live System Health Pill */}
        <div className="px-4 py-3 bg-[#24170f] border-b border-[#3a271a]">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-[#d8c3ad]">Adama Network Active</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              Prisma SQLite OK
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#8c6b51] uppercase tracking-wider">
            Enterprise Management
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? "bg-[#332014] text-white shadow-xs border border-[#52361f] text-[#fbebd8]"
                    : "text-[#c2ab94] hover:bg-[#271910] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#3b82f6]" : "text-[#8c6b51] group-hover:text-amber-400"
                    }`}
                  />
                  <span>{link.name}</span>
                </div>

                {link.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      link.badgeColor || "bg-[#3d2717] text-[#e0cfbe] border-[#553823]"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin User Footer & Exit to Marketplace */}
        <div className="p-3 border-t border-[#3a271a] bg-[#140c07] space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#22150d] border border-[#3a271a]">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80"
              alt="Admin Profile"
              width={32}
              height={32}
              style={{ width: "32px", height: "32px", objectFit: "cover" }}
              className="w-8 h-8 rounded-full object-cover border border-[#553823]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">Sebez Operations HQ</div>
              <div className="text-[10px] text-amber-400 font-mono">Super Admin • Adama</div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full py-2.5 px-3 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#e6d3c0] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#442c1c]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Return to Customer Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
