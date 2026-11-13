"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { useMarketplace, PRESET_USERS, ActiveUser } from "@/context/MarketplaceContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast } = useMarketplace();

  const [phone, setPhone] = useState("+251 911 448822");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const cleanPhone = phone.replace(/\s+/g, "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        const loggedUser: ActiveUser = {
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          role: data.user.role,
          city: data.user.city || "Adama",
          kebele: data.user.kebele || "Bole",
          avatarUrl:
            data.user.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          rating: data.user.rating || 5.0,
          completedTrades: data.user.completedTrades || 0,
          walletBalance: 14250,
        };
        login(loggedUser);
        router.push("/dashboard");
      } else {
        // Fallback to preset if not in db
        const matchingPreset = PRESET_USERS.find((u) => u.phone === cleanPhone) || PRESET_USERS[0];
        login(matchingPreset);
        router.push("/dashboard");
      }
    } catch {
      const matchingPreset = PRESET_USERS.find((u) => u.phone === cleanPhone) || PRESET_USERS[0];
      login(matchingPreset);
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (user: ActiveUser) => {
    login(user);
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto py-8 pb-16 space-y-6">
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
          Sign in to manage your active listings, direct chats, and barter deals across Ethiopia
        </p>
      </div>

      {/* 1-Click Demo Persona Switcher (High Value for Demonstrations) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>1-Click Demo Logins</span>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Instant Demo
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_USERS.slice(0, 3).map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleQuickLogin(u)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-center transition-all hover:scale-[1.02] shadow-2xs"
            >
              <img
                src={u.avatarUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover mx-auto border border-slate-200"
              />
              <div className="font-black text-[10px] text-slate-900 truncate mt-1">
                {u.name.split(" ")[0]}
              </div>
              <span className="text-[9px] text-slate-500 block font-semibold">
                {u.city}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">Ethiopian Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 911 223344"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Password</label>
              <button
                type="button"
                onClick={() => showToast("Password reset SMS code sent to your phone.", "info")}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In to Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Link to Signup */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/auth/signup" className="font-bold text-blue-600 hover:underline">
            Register free in 30 seconds
          </Link>
        </div>
      </div>
    </div>
  );
}
