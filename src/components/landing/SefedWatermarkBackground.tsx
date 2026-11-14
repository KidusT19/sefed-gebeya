"use client";

import React from "react";

/**
 * SefedWatermarkBackground
 * Renders an authentic Ethiopian Sefed (ሰፌድ) traditional handwoven straw tray
 * as a clear, beautifully blurred ambient watermark across the landing page background.
 * Symbolizes the heritage of Sefed Market (ሰፌድ ገበያ) — Ethiopian abundance, quality sorting, and gathering.
 */
export default function SefedWatermarkBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Primary Hero Sefed Watermark - Positioned centrally behind the hero title, text, and shopper */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 sm:left-[35%] lg:left-[36%] w-[380px] sm:w-[720px] lg:w-[860px] h-[380px] sm:h-[720px] lg:h-[860px] opacity-[0.18] sm:opacity-[0.22] filter blur-[1px] sm:blur-[1.5px] contrast-[1.1] saturate-[1.15] mix-blend-multiply transition-all">
        <img
          src="/images/sefed_watermark.jpg"
          alt="Traditional Ethiopian Sefed Watermark"
          className="w-full h-full object-contain rounded-full transform rotate-6 [mask-image:radial-gradient(circle_at_center,black_70%,transparent_98%)]"
        />
      </div>

      {/* 2. Secondary Sefed Watermark - Behind "Shop by Category" section on the right */}
      <div className="absolute top-[820px] sm:top-[720px] -right-20 sm:-right-10 lg:right-4 w-[320px] sm:w-[560px] lg:w-[680px] h-[320px] sm:h-[560px] lg:h-[680px] opacity-[0.14] sm:opacity-[0.18] filter blur-[1.5px] sm:blur-[2px] contrast-[1.1] saturate-[1.1] mix-blend-multiply">
        <img
          src="/images/sefed_watermark.jpg"
          alt="Traditional Ethiopian Sefed Watermark"
          className="w-full h-full object-contain rounded-full transform -rotate-45 [mask-image:radial-gradient(circle_at_center,black_65%,transparent_95%)]"
        />
      </div>

      {/* 3. Mid-Page Sefed Watermark - Behind Featured Products Showcase on the left */}
      <div className="absolute top-[1600px] -left-24 sm:-left-12 lg:left-2 w-[340px] sm:w-[580px] lg:w-[700px] h-[340px] sm:h-[580px] lg:h-[700px] opacity-[0.13] sm:opacity-[0.16] filter blur-[1.5px] sm:blur-[2px] contrast-[1.05] saturate-[1.1] mix-blend-multiply">
        <img
          src="/images/sefed_watermark.jpg"
          alt="Traditional Ethiopian Sefed Watermark"
          className="w-full h-full object-contain rounded-full transform rotate-25 [mask-image:radial-gradient(circle_at_center,black_65%,transparent_95%)]"
        />
      </div>

      {/* 4. Lower Barter & Swap Sefed Watermark - Perfectly represents circular exchange */}
      <div className="absolute top-[2500px] right-1/2 translate-x-1/2 sm:right-10 lg:right-16 w-[360px] sm:w-[620px] lg:w-[750px] h-[360px] sm:h-[620px] lg:h-[750px] opacity-[0.14] sm:opacity-[0.18] filter blur-[1.5px] sm:blur-[2px] mix-blend-multiply">
        <img
          src="/images/sefed_watermark.jpg"
          alt="Traditional Ethiopian Sefed Watermark"
          className="w-full h-full object-contain rounded-full transform -rotate-15 [mask-image:radial-gradient(circle_at_center,black_65%,transparent_95%)]"
        />
      </div>
    </div>
  );
}
