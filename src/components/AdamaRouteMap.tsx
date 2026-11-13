"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface KebeleHub {
  id: string;
  name: string;
  nameAm: string;
  type: "commercial" | "residential" | "mixed";
  x: number;
  y: number;
  activeAdsCount: number;
  landmark: string;
  description: string;
}

const HUBS: KebeleHub[] = [
  {
    id: "addis-ababa",
    name: "Addis Ababa",
    nameAm: "አዲስ አበባ (ቦሌ እና ፒያሳ)",
    type: "commercial",
    x: 48,
    y: 38,
    activeAdsCount: 42,
    landmark: "Edna Mall, Mexico CBE Branch & Piassa Post Office",
    description: "The capital's central commercial and tech district. High-volume in-person exchange for smartphones, laptops, and electronics.",
  },
  {
    id: "adama",
    name: "Adama / Nazret",
    nameAm: "አዳማ (ፖስታ ቤት እና አራዳ)",
    type: "commercial",
    x: 58,
    y: 48,
    activeAdsCount: 24,
    landmark: "Posta Bet CBE Main Branch & Arada Market",
    description: "Central rift valley transportation crossroads. Bustling marketplace for phones, home appliances, and vehicle barter.",
  },
  {
    id: "hawassa",
    name: "Hawassa",
    nameAm: "ሀዋሳ (ፒያሳ)",
    type: "commercial",
    x: 46,
    y: 72,
    activeAdsCount: 18,
    landmark: "Piazza Commercial Area & Lake Tula Bank Row",
    description: "Southern regional economic hub. Active trade for student tech, laptops, and consumer gear.",
  },
  {
    id: "bahir-dar",
    name: "Bahir Dar",
    nameAm: "ባህር ዳር (ቀበሌ 04)",
    type: "commercial",
    x: 32,
    y: 22,
    activeAdsCount: 15,
    landmark: "Felege Hiwot Commercial Gate & Lake Shore Bank Row",
    description: "North-Western trade center. Popular for photography gear, laptops, and home goods.",
  },
  {
    id: "dire-dawa",
    name: "Dire Dawa",
    nameAm: "ድሬዳዋ (ታይዋን እና ከዚራ)",
    type: "commercial",
    x: 78,
    y: 35,
    activeAdsCount: 16,
    landmark: "Taiwan Market Entrance & Kezira Commercial Quarter",
    description: "Eastern trade gateway. Renowned for electronics imports, electric mitad, and direct device swaps.",
  },
  {
    id: "mekelle",
    name: "Mekelle",
    nameAm: "መቐለ (ቀዳማይ ወያነ)",
    type: "commercial",
    x: 42,
    y: 10,
    activeAdsCount: 12,
    landmark: "Kedamay Weyane Mall & Romanat Square",
    description: "Northern commerce hub with strong demand for MacBooks, smartphones, and accessories.",
  },
];

interface AdamaRouteMapProps {
  onSelectKebele?: (kebeleName: string) => void;
}

export default function AdamaRouteMap({ onSelectKebele }: AdamaRouteMapProps = {}) {
  const [selectedHub, setSelectedHub] = useState<KebeleHub>(HUBS[0]);

  const handleSelect = (hub: KebeleHub) => {
    setSelectedHub(hub);
    if (onSelectKebele) {
      onSelectKebele(hub.name.split(" /")[0]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ethiopia Nationwide Hubs &bull; መላው ኢትዮጵያ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Nationwide Safe Meetup Landmarks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any city hub below to explore safe meeting landmarks and active classifieds in that region.
          </p>
        </div>

        <Link
          href="/listings"
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          View all nationwide ads &rarr;
        </Link>
      </div>

      {/* Map Canvas + Hub Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-7 bg-slate-100/80 rounded-2xl border border-slate-200 p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Ethiopian Regional Hubs</span>
            <span className="text-blue-600">● Safe Landmark Points</span>
          </div>

          {/* SVG Map Lines connecting hubs across Ethiopia */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <line x1="48%" y1="38%" x2="58%" y2="48%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="48%" y1="38%" x2="46%" y2="72%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="48%" y1="38%" x2="32%" y2="22%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="48%" y1="38%" x2="78%" y2="35%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
            <line x1="32%" y1="22%" x2="42%" y2="10%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
          </svg>

          {/* Hub Pins on Canvas */}
          <div className="relative w-full h-[240px]" style={{ zIndex: 2 }}>
            {HUBS.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleSelect(hub)}
                  style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all cursor-pointer group flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20 scale-110 z-10"
                      : "bg-white text-slate-900 border border-slate-200 hover:border-blue-500 hover:scale-105 shadow-2xs"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-600"}`} />
                  <span className="text-[11px] font-bold whitespace-nowrap">{hub.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200 relative z-10">
            <span className="font-semibold">In-person handovers at Commercial Bank of Ethiopia (CBE) branches</span>
            <span className="font-bold text-blue-600">0 ETB Broker Fee</span>
          </div>
        </div>

        {/* Selected Hub Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Selected Region
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{selectedHub.name}</h3>
                <span className="text-xs text-slate-500 font-semibold">{selectedHub.nameAm}</span>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                {selectedHub.activeAdsCount} Active Ads
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Recommended Meeting Landmark:</span>
              <p className="text-slate-600 font-medium">{selectedHub.landmark}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedHub.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Public Meeting Zone
            </span>

            <Link
              href={`/listings?city=${encodeURIComponent(selectedHub.name.split(" /")[0])}`}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Explore Ads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
