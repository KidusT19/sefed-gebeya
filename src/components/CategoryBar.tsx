"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  Smartphone,
  Laptop,
  Car,
  Tv,
  Home,
  Watch,
  Building,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface CategoryMeta {
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  adCount: number;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  phones: {
    icon: Smartphone,
    accentColor: "text-blue-600",
    bgLight: "bg-blue-50/80 border-blue-200/70 hover:border-blue-400",
    adCount: 18,
  },
  laptops: {
    icon: Laptop,
    accentColor: "text-amber-700",
    bgLight: "bg-amber-50/80 border-amber-200/70 hover:border-amber-400",
    adCount: 14,
  },
  vehicles: {
    icon: Car,
    accentColor: "text-emerald-700",
    bgLight: "bg-emerald-50/80 border-emerald-200/70 hover:border-emerald-400",
    adCount: 9,
  },
  electronics: {
    icon: Tv,
    accentColor: "text-indigo-600",
    bgLight: "bg-indigo-50/80 border-indigo-200/70 hover:border-indigo-400",
    adCount: 12,
  },
  home: {
    icon: Home,
    accentColor: "text-rose-700",
    bgLight: "bg-rose-50/80 border-rose-200/70 hover:border-rose-400",
    adCount: 15,
  },
  fashion: {
    icon: Watch,
    accentColor: "text-purple-600",
    bgLight: "bg-purple-50/80 border-purple-200/70 hover:border-purple-400",
    adCount: 8,
  },
  "real-estate": {
    icon: Building,
    accentColor: "text-teal-700",
    bgLight: "bg-teal-50/80 border-teal-200/70 hover:border-teal-400",
    adCount: 6,
  },
};

function CategoryBarContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const { language } = useMarketplace();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <h2 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
            Curated Categories across Ethiopia
          </h2>
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
            &bull; Direct classifieds &amp; device swaps
          </span>
        </div>
        <Link
          href="/listings"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>View All 82 Ads</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.slug;
          const meta = CATEGORY_META[cat.slug] || {
            icon: Smartphone,
            accentColor: "text-blue-600",
            bgLight: "bg-white border-slate-200",
            adCount: 10,
          };
          const Icon = meta.icon;

          const localizedName =
            language === "am" ? cat.nameAm || cat.name : language === "om" ? cat.nameOr || cat.name : cat.name;

          return (
            <Link
              key={cat.id}
              href={`/listings?category=${cat.slug}`}
              className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                isActive
                  ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-600/20 -translate-y-0.5"
                  : "bg-white border-slate-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                    meta.bgLight
                  }`}
                >
                  <Icon className={`w-5 h-5 ${meta.accentColor}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {meta.adCount} ads
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                  {localizedName}
                </h3>
                <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1 font-medium">
                  {cat.subcategories[0]} &bull; {cat.subcategories[1]}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function CategoryBar() {
  return (
    <Suspense fallback={<div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />}>
      <CategoryBarContent />
    </Suspense>
  );
}
