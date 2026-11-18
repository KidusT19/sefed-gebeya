import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Phone,
  Repeat,
  Lock,
  Smartphone,
  Eye,
  MapPin,
} from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-slate-900 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Nationwide Marketplace Safety Standards &bull; መላው ኢትዮጵያ
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
          How to Trade Safely on Sebez Market
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed font-medium">
          We designed Sebez to keep peer-to-peer trade across Ethiopia safe, honest, and transparent. Follow these golden rules when meeting sellers, purchasing directly, or swapping devices.
        </p>
      </section>

      {/* The 4 Golden Rules */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          The 4 Golden Rules for Buyers &amp; Sellers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Rule 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-sm border border-amber-200">
                1
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Never Send Advance Payments to Unverified Accounts
                </h3>
                <span className="text-[11px] text-slate-500">Avoid upfront payment scams</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never transfer money blindly before physically meeting or testing the item. Inspect the device in daylight at public bank branches in your city before completing payment.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-200">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Inspect First Before Handing Over Cash
                </h3>
                <span className="text-[11px] text-slate-500">In-person inspection protection</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When meeting the seller, do <strong>NOT</strong> hand over cash until you have turned on the device, verified the specifications, and confirmed it matches the ad description.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm border border-indigo-200">
                3
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Meet in Safe Public Spots Nationwide
                </h3>
                <span className="text-[11px] text-slate-500">Recommended meeting zones</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pick busy, well-lit daytime locations for handovers: outside the <strong>Commercial Bank of Ethiopia (CBE) branches</strong>, Telebirr centers, or commercial shopping centers in your city (Addis Ababa, Adama, Hawassa, Bahir Dar, Dire Dawa, etc.).
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm border border-emerald-200">
                4
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Verify Specs &amp; Lock Status on Smartphones
                </h3>
                <span className="text-[11px] text-[#785437]">Anti-theft &amp; hardware checks</span>
              </div>
            </div>
            <p className="text-xs text-[#52361f] leading-relaxed">
              Dial <code className="bg-[#ede4d6] px-1 py-0.5 rounded font-bold text-[#2b1c11]">*#06#</code> to verify IMEI matches the box and receipt. Ensure iCloud / Apple ID and Google FRP accounts are completely removed before concluding any barter swap.
            </p>
          </div>
        </div>
      </section>

      {/* Device Inspection Checklist for Handover */}
      <section className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-6 sm:p-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-black text-[#2b1c11] flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#1d4ed8]" />
          Pre-Handover Phone &amp; Laptop Inspection Checklist
        </h2>
        <p className="text-xs text-[#785437]">
          Take 2 minutes to inspect these points during your meetup:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1">
            <span className="font-bold text-[#2b1c11] block">1. Screen &amp; Touch Response</span>
            <p className="text-[11px] text-[#785437]">
              Check for dead pixels, cracks under screen protectors, and test touchscreen sensitivity across all four corners.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1">
            <span className="font-bold text-[#2b1c11] block">2. SIM &amp; Network Signal</span>
            <p className="text-[11px] text-[#785437]">
              Insert an Ethio Telecom or Safaricom SIM card. Make a brief test call to verify microphone and earpiece speaker.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1">
            <span className="font-bold text-[#2b1c11] block">3. Battery Health &amp; Charging</span>
            <p className="text-[11px] text-[#785437]">
              Plug into a power bank or charger to verify the USB-C or Lightning port is not loose or malfunctioning.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1">
            <span className="font-bold text-[#2b1c11] block">4. Camera &amp; Sensors</span>
            <p className="text-[11px] text-[#785437]">
              Open camera app. Test front and back lenses, autofocus, flash, and biometric Face ID or fingerprint sensor.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1">
            <span className="font-bold text-[#2b1c11] block">5. Account Sign-Out</span>
            <p className="text-[11px] text-[#785437]">
              Ensure previous owner has signed out of iCloud, Google, and Samsung accounts. Device should be ready for initial setup.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ede4d6] border border-[#dfd2be] space-y-1">
            <span className="font-bold text-[#2b1c11] block">6. Storage &amp; Processor</span>
            <p className="text-[11px] text-[#785437]">
              Check About Phone in settings to confirm genuine RAM, storage capacity, and iOS/Android version.
            </p>
          </div>
        </div>
      </section>

      {/* What to do if there is an issue */}
      <section className="bg-[#ede4d6] rounded-2xl border border-[#dfd2be] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h3 className="font-black text-sm text-[#2b1c11]">
            What if an item fails inspection during a meetup?
          </h3>
        </div>
        <p className="text-xs text-[#52361f] leading-relaxed">
          Do <strong>NOT</strong> pay for the item. Simply decline the purchase and walk away. Never send money upfront before seeing and testing the device in person.
        </p>
        <div className="pt-2">
          <Link
            href="/messages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] hover:underline"
          >
            Contact Customer Support / Open Chat &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
