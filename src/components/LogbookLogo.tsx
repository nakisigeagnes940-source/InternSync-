import React from 'react';
import { motion } from 'motion/react';

interface LogbookLogoProps {
  className?: string;
  size?: number;
}

export const LogbookLogo: React.FC<LogbookLogoProps> = ({
  className = '',
  size = 230,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id="logbook-logo-wrapper"
    >
      {/* Ambient Diffused Cyan/Teal Halo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.65, scale: 1.18 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/25 via-sky-300/20 to-teal-400/20 blur-3xl pointer-events-none"
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-[0_16px_32px_rgba(20,50,75,0.22)] w-full h-full"
        id="logbook-logo-svg"
      >
        <defs>
          {/* Outer Badge Shield Gradient */}
          <linearGradient id="shieldBorder" x1="40" y1="20" x2="240" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2a5270" />
            <stop offset="50%" stopColor="#193850" />
            <stop offset="100%" stopColor="#0f2232" />
          </linearGradient>

          {/* Inner Surface Deep Ocean Gradient */}
          <linearGradient id="coreSurface" x1="60" y1="40" x2="220" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2c728a" />
            <stop offset="35%" stopColor="#1e5467" />
            <stop offset="100%" stopColor="#113645" />
          </linearGradient>

          {/* Glowing Neon Cyan Gradient */}
          <linearGradient id="cyanNeon" x1="60" y1="60" x2="220" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>

          {/* L Monogram Radiant Gradient */}
          <linearGradient id="monogramGrad" x1="85" y1="65" x2="195" y2="215" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0fdfa" />
            <stop offset="50%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Radial Center Aperture Light */}
          <radialGradient id="apertureGlow" cx="140" cy="140" r="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </radialGradient>

          {/* Filter for Cybernetic Node Glow */}
          <filter id="logoGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- 1. OUTER HEXAGONAL LOGBOOK BADGE --- */}
        <polygon
          points="140,24 236,78 236,198 140,252 44,198 44,78"
          fill="url(#shieldBorder)"
          stroke="#0f2231"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Outer Highlight Ridge */}
        <polygon
          points="140,32 228,82 228,194 140,244 52,194 52,82"
          fill="none"
          stroke="#407797"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeLinejoin="round"
        />

        {/* --- 2. INNER CORE SURFACE --- */}
        <polygon
          points="140,38 222,85 222,191 140,238 58,191 58,85"
          fill="url(#coreSurface)"
          stroke="#103140"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Soft Radial Center Lighting */}
        <circle cx="140" cy="140" r="85" fill="url(#apertureGlow)" />

        {/* Precision Logbook Telemetry Perimeter Marks (Degrees & Grid ticks) */}
        <g stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1">
          {/* Top & bottom notches */}
          <line x1="140" y1="44" x2="140" y2="52" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="140" y1="224" x2="140" y2="232" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="68" y1="140" x2="76" y2="140" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="204" y1="140" x2="212" y2="140" strokeWidth="2" strokeOpacity="0.7" />

          {/* Diagonal secondary ticks */}
          <line x1="88" y1="92" x2="94" y2="98" />
          <line x1="186" y1="92" x2="192" y2="98" />
          <line x1="88" y1="188" x2="94" y2="182" />
          <line x1="186" y1="188" x2="192" y2="182" />
        </g>

        {/* Telemetry Log Data Matrix Grid */}
        <g stroke="#38bdf8" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="2 3">
          <circle cx="140" cy="140" r="62" />
          <circle cx="140" cy="140" r="42" />
          <line x1="78" y1="140" x2="202" y2="140" />
          <line x1="140" y1="78" x2="140" y2="202" />
        </g>

        {/* --- 3. DIGITAL LOGBOOK CIRCUIT TRACES (Log telemetry lines) --- */}
        <g stroke="#38bdf8" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Top-left log stream */}
          <path d="M 92 76 H 116 L 126 86" />
          {/* Top-right circuit stream */}
          <path d="M 188 76 H 164 L 154 86" />
          {/* Lower telemetry histograms */}
          <line x1="78" y1="165" x2="78" y2="180" strokeWidth="2" stroke="#22d3ee" strokeOpacity="0.8" />
          <line x1="84" y1="160" x2="84" y2="180" strokeWidth="2" stroke="#22d3ee" strokeOpacity="0.9" />
          <line x1="90" y1="168" x2="90" y2="180" strokeWidth="2" stroke="#22d3ee" strokeOpacity="0.7" />
          
          <line x1="190" y1="168" x2="190" y2="180" strokeWidth="2" stroke="#22d3ee" strokeOpacity="0.7" />
          <line x1="196" y1="160" x2="196" y2="180" strokeWidth="2" stroke="#22d3ee" strokeOpacity="0.9" />
          <line x1="202" y1="165" x2="202" y2="180" strokeWidth="2" stroke="#22d3ee" strokeOpacity="0.8" />
        </g>

        {/* --- 4. THE ICONIC "L" LOGBOOK MONOGRAM + DATA CORRIDOR --- */}
        {/* Shadow of the L monogram */}
        <path
          d="M 108 76
             V 182
             C 108 186, 112 190, 118 190
             H 178
             C 184 190, 188 186, 188 180
             V 166
             H 134
             V 76
             Z"
          fill="#0a1d29"
          opacity="0.45"
          transform="translate(3, 4)"
        />

        {/* Primary L Monogram (Modern Cybernetic Logbook Insignia) */}
        <path
          d="M 108 76
             V 182
             C 108 187, 112 191, 118 191
             H 178
             C 184 191, 188 187, 188 181
             V 166
             H 134
             V 76
             Z"
          fill="url(#monogramGrad)"
          stroke="#cffafe"
          strokeWidth="1.2"
        />

        {/* Inner L Track Glow Streak */}
        <path
          d="M 116 88
             V 175
             H 176"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
        />

        {/* --- 5. AI INTELLIGENCE SPARKLE & NEURAL CORE --- */}
        {/* Connecting AI vector lines */}
        <g stroke="#7dd3fc" strokeOpacity="0.75" strokeWidth="1.2">
          <line x1="140" y1="116" x2="168" y2="134" />
          <line x1="168" y1="134" x2="152" y2="154" />
          <line x1="140" y1="116" x2="152" y2="154" />
        </g>

        {/* Central Luminous AI Core Sparkle (at intersection 154, 134) */}
        <g transform="translate(154, 134)" filter="url(#logoGlow)">
          {/* Luminous diamond core */}
          <path
            d="M 0 -14
               C 0 -4, 4 0, 14 0
               C 4 0, 0 4, 0 14
               C 0 4, -4 0, -14 0
               C -4 0, 0 -4, 0 -14 Z"
            fill="#ffffff"
          />
        </g>

        {/* Neural Nodes / Telemetry Waypoints with glowing pulses */}
        <g filter="url(#logoGlow)" fill="#ffffff">
          <circle cx="140" cy="116" r="3.2" />
          <circle cx="168" cy="134" r="3.2" />
          <circle cx="152" cy="154" r="2.8" />
          <circle cx="92" cy="76" r="2.4" fill="#a5f3fc" />
          <circle cx="188" cy="76" r="2.4" fill="#a5f3fc" />
          <circle cx="140" cy="214" r="3.2" fill="#22d3ee" />
        </g>

        {/* Precision Coordinate Rings around the AI Core */}
        <circle cx="154" cy="134" r="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.8" />
        <circle cx="154" cy="134" r="2" fill="#ffffff" />
      </svg>
    </div>
  );
};
