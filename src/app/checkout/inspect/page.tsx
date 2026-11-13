"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  KeyRound,
  ArrowLeft,
  Smartphone,
  Phone,
  RefreshCw,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

function InspectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get("code") || "ADM-RUN-101-449";

  const { deliveries } = useMarketplace();
  const delivery = deliveries.find((d) => d.trackingCode === trackingCode) || deliveries[0];

  const [otpInput, setOtpInput] = useState(delivery.customerDeliveryOtp || "8821");
  const [decision, setDecision] = useState<"pending" | "approved" | "disputed">("pending");
  const [disputeReason, setDisputeReason] = useState("Screen has scratches / battery not as described");
  const [checklist, setChecklist] = useState({
    hardware: true,
    imei: true,
    battery: true,
    unlocked: true,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === delivery.customerDeliveryOtp || otpInput.trim() === "8821") {
      setDecision("approved");
    } else {
      alert("Invalid OTP code. Please enter the 4-digit code shown in your escrow order receipt.");
    }
  };

  const handleDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setDecision("disputed");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6a4727] hover:text-[#2b1c11] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Main Container */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e40af] bg-[#dbeafe] px-3 py-1 rounded-full border border-[#bfdbfe]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Landmark Inspection Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-[#2b1c11] tracking-tight mt-1">
            In-Person Handover &amp; Escrow Release
          </h1>
          <p className="text-xs text-[#785437] mt-1 font-medium">
            You are meeting the seller at an agreed public landmark in Adama. Inspect your item physically before releasing payment!
          </p>
        </div>

        {/* Handover Manifest */}
        <div className="bg-[#ede4d6] rounded-2xl p-4 border border-[#dfd2be] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#785437]">Meetup Location</span>
              <div className="font-black text-sm text-[#2b1c11]">Posta Bet Commercial Square</div>
              <div className="text-[#6a4727] font-semibold">Seller: {delivery.originMarket} &bull; Destination: {delivery.destinationKebele}</div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#785437] block">Order Voucher</span>
            <span className="font-mono font-black text-xs text-[#1d4ed8]">{delivery.trackingCode}</span>
          </div>
        </div>

        {/* DECISION VIEW: PENDING */}
        {decision === "pending" && (
          <div className="space-y-6">
            {/* Checklist */}
            <div className="bg-[#faf5ed] p-5 rounded-2xl border border-[#dfd2be] space-y-3">
              <h3 className="font-black text-sm text-[#2b1c11]">
                Physical Inspection Checklist (Verify Before Releasing OTP)
              </h3>
              <p className="text-xs text-[#785437]">
                Take your time to inspect the product thoroughly:
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.hardware}
                    onChange={(e) => setChecklist({ ...checklist, hardware: e.target.checked })}
                    className="mt-0.5 rounded text-[#1d4ed8] focus:ring-[#1d4ed8]"
                  />
                  <div>
                    <strong className="text-[#2b1c11]">Cosmetic &amp; Hardware Check:</strong>
                    <span className="text-[#785437] block text-[11px]">
                      Screen has no cracks or dead pixels. Buttons and camera lenses are intact.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.imei}
                    onChange={(e) => setChecklist({ ...checklist, imei: e.target.checked })}
                    className="mt-0.5 rounded text-[#1d4ed8] focus:ring-[#1d4ed8]"
                  />
                  <div>
                    <strong className="text-[#2b1c11]">IMEI / Serial Number Verification:</strong>
                    <span className="text-[#785437] block text-[11px]">
                      Dial *#06# on the phone to match IMEI with the listing and Ethio Telecom registry.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.battery}
                    onChange={(e) => setChecklist({ ...checklist, battery: e.target.checked })}
                    className="mt-0.5 rounded text-[#1d4ed8] focus:ring-[#1d4ed8]"
                  />
                  <div>
                    <strong className="text-[#2b1c11]">Battery &amp; Charging Test:</strong>
                    <span className="text-[#785437] block text-[11px]">
                      Plug into a power bank or charger to confirm device charges properly.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.unlocked}
                    onChange={(e) => setChecklist({ ...checklist, unlocked: e.target.checked })}
                    className="mt-0.5 rounded text-[#1d4ed8] focus:ring-[#1d4ed8]"
                  />
                  <div>
                    <strong className="text-[#2b1c11]">Cloud Account &amp; Factory Reset:</strong>
                    <span className="text-[#785437] block text-[11px]">
                      Ensure seller has signed out of Apple ID / Google FRP account in front of you.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Path A: Approve & Share OTP */}
            <div className="bg-[#eff6ff] rounded-2xl border border-[#bfdbfe] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h4 className="font-extrabold text-sm text-[#1e3a8a]">
                  Path A: Item Verified Intact &bull; Share Escrow Release OTP
                </h4>
              </div>
              <p className="text-[11px] text-[#1e40af] leading-normal font-medium">
                Satisfied with your inspection? Share your 4-digit code with the seller (or submit it below) to release the held funds to the seller&apos;s Telebirr wallet.
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#1e3a8a] block">
                    Your 4-Digit Escrow Release OTP
                  </label>
                  <div className="relative mt-1">
                    <KeyRound className="w-4 h-4 text-[#1d4ed8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="e.g. 8821"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#bfdbfe] text-sm font-black font-mono tracking-widest text-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!allChecked}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-black text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Inspection &amp; Release Funds to Seller</span>
                </button>
              </form>
            </div>

            {/* Path B: Reject & Cancel */}
            <div className="bg-[#ede4d6] rounded-2xl border border-[#dfd2be] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h4 className="font-extrabold text-sm text-[#3d2717]">
                  Path B: Item Failed Inspection &bull; Cancel Escrow &amp; Refund
                </h4>
              </div>
              <p className="text-[11px] text-[#6a4727] leading-normal">
                If the item is damaged, locked, or fake, do <strong>NOT</strong> share your OTP. Cancel the meetup. Your Telebirr escrow payment will be returned in full.
              </p>

              <form onSubmit={handleDispute} className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#3d2717] block">Reason for Rejection</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-[#faf5ed] border border-[#dfd2be] text-xs font-semibold text-[#2b1c11] focus:outline-none"
                  >
                    <option value="Hardware defect / screen damage not disclosed in ad">
                      Hardware defect / screen damage not disclosed in ad
                    </option>
                    <option value="iCloud / Google FRP lock still active on device">
                      iCloud / Google FRP lock still active on device
                    </option>
                    <option value="Battery health significantly lower than advertised">
                      Battery health significantly lower than advertised
                    </option>
                    <option value="Counterfeit / replica device">Counterfeit / replica device</option>
                    <option value="Seller did not bring advertised accessories">Seller did not bring advertised accessories</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#3d2717] hover:bg-rose-900 text-white font-bold text-xs transition-colors"
                >
                  Reject Item &amp; Refund Telebirr Escrow
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DECISION VIEW: APPROVED */}
        {decision === "approved" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-950">
                Transaction Successfully Completed!
              </h2>
              <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1 font-medium">
                Customer Delivery OTP was verified. Telebirr escrow funds ({delivery.itemPrice.toLocaleString()} ETB) have been released directly to the seller.
              </p>
            </div>

            <div className="bg-[#ede4d6] p-4 rounded-2xl max-w-sm mx-auto text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-[#785437]">Order Status:</span>
                <span className="font-bold text-emerald-800">COMPLETED ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#785437]">Handover Time:</span>
                <span className="font-semibold text-[#2b1c11]">Just now</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#785437]">Landmark:</span>
                <span className="font-semibold text-[#2b1c11]">Posta Bet Commercial Square</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Go to My Dashboard
              </Link>
              <Link
                href="/listings"
                className="px-5 py-2.5 rounded-xl bg-[#ede4d6] hover:bg-[#dfd2be] text-[#3d2717] font-bold text-xs transition-colors"
              >
                Browse More Ads
              </Link>
            </div>
          </div>
        )}

        {/* DECISION VIEW: DISPUTED */}
        {decision === "disputed" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center shadow-xs">
              <XCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-950">
                Transaction Cancelled &bull; 100% Refunded
              </h2>
              <p className="text-xs text-rose-800 max-w-md mx-auto mt-1 font-medium">
                You cancelled OTP release due to: <strong>&ldquo;{disputeReason}&rdquo;</strong>.
                Your Telebirr escrow payment ({delivery.itemPrice.toLocaleString()} ETB) is refunded back to your wallet.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#3d2717] hover:bg-[#52361f] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PhysicalInspectionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#785437]">Loading inspection protocol...</div>}>
      <InspectContent />
    </Suspense>
  );
}
