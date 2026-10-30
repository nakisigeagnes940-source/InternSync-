import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, Check, Smartphone, ShieldCheck, AlertCircle, X, Users, Globe } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { db } from '../lib/firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

interface PasswordLockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VisitorRecord {
  deviceId: string;
  userName?: string;
  deviceInfo?: string;
  lastActive: number;
  userAgent?: string;
}

export const PasswordLockModal: React.FC<PasswordLockModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [visitorsList, setVisitorsList] = useState<VisitorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Record current device as a visitor in background on mount
    async function recordVisit() {
      try {
        let deviceId = localStorage.getItem('logbook_device_id');
        if (!deviceId) {
          const ua = navigator.userAgent.toLowerCase();
          let osName = 'Desktop PC';
          if (/iphone|ipad|ipod/.test(ua)) osName = 'iPhone / iOS';
          else if (/android/.test(ua)) osName = 'Android Phone';
          else if (/mac/.test(ua)) osName = 'Mac';
          else if (/win/.test(ua)) osName = 'Windows PC';
          else if (/linux/.test(ua)) osName = 'Linux PC';

          const browser = /chrome/.test(ua) ? 'Chrome' : /safari/.test(ua) ? 'Safari' : /firefox/.test(ua) ? 'Firefox' : 'Browser';
          const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
          deviceId = `${osName} • ${browser} [${uniqueId}]`;
          localStorage.setItem('logbook_device_id', deviceId);
        }

        const visitorRef = doc(db, 'app_visitors', deviceId);
        await setDoc(visitorRef, {
          deviceId,
          lastActive: Date.now(),
          userAgent: navigator.userAgent,
        }, { merge: true });
      } catch (err) {
        console.warn('Visitor tracking error:', err);
      }
    }
    recordVisit();
  }, []);

  useEffect(() => {
    async function fetchVisitorStats() {
      if (isUnlocked) {
        setIsLoading(true);
        try {
          const snapshot = await getDocs(collection(db, 'app_visitors'));
          const list: VisitorRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as VisitorRecord;
            if (data.userName && data.userName.trim() !== '' && !data.userName.toLowerCase().includes('student')) {
              list.push(data);
            }
          });
          setVisitorCount(list.length);
          list.sort((a, b) => b.lastActive - a.lastActive);
          setVisitorsList(list);
        } catch (err) {
          console.warn('Visitor stats error:', err);
          setVisitorCount(0);
          setVisitorsList([]);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchVisitorStats();
  }, [isUnlocked]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'immy') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password. Developer access only.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsUnlocked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors ${
          isLight
            ? 'bg-white border-[#d5e2ed] text-[#1e3a5f]'
            : 'bg-[#1e1f20] border-white/15 text-[#e3e2e6]'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
              {isUnlocked ? <Users size={28} /> : <Lock size={28} />}
            </div>
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-[#1e3a5f]' : 'text-white'}`}>
                {isUnlocked ? 'Developer Visitor Stats' : 'Developer Access'}
              </h2>
              <p className={`text-xs ${isLight ? 'text-[#486581]' : 'text-[#9ca3af]'}`}>
                {isUnlocked ? 'Unique phone & device access analytics' : 'Enter developer password to view stats'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border font-medium outline-none transition-all ${
                  isLight
                    ? 'bg-[#f8fafc] border-[#cbd8e6] text-[#1e3a5f] focus:border-[#1e3a5f]'
                    : 'bg-[#2a2b2d] border-white/10 text-white focus:border-[#a8c7fa]'
                }`}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] ${
                isLight
                  ? 'bg-[#1e3a5f] hover:bg-[#152943] text-white'
                  : 'bg-[#a8c7fa] hover:bg-[#92b5f0] text-[#041e49]'
              }`}
            >
              <ShieldCheck size={18} />
              <span>View Developer Stats</span>
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className={`p-5 rounded-2xl border text-center ${
              isLight ? 'bg-blue-50/50 border-blue-100' : 'bg-blue-950/20 border-blue-500/20'
            }`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 block mb-1">
                Total Unique Devices & Phones
              </span>
              <div className={`text-4xl font-extrabold ${isLight ? 'text-[#1e3a5f]' : 'text-white'}`}>
                {visitorCount !== null ? visitorCount : 'Loading...'}
              </div>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Every unique phone, tablet, or browser accessing Logbook is automatically tracked.
              </p>
            </div>

            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Recent Visitor Devices
              </h3>
              <div className={`max-h-48 overflow-y-auto rounded-xl border divide-y ${
                isLight ? 'border-slate-200 divide-slate-100 bg-slate-50' : 'border-white/10 divide-white/5 bg-[#252628]'
              }`}>
                {isLoading ? (
                  <div className="p-6 text-center text-xs text-slate-400">Loading visitor records...</div>
                ) : visitorsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No visitors recorded yet.</div>
                ) : (
                  visitorsList.map((v, idx) => (
                    <div key={v.deviceId || idx} className="p-3 text-left flex items-start justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-xs truncate ${isLight ? 'text-[#1e3a5f]' : 'text-white'}`}>
                          👤 {v.userName}
                        </div>
                        <div className="font-mono text-[10px] text-blue-500 truncate mt-0.5">
                          {v.deviceInfo || v.deviceId}
                        </div>
                      </div>
                      <div className="text-[10px] text-right shrink-0 opacity-75">
                        {new Date(v.lastActive).toLocaleDateString()} {new Date(v.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              Close Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
