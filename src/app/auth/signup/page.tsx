"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  User,
  MapPin,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Store,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMarketplace, ActiveUser } from "@/context/MarketplaceContext";

export default function SignUpPage() {
  const router = useRouter();
  const { login, showToast } = useMarketplace();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+251 9");
  const [role, setRole] = useState<"BUYER" | "MERCHANT">("BUYER");
  const [city, setCity] = useState("Addis Ababa");
  const [landmark, setLandmark] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Verification Step State
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("4821");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("+251")) {
      val = "+251 ";
    }
    setPhone(val);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\s+/g, "");
    if (cleanPhone.length < 12) {
      setError("Please enter a valid 9-digit Ethiopian mobile number (e.g. +251 911 223344)");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 4) {
      setError("Please choose a password with at least 4 characters.");
      return;
    }

    // Generate random 4-digit demo OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep("otp");
    showToast(`SMS Verification Code sent to ${phone}: [${code}]`, "info");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== "1234") {
      setError("Incorrect verification code. Click 'Auto-Fill Demo Code' or re-enter.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newUser: ActiveUser = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      phone: phone.replace(/\s+/g, ""),
      role,
      city,
      kebele: landmark.trim() ? `${city} (${landmark.trim()})` : city,
      landmark: landmark.trim() || `${city} Center`,
      avatarUrl:
        role === "MERCHANT"
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      rating: 5.0,
      completedTrades: 0,
      walletBalance: 0,
    };

    // Try posting to API
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          phone: newUser.phone,
          role: newUser.role,
          city: newUser.city,
          kebele: newUser.kebele,
          landmark: newUser.landmark,
        }),
      });
    } catch {}

    login(newUser);
    setIsSubmitting(false);
    showToast(`✓ Account created successfully! Welcome to Sebez Market, ${newUser.name}.`, "success");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-lg mx-auto py-8 pb-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 shadow-xs group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
            <img
              src="/images/sefed-icon.jpg"
              alt="Sebez Sefed Emblem"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">
            Sebez<span className="text-blue-600">Market</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Join Ethiopia&apos;s direct buyer-seller classifieds and circular barter platform
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">I want to register as:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("BUYER")}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all ${
                    role === "BUYER"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-black">Individual Trader</span>
                  <span className="text-[10px] opacity-80">Buy, Sell &amp; Barter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("MERCHANT")}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all ${
                    role === "MERCHANT"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-xs font-black">Store Merchant</span>
                  <span className="text-[10px] opacity-80">Verified Business Owner</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                {role === "MERCHANT" ? "Shop / Business Representative Name" : "Full Name"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === "MERCHANT" ? "e.g. Dawit Bekele (Arada Electronics)" : "e.g. Henok Tadesse"}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Ethiopian Mobile Number (Telebirr / Calls)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+251 911 223344"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Used for buyer contact, SMS OTP verification, and Telebirr trade safety.
              </span>
            </div>

            {/* City & Nearest Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Your City</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                    <option value="Adama">Adama (አዳማ)</option>
                    <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                    <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                    <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                    <option value="Mekelle">Mekelle (መቐለ)</option>
                    <option value="Jimma">Jimma (ጅማ)</option>
                    <option value="Gondar">Gondar (ጎንደር)</option>
                    <option value="Bishoftu">Bishoftu (ቢሾፍቱ)</option>
                    <option value="Dessie">Dessie (ደሴ)</option>
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Area / Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Bole Medhanialem"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Choose Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Continue &bull; Verify via SMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Verify Mobile Number</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 4-digit verification code sent to <strong className="text-slate-900 font-mono">{phone}</strong>
              </p>
            </div>

            {/* Demo Code Helper */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600">Demo SMS Simulation:</span>
                <span className="font-mono font-black text-blue-600 text-sm bg-white px-2 py-0.5 rounded border border-blue-200">
                  {generatedOtp}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(generatedOtp)}
                className="w-full py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-xs transition-colors"
              >
                Auto-Fill Demo Code ({generatedOtp})
              </button>
            </div>

            <input
              type="text"
              maxLength={4}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="0 0 0 0"
              className="w-44 mx-auto text-center font-mono text-2xl font-black tracking-widest py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Confirm &amp; Access Marketplace</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
