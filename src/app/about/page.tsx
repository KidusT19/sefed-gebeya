import Link from "next/link";
import {
  Repeat,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  CheckCircle,
  Users,
  Smartphone,
  ArrowRight,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header in Clean Slate Canvas */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-slate-900 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          📍 Nationwide Ethiopia &bull; መላው ኢትዮጵያ
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
          Modernizing Commerce Across Ethiopia with Direct Trade &amp; Smart Device Barter.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed font-medium">
          Sebez Market was founded to solve a critical problem for buyers, sellers, and small businesses across Ethiopia:
          cash shortages when upgrading phones, laptops, or electronics. We empower people to connect directly
          for cash purchases and smart trade-in swaps without losing money to brokers or middlemen.
        </p>
      </section>

      {/* The 4 Core Pillars */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          The 4 Pillars of Sebez Market
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Direct Buy */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                1. Direct Buy from Seller
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse verified classifieds across Ethiopia. Call or message sellers directly to negotiate and arrange a safe in-person inspection.
              </p>
            </div>
            <Link
              href="/listings"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-2"
            >
              Browse listings &rarr;
            </Link>
          </div>

          {/* Pillar 2: Direct Sell */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                2. Direct Selling (Free Ads)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                List phones, laptops, and appliances in under 60 seconds with photos, city location, and ETB pricing. Zero listing commission.
              </p>
            </div>
            <Link
              href="/listings/create"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 pt-2"
            >
              Post your ad &rarr;
            </Link>
          </div>

          {/* Pillar 3: Barter */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                3. Direct Barter Swap (1-to-1)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Propose a trade. If values differ, our built-in calculator automatically determines the exact cash difference (e.g. Samsung + 19,000 ETB for an iPhone 13 Pro).
              </p>
            </div>
            <Link
              href="/swaps"
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 pt-2"
            >
              Try swap calculator &rarr;
            </Link>
          </div>

          {/* Pillar 4: Circular Swaps */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                4. Circular Swaps (3-Way)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When cash is tight, our graph matching engine creates 3-party trade loops (A &rarr; B &rarr; C &rarr; A) so everyone gets what they want without huge cash outlay.
              </p>
            </div>
            <Link
              href="/swaps"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-2"
            >
              Explore 3-way loops &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Coverage Areas Across Ethiopia */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Major Ethiopian Commercial Hubs &amp; Meetup Landmarks
        </h2>
        <p className="text-xs text-slate-500">
          Connect with trusted buyers and sellers across key commercial centers and bank branches nationwide:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Addis Ababa (አዲስ አበባ)</span>
            <span className="text-[11px] text-slate-500">Bole, Piassa, Mexico &amp; Edna Mall</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Adama / Nazret (አዳማ)</span>
            <span className="text-[11px] text-slate-500">Posta Bet, Arada Market &amp; Bole</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Hawassa (ሀዋሳ)</span>
            <span className="text-[11px] text-slate-500">Piazza, Lake Tula &amp; Commercial Row</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Bahir Dar (ባህር ዳር)</span>
            <span className="text-[11px] text-slate-500">Felege Hiwot, Kebele 04 &amp; Lake Shore</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Dire Dawa (ድሬዳዋ)</span>
            <span className="text-[11px] text-slate-500">Taiwan Market &amp; Kezira Quarter</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Mekelle (መቐለ)</span>
            <span className="text-[11px] text-slate-500">Kedamay Weyane &amp; Romanat Square</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Jimma (ጅማ)</span>
            <span className="text-[11px] text-slate-500">Hirmata &amp; Central Bank Row</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-black text-sm text-slate-900 block">Gondar (ጎንደር)</span>
            <span className="text-[11px] text-slate-500">Arada &amp; Fasil Piazza</span>
          </div>
        </div>
      </section>

      {/* Safety & Community Standards */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          Buyer &amp; Seller Safety Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900">Public Landmark Meetups</h4>
            <p className="text-[11px] text-slate-500">
              Always meet in daylight, well-lit areas at public landmarks across your city (e.g. outside Commercial Bank of Ethiopia branches or commercial centers). Never invite strangers to isolated locations.
            </p>
          </div>
          <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900">Physical Inspection First</h4>
            <p className="text-[11px] text-slate-500">
              Inspect the item thoroughly before handing over cash. Check phone IMEI, battery health, iCloud/Google accounts, camera, and charging port.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-black text-white">Ready to start trading across Ethiopia?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Post an ad for free or browse deals available today.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/listings/create"
            className="flex-1 sm:flex-none text-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Post Free Ad
          </Link>
          <Link
            href="/listings"
            className="flex-1 sm:flex-none text-center bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            Browse Ads
          </Link>
        </div>
      </section>
    </div>
  );
}
