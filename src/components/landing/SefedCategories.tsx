"use client";

import React from "react";
import Link from "next/link";
import { Grid, ChevronRight } from "lucide-react";

interface CategoryCardItem {
  id: string;
  name: string;
  slug: string;
  href: string;
  image: string;
  fallbackImage: string;
  bgColor: string;
  hoverBg: string;
  borderColor: string;
  itemCount: string;
}

export default function SefedCategories() {
  const categories: CategoryCardItem[] = [
    {
      id: "cat-electronics",
      name: "Electronics",
      slug: "electronics",
      href: "/listings?category=electronics",
      image: "/images/mockup_assets/cat_electronics.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      bgColor: "bg-[#fdf4eb]",
      hoverBg: "hover:bg-[#fce9d7]",
      borderColor: "border-[#f5d7be]",
      itemCount: "140+ Items",
    },
    {
      id: "cat-fashion",
      name: "Fashion",
      slug: "fashion",
      href: "/listings?category=fashion",
      image: "/images/mockup_assets/cat_fashion.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80",
      bgColor: "bg-[#edf4fc]",
      hoverBg: "hover:bg-[#dbeafc]",
      borderColor: "border-[#cbe0f7]",
      itemCount: "220+ Items",
    },
    {
      id: "cat-home",
      name: "Home & Living",
      slug: "home",
      href: "/listings?category=home",
      image: "/images/mockup_assets/cat_home.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80",
      bgColor: "bg-[#f7f4ee]",
      hoverBg: "hover:bg-[#ede7da]",
      borderColor: "border-[#ded4c1]",
      itemCount: "95+ Items",
    },
    {
      id: "cat-beauty",
      name: "Beauty & Health",
      slug: "beauty",
      href: "/listings?category=beauty",
      image: "/images/mockup_assets/cat_beauty.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
      bgColor: "bg-[#f8edf5]",
      hoverBg: "hover:bg-[#f3dbec]",
      borderColor: "border-[#e8cadf]",
      itemCount: "80+ Items",
    },
    {
      id: "cat-groceries",
      name: "Groceries",
      slug: "groceries",
      href: "/listings?category=groceries",
      image: "/images/mockup_assets/cat_groceries.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
      bgColor: "bg-[#fbf7ea]",
      hoverBg: "hover:bg-[#f6eecf]",
      borderColor: "border-[#ebdca8]",
      itemCount: "310+ Items",
    },
  ];

  return (
    <section className="py-5 sm:py-7 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header with Decorative Green Accent Lines */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-0.5 w-10 sm:w-16 bg-emerald-600/30 rounded-full" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0b4d2e] tracking-tight">
              Shop by Category
            </h2>
            <div className="h-0.5 w-10 sm:w-16 bg-emerald-600/30 rounded-full" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Browse authentic products from verified sellers across Ethiopia
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {/* 5 Product Image Cards */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group flex flex-col justify-between p-3.5 rounded-2xl ${cat.bgColor} ${cat.hoverBg} border ${cat.borderColor} shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Product Preview Thumbnail */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/70 flex items-center justify-center p-2 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = cat.fallbackImage;
                  }}
                />
              </div>

              {/* Category Footer Label with Chevron */}
              <div className="text-center pt-1">
                <span className="inline-flex items-center gap-1 font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-800 transition-colors">
                  <span className="text-emerald-700 font-black">&gt;</span>
                  <span>{cat.name}</span>
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                  {cat.itemCount}
                </span>
              </div>
            </Link>
          ))}

          {/* 6th Card: "More Categories" with Green Grid Icon */}
          <Link
            href="/listings"
            className="group flex flex-col justify-between p-3.5 rounded-2xl bg-[#eef7f2] hover:bg-[#e0f1e7] border border-[#cbe6d4] shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Green 4-dot Grid Icon */}
            <div className="relative w-full aspect-square rounded-xl bg-white/70 flex items-center justify-center p-2 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-[#0e623a] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Grid className="w-8 h-8 stroke-[2.2]" />
              </div>
            </div>

            {/* Category Footer Label with Chevron */}
            <div className="text-center pt-1">
              <span className="inline-flex items-center gap-1 font-black text-xs sm:text-sm text-emerald-900 group-hover:text-[#0b4d2e] transition-colors">
                <span className="text-emerald-700 font-black">&gt;</span>
                <span>More Categories</span>
              </span>
              <span className="block text-[10px] text-emerald-700 mt-0.5 font-bold">
                15+ Subcategories
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
