import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex items-center gap-1.5 p-1 rounded-full cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        isDark
          ? 'bg-[#1e1f20] hover:bg-[#282a2c] text-[#c4c6d0] border border-white/10'
          : 'bg-[#e2eaf2] hover:bg-[#d5e2ed] text-[#1e3a5f] border border-[#cbd8e6]'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      id="theme-toggle-switch"
    >
      {/* Light Icon */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 z-10 ${
          !isDark ? 'text-[#1e3a5f]' : 'text-slate-500'
        }`}
      >
        <Sun className="w-4 h-4" />
      </div>

      {/* Dark Icon */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 z-10 ${
          isDark ? 'text-[#a8c7fa]' : 'text-slate-400'
        }`}
      >
        <Moon className="w-4 h-4" />
      </div>

      {/* Sliding Pill Indicator */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className={`absolute top-1 bottom-1 w-7 rounded-full shadow-xs ${
          isDark ? 'left-[calc(100%-2rem)] bg-[#2c2d30]' : 'left-1 bg-white'
        }`}
      />
    </button>
  );
};
