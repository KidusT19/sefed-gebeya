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
      iconColor: "text-emerald-700",
      bgColor: "bg-emerald-100",
      title: "Secure Payment",
      description: "Shop with confidence",
      badge: "Telebirr & CBE",
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
      iconColor: "text-emerald-700",
      bgColor: "bg-emerald-100",
      title: "Best Quality",
      description: "Only the best for you",
      badge: "100% Genuine",
    },
    {
      icon: Headphones,
      iconColor: "text-emerald-700",
      bgColor: "bg-emerald-100",
      title: "24/7 Support",
      description: "We're here to help",
      badge: "Hotline 8082",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-4 sm:p-6 transition-all hover:shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx > 0 ? "pt-3 sm:pt-0 sm:pl-6" : ""
                } group cursor-default`}
              >
                {/* Pillar Icon with Round Badge */}
                <div
                  className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* Text Labels */}
                <div className="min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
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
