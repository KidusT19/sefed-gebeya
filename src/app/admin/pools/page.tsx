"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  ShieldCheck,
  Users,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AdminLandmarksPage() {
  const [landmarks, setLandmarks] = useState([
    {
      id: "HUB-1",
      name: "Posta Bet Commercial Square",
      kebele: "Posta Bet / Downtown",
      spotType: "Bank Branch Frontage & Main Post Office",
      dealsCompleted: 142,
      activeToday: 14,
      safetyScore: 99,
      status: "ACTIVE",
    },
    {
      id: "HUB-2",
      name: "Arada Electronics Center",
      kebele: "Arada Market",
      spotType: "Wholesale Electronics Lane, 2nd Floor",
      dealsCompleted: 284,
      activeToday: 22,
      safetyScore: 98,
      status: "ACTIVE",
    },
    {
      id: "HUB-3",
      name: "Bole Commercial Gate",
      kebele: "Bole Kebele",
      spotType: "Bole High School Main Junction & Shops",
      dealsCompleted: 98,
      activeToday: 9,
      safetyScore: 96,
      status: "ACTIVE",
    },
    {
      id: "HUB-4",
      name: "Kebele 04 Stadium Hub",
      kebele: "Kebele 04",
      spotType: "Stadium Frontage & Geda Hospital Gate",
      dealsCompleted: 67,
      activeToday: 6,
      safetyScore: 97,
      status: "ACTIVE",
    },
  ]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-700/50">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Adama Community Infrastructure
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Safe Meetup Landmarks &amp; Trade Hubs
          </h1>
          <p className="text-xs text-[#a89078]">
            Manage designated public landmark meeting spots for direct buyer-to-seller handovers
          </p>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-2 rounded-xl bg-[#2a1a0f] hover:bg-[#382416] text-[#c2ab94] hover:text-white font-bold text-xs border border-[#442c1c] transition-colors"
        >
          &larr; Back to Command Center
        </Link>
      </div>

      {/* Landmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {landmarks.map((hub) => (
          <div key={hub.id} className="bg-[#24170f] p-5 rounded-2xl border border-[#3a271a] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-blue-400 font-bold block">{hub.id}</span>
                <h3 className="font-black text-base text-white mt-0.5">{hub.name}</h3>
                <span className="text-xs text-[#c2ab94]">{hub.kebele} &bull; {hub.spotType}</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                {hub.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#3a271a] text-center text-xs">
              <div className="p-2 rounded-xl bg-[#1b110a]">
                <div className="text-[10px] text-[#8c6b51]">Deals Today</div>
                <div className="font-black text-white mt-0.5">{hub.activeToday}</div>
              </div>
              <div className="p-2 rounded-xl bg-[#1b110a]">
                <div className="text-[10px] text-[#8c6b51]">Total Deals</div>
                <div className="font-black text-blue-300 mt-0.5">{hub.dealsCompleted}</div>
              </div>
              <div className="p-2 rounded-xl bg-[#1b110a]">
                <div className="text-[10px] text-[#8c6b51]">Trust Score</div>
                <div className="font-black text-emerald-400 mt-0.5">{hub.safetyScore}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
