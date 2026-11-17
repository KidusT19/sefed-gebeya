"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Repeat, ArrowLeftRight, ShieldCheck, CheckCircle, ArrowLeft, MapPin, AlertCircle, Phone, MessageSquare } from "lucide-react";

export default function TradeDealRoomPage() {
  const router = useRouter();
  const params = useParams();
  const tradeId = (params?.id as string) || "deal-701";

  const { listings } = useMarketplace();
  const targetItem = listings[0];
  const offeredItem = listings[1] || listings[0];

  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "IN_ESCROW">("PENDING");
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterInput, setCounterInput] = useState("0");

  const handleAccept = () => {
    setStatus("ACCEPTED");
    setTimeout(() => {
      if (targetItem) {
        router.push(`/checkout/escrow?listing=${targetItem.id}&topup=${topUpAmount}`);
      }
    }, 1500);
  };

  const handleCounter = (e: React.FormEvent) => {
    e.preventDefault();
    setTopUpAmount(Number(counterInput));
    setShowCounterModal(false);
  };

  if (!targetItem || !offeredItem) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No Active Deal Room Found</h2>
        <p className="text-xs text-slate-500">
          There is currently no active bilateral trade proposal matching this ID.
        </p>
        <Link href="/dashboard?tab=trades" className="inline-block px-5 py-2.5 bg-[#0f172a] text-white text-xs font-bold rounded-full">
          Back to Barter Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/swaps" className="inline-flex items-center gap-1 text-xs text-[#785437] hover:text-[#1d4ed8] font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Swap Deals
        </Link>
        <span className="text-xs font-bold text-[#1e40af] bg-[#dbeafe] px-2.5 py-1 rounded-full border border-[#bfdbfe]">
          Deal Room #{tradeId}
        </span>
      </div>

      <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#dfd2be]">
          <div>
            <h1 className="text-2xl font-black text-[#2b1c11] tracking-tight">
              Bilateral Swap Negotiation
            </h1>
            <p className="text-xs text-[#785437] mt-0.5">
              Review and agree on device exchange terms with {targetItem.seller.name}
            </p>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              status === "ACCEPTED"
                ? "bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]"
                : "bg-[#ede4d6] text-[#6a4727] border border-[#dfd2be]"
            }`}
          >
            {status === "ACCEPTED" ? "Terms Agreed & Proceeding" : "Offer Pending Review"}
          </span>
        </div>

        {/* Both Items Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* Item 1 */}
          <div className="md:col-span-5 p-4 rounded-xl border border-[#dfd2be] bg-[#ede4d6] space-y-2">
            <span className="text-[10px] font-bold text-[#785437] uppercase tracking-wider block">
              Offered Device
            </span>
            <div className="flex items-center gap-3">
              <img
                src={offeredItem.images[0]}
                alt=""
                className="w-14 h-14 rounded-xl object-cover border border-[#dfd2be] flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-xs text-[#2b1c11] line-clamp-1">{offeredItem.title}</h3>
                <div className="text-xs font-black text-[#1d4ed8] mt-0.5">
                  Value: {offeredItem.price.toLocaleString()} ETB
                </div>
                <div className="text-[10px] text-[#785437]">
                  Owner: Dawit B. (Kebele 04)
                </div>
              </div>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="md:col-span-1 flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-xs">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* Item 2 */}
          <div className="md:col-span-5 p-4 rounded-xl border border-[#dfd2be] bg-[#ede4d6] space-y-2">
            <span className="text-[10px] font-bold text-[#785437] uppercase tracking-wider block">
              Requested Device
            </span>
            <div className="flex items-center gap-3">
              <img
                src={targetItem.images[0]}
                alt=""
                className="w-14 h-14 rounded-xl object-cover border border-[#dfd2be] flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-xs text-[#2b1c11] line-clamp-1">{targetItem.title}</h3>
                <div className="text-xs font-black text-[#1d4ed8] mt-0.5">
                  Value: {targetItem.price.toLocaleString()} ETB
                </div>
                <div className="text-[10px] text-[#785437]">
                  Owner: {targetItem.seller.name} (Bole)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreed Terms Box */}
        <div className="bg-[#ede4d6] p-5 rounded-2xl border border-[#dfd2be] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#2b1c11]">Current Cash Top-Up Difference:</span>
            <span className="text-base font-black text-[#1d4ed8]">
              +{topUpAmount.toLocaleString()} ETB
            </span>
          </div>
          <p className="text-[11px] text-[#785437] leading-relaxed">
            Dawit B. pays <strong>{topUpAmount.toLocaleString()} ETB</strong> in cash top-up to {targetItem.seller.name} to balance the difference between both devices. Funds are held in Telebirr escrow until in-person inspection and OTP release.
          </p>

          <div className="border-t border-[#dfd2be] pt-3 flex items-center gap-2 text-xs text-[#52361f]">
            <MapPin className="w-4 h-4 text-[#1d4ed8] flex-shrink-0" />
            <span>
              Meetup Landmark: <strong>Posta Bet Commercial Square</strong> &bull; Direct Handover (0 ETB Fee)
            </span>
          </div>
        </div>

        {/* Counter Offer Modal */}
        {showCounterModal && (
          <form onSubmit={handleCounter} className="p-4 rounded-xl bg-[#eee4d5] border border-[#d2ba92] space-y-3">
            <label className="text-xs font-bold text-[#2b1c11] block">
              Propose New Top-Up Amount (ETB)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#faf5ed] border border-[#d2ba92] text-xs font-bold text-[#2b1c11] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#1d4ed8] text-white font-bold text-xs"
              >
                Send Counter
              </button>
              <button
                type="button"
                onClick={() => setShowCounterModal(false)}
                className="px-3 py-2 rounded-lg bg-[#faf5ed] text-[#52361f] font-semibold text-xs border border-[#dfd2be]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Negotiation Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={handleAccept}
            className="w-full py-3 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Accept Deal & Lock Escrow
          </button>

          <button
            onClick={() => setShowCounterModal(true)}
            className="w-full py-3 rounded-xl bg-[#eee4d5] hover:bg-[#e4d6c2] text-[#3d2717] font-bold text-xs border border-[#dfd2be] transition-colors"
          >
            Counter-Offer Top-Up
          </button>

          <Link
            href={`/messages?listing=${targetItem.id}`}
            className="w-full py-3 rounded-xl bg-[#faf5ed] hover:bg-[#eee4d5] text-[#785437] font-bold text-xs border border-[#dfd2be] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Seller
          </Link>
        </div>
      </div>
    </div>
  );
}
