import React from "react";

interface SefedEmblemProps {
  className?: string;
  size?: number;
  showRays?: boolean;
}

/**
 * SefedEmblem (ሰፌድ)
 * Traditional Ethiopian woven basket tray motif rendered with precision SVG geometry.
 * Represents "Sebez" (ሰበዝ - woven strands/fibers) intertwining into an unbroken circular loop,
 * symbolizing circular barter, community gathering, and authentic Ethiopian craftsmanship.
 * Uses Ethiopian coffee roast brown (#3d2717, #52361f), straw tan (#d4a373, #e5c89a),
 * and commerce blue (#1d4ed8) accents.
 */
export default function SefedEmblem({
  className = "",
  size = 48,
  showRays = false,
}: SefedEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label="Ethiopian Sefed Emblem"
    >
      <defs>
        {/* Straw fiber texture gradient */}
        <radialGradient id="sefedStraw" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ede4d6" />
          <stop offset="35%" stopColor="#e2d2ba" />
          <stop offset="70%" stopColor="#d4bd98" />
          <stop offset="100%" stopColor="#c5a97d" />
        </radialGradient>

        {/* Coffee roast dark border */}
        <linearGradient id="coffeeRoast" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#52361f" />
          <stop offset="50%" stopColor="#3d2717" />
          <stop offset="100%" stopColor="#24160c" />
        </linearGradient>

        {/* Commerce Blue accent gradient */}
        <linearGradient id="commerceBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Warm shadow filter */}
        <filter id="sefedShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#24160c" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#sefedShadow)">
        {/* Outer Woven Rim / Coil */}
        <circle cx="100" cy="100" r="92" fill="url(#sefedStraw)" stroke="url(#coffeeRoast)" strokeWidth="4" />
        <circle cx="100" cy="100" r="88" stroke="#8d7159" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Outer Stitched Border Teeth (Traditional Sefed Edge Weaving) */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 360) / 36;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 86 * Math.cos(rad);
          const y1 = 100 + 86 * Math.sin(rad);
          const x2 = 100 + 92 * Math.cos(rad);
          const y2 = 100 + 92 * Math.sin(rad);
          return (
            <line
              key={`edge-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#52361f"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Ring 1: Concentric Weave Band */}
        <circle cx="100" cy="100" r="76" fill="none" stroke="#ba9663" strokeWidth="2" strokeDasharray="4 2" />

        {/* Ring 2: Blue & Brown Alternating Geometric Triangles (Kekeb Motif) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          const nextAngle = ((i + 1) * 360) / 12;
          const midAngle = angle + 15;

          const rOuter = 76;
          const rInner = 56;

          const rad1 = (angle * Math.PI) / 180;
          const rad2 = (nextAngle * Math.PI) / 180;
          const radMid = (midAngle * Math.PI) / 180;

          const p1x = 100 + rOuter * Math.cos(rad1);
          const p1y = 100 + rOuter * Math.sin(rad1);
          const p2x = 100 + rOuter * Math.cos(rad2);
          const p2y = 100 + rOuter * Math.sin(rad2);
          const tipX = 100 + rInner * Math.cos(radMid);
          const tipY = 100 + rInner * Math.sin(radMid);

          const isBlue = i % 2 === 0;

          return (
            <polygon
              key={`tri-${i}`}
              points={`${p1x},${p1y} ${p2x},${p2y} ${tipX},${tipY}`}
              fill={isBlue ? "url(#commerceBlue)" : "url(#coffeeRoast)"}
              opacity={isBlue ? "0.9" : "0.85"}
            />
          );
        })}

        {/* Ring 3: Middle Separator Ring */}
        <circle cx="100" cy="100" r="54" fill="url(#sefedStraw)" stroke="#52361f" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="50" stroke="#ba9663" strokeWidth="1" strokeDasharray="2 2" />

        {/* Ring 4: Inner Spiral Sunburst (12 Interlocking Woven Strands - Sebez) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 26 * Math.cos(rad);
          const y1 = 100 + 26 * Math.sin(rad);
          const x2 = 100 + 48 * Math.cos(rad + 0.35); // curve angle
          const y2 = 100 + 48 * Math.sin(rad + 0.35);

          return (
            <path
              key={`spiral-${i}`}
              d={`M ${x1} ${y1} Q 100 100 ${x2} ${y2}`}
              stroke={i % 2 === 0 ? "#1d4ed8" : "#3d2717"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Inner Heart of Sefed (Lib / ማዕከል) */}
        <circle cx="100" cy="100" r="24" fill="url(#coffeeRoast)" stroke="#d4bd98" strokeWidth="2" />
        <circle cx="100" cy="100" r="18" fill="url(#commerceBlue)" />
        <circle cx="100" cy="100" r="10" fill="#faf5ed" stroke="#3d2717" strokeWidth="1.5" />

        {/* Center Point - The Origin of the Sebez Weave */}
        <circle cx="100" cy="100" r="4" fill="#3d2717" />
      </g>
    </svg>
  );
}
