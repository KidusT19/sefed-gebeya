"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MOCK_LISTINGS } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Lock,
  Smartphone,
  CreditCard,
  KeyRound,
  FileText,
  Eye,
  ArrowRight,
  MapPin,
  Phone,
} from "lucide-react";

function EscrowCheckoutContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listing") || "lst-1";

  const { currentUser } = useMarketplace();

  const listing = MOCK_LISTINGS.find((l) => l.id === listingId) || MOCK_LISTINGS[0];

  const [paymentProvider, setPaymentProvider] = useState<"TELEBIRR" | "CBE_BIRR">("TELEBIRR");
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || "+251911448822");
  const [meetupLocation, setMeetupLocation] = useState(`${listing.kebele} Public Landmark`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Escrow Release OTP generated upon deposit
  const [releaseOtp, setReleaseOtp] = useState("8492");

  const totalAmount = listing.price;

  const handlePayEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setReleaseOtp(Math.floor(1000 + Math.random() * 9000).toString());
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Back Link */}
      <Link
        href={`/listings/${listing.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6a4727] hover:text-[#1d4ed8] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Product Listing</span>
      </Link>

      {/* Main Card */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e40af] bg-[#dbeafe] px-3 py-1 rounded-full border border-[#bfdbfe]">
            <Lock className="w-3.5 h-3.5 text-[#1d4ed8]" />
            Direct Buyer-Seller Escrow Protection
          </div>
          <h1 className="text-2xl font-black text-[#2b1c11] tracking-tight mt-1">
            Telebirr & CBE Escrow Deposit
          </h1>
          <p className="text-xs text-[#785437] mt-1 font-medium">
            Your money is held safely by Sebez Escrow. The seller is paid ONLY after you meet in person, inspect, and test the item!
          </p>
        </div>

        {isPaid ? (
          <div className="space-y-6">
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#1d4ed8] text-white mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#1e3a8a]">Funds Safely Locked in Escrow!</h2>
              <p className="text-xs text-[#2563eb] max-w-md mx-auto font-medium">
                <strong>{totalAmount.toLocaleString()} ETB</strong> has been deducted from your {paymentProvider} wallet and is frozen in platform escrow.
              </p>
            </div>

            {/* Escrow Release OTP Protocol Box */}
            <div className="bg-[#24160c] text-white rounded-2xl p-6 space-y-5 border border-[#3d2717]">
              <div>
                <h3 className="font-extrabold text-sm text-blue-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                  Your 4-Digit Escrow Release OTP
                </h3>
                <p className="text-xs text-[#d8c3ad] mt-1">
                  Keep this OTP private. Share it with <strong>{listing.seller.name}</strong> ONLY after you physically meet and inspect the device.
                </p>
              </div>

              <div className="bg-[#3d2717] p-5 rounded-xl border border-[#52361f] space-y-2 text-center">
                <span className="text-[10px] font-bold text-[#ba9663] uppercase tracking-wider block">
                  Buyer Release Code
                </span>
                <div className="text-3xl font-mono font-black text-amber-300 tracking-widest">
                  {releaseOtp}
                </div>
                <p className="text-[11px] text-[#d8c3ad] max-w-md mx-auto">
                  Give this code to {listing.seller.name} at your in-person meetup in {listing.kebele} once you are fully satisfied with the item.
                </p>
              </div>
            </div>

            {/* Seller Contact & Handover Card */}
            <div className="bg-[#ede4d6] p-4 rounded-xl border border-[#dfd2be] text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#785437] block">
                Seller Contact Information
              </span>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <div className="font-black text-sm text-[#2b1c11]">{listing.seller.name}</div>
                  <div className="text-[#6a4727] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1d4ed8]" />
                    <span>Meetup Location: {listing.kebele}, Adama</span>
                  </div>
                </div>
                <a
                  href={`tel:${listing.seller.phone}`}
                  className="inline-flex items-center gap-1.5 bg-[#1d4ed8] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {listing.seller.phone}</span>
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#dfd2be]">
              <Link
                href="/messages"
                className="text-xs font-bold text-[#6a4727] hover:text-[#1d4ed8]"
              >
                &larr; Message Seller
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#3d2717] text-white font-bold text-xs hover:bg-[#52361f] shadow-xs"
              >
                View in My Dashboard &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayEscrow} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-[#ede4d6] rounded-xl p-4 border border-[#dfd2be] space-y-3">
              <span className="text-xs font-bold text-[#2b1c11] block uppercase tracking-wide">
                Direct Purchase Summary
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#52361f]">{listing.title}</span>
                <span className="font-black text-[#2b1c11]">{listing.price.toLocaleString()} ETB</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#52361f] font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1d4ed8]" />
                  <span>Direct Handover in {listing.kebele}</span>
                </span>
                <span className="font-bold text-emerald-700">In-Person Meetup</span>
              </div>

              <div className="border-t border-[#dfd2be] pt-2 flex items-center justify-between text-sm">
                <span className="font-black text-[#2b1c11]">Total Escrow Hold:</span>
                <span className="font-black text-lg text-[#1d4ed8]">
                  {totalAmount.toLocaleString()} ETB
                </span>
              </div>
            </div>

            {/* Meetup Agreement */}
            <div className="bg-[#eff6ff] p-4 rounded-xl border border-[#bfdbfe] space-y-3">
              <span className="text-xs font-bold text-[#1e3a8a] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1d4ed8]" /> Handover Location in Adama
              </span>
              <div>
                <label className="text-[11px] font-bold text-[#1e40af] block">
                  Agreed Public Landmark (e.g. Posta Bet, Arada Market, Cafe)
                </label>
                <input
                  type="text"
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  required
                  placeholder="e.g. Posta Bet Gate, Arada Market, Bole High School"
                  className="w-full mt-1 p-2 rounded-lg bg-[#faf5ed] border border-[#bfdbfe] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#2b1c11] block uppercase tracking-wide">
                Select Mobile Wallet for Escrow Hold
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentProvider("TELEBIRR")}
                  className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    paymentProvider === "TELEBIRR"
                      ? "bg-[#1d4ed8] text-white border-[#1d4ed8] shadow-xs"
                      : "bg-[#faf5ed] border-[#dfd2be] text-[#3d2717] hover:border-[#1d4ed8]"
                  }`}
                >
                  <Smartphone className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-black text-xs">Telebirr SuperApp</div>
                    <div
                      className={`text-[10px] ${
                        paymentProvider === "TELEBIRR" ? "text-blue-100" : "text-[#785437]"
                      }`}
                    >
                      Instant USSD or In-App prompt
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentProvider("CBE_BIRR")}
                  className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    paymentProvider === "CBE_BIRR"
                      ? "bg-[#1d4ed8] text-white border-[#1d4ed8] shadow-xs"
                      : "bg-[#faf5ed] border-[#dfd2be] text-[#3d2717] hover:border-[#1d4ed8]"
                  }`}
                >
                  <CreditCard className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-black text-xs">CBE Birr / Commercial Bank</div>
                    <div
                      className={`text-[10px] ${
                        paymentProvider === "CBE_BIRR" ? "text-blue-100" : "text-[#785437]"
                      }`}
                    >
                      CBE Mobile Banking
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Wallet Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2b1c11] block">
                {paymentProvider === "TELEBIRR" ? "Telebirr Registered Phone" : "CBE Account Phone"}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4ece1] border border-[#d2ba92] text-xs text-[#2b1c11] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-extrabold text-sm transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span>Locking Escrow Deposit...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize Escrow Deposit ({totalAmount.toLocaleString()} ETB)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function EscrowCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-[#785437]">Loading Escrow...</div>}>
      <EscrowCheckoutContent />
    </Suspense>
  );
}
