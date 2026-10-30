import React from 'react';
import { motion } from 'motion/react';
import logbookPng from '../assets/images/1158622-200.png';

interface AppLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  color?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 64,
  className = '',
  animated = false,
  color,
}) => {
  const isLarge = size >= 60;

  const content = (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id={`app-logo-${size}`}
    >
      {/* Dynamic Ambient Aura for larger placements (Splash & Hero) */}
      {isLarge && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, rgba(100, 210, 240, 0.35) 0%, rgba(30, 58, 95, 0.15) 60%, transparent 85%)',
            filter: size >= 100 ? 'blur(22px)' : 'blur(12px)',
            transform: 'scale(1.25)',
          }}
        />
      )}

      {/* The Exact Logbook Checkmark Logo Asset */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-200"
        style={{
          color: color || 'currentColor',
        }}
      >
        {/* CSS Masked Layer to ensure dynamic theming and color adaptation */}
        <div
          className="w-full h-full transition-colors duration-200"
          style={{
            backgroundColor: color || 'currentColor',
            WebkitMaskImage: `url(${logbookPng})`,
            maskImage: `url(${logbookPng})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
          aria-hidden="true"
        />

        {/* Accessible hidden label */}
        <span className="sr-only">Internship Logbook Logo</span>
      </div>
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="inline-flex items-center justify-center"
    >
      {content}
    </motion.div>
  );
};
