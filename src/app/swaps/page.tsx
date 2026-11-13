"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_CIRCULAR_CYCLES } from "@/data/mockData";
import {
  Repeat,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Info,
  RefreshCw,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function CircularSwapsPage() {
  const [cycle, setCycle] = useState(MOCK_CIRCULAR_CYCLES[0]);
  const [hasUserApproved, setHasUserApproved] = useState(false);
  const [simStep, setSimStep] = useState(1);

  const handleApprove = () => {
    setHasUserApproved(true);
    setCycle((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node, idx) => (idx === 2 ? { ...node, hasApproved: true } : node)),
    }));
  };

  const allApproved = cycle.nodes.every((n) => n.hasApproved);

  const routeSteps = [
    {
      step: 1,
      kebele: "Posta Bet",
      title: "Handover 1: Posta Bet Commercial Square",
      action: "Henok presents iPhone 13 Pro (55,000 ETB) for Dawit to inspect.",
      cashSettlement: "Henok deposits +13,000 ETB into escrow for upcoming Dell XPS upgrade.",
      status: "INSPECTION VERIFIED",
    },
    {
      step: 2,
      kebele: "Arada Market",
      title: "Handover 2: Arada Electronics Hub",
      action: "Dawit accepts iPhone 13 Pro and hands over Dell XPS 13 (68,000 ETB) to Yonas.",
      cashSettlement: "Dawit receives +13,000 ETB cash top-up credited to Telebirr wallet.",
      status: "SWAP COMPLETED",
    },
    {
      step: 3,
      kebele: "Bole Gate",
      title: "Handover 3: Bole Commercial Gate",
      action: "Yonas hands over Sony Alpha Camera (62,000 ETB) to Henok and receives Dell XPS 13.",
      cashSettlement: "Yonas settles cash difference. All 3 devices verified intact in person.",
      status: "DEAL VERIFIED",
    },
    {
      step: 4,
      kebele: "Loop Closed",
      title: "Handover 4: Unbroken Circle Completion",
      action: "All 3 traders complete physical handover with zero middleman fees.",
      cashSettlement: "Total net cash differences sum to 0 ETB. All 3 traders received upgrades!",
      status: "ALL TRANSACTIONS SETTLED",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner in Clean Modern Slate */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <Repeat className="w-3.5 h-3.5 text-blue-600" />
          Multi-Party Swap Matching Engine &bull; መላው ኢትዮጵያ
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          3-Way Circular Trade Matching Across Ethiopia
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
          When Person 1 has what Person 2 wants, Person 2 has what Person 3 wants, and Person 3 has what Person 1 wants,
          our algorithm connects them into an unbroken trade loop!
        </p>
      </div>

      {/* Active Matched Loop Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                Loop #{cycle.id}
              </span>
              <span className="text-xs text-slate-500">{cycle.estimatedDate}</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Active 3-Party Trade Chain
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                allApproved
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {allApproved ? "Loop Ready for Handover" : "2 of 3 Traders Approved"}
            </span>
          </div>
        </div>

        {/* 3-Party Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {cycle.nodes.map((node, index) => {
            const nextNode = cycle.nodes[(index + 1) % cycle.nodes.length];
            return (
              <div
                key={node.userId}
                className="bg-[#ede4d6] rounded-2xl border border-[#dfd2be] p-5 flex flex-col justify-between space-y-4 relative"
              >
                {/* Node Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a4727]">
                      Trader {index + 1}
                    </span>
                    <h3 className="font-bold text-sm text-[#2b1c11]">{node.userName}</h3>
                    <span className="text-[11px] text-[#785437]">{node.userKebele}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      node.hasApproved
                        ? "bg-[#dbeafe] text-[#1e40af]"
                        : "bg-[#dfd2be] text-[#52361f]"
                    }`}
                  >
                    {node.hasApproved ? "Approved ✓" : "Pending"}
                  </span>
                </div>

                {/* Offering */}
                <div className="bg-[#faf5ed] p-3 rounded-xl border border-[#dfd2be] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#8d7159] uppercase">Gives</span>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={node.offeringItem.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-[#dfd2be]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2b1c11] line-clamp-1">
                        {node.offeringItem.title}
                      </div>
                      <div className="text-[11px] text-[#785437]">
                        Value: {node.offeringItem.value.toLocaleString()} ETB
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direction */}
                <div className="text-center py-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e40af] bg-[#dbeafe] px-2.5 py-1 rounded-full border border-[#bfdbfe]">
                    <span>Trades with {nextNode.userName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Receiving */}
                <div className="bg-[#faf5ed] p-3 rounded-xl border border-[#dfd2be] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#8d7159] uppercase">Receives</span>
                  <div>
                    <div className="font-bold text-xs text-[#2b1c11] line-clamp-1">
                      {node.receivingItem.title}
                    </div>
                    <div className="text-[11px] text-[#785437]">
                      Value: {node.receivingItem.value.toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                {/* Cash adjustment */}
                <div className="p-2.5 rounded-xl bg-[#faf5ed] border border-[#dfd2be] text-xs flex items-center justify-between font-medium">
                  <span className="text-[#785437]">Cash Top-Up:</span>
                  <span
                    className={`font-black ${
                      node.cashTopUpAdjustment > 0
                        ? "text-[#1d4ed8]"
                        : node.cashTopUpAdjustment < 0
                        ? "text-[#845e32]"
                        : "text-[#2b1c11]"
                    }`}
                  >
                    {node.cashTopUpAdjustment > 0
                      ? `+${node.cashTopUpAdjustment.toLocaleString()} ETB (Receives)`
                      : node.cashTopUpAdjustment < 0
                      ? `${node.cashTopUpAdjustment.toLocaleString()} ETB (Pays)`
                      : "Even Swap"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Panel for Logged-In User */}
        <div className="bg-[#eee4d5] border border-[#dfd2be] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-sm text-[#2b1c11]">
              You are Trader 3 (Dawit B. - Arada Kebele)
            </h4>
            <p className="text-xs text-[#6a4727] font-medium">
              You trade your <strong>Dell XPS 13</strong>, receive an <strong>iPhone 13 Pro</strong>, and collect{" "}
              <strong className="text-[#1d4ed8] font-bold">+13,000 ETB cash top-up</strong> held in escrow!
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!hasUserApproved ? (
              <button
                onClick={handleApprove}
                className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-blue-200" />
                Approve &amp; Lock My Leg
              </button>
            ) : (
              <div className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#1e40af] text-white font-bold text-xs flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                You Approved! Waiting on Courier
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE MEETUP & HANDOVER STEPPER */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-sm text-slate-900">
                Nationwide In-Person Exchange Protocol (Landmark Meetups)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              4-Step Handover Loop
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Click through the handovers to see how 3 traders meet at central public landmarks or CBE bank branches to complete the cycle:
          </p>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {routeSteps.map((r) => (
              <button
                key={r.step}
                type="button"
                onClick={() => setSimStep(r.step)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  simStep === r.step
                    ? "bg-[#faf5ed] border-[#1d4ed8] shadow-xs ring-2 ring-[#1d4ed8]"
                    : "bg-[#faf5ed]/60 border-[#dfd2be] hover:bg-[#faf5ed]"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-[#785437]">
                  <span>Step {r.step}</span>
                  <span className={simStep === r.step ? "text-[#1d4ed8]" : ""}>●</span>
                </div>
                <div className="font-black text-xs text-[#2b1c11] mt-0.5 truncate">{r.kebele}</div>
              </button>
            ))}
          </div>

          {/* Active Stop Detail Card */}
          <div className="bg-[#faf5ed] rounded-xl border border-[#dfd2be] p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-xs text-[#2b1c11]">
                {routeSteps[simStep - 1].title}
              </h4>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {routeSteps[simStep - 1].status}
              </span>
            </div>
            <p className="text-xs text-[#52361f] font-medium">
              {routeSteps[simStep - 1].action}
            </p>
            <div className="text-[11px] text-[#1d4ed8] font-bold bg-[#eff6ff] p-2 rounded-lg border border-[#bfdbfe]">
              💰 Financial Settlement: {routeSteps[simStep - 1].cashSettlement}
            </div>
          </div>
        </div>

        {/* Direct In-Person Verification Box */}
        <div className="p-4 rounded-xl bg-[#ede4d6] border border-[#dfd2be] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#52361f]">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <div>
              <span className="font-bold text-[#2b1c11]">Central Meeting Landmark:</span>
              <span className="ml-1 text-[#6a4727] font-semibold">Posta Bet Commercial Square &bull; Commercial Bank Branch</span>
            </div>
          </div>
          <Link
            href="/safety"
            className="text-xs font-bold text-[#1d4ed8] hover:underline whitespace-nowrap"
          >
            Read Meetup Safety Guide &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
