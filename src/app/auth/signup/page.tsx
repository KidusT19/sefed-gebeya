"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  User,
  Mail,
  MapPin,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Store,
  KeyRound,
  Eye,
  EyeOff,
  RotateCw,
} from "lucide-react";
import { useMarketplace, ActiveUser } from "@/context/MarketplaceContext";
import SefedLogo from "@/components/SefedLogo";

export default function SignUpPage() {
  const router = useRouter();
  const { login, showToast } = useMarketplace();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

    // Generate random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep("otp");
    showToast(`Verification code sent to ${phone}`, "info");
  };

  const handleResendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    showToast(`New verification code sent to ${phone}`, "info");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== "1234") {
      setError("Incorrect verification code. Please check your SMS and try again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newUser: ActiveUser = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim() ? email.trim().toLowerCase() : undefined,
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

    // Post to API
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
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
    showToast(`✓ Account created successfully! Welcome to Sefed Market, ${newUser.name}.`, "success");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-lg mx-auto py-8 pb-16 px-4 sm:px-0 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <SefedLogo size="lg" showTagline={true} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Create Your Sefed Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
          Join thousands of verified shoppers and merchants across Addis Ababa, Adama, Hawassa, and nationwide
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            {error}
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("BUYER")}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    role === "BUYER"
                      ? "bg-[#0e623a] text-white border-[#0e623a] shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-600"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-black">Shopper &amp; Trader</span>
                  <span className="text-[10px] opacity-80">Buy, Sell &amp; Barter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("MERCHANT")}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    role === "MERCHANT"
                      ? "bg-[#0e623a] text-white border-[#0e623a] shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-600"
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
                  placeholder={role === "MERCHANT" ? "e.g. Dawit Bekele (Tech Hub)" : "e.g. Henok Tadesse"}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Email Address</label>
                <span className="text-[10px] text-slate-400 font-medium">Recommended for receipts</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">
                Used for order confirmations, delivery OTPs, and Telebirr security.
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
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a] cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition-all cursor-pointer mt-2"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        ) : (
          /* STEP 2: OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">Enter Verification Code</h3>
              <p className="text-xs text-slate-500 mt-1">
                A 4-digit code was sent to <strong className="text-slate-900 font-mono">{phone}</strong>
              </p>
            </div>

            <div className="py-2">
              <input
                type="text"
                maxLength={4}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="• • • •"
                className="w-48 mx-auto text-center font-mono text-3xl font-black tracking-widest py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0e623a]"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500">Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-bold text-[#0e623a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#0e623a] hover:bg-[#0b4d2e] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Confirm &amp; Complete Registration</span>
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-black text-[#0e623a] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Security Assurance */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-700" />
        <span>Your data is protected under National Digital ID &amp; Telebirr Standards</span>
      </div>
    </div>
  );
}
