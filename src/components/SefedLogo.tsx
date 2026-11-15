import React from "react";
import Link from "next/link";

interface SefedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
}

/**
 * SefedLogo (ሰፌድ ገበያ)
 * Official brand identity for Sefed Market.
 * Features a dynamic shopping cart integrated with the iconic Ethiopian Sefed
 * woven basket and monument apex, flanked by golden speed lines.
 * Tagline: "Shop Smart · Live Better"
 */
export default function SefedLogo({
  className = "",
  size = "md",
  showTagline = true,
  href = "/",
}: SefedLogoProps) {
  const iconSizes = {
    sm: { w: 38, h: 32, textScale: "text-sm", subScale: "text-[9px]" },
    md: { w: 48, h: 42, textScale: "text-lg sm:text-xl", subScale: "text-[10px]" },
    lg: { w: 60, h: 52, textScale: "text-2xl sm:text-3xl", subScale: "text-xs" },
  };

  const current = iconSizes[size];

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Sefed Shopping Cart Vector Icon */}
      <svg
        width={current.w}
        height={current.h}
        viewBox="0 0 76 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform group-hover:scale-105 duration-200"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cartNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldSpeed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Speed / Motion Dashes on Left */}
        <path d="M4 18 H20" stroke="url(#goldSpeed)" strokeWidth="3" strokeLinecap="round" />
        <path d="M8 26 H24" stroke="url(#goldSpeed)" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 34 H26" stroke="url(#goldSpeed)" strokeWidth="3" strokeLinecap="round" />

        {/* Shopping Cart Basket Body */}
        <path
          d="M24 16 H68 L60 40 H31 L27 12 H21"
          stroke="url(#cartNavy)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Traditional Sefed Woven Motif & Apex inside Cart */}
        <path
          d="M36 38 L45 22 L54 38 Z"
          fill="#fef3c7"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M45 16 V22"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="45" cy="14" r="2.5" fill="#f59e0b" />
        {/* Horizontal weave strand inside Sefed */}
        <path d="M39 33 H51" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />

        {/* Bottom Cart Base Bar */}
        <path d="M30 46 H58" stroke="url(#cartNavy)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Cart Wheels */}
        <circle cx="34" cy="53" r="4.5" fill="#0f172a" />
        <circle cx="34" cy="53" r="2" fill="#fef3c7" />
        <circle cx="55" cy="53" r="4.5" fill="#0f172a" />
        <circle cx="55" cy="53" r="2" fill="#fef3c7" />
      </svg>

      {/* Brand Text: Dual Script (Ge'ez/Amharic + English) */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-black tracking-tight text-[#0f172a] ${current.textScale} font-sans`}>
            ሰፌድ ገበያ
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="font-extrabold tracking-tight text-[#1e293b] text-sm sm:text-base">
            Sefed <span className="text-[#f59e0b]">Market</span>
          </span>
        </div>
        {showTagline && (
          <span className={`hidden sm:block text-[#d97706] font-bold tracking-wider ${current.subScale} mt-0.5`}>
            — Shop Smart · Live Better —
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus:ring-2 focus:ring-[#0e623a] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
