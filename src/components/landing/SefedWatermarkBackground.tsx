"use client";

import React from "react";

/**
 * SefedWatermarkBackground
 * Renders an authentic Ethiopian Sefed (ሰፌድ) woven basket tray as a soft,
 * blurred ambient watermark across the landing page background.
 * Symbolizes Ethiopian marketplace trust, gathering, and the heritage of Sefed Market.
 */
export default function SefedWatermarkBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Primary Hero Sefed Watermark - Positioned centrally behind the hero title and CTA */}
      <div className="absolute -top-16 -left-20 sm:left-1/4 sm:-translate-x-1/2 sm:-top-24 w-[360px] sm:w-[680px] lg:w-[840px] h-[360px] sm:h-[680px] lg:h-[840px] opacity-[0.07] sm:opacity-[0.08] filter blur-[2px] sm:blur-[3.5px] transition-opacity">
        <img
          src="/images/sefed_watermark.jpg"
          alt=""
          className="w-full h-full object-contain rounded-full transform rotate-12 [mask-image:radial-gradient(circle_at_center,black_50%,transparent_80%)]"
        />
      </div>

      {/* 2. Secondary Sefed Watermark - Behind "Shop by Category" on the right side */}
      <div className="absolute top-[900px] sm:top-[750px] -right-24 sm:right-0 w-[300px] sm:w-[540px] lg:w-[650px] h-[300px] sm:h-[540px] lg:h-[650px] opacity-[0.045] sm:opacity-[0.055] filter blur-[3px] sm:blur-[4px]">
        <img
          src="/images/sefed_watermark.jpg"
          alt=""
          className="w-full h-full object-contain rounded-full transform -rotate-45 [mask-image:radial-gradient(circle_at_center,black_45%,transparent_75%)]"
        />
      </div>

      {/* 3. Lower Sefed Watermark - Behind Trending Listings / Device Barter on the left side */}
      <div className="absolute top-[1800px] -left-20 sm:-left-12 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] opacity-[0.04] sm:opacity-[0.05] filter blur-[3px] sm:blur-[4px]">
        <img
          src="/images/sefed_watermark.jpg"
          alt=""
          className="w-full h-full object-contain rounded-full transform rotate-30 [mask-image:radial-gradient(circle_at_center,black_45%,transparent_75%)]"
        />
      </div>
    </div>
  );
}
