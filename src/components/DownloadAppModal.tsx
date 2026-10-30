import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Check, 
  X, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { AppLogo } from './AppLogo';
import { useTheme } from '../ThemeContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { isInstallable, isInIframe, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleInstallClick = async () => {
    localStorage.setItem('logbook_app_installed', 'true');
    await install();
    setInstallSuccess(true);
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none overflow-y-auto"
        id="download-app-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl border transition-colors duration-300 text-center ${
            isLight
              ? 'bg-white border-[#d5e2ed] text-[#1e3a5f]'
              : 'bg-[#1e1f20] border-white/10 text-[#e3e2e6]'
          }`}
          id="download-app-modal-content"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
              isLight
                ? 'hover:bg-[#f1f5f9] text-[#64748b]'
                : 'hover:bg-[#2a2b2d] text-[#9ca3af]'
            }`}
            title="Close"
            id="btn-close-download-modal"
          >
            <X size={18} />
          </button>

          {/* Header with App Logo */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <AppLogo
                size={72}
                className={isLight ? 'text-[#1e3a5f]' : 'text-[#a8c7fa]'}
                animated={true}
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <Check size={14} strokeWidth={3} />
              </span>
            </div>

            <h2 
              className={`text-xl font-bold tracking-tight mb-2 ${
                isLight ? 'text-[#1e3a5f]' : 'text-white'
              }`}
              id="download-modal-title"
            >
              Install Logbook App
            </h2>

            <p 
              className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                isLight ? 'text-[#486581]' : 'text-[#9ca3af]'
              }`}
            >
              Add Logbook to your device home screen for quick, one-tap access on shift.
            </p>
          </div>

          {/* Single Install Button */}
          <div className="flex flex-col gap-3">
            {installSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center text-xs font-medium flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                <span>Successfully Installed!</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className={`w-full py-3 px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] ${
                  isLight
                    ? 'bg-[#1e3a5f] hover:bg-[#152943] text-white shadow-blue-900/20'
                    : 'bg-[#a8c7fa] hover:bg-[#92b5f0] text-[#041e49] shadow-blue-500/10'
                }`}
                id="btn-confirm-download-app"
              >
                <Download size={18} />
                <span>Install the App</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`w-full py-2 px-4 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                isLight
                  ? 'text-[#64748b] hover:text-[#1e3a5f] hover:bg-[#f1f5f9]'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#2a2b2d]'
              }`}
              id="btn-dismiss-download-modal"
            >
              Continue in Web Browser
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
