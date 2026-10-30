import React from 'react';
import { motion } from 'motion/react';

interface TechBookLogoProps {
  className?: string;
  size?: number;
}

export const TechBookLogo: React.FC<TechBookLogoProps> = ({
  className = '',
  size = 220,
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0px 10px 20px rgba(27, 43, 76, 0.15))',
      }}
      id="tech-book-logo-wrapper"
    >
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Outer Cover Gradient */}
          <linearGradient id="coverGrad" x1="0" y1="0" x2="200" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2a5268" />
            <stop offset="100%" stopColor="#192d3f" />
          </linearGradient>
          
          {/* Inner Pages Teal Glow */}
          <linearGradient id="pageGrad" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4aa3b3" />
            <stop offset="100%" stopColor="#27566b" />
          </linearGradient>
        </defs>

        {/* Book Outer Cover */}
        <path
          d="M100 28 C125 18, 170 18, 190 28 V138 C170 128, 125 128, 100 138 C75 128, 30 128, 10 138 V28 C30 18, 75 18, 100 28 Z"
          fill="url(#coverGrad)"
        />
        
        {/* Inner Pages Overlay */}
        <path
          d="M100 32 C122 23, 165 23, 184 32 V132 C165 123, 122 123, 100 132 C78 123, 35 123, 16 132 V32 C35 23, 78 23, 100 32 Z"
          fill="url(#pageGrad)"
        />
        
        {/* Spine Divider */}
        <line x1="100" y1="32" x2="100" y2="132" stroke="#122332" strokeWidth="3" />

        {/* Tech Circuit Lines & Nodes Left Side */}
        <g stroke="#9bf3f0" strokeWidth="1.2" opacity="0.85">
          <path d="M 30 45 L 60 45 L 75 60 L 90 60" />
          <path d="M 25 70 L 45 70 L 60 85 L 90 85" />
          <path d="M 35 110 L 55 110 L 70 95 L 90 95" />
          <path d="M 40 120 L 70 120" />
          
          {/* Nodes */}
          <circle cx="30" cy="45" r="2.5" fill="#9bf3f0" />
          <circle cx="60" cy="45" r="2.5" fill="#9bf3f0" />
          <circle cx="75" cy="60" r="2.5" fill="#9bf3f0" />
          
          <circle cx="25" cy="70" r="2.5" fill="#9bf3f0" />
          <circle cx="45" cy="70" r="2.5" fill="#9bf3f0" />
          <circle cx="60" cy="85" r="2.5" fill="#9bf3f0" />

          <circle cx="35" cy="110" r="2.5" fill="#9bf3f0" />
          <circle cx="70" cy="95" r="2.5" fill="#9bf3f0" />
          <circle cx="70" cy="120" r="2.5" fill="#9bf3f0" />
        </g>

        {/* Tech Circuit Lines & Nodes Right Side */}
        <g stroke="#9bf3f0" strokeWidth="1.2" opacity="0.85">
          <path d="M 170 45 L 140 45 L 125 60 L 110 60" />
          <path d="M 175 70 L 155 70 L 140 85 L 110 85" />
          <path d="M 165 110 L 145 110 L 130 95 L 110 95" />
          <path d="M 160 120 L 130 120" />

          {/* Nodes */}
          <circle cx="170" cy="45" r="2.5" fill="#9bf3f0" />
          <circle cx="140" cy="45" r="2.5" fill="#9bf3f0" />
          <circle cx="125" cy="60" r="2.5" fill="#9bf3f0" />

          <circle cx="175" cy="70" r="2.5" fill="#9bf3f0" />
          <circle cx="155" cy="70" r="2.5" fill="#9bf3f0" />
          <circle cx="140" cy="85" r="2.5" fill="#9bf3f0" />

          <circle cx="165" cy="110" r="2.5" fill="#9bf3f0" />
          <circle cx="130" cy="95" r="2.5" fill="#9bf3f0" />
          <circle cx="130" cy="120" r="2.5" fill="#9bf3f0" />
        </g>

        {/* Constellation Data Grid Stars */}
        <g fill="#ffffff">
          <circle cx="100" cy="50" r="2" opacity="0.9" />
          <circle cx="85" cy="70" r="1.5" opacity="0.8" />
          <circle cx="115" cy="70" r="1.5" opacity="0.8" />
          <circle cx="100" cy="90" r="2.5" opacity="1" />
          <circle cx="75" cy="100" r="1.5" opacity="0.7" />
          <circle cx="125" cy="100" r="1.5" opacity="0.7" />
        </g>
      </svg>
    </motion.div>
  );
};
