import React from 'react';
import { Zap } from 'lucide-react';

interface GenerationLimitBadgeProps {
  remaining: number | null;
  max?: number;
  isLight?: boolean;
}

export const GenerationLimitBadge: React.FC<GenerationLimitBadgeProps> = ({
  remaining,
  max = 3,
  isLight = true,
}) => {
  const currentRemaining = remaining !== null ? remaining : max;
  const percentage = Math.max(0, Math.min(100, (currentRemaining / max) * 100));

  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2 rounded-2xl border transition-all duration-300 ${
        isLight
          ? 'bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border-blue-200/80 text-blue-900 shadow-sm'
          : 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border-blue-800/50 text-blue-200 shadow-lg'
      }`}
      id="generation-limit-badge"
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center ${
            isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/60 text-blue-300'
          }`}
        >
          <Zap className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
            Daily Free Quota
          </span>
          <span className="text-xs font-bold">
            Generations remaining: {currentRemaining}/{max}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              currentRemaining === 0
                ? 'bg-rose-500'
                : currentRemaining === 1
                ? 'amber-500 bg-amber-500'
                : 'bg-blue-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold opacity-80">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};
