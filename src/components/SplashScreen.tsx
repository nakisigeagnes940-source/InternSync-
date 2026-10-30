import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AppLogo } from './AppLogo';
import { IndicatorDots } from './IndicatorDots';
import { useTheme } from '../ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
  onProceed?: () => void;
  autoProceedDelayMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
  onProceed,
  autoProceedDelayMs = 3200,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Automatically transition to the main typing area when the splash screen duration concludes
  useEffect(() => {
    if (!onProceed) return;

    const timer = setTimeout(() => {
      onProceed();
    }, autoProceedDelayMs);

    return () => clearTimeout(timer);
  }, [onProceed, autoProceedDelayMs]);

  return (
    <motion.div
      onClick={onProceed}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={onAnimationComplete}
      className={`relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none font-['Montserrat',sans-serif] cursor-pointer transition-colors duration-300 ${
        isLight ? 'text-[#1e3a5f]' : 'bg-[#131314] text-[#e3e2e6]'
      }`}
      id="splash-screen-root"
      style={
        isLight
          ? {
              background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 50%, #dbe3ed 100%)',
            }
          : {
              background: 'linear-gradient(180deg, #131314 0%, #1a1c1e 50%, #101112 100%)',
            }
      }
    >
      {/* Top Bar with Theme Toggle */}
      <div
        className="absolute top-4 right-4 z-30"
        onClick={(e) => e.stopPropagation()}
        id="splash-theme-toggle-container"
      >
        <ThemeToggle />
      </div>

      {/* Central Content: App Logo and Title */}
      <div
        className="flex flex-col items-center justify-center text-center px-4"
        id="splash-brand-content"
      >
        <div className="p-4 rounded-3xl shadow-xl mb-4 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10">
          <AppLogo
            size={100}
            className={isLight ? 'text-[#1e3a5f]' : 'text-[#a8c7fa]'}
            animated={true}
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isLight ? 'text-[#1e3a5f]' : 'text-white'
          }`}
        >
          Logbook
        </motion.h1>
      </div>

      {/* Animated Loading Dots positioned at bottom: 50px */}
      <div
        className="absolute bottom-[50px] inset-x-0 mx-auto flex items-center justify-center"
        id="splash-dots-container"
      >
        <IndicatorDots
          initialIndex={2}
          autoPlay={true}
          intervalMs={900}
        />
      </div>
    </motion.div>
  );
};
