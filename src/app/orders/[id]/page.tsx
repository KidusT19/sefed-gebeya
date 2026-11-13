"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  CheckCircle,
  Copy,
  Check,
  ArrowLeft,
  Printer,
  Smartphone,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function OrderReceiptPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "ADM-ESC-101";

  const { deliveries } = useMarketplace();
  const activeDel = deliveries.find((d) => d.trackingCode === orderId) || deliveries[0];

  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6a4727] hover:text-[#2b1c11] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ede4d6] hover:bg-[#dfd2be] text-[#3d2717] font-bold text-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print Voucher
        </button>
      </div>

      {/* Main Voucher Container */}
      <div className="bg-[#faf5ed] rounded-3xl border border-[#dfd2be] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#dfd2be]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-black text-xl text-[#2b1c11] tracking-tight">
                  Sebez<span className="text-[#1d4ed8]">Market</span>
                </h1>
                <span className="text-[10px] text-[#785437] font-semibold block">
                  Official Direct Escrow &amp; Inspection Voucher
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#785437] mt-2">
              Adama Commercial Marketplace &bull; 100% Protected via Telebirr Escrow
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#785437] block">Order Voucher Code</span>
            <span className="font-mono font-black text-base text-[#1d4ed8]">{orderId}</span>
            <span className="text-[11px] text-[#785437] block mt-0.5">
              Status: <strong className="text-emerald-700">ESCROW FUNDED ✓</strong>
            </span>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#785437] block">Buyer</span>
            <div className="font-bold text-[#2b1c11] mt-0.5">Henok Tadesse</div>
            <div className="text-[#6a4727]">{activeDel.destinationKebele}, Adama</div>
            <div className="text-[#785437]">+251 91 144 8822</div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-[#785437] block">Seller &amp; Shop</span>
            <div className="font-bold text-[#2b1c11] mt-0.5">{activeDel.originMarket}</div>
            <div className="text-[#6a4727]">Central Electronics Lane, Adama</div>
            <div className="text-[#785437]">+251 92 277 1133</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-xl border border-[#dfd2be] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ede4d6] text-[#3d2717] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfd2be] bg-[#faf5ed]">
              <tr>
                <td className="p-3">
                  <div className="font-bold text-[#2b1c11]">{activeDel.listingTitle}</div>
                  <div className="text-[10px] text-[#785437]">Held securely in Telebirr Escrow</div>
                </td>
                <td className="p-3 text-right font-black text-[#2b1c11]">
                  {activeDel.itemPrice > 0 ? `${activeDel.itemPrice.toLocaleString()} ETB` : "Barter Swap Item"}
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <div className="font-semibold text-[#2b1c11]">Fulfillment Method</div>
                  <div className="text-[10px] text-[#785437]">
                    Direct In-Person Handover at Adama Landmark (0 ETB middleman fee)
                  </div>
                </td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  FREE (0 ETB)
                </td>
              </tr>
              <tr className="bg-[#ede4d6]/60 font-black">
                <td className="p-3 text-[#2b1c11]">Total Escrow Deposit</td>
                <td className="p-3 text-right text-base text-[#1d4ed8]">
                  {activeDel.itemPrice.toLocaleString()} ETB
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ESCROW RELEASE OTP CARD */}
        <div className="bg-[#eff6ff] rounded-2xl border-2 border-[#bfdbfe] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1d4ed8]" />
            <h4 className="font-black text-sm text-[#1e3a8a]">
              Buyer Escrow Release Code (Keep Private Until Inspection)
            </h4>
          </div>
          <p className="text-[11px] text-[#1e40af] leading-relaxed">
            Give this 4-digit code to the seller <strong>ONLY</strong> after you meet in person, test the device, and verify IMEI and condition.
          </p>

          <div className="bg-[#faf5ed] p-4 rounded-xl border-2 border-emerald-400 max-w-sm">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">
              Inspection Release OTP
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-black text-3xl text-emerald-700 tracking-widest">
                {activeDel.customerDeliveryOtp || "8821"}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(activeDel.customerDeliveryOtp || "8821", "otp")}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                {copied === "otp" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === "otp" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[10px] text-emerald-900 font-bold mt-1.5">
              Releasing this code instantly transfers funds to seller.
            </p>
          </div>
        </div>

        {/* Seller Contact & Handover Landmark */}
        <div className="bg-[#ede4d6] rounded-2xl p-4 border border-[#dfd2be] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#785437] block">Meetup Landmark</span>
              <div className="font-black text-sm text-[#2b1c11]">Posta Bet Commercial Square</div>
              <div className="text-[#6a4727] font-semibold">Seller: {activeDel.originMarket}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <a
              href="tel:+251922771133"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex-1 sm:flex-none justify-center"
            >
              <Phone className="w-3.5 h-3.5" /> Call Seller
            </a>
            <Link
              href="/messages"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs transition-colors flex-1 sm:flex-none justify-center"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
