import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface UserNamePromptModalProps {
  isOpen: boolean;
  onComplete: (name: string) => void;
}

export const UserNamePromptModal: React.FC<UserNamePromptModalProps> = ({ isOpen, onComplete }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim() || 'Guest Student';
    localStorage.setItem('logbook_user_name', trimmed);

    // Save visitor with real name to Firestore
    try {
      let deviceId = localStorage.getItem('logbook_device_id');
      if (!deviceId) {
        deviceId = `device-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
        localStorage.setItem('logbook_device_id', deviceId);
      }

      const ua = navigator.userAgent.toLowerCase();
      let osName = 'Desktop';
      if (/iphone|ipad|ipod/.test(ua)) osName = 'iPhone';
      else if (/android/.test(ua)) osName = 'Android';
      else if (/mac/.test(ua)) osName = 'Mac';
      else if (/win/.test(ua)) osName = 'Windows';

      const browser = /chrome/.test(ua) ? 'Chrome' : /safari/.test(ua) ? 'Safari' : 'Browser';
      const deviceSignature = `${osName} (${browser})`;

      const visitorRef = doc(db, 'app_visitors', deviceId);
      await setDoc(visitorRef, {
        deviceId,
        userName: trimmed,
        deviceInfo: deviceSignature,
        lastActive: Date.now(),
        userAgent: navigator.userAgent,
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to record visitor name:', err);
    }

    onComplete(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors text-center ${
          isLight
            ? 'bg-white border-[#d5e2ed] text-[#1e3a5f]'
            : 'bg-[#1e1f20] border-white/15 text-[#e3e2e6]'
        }`}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 rounded-2xl mb-3 bg-blue-500/10 border border-blue-500/20 text-blue-500">
            <Sparkles size={32} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
            {greeting}!
          </span>
          <h2 className={`text-2xl font-bold tracking-tight mb-2 ${isLight ? 'text-[#1e3a5f]' : 'text-white'}`}>
            How may I call you?
          </h2>
          <p className={`text-xs ${isLight ? 'text-[#486581]' : 'text-[#9ca3af]'}`}>
            Please enter your name to personalize your logbook.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border font-medium outline-none transition-all ${
                isLight
                  ? 'bg-[#f8fafc] border-[#cbd8e6] text-[#1e3a5f] focus:border-[#1e3a5f]'
                  : 'bg-[#2a2b2d] border-white/10 text-white focus:border-[#a8c7fa]'
              }`}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] ${
              isLight
                ? 'bg-[#1e3a5f] hover:bg-[#152943] text-white'
                : 'bg-[#a8c7fa] hover:bg-[#92b5f0] text-[#041e49]'
            }`}
          >
            <span>Continue to Logbook</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
