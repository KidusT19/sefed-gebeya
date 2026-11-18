import React from "react";
import { ShieldCheck, Truck, Award, Headphones } from "lucide-react";

/**
 * SefedTrustBar
 * 4 Pillars of Confidence as seen directly on the Sefed Market mockup:
 * - Secure Payment
 * - Fast Delivery
 * - Best Quality
 * - 24/7 Support
 */
export default function SefedTrustBar() {
  const pillars = [
    {
      icon: ShieldCheck,
      iconColor: "text-[#0f172a]",
      bgColor: "bg-slate-100",
      title: "Direct Deals",
      description: "Zero platform fees",
      badge: "100% Free P2P",
    },
    {
      icon: Truck,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      title: "Fast Delivery",
      description: "Get your orders quickly",
      badge: "Nationwide",
    },
    {
      icon: Award,
      iconColor: "text-[#0f172a]",
      bgColor: "bg-slate-100",
      title: "Best Quality",
      description: "Only the best for you",
      badge: "100% Genuine",
    },
    {
      icon: Headphones,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      title: "24/7 Support",
      description: "We're here to help",
      badge: "Hotline 8082",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-slate-200/50 border border-slate-200/80 p-3 sm:p-6 transition-all hover:shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6 sm:divide-x divide-slate-100">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 sm:gap-3.5 p-2 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent ${
                  idx > 0 ? "sm:pl-6" : ""
                } group cursor-default`}
              >
                {/* Pillar Icon with Round Badge */}
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>

                {/* Text Labels */}
                <div className="min-w-0">
                  <h3 className="font-extrabold text-[11px] sm:text-sm text-slate-900 tracking-tight group-hover:text-[#0f172a] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
