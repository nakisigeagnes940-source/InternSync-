import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';

interface IndicatorDotsProps {
  initialIndex?: number;
  activeIndex?: number;
  onSelect?: (index: number) => void;
  autoPlay?: boolean;
  intervalMs?: number;
}

export const IndicatorDots: React.FC<IndicatorDotsProps> = ({
  initialIndex = 2,
  activeIndex: controlledIndex,
  onSelect,
  autoPlay = true,
  intervalMs = 1200,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [internalIndex, setInternalIndex] = useState(initialIndex);

  const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setInternalIndex((prev) => (prev + 1) % 3);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlay, intervalMs]);

  const handleDotClick = (index: number) => {
    setInternalIndex(index);
    onSelect?.(index);
  };

  return (
    <div
      className="flex items-center justify-center gap-3 py-2"
      id="splash-loading-dots"
      role="tablist"
      aria-label="Loading indicators"
    >
      {[0, 1, 2].map((index) => {
        const isActive = currentIndex === index;

        return (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
              isActive
                ? isLight
                  ? 'opacity-100 scale-125 bg-[#1e3a5f] shadow-[0_0_10px_rgba(30,58,95,0.45)]'
                  : 'opacity-100 scale-125 bg-[#a8c7fa] shadow-[0_0_12px_rgba(168,199,250,0.7)]'
                : isLight
                ? 'opacity-35 bg-[#64748b] hover:opacity-60'
                : 'opacity-35 bg-[#8e918f] hover:opacity-60'
            }`}
            aria-label={`Step ${index + 1}`}
            aria-selected={isActive}
            role="tab"
          />
        );
      })}
    </div>
  );
};
