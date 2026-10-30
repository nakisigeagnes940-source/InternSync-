import React from 'react';
import { motion } from 'motion/react';

interface LogbookIconProps {
  className?: string;
  size?: number;
}

export const LogbookIcon: React.FC<LogbookIconProps> = ({
  className = '',
  size = 220,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id="logbook-icon-wrapper"
    >
      {/* Ambient Backlight Glow behind the book */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1.2 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full bg-cyan-300/25 blur-3xl pointer-events-none"
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-[0_12px_24px_rgba(20,50,75,0.22)] w-full h-full"
        id="logbook-svg"
      >
        <defs>
          {/* Gradient for dark book base & spine */}
          <linearGradient id="bookCoverGrad" x1="160" y1="50" x2="160" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a53" />
            <stop offset="100%" stopColor="#132637" />
          </linearGradient>

          {/* Left Page Gradient */}
          <linearGradient id="leftPageGrad" x1="150" y1="60" x2="40" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#317992" />
            <stop offset="35%" stopColor="#225b70" />
            <stop offset="100%" stopColor="#163f50" />
          </linearGradient>

          {/* Right Page Gradient */}
          <linearGradient id="rightPageGrad" x1="170" y1="60" x2="280" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#317992" />
            <stop offset="35%" stopColor="#225b70" />
            <stop offset="100%" stopColor="#163f50" />
          </linearGradient>

          {/* Spine glow gradient */}
          <linearGradient id="spineLight" x1="160" y1="60" x2="160" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>

          {/* Center glow beam */}
          <radialGradient id="centerGlow" cx="160" cy="150" r="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </radialGradient>

          {/* Soft Filter for glowing network nodes */}
          <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- BOOK BASE & OUTER HARDCOVER --- */}
        {/* Dark hardcover backing */}
        <path
          d="M 160 76
             C 175 62, 205 52, 275 60
             C 285 61, 290 68, 290 78
             L 290 220
             C 290 230, 282 238, 272 238
             C 210 234, 180 244, 160 258
             C 140 244, 110 234, 48 238
             C 38 238, 30 230, 30 220
             L 30 78
             C 30 68, 35 61, 45 60
             C 115 52, 145 62, 160 76 Z"
          fill="url(#bookCoverGrad)"
          stroke="#10212f"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Bottom spine contour cushion */}
        <path
          d="M 135 250
             C 148 259, 172 259, 185 250
             C 192 258, 185 266, 160 267
             C 135 266, 128 258, 135 250 Z"
          fill="#0c1824"
        />

        {/* Outer Page Border / Rim */}
        <path
          d="M 160 78
             C 178 66, 210 58, 276 66
             C 281 67, 284 71, 284 76
             L 284 216
             C 284 222, 280 226, 274 227
             C 214 224, 182 234, 160 248
             C 138 234, 106 224, 46 227
             C 40 226, 36 222, 36 216
             L 36 76
             C 36 71, 39 67, 44 66
             C 110 58, 142 66, 160 78 Z"
          fill="#194052"
          stroke="#132c3c"
          strokeWidth="2"
        />

        {/* --- LEFT PAGE BODY --- */}
        <path
          d="M 158 82
             C 140 71, 112 64, 47 71
             C 43 71, 40 74, 40 78
             L 40 213
             C 40 217, 43 220, 47 221
             C 107 218, 137 228, 158 241 Z"
          fill="url(#leftPageGrad)"
        />

        {/* --- RIGHT PAGE BODY --- */}
        <path
          d="M 162 82
             C 180 71, 208 64, 273 71
             C 277 71, 280 74, 280 78
             L 280 213
             C 280 217, 277 220, 273 221
             C 213 218, 183 228, 162 241 Z"
          fill="url(#rightPageGrad)"
        />

        {/* Soft Radial Center Light Beam & Page Sheen */}
        <ellipse cx="160" cy="155" rx="115" ry="75" fill="url(#centerGlow)" />

        {/* Page Grid Background Lines (Technical Logbook Matrix) */}
        <g stroke="#38bdf8" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="1.5 3">
          {/* Left grid lines */}
          <line x1="50" y1="100" x2="150" y2="100" />
          <line x1="48" y1="130" x2="152" y2="130" />
          <line x1="46" y1="160" x2="154" y2="160" />
          <line x1="48" y1="190" x2="152" y2="190" />
          
          <line x1="75" y1="75" x2="75" y2="218" />
          <line x1="105" y1="72" x2="105" y2="223" />
          <line x1="135" y1="75" x2="135" y2="232" />

          {/* Right grid lines */}
          <line x1="170" y1="100" x2="270" y2="100" />
          <line x1="168" y1="130" x2="272" y2="130" />
          <line x1="166" y1="160" x2="274" y2="160" />
          <line x1="168" y1="190" x2="272" y2="190" />

          <line x1="185" y1="75" x2="185" y2="232" />
          <line x1="215" y1="72" x2="215" y2="223" />
          <line x1="245" y1="75" x2="245" y2="218" />
        </g>

        {/* --- CIRCUITRY & TELEMETRY ON LEFT PAGE --- */}
        {/* Orthogonal circuit traces */}
        <g stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Top-left circuit traces */}
          <path d="M 52 90 H 82 V 104 H 108" />
          <path d="M 64 115 H 90 V 132 H 102" />
          <path d="M 50 142 H 72 V 158 H 86" />
          
          {/* Vertical telemetry bars at lower-left corner */}
          <path d="M 54 212 V 185" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.7" />
          <path d="M 60 213 V 172" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.8" />
          <path d="M 66 214 V 180" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.6" />
          <path d="M 72 215 V 166" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.9" />
          <path d="M 78 216 V 178" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.5" />
          <path d="M 84 217 V 192" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.7" />

          {/* Central spine connectors */}
          <path d="M 130 228 V 195 H 145 V 170" />
          <path d="M 142 232 V 188 H 152" />
        </g>

        {/* Circuit solder points / circles */}
        <g fill="#67e8f9" filter="url(#subtleGlow)">
          <circle cx="82" cy="90" r="2" />
          <circle cx="108" cy="104" r="2.2" />
          <circle cx="90" cy="132" r="2" />
          <circle cx="72" cy="158" r="1.8" />
        </g>

        {/* --- CIRCUITRY & TELEMETRY ON RIGHT PAGE --- */}
        <g stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Top-right circuit traces */}
          <path d="M 268 90 H 238 V 104 H 212" />
          <path d="M 256 115 H 230 V 132 H 218" />
          <path d="M 270 142 H 248 V 158 H 234" />

          {/* Vertical telemetry bars at lower-right corner */}
          <path d="M 266 212 V 188" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.7" />
          <path d="M 260 213 V 176" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.8" />
          <path d="M 254 214 V 184" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.6" />
          <path d="M 248 215 V 162" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.9" />
          <path d="M 242 216 V 174" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.5" />
          <path d="M 236 217 V 190" strokeWidth="1.8" stroke="#38bdf8" strokeOpacity="0.7" />

          {/* Central spine connectors */}
          <path d="M 190 228 V 195 H 175 V 170" />
          <path d="M 178 232 V 188 H 168" />
        </g>

        {/* Right circuit solder points */}
        <g fill="#67e8f9" filter="url(#subtleGlow)">
          <circle cx="238" cy="90" r="2" />
          <circle cx="212" cy="104" r="2.2" />
          <circle cx="230" cy="132" r="2" />
          <circle cx="248" cy="158" r="1.8" />
        </g>

        {/* --- NEURAL CONSTELLATION / AI DATA GRAPH MESH --- */}
        {/* Network connection lines */}
        <g stroke="#7dd3fc" strokeOpacity="0.7" strokeWidth="1.1">
          {/* Left network cluster */}
          <line x1="72" y1="166" x2="94" y2="148" />
          <line x1="94" y1="148" x2="116" y2="162" />
          <line x1="94" y1="148" x2="88" y2="124" />
          <line x1="88" y1="124" x2="112" y2="114" />
          <line x1="112" y1="114" x2="134" y2="132" />
          <line x1="134" y1="132" x2="116" y2="162" />
          <line x1="116" y1="162" x2="138" y2="182" />
          <line x1="134" y1="132" x2="154" y2="120" />
          <line x1="134" y1="132" x2="150" y2="154" />
          <line x1="88" y1="124" x2="68" y2="136" />
          <line x1="68" y1="136" x2="72" y2="166" />

          {/* Bridge across pages */}
          <line x1="154" y1="120" x2="166" y2="120" stroke="#bae6fd" strokeWidth="1.4" />
          <line x1="150" y1="154" x2="170" y2="154" stroke="#bae6fd" strokeWidth="1.4" />

          {/* Right network cluster */}
          <line x1="166" y1="120" x2="186" y2="132" />
          <line x1="170" y1="154" x2="186" y2="132" />
          <line x1="186" y1="132" x2="204" y2="162" />
          <line x1="186" y1="132" x2="208" y2="114" />
          <line x1="208" y1="114" x2="232" y2="124" />
          <line x1="232" y1="124" x2="226" y2="148" />
          <line x1="226" y1="148" x2="204" y2="162" />
          <line x1="204" y1="162" x2="182" y2="182" />
          <line x1="226" y1="148" x2="248" y2="166" />
          <line x1="232" y1="124" x2="252" y2="136" />
          <line x1="252" y1="136" x2="248" y2="166" />
        </g>

        {/* Secondary fine mesh web lines */}
        <g stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="0.8">
          <line x1="112" y1="114" x2="154" y2="120" />
          <line x1="94" y1="148" x2="138" y2="182" />
          <line x1="116" y1="162" x2="150" y2="154" />
          <line x1="208" y1="114" x2="166" y2="120" />
          <line x1="226" y1="148" x2="182" y2="182" />
          <line x1="204" y1="162" x2="170" y2="154" />
        </g>

        {/* Glowing Constellation / Neural Nodes */}
        <g filter="url(#nodeGlow)">
          {/* Center prominent nodes */}
          <circle cx="154" cy="120" r="3.2" fill="#ffffff" />
          <circle cx="166" cy="120" r="3.2" fill="#ffffff" />
          <circle cx="150" cy="154" r="3" fill="#ffffff" />
          <circle cx="170" cy="154" r="3" fill="#ffffff" />

          {/* Left page nodes */}
          <circle cx="134" cy="132" r="3.4" fill="#e0f2fe" />
          <circle cx="112" cy="114" r="2.8" fill="#bae6fd" />
          <circle cx="88" cy="124" r="2.6" fill="#a5f3fc" />
          <circle cx="68" cy="136" r="2.2" fill="#67e8f9" />
          <circle cx="72" cy="166" r="2.5" fill="#67e8f9" />
          <circle cx="94" cy="148" r="3.2" fill="#e0f2fe" />
          <circle cx="116" cy="162" r="3" fill="#bae6fd" />
          <circle cx="138" cy="182" r="2.5" fill="#67e8f9" />

          {/* Right page nodes */}
          <circle cx="186" cy="132" r="3.4" fill="#e0f2fe" />
          <circle cx="208" cy="114" r="2.8" fill="#bae6fd" />
          <circle cx="232" cy="124" r="2.6" fill="#a5f3fc" />
          <circle cx="252" cy="136" r="2.2" fill="#67e8f9" />
          <circle cx="248" cy="166" r="2.5" fill="#67e8f9" />
          <circle cx="226" cy="148" r="3.2" fill="#e0f2fe" />
          <circle cx="204" cy="162" r="3" fill="#bae6fd" />
          <circle cx="182" cy="182" r="2.5" fill="#67e8f9" />
        </g>

        {/* Sparkling bright star accents in nodes */}
        <g fill="#ffffff">
          <circle cx="134" cy="132" r="1.4" />
          <circle cx="186" cy="132" r="1.4" />
          <circle cx="94" cy="148" r="1.2" />
          <circle cx="226" cy="148" r="1.2" />
          <circle cx="154" cy="120" r="1.5" />
          <circle cx="166" cy="120" r="1.5" />
        </g>

        {/* --- LUMINOUS CENTER SPINE BEAM --- */}
        {/* Soft spine beam */}
        <line
          x1="160"
          y1="75"
          x2="160"
          y2="242"
          stroke="url(#spineLight)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#nodeGlow)"
        />
        {/* Core white highlight beam */}
        <line
          x1="160"
          y1="82"
          x2="160"
          y2="225"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity="0.85"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
