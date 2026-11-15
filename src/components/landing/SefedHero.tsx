"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Play,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Lock,
  Smartphone,
} from "lucide-react";

interface SefedHeroProps {
  onShopNowClick?: () => void;
}

export default function SefedHero({ onShopNowClick }: SefedHeroProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-transparent">
        {/* Decorative Fluid Ambient Waves (Ethiopian Green & Sunshine Gold) */}
        <div className="absolute top-0 right-0 w-full sm:w-[55%] h-[50%] sm:h-[85%] pointer-events-none -z-0 opacity-80 sm:opacity-90">
          <svg
            viewBox="0 0 700 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover"
          >
            {/* Soft background city / landmark silhouette blur */}
            <circle cx="500" cy="180" r="160" fill="#f0fdf4" />
            <circle cx="580" cy="260" r="140" fill="#fefce8" />

            {/* Golden Sunshine Yellow Curve */}
            <path
              d="M320 0 C450 120 540 240 700 280 L700 0 Z"
              fill="url(#goldHeroGrad)"
              opacity="0.9"
            />

            {/* Vibrant Forest Green Curve */}
            <path
              d="M420 0 C510 130 580 280 700 360 L700 0 Z"
              fill="url(#greenHeroGrad)"
            />

            <defs>
              <linearGradient id="goldHeroGrad" x1="300" y1="0" x2="700" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="greenHeroGrad" x1="400" y1="0" x2="700" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#15803d" />
                <stop offset="1" stopColor="#0a4d2c" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Left Bottom Wave Swoosh */}
        <div className="absolute -bottom-10 -left-10 w-96 h-64 pointer-events-none -z-0 opacity-70 hidden lg:block">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M-20 200 C80 180 180 230 260 300 L-20 300 Z"
              fill="#fbbf24"
              opacity="0.4"
            />
            <path
              d="M-20 230 C90 220 170 260 220 300 L-20 300 Z"
              fill="#15803d"
              opacity="0.25"
            />
          </svg>
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-4 sm:pt-6 sm:pb-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* Left Column: Headlines & Call to Action */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-5 text-left">
              {/* "Welcome to" Intro */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] sm:text-xs font-bold text-emerald-800">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
                <span>Welcome to Ethiopia&apos;s Trusted Marketplace</span>
              </div>

              {/* Main Brand Titles (Amharic + English) */}
              <div className="space-y-0.5 sm:space-y-1">
                <div className="relative inline-block">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0b4d2e] tracking-tight leading-tight">
                    ሰፌድ ገበያ
                  </h1>
                  {/* Decorative Ethiopian Sunburst Accents */}
                  <div className="absolute -top-3 -right-8 text-amber-400 select-none hidden sm:block animate-pulse">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                </div>

                <div className="block">
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0e623a] tracking-tight">
                    Sefed Market
                  </span>
                </div>
              </div>

              {/* Tagline & Subheading */}
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-sm sm:text-xl font-extrabold text-slate-800 tracking-tight">
                  Your One-Stop Online Shopping Destination!
                </h2>
                <p className="hidden sm:block text-xs sm:text-base text-slate-600 max-w-xl leading-relaxed">
                  Discover a wide range of quality products at the best prices, and enjoy a convenient, 
                  secure shopping experience with verified sellers and fast delivery across Ethiopia.
                </p>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                {/* Primary Button: Shop Now */}
                {onShopNowClick ? (
                  <button
                    type="button"
                    onClick={onShopNowClick}
                    className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs sm:text-base px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </button>
                ) : (
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs sm:text-base px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </Link>
                )}

                {/* Secondary Button: How Escrow Works Walkthrough */}
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-base px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-full border border-slate-200 sm:border-2 hover:border-emerald-600 shadow-xs transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white ml-0.5" />
                  </div>
                  <span>How Escrow Works</span>
                </button>
              </div>

              {/* Quick Trust Badges - Hidden on mobile because the 4-pillar trust bar is right below */}
              <div className="hidden sm:flex pt-1.5 sm:pt-3 flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  <span>Escrow Protected (Telebirr / CBE)</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                  <span>Hyperlocal Express Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Shopper Visual & Floating Badges */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-3 lg:mt-0">
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">

                {/* Shopper Hero Frame */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white bg-gradient-to-b from-emerald-50/50 to-white">
                  <img
                    src="/images/mockup_assets/hero_shopper.jpg"
                    alt="Ethiopian Shopper enjoying Sefed Market"
                    className="w-full h-auto object-cover object-center max-h-[180px] sm:max-h-[300px] lg:max-h-[360px] transform hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to high-res shopper portrait if local crop is unavailable
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";
                    }}
                  />

                  {/* Gradient bottom overlay for smooth blend */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Verified Quality Badge */}
                <div className="absolute -bottom-3 -left-2 sm:-bottom-5 sm:-left-5 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-100 p-2 sm:p-3 flex items-center gap-2 sm:gap-3 z-20">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs sm:text-base">
                    ✓
                  </div>
                  <div className="text-left leading-tight pr-1 sm:pr-2">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      Verified Sellers
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 block mt-0.5">
                      100% Genuine Items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive "Watch Video / How It Works" Walkthrough Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close video modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <Play className="w-7 h-7 fill-emerald-800 ml-1" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">How Sefed Market Works</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Watch our quick guide to shopping, selling, and swapping across Ethiopia
                </p>
              </div>

              {/* 3 Step Interactive Visual Cards */}
              <div className="space-y-3 text-left pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Discover &amp; Compare</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Browse verified products from Addis Ababa, Adama, Hawassa, and nationwide sellers at fair local prices.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Lock Payment in Escrow</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Pay securely with Telebirr or CBE Birr. Funds are held safely in escrow and only released when you inspect and confirm.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0e623a] text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Speedy Kebele Delivery</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Pooled deliveries and Bajaj dispatches deliver direct to your kebele landmark with dual-OTP verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-black text-xs transition-colors"
                >
                  Start Exploring Sefed Market
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
