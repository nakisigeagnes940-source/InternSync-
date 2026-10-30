import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Trash2,
  Clock,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  MessageSquare,
} from 'lucide-react';
import { AppSession } from '../types';
import { useTheme } from '../ThemeContext';
import { AppLogo } from './AppLogo';

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: AppSession[];
  activeSessionId: string | null;
  onSelectSession: (session: AppSession) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAll,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
            id="history-sidebar-backdrop"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 310 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 h-[100dvh] flex flex-col overflow-hidden border-r transition-colors duration-300 ${
          isLight
            ? 'bg-[#ffffff] border-[#d5e2ed] text-[#1e3a5f]'
            : 'bg-[#18191b] border-white/10 text-[#e3e2e6]'
        } ${!isOpen ? 'pointer-events-none md:border-r-0' : ''}`}
        id="history-sidebar"
        aria-label="App Ideas History"
      >
        <div className="w-[310px] h-full flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
            <div className="flex items-center gap-2.5">
              <AppLogo size={24} animated={false} />
              <div>
                <h2 className="font-semibold text-sm tracking-tight">Logbook Entries</h2>
                <p className={`text-[11px] ${isLight ? 'text-[#64748b]' : 'text-[#8e918f]'}`}>
                  {sessions.length} {sessions.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'hover:bg-[#edf2f7] text-[#506882]' : 'hover:bg-white/10 text-[#c4c6d0]'
              }`}
              title="Collapse sidebar"
              aria-label="Collapse history sidebar"
              id="btn-collapse-sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* New Logbook Entry Button */}
          <button
            onClick={onNewSession}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer shadow-xs mb-3 ${
              isLight
                ? 'bg-[#1e3a5f] text-white hover:bg-[#152a45] active:scale-[0.98]'
                : 'bg-[#a8c7fa] text-[#041e49] hover:bg-[#b8d2fa] active:scale-[0.98]'
            }`}
            id="btn-new-logbook-entry"
          >
            <Plus className="w-4 h-4" />
            <span>New Logbook Entry</span>
          </button>

          {/* Search Filter */}
          {sessions.length > 2 && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs mb-3 border ${
                isLight
                  ? 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e3a5f]'
                  : 'bg-[#1e1f20] border-white/5 text-[#e3e2e6]'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-50 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search past logbook entries..."
                className="w-full bg-transparent border-none outline-none placeholder:text-slate-400 text-xs"
                id="input-search-history"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="opacity-50 hover:opacity-100 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Session List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                <Clock className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs font-medium opacity-60">No logbook entries found</p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    className={`group relative flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-150 text-left border ${
                      isActive
                        ? isLight
                          ? 'bg-[#edf4fc] border-[#bfdbfe] text-[#1e3a5f] shadow-2xs'
                          : 'bg-[#282a2c] border-[#a8c7fa]/30 text-white shadow-2xs'
                        : isLight
                        ? 'bg-transparent border-transparent hover:bg-[#f1f5f9] text-[#334155]'
                        : 'bg-transparent border-transparent hover:bg-white/5 text-[#c4c6d0]'
                    }`}
                    id={`session-item-${session.id}`}
                  >
                    {/* Status / Category Icon */}
                    <div className="mt-0.5 shrink-0">
                      {isActive ? (
                        <Sparkles
                          className={`w-4 h-4 ${
                            isLight ? 'text-[#2563eb]' : 'text-[#a8c7fa]'
                          }`}
                        />
                      ) : (
                        <MessageSquare className="w-4 h-4 opacity-40 group-hover:opacity-75 transition-opacity" />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-medium truncate block">
                          {session.title}
                        </span>
                        <span className="text-[10px] opacity-50 shrink-0 font-mono">
                          {session.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] opacity-65 truncate leading-tight">
                        {session.prompt}
                      </p>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/15 hover:text-rose-500 transition-all shrink-0 cursor-pointer"
                      title="Delete session"
                      aria-label="Delete this session"
                      id={`btn-delete-${session.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
            <span className={`text-[11px] ${isLight ? 'text-[#64748b]' : 'text-[#8e918f]'}`}>
              Auto-saved locally
            </span>

            {sessions.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-rose-500/80 hover:text-rose-500 transition-colors cursor-pointer"
                id="btn-clear-all-sessions"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
