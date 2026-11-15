"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Repeat, MessageSquare } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useMarketplace();

  const postHref = isLoggedIn ? "/listings/create" : "/auth/login?redirect=/listings/create";

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "All Ads", href: "/listings", icon: Search },
    { label: "Post Ad", href: postHref, icon: PlusCircle, isPrimary: true },
    { label: "Swaps", href: "/swaps", icon: Repeat },
    { label: "Chat", href: "/messages", icon: MessageSquare },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-[#0f172a] text-amber-400 flex items-center justify-center shadow-md border-4 border-slate-50 transition-transform active:scale-95">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#0f172a] mt-0.5">Post</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                isActive ? "text-[#0f172a] font-black" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
