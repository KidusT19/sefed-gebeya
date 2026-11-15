import Link from "next/link";
import { ShieldCheck, MapPin, Repeat, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0f172a] text-slate-400 border-t border-slate-800">
      {/* 3 Core Value Props */}
      <div className="border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700">
              <Repeat className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white">Device Barter &amp; Swap</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Exchange phones, laptops, and electronics directly with fair cash difference balancing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-900/60">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white">Nationwide Safe Meetups</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Meet sellers directly at public landmarks, CBE branches, and commercial centers across Addis Ababa, Adama, Hawassa, and nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white">Telebirr &amp; CBE Escrow</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Optional payment protection with Dual-OTP codes. Release funds only after you inspect the item.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Links */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-400">
          {/* Col 1: Shop & Swap */}
          <div className="space-y-2">
            <h5 className="font-black uppercase tracking-wider text-white text-[11px]">
              Marketplace
            </h5>
            <ul className="space-y-1.5">
              <li>
                <Link href="/listings" className="hover:text-white transition-colors">
                  All Classifieds
                </Link>
              </li>
              <li>
                <Link href="/listings/create" className="hover:text-white transition-colors">
                  Post a Free Ad
                </Link>
              </li>
              <li>
                <Link href="/swaps" className="hover:text-white transition-colors">
                  Direct Device Barter
                </Link>
              </li>
              <li>
                <Link href="/swaps" className="hover:text-white transition-colors">
                  Circular 3-Way Loops
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2">
            <h5 className="font-black uppercase tracking-wider text-white text-[11px]">
              Top Categories
            </h5>
            <ul className="space-y-1.5">
              <li>
                <Link href="/listings?category=smartphones" className="hover:text-white transition-colors">
                  Phones &amp; Tablets
                </Link>
              </li>
              <li>
                <Link href="/listings?category=laptops" className="hover:text-white transition-colors">
                  Laptops &amp; Computers
                </Link>
              </li>
              <li>
                <Link href="/listings?category=vehicles" className="hover:text-white transition-colors">
                  Cars, Motorcycles &amp; Parts
                </Link>
              </li>
              <li>
                <Link href="/listings?category=furniture" className="hover:text-white transition-colors">
                  Home Furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Trust */}
          <div className="space-y-2">
            <h5 className="font-black uppercase tracking-wider text-white text-[11px]">
              Customer Care
            </h5>
            <ul className="space-y-1.5">
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  Safety Tips &amp; Rules
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Sebez Market
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Dashboard &amp; Wallet
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Safe Trading Across Ethiopia */}
          <div className="space-y-2.5 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <h5 className="font-black uppercase tracking-wider text-amber-400 text-[11px] flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>Nationwide Safe Meetups</span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Always inspect devices in daylight at public bank branches (Commercial Bank of Ethiopia) or commercial landmarks across your city.
            </p>
            <Link
              href="/safety"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Read Safety Guidelines &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="border-t border-slate-800 mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>
            <strong className="text-slate-200">Sebez Market (ሰበዝ ማርኬት)</strong> &copy; {new Date().getFullYear()} — Ethiopia&apos;s National Peer-to-Peer Marketplace.
          </div>
          <div className="text-[11px] text-slate-500">
            Direct buyer-to-seller classifieds &amp; circular device barter exchange
          </div>
        </div>
      </div>
    </footer>
  );
}
