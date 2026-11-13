"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Repeat,
  CheckCircle,
  FileText,
  Download,
  Building,
  Calculator,
  ArrowRight,
  Layers,
  Sparkles,
  Award,
  Globe,
  Database,
  Lock,
} from "lucide-react";

export default function CommercialMonetizationPage() {
  // ROI Interactive Calculator state
  const [dailyDeliveries, setDailyDeliveries] = useState(800);
  const [avgItemPrice, setAvgItemPrice] = useState(15000);
  const [monthlyTrades, setMonthlyTrades] = useState(350);
  const [verifiedMerchants, setVerifiedMerchants] = useState(60);

  // Financial calculations
  const deliveryPlatformRevenue = dailyDeliveries * 5 * 30; // 5 ETB cut per 40 ETB delivery * 30 days
  const escrowCommissionRevenue = monthlyTrades * (avgItemPrice * 0.02); // 2% platform escrow fee
  const merchantSubscriptions = verifiedMerchants * 350; // 350 ETB/mo merchant badge
  const listingBoostRevenue = 120 * 80; // 120 featured boosts @ 80 ETB

  const totalMonthlyRevenue =
    deliveryPlatformRevenue + escrowCommissionRevenue + merchantSubscriptions + listingBoostRevenue;

  const acquisitionPrice = 25000;
  const paybackDays = Math.max(1, Math.round((acquisitionPrice / (totalMonthlyRevenue / 30)) * 10) / 10);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-[#2a1a0f] text-[#faf5ed] rounded-3xl p-6 sm:p-10 border border-[#553823] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,#1d4ed8_0%,transparent_70%)] opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-600/50 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Official Commercial Acquisition Proposal
            </span>
            <span className="text-xs font-bold text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-600/50">
              Turn-Key Asset Ready for Deployment
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Sebez Market Commercial Valuation Deck
            </h1>
            <p className="text-sm sm:text-base text-[#d8c3ad] max-w-3xl leading-relaxed">
              Complete production e-commerce &amp; logistics software engineered specifically for the 
              rapidly expanding economy of <strong className="text-white">Adama, Ethiopia</strong>. 
              Featuring circular barter cycle detection, verified local classifieds, and safe in-person inspection escrow rails.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <div className="bg-[#3d2717] px-4 py-2.5 rounded-2xl border border-[#553823] shadow-inner">
              <span className="text-[11px] text-[#b8a088] uppercase tracking-wider block font-bold">Acquisition Price</span>
              <span className="text-2xl font-black text-amber-300">25,000 ETB</span>
              <span className="text-[10px] text-[#b8a088] ml-1.5">(One-time full IP buyout)</span>
            </div>

            <div className="bg-[#3d2717] px-4 py-2.5 rounded-2xl border border-[#553823] shadow-inner">
              <span className="text-[11px] text-[#b8a088] uppercase tracking-wider block font-bold">Payback Period</span>
              <span className="text-2xl font-black text-emerald-400">{paybackDays} Days</span>
              <span className="text-[10px] text-[#b8a088] ml-1.5">at projected Adama volume</span>
            </div>

            <div className="bg-[#3d2717] px-4 py-2.5 rounded-2xl border border-[#553823] shadow-inner">
              <span className="text-[11px] text-[#b8a088] uppercase tracking-wider block font-bold">Projected Monthly GMV</span>
              <span className="text-2xl font-black text-blue-300">{(avgItemPrice * monthlyTrades).toLocaleString()} ETB</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#faf5ed] p-6 rounded-2xl border border-[#dfd2be] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center">
            <Repeat className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#2b1c11]">Proprietary Circular Barter Matching Engine</h3>
          <p className="text-xs text-[#785437] leading-relaxed">
            Unlike standard classifieds where trades require rare bilateral double coincidence, Sebez 
            solves barter deadlocks using graph cycle algorithms to orchestrate 3-party circular swaps 
            (User A &rarr; User B &rarr; User C &rarr; User A) with automated cash top-up clearing.
          </p>
          <div className="text-[11px] font-bold text-[#1d4ed8] flex items-center gap-1">
            <span>Graph matching API: /api/swaps/match</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-[#faf5ed] p-6 rounded-2xl border border-[#dfd2be] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#1e40af] flex items-center justify-center border border-[#bfdbfe]">
            <Award className="w-5 h-5 text-[#1d4ed8]" />
          </div>
          <h3 className="text-base font-bold text-[#2b1c11]">Promoted Listings &amp; Merchant Badges</h3>
          <p className="text-xs text-[#785437] leading-relaxed">
            Local electronics and smartphone merchants in Arada and Posta Bet pay to feature their ads at the top of category feeds and earn verified green trust checkmarks, generating steady recurring SaaS margins.
          </p>
          <div className="text-[11px] font-bold text-[#1d4ed8] flex items-center gap-1">
            <span>Classifieds API: /api/listings</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-[#faf5ed] p-6 rounded-2xl border border-[#dfd2be] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#2b1c11]">Dual-OTP Telebirr Escrow Protocol</h3>
          <p className="text-xs text-[#785437] leading-relaxed">
            Eliminates classifieds fraud in Ethiopia. Escrow holds Telebirr/CBE Birr payments safely. 
            Buyer meets seller at Adama landmarks and confirms satisfactory physical inspection with 
            their 4-digit Customer Release OTP before funds are transferred to the seller.
          </p>
          <div className="text-[11px] font-bold text-[#1d4ed8] flex items-center gap-1">
            <span>Escrow verification: /api/deliveries/verify</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-[#faf5ed] p-6 rounded-2xl border border-[#dfd2be] shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ede4d6] text-[#52361f] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#2b1c11]">Tri-Lingual Localization &amp; Cultural Branding</h3>
          <p className="text-xs text-[#785437] leading-relaxed">
            Full instant client-side localization across English, Amharic (አማርኛ), and Afaan Oromoo. 
            Rooted in Ethiopian heritage with traditional ሰፌድ (Sefed) woven circular motif representing 
            endless circular trade loops and local community trust.
          </p>
          <div className="text-[11px] font-bold text-[#1d4ed8] flex items-center gap-1">
            <span>Dictionary: src/data/translations.ts</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Interactive Financial ROI Calculator */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dfd2be] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8]">
              <Calculator className="w-4 h-4" />
              <span>Investment Return Model</span>
            </div>
            <h2 className="text-xl font-black text-[#2b1c11] tracking-tight mt-0.5">
              Live Revenue &amp; Payback Calculator for Adama
            </h2>
          </div>
          <span className="text-xs text-[#785437]">
            Adjust the sliders to project returns based on your operational scale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#2b1c11]">
                <span>Daily Completed Escrow Trades</span>
                <span className="text-[#1d4ed8]">{dailyDeliveries.toLocaleString()} orders / day</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={dailyDeliveries}
                onChange={(e) => setDailyDeliveries(Number(e.target.value))}
                className="w-full accent-[#1d4ed8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#785437]">
                <span>200 (Pilot phase)</span>
                <span>2,500 (Full Adama rollout)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#2b1c11]">
                <span>Monthly Escrow Trades Settled</span>
                <span className="text-[#1d4ed8]">{monthlyTrades.toLocaleString()} trades</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={monthlyTrades}
                onChange={(e) => setMonthlyTrades(Number(e.target.value))}
                className="w-full accent-[#1d4ed8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#785437]">
                <span>50 trades</span>
                <span>1,000 trades</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#2b1c11]">
                <span>Average Item Value</span>
                <span className="text-[#1d4ed8]">{avgItemPrice.toLocaleString()} ETB</span>
              </div>
              <input
                type="range"
                min="3000"
                max="50000"
                step="1000"
                value={avgItemPrice}
                onChange={(e) => setAvgItemPrice(Number(e.target.value))}
                className="w-full accent-[#1d4ed8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#785437]">
                <span>3,000 ETB (Apparel/Shoes)</span>
                <span>50,000 ETB (Phones/Laptops)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#2b1c11]">
                <span>Subscribed Verified Merchants</span>
                <span className="text-[#1d4ed8]">{verifiedMerchants} stores</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={verifiedMerchants}
                onChange={(e) => setVerifiedMerchants(Number(e.target.value))}
                className="w-full accent-[#1d4ed8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#785437]">
                <span>10 stores</span>
                <span>250 stores</span>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Card */}
          <div className="bg-[#ede4d6] p-5 rounded-2xl border border-[#dfd2be] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#52361f] pb-2 border-b border-[#dfd2be]">
                Projected Monthly Platform Income
              </h3>
              <div className="divide-y divide-[#dfd2be]/70 text-xs py-2 space-y-2">
                <div className="flex justify-between pt-1">
                  <span className="text-[#785437]">Promoted Ads &amp; Top Placement:</span>
                  <span className="font-bold text-[#2b1c11]">{deliveryPlatformRevenue.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#785437]">Telebirr Escrow (2% fee):</span>
                  <span className="font-bold text-[#2b1c11]">{escrowCommissionRevenue.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#785437]">Verified Merchant Subscriptions:</span>
                  <span className="font-bold text-[#2b1c11]">{merchantSubscriptions.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#785437]">Listing Boosts &amp; Urgents:</span>
                  <span className="font-bold text-[#2b1c11]">{listingBoostRevenue.toLocaleString()} ETB</span>
                </div>
              </div>
            </div>

            <div className="bg-[#faf5ed] p-4 rounded-xl border border-[#d2ba92] space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#785437]">Net Monthly Platform Income:</span>
                <span className="text-xl font-black text-[#1d4ed8]">{totalMonthlyRevenue.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-[#dfd2be] text-xs">
                <span className="font-bold text-[#3d2717]">25,000 ETB Payback Horizon:</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Fully recovered in {paybackDays} days!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture & Deliverables */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-6 sm:p-8 shadow-2xs space-y-6">
        <h2 className="text-xl font-black text-[#2b1c11] tracking-tight">
          What Is Included in the 25,000 ETB Software Handover
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#f4ece1] border border-[#dfd2be] space-y-2">
            <Database className="w-5 h-5 text-[#1d4ed8]" />
            <h4 className="text-xs font-bold text-[#2b1c11]">Prisma ORM &amp; Database</h4>
            <p className="text-[11px] text-[#785437]">
              Complete schema with 10 models (User, KYC, Listing, TradeOffer, TradeCycle, DeliveryPool, EscrowTransaction, ChatMessage, Review). Zero cloud lock-in.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4ece1] border border-[#dfd2be] space-y-2">
            <Layers className="w-5 h-5 text-[#1d4ed8]" />
            <h4 className="text-xs font-bold text-[#2b1c11]">Next.js 14 App Router</h4>
            <p className="text-[11px] text-[#785437]">
              Full SSR, modern REST API routes, physical file uploads, server-rendered dynamic maps, and responsive mobile-first Tailwind styling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4ece1] border border-[#dfd2be] space-y-2">
            <FileText className="w-5 h-5 text-[#1d4ed8]" />
            <h4 className="text-xs font-bold text-[#2b1c11]">Deployment &amp; Docker Setup</h4>
            <p className="text-[11px] text-[#785437]">
              Single command deployment script, complete seeding scripts with Adama geolocations, and 10-day Git version history ready to push to your repository.
            </p>
          </div>
        </div>
      </div>

      {/* Acquisition Next Steps & Direct Handover */}
      <div className="bg-[#52361f] text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black tracking-tight">Ready to Finalize Software Acquisition</h3>
            <p className="text-xs text-[#d8c3ad] mt-1 max-w-xl">
              All source code, database migrations, assets, and operational portals are verified, tested, 
              and ready for immediate handover to the buyer under the agreed 25,000 ETB consideration.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/listings"
              className="px-4 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-[#3d2717] hover:bg-[#2a1a0f] text-[#faf5ed] text-xs font-bold border border-[#6a4727] transition-all"
            >
              Operations Command
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
