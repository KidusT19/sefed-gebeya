"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_LISTINGS } from "@/data/mockData";
import { Repeat, ArrowLeftRight, ShieldCheck, CheckCircle, ArrowLeft, MapPin, AlertCircle } from "lucide-react";

function NewTradeOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = searchParams.get("target") || "lst-1";

  const targetListing = MOCK_LISTINGS.find((l) => l.id === targetId) || MOCK_LISTINGS[0];

  const myItems = [
    {
      id: "my-1",
      title: "Samsung Galaxy S21 5G (128GB)",
      estimatedValue: 36000,
      condition: "Good",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "my-2",
      title: "HP Pavilion Gaming Laptop (Core i5, GTX 1650)",
      estimatedValue: 48000,
      condition: "Like New",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const [selectedMyItemId, setSelectedMyItemId] = useState(myItems[0].id);
  const selectedMyItem = myItems.find((i) => i.id === selectedMyItemId) || myItems[0];

  const rawDifference = targetListing.price - selectedMyItem.estimatedValue;

  const [customTopUp, setCustomTopUp] = useState(rawDifference.toString());
  const [meetupLandmark, setMeetupLandmark] = useState("Posta Bet Commercial Square");
  const [proposalNotes, setProposalNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const numericTopUp = Number(customTopUp) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/swaps");
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link href={`/listings/${targetListing.id}`} className="inline-flex items-center gap-1 text-xs text-[#785437] hover:text-[#1d4ed8] font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Item
        </Link>
        <span className="text-xs font-bold text-[#1e40af] bg-[#dbeafe] px-2.5 py-1 rounded-full border border-[#bfdbfe]">
          Bilateral Barter Deal Room
        </span>
      </div>

      <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#2b1c11] tracking-tight flex items-center gap-2">
            <Repeat className="w-6 h-6 text-[#1d4ed8]" />
            Propose 2-Way Device Swap
          </h1>
          <p className="text-xs text-[#785437] mt-1 font-medium">
            Exchange your device with {targetListing.seller.name}. Our dynamic engine calculates the cash top-up difference to ensure fair value.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#dbeafe] text-[#1d4ed8] mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#1e3a8a]">Barter Proposal Sent to Seller!</h2>
            <p className="text-xs text-[#2563eb] max-w-sm mx-auto font-medium">
              {targetListing.seller.name} has been notified via In-App alert and Telegram bot. Once they accept, your exchange room will be activated.
            </p>
            <p className="text-xs text-[#1d4ed8] font-bold animate-pulse">
              Redirecting to your active trade deals...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visual Swap Comparison: Target vs My Device */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
              {/* Target Item */}
              <div className="md:col-span-5 p-4 rounded-xl border border-[#dfd2be] bg-[#ede4d6] space-y-2">
                <span className="text-[10px] font-bold text-[#785437] uppercase tracking-wider block">
                  You Receive (Target Item)
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={targetListing.images[0]}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border border-[#dfd2be] flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-[#2b1c11] line-clamp-1">
                      {targetListing.title}
                    </h3>
                    <div className="text-xs font-black text-[#1d4ed8] mt-0.5">
                      {targetListing.price.toLocaleString()} ETB
                    </div>
                    <div className="text-[10px] text-[#785437]">
                      Seller: {targetListing.seller.name} ({targetListing.kebele})
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

              {/* My Item */}
              <div className="md:col-span-5 p-4 rounded-xl border border-[#dfd2be] bg-[#ede4d6] space-y-2">
                <span className="text-[10px] font-bold text-[#785437] uppercase tracking-wider block">
                  You Give (Your Item)
                </span>
                <select
                  value={selectedMyItemId}
                  onChange={(e) => {
                    setSelectedMyItemId(e.target.value);
                    const item = myItems.find((i) => i.id === e.target.value);
                    if (item) {
                      setCustomTopUp((targetListing.price - item.estimatedValue).toString());
                    }
                  }}
                  className="w-full p-2 rounded-lg bg-[#faf5ed] border border-[#d2ba92] text-xs font-semibold text-[#2b1c11] focus:outline-none"
                >
                  {myItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.estimatedValue.toLocaleString()} ETB)
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#785437]">Your Item Value:</span>
                  <span className="font-bold text-[#2b1c11]">
                    {selectedMyItem.estimatedValue.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Cash Top-Up Balancing Engine (Coffee Brown) */}
            <div className="bg-[#24160c] text-white p-5 rounded-2xl space-y-4 border border-[#3d2717]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-blue-300">
                    Cash Top-Up Difference Calculator
                  </h3>
                  <p className="text-[11px] text-[#d8c3ad] mt-0.5">
                    Item values are balanced with cash top-up held safely in Telebirr escrow
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#a88a6d] block">Benchmark Difference</span>
                  <span className="text-lg font-black text-white">
                    {rawDifference > 0
                      ? `+${rawDifference.toLocaleString()} ETB`
                      : `${rawDifference.toLocaleString()} ETB`}
                  </span>
                </div>
              </div>

              {/* Adjustable Top-Up Input */}
              <div className="bg-[#3d2717] p-4 rounded-xl space-y-2 border border-[#52361f]">
                <label className="text-xs font-bold text-[#faf5ed] block">
                  Proposed Cash Top-Up Amount (ETB)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={customTopUp}
                    onChange={(e) => setCustomTopUp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#24160c] border border-[#52361f] text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                  />
                  <div className="text-xs font-bold text-blue-300 whitespace-nowrap">
                    {numericTopUp > 0 ? "You Pay to Seller" : numericTopUp < 0 ? "Seller Pays You" : "Even Swap"}
                  </div>
                </div>
                <p className="text-[11px] text-[#d8c3ad]">
                  {numericTopUp > 0
                    ? `You are offering your ${selectedMyItem.title} + ${numericTopUp.toLocaleString()} ETB cash in exchange for ${targetListing.title}.`
                    : `You are requesting ${Math.abs(numericTopUp).toLocaleString()} ETB cash from the seller because your item has a higher value.`}
                </p>
              </div>
            </div>

            {/* Proposed Meetup Landmark */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2b1c11] block">
                Proposed Direct Meetup Landmark (Public Bank Branch / Commercial Hub)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  "CBE Main Branch (Edna Mall / Bole / Mexico)",
                  "CBE Posta Bet / Arada Commercial Area",
                  "CBE Piazza / Lake Commercial Center",
                ].map((spot) => (
                  <div
                    key={spot}
                    onClick={() => setMeetupLandmark(spot)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      meetupLandmark === spot
                        ? "border-[#1d4ed8] bg-[#eff6ff] shadow-xs ring-1 ring-[#1d4ed8]"
                        : "border-[#dfd2be] bg-[#faf5ed] hover:bg-[#eee4d5]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#2b1c11]">
                      <MapPin className="w-3.5 h-3.5 text-[#1d4ed8]" />
                      <span>{spot}</span>
                    </div>
                    <p className="text-[10px] text-[#785437] mt-1 font-medium">
                      Public landmark for safe physical device inspection and direct trade.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note to Seller */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2b1c11] block">
                Message to Seller (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. My Samsung S21 is in great condition with charger and case. Ready to complete the deal today."
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-xs focus:bg-[#faf5ed] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
              />
            </div>

            {/* Submit Proposal in Blue */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-extrabold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Repeat className="w-4 h-4" />
              Send Barter Proposal
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function NewTradeOfferPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#785437]">Loading deal room...</div>}>
      <NewTradeOfferContent />
    </Suspense>
  );
}
