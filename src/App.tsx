import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { SplashScreen } from './components/SplashScreen';
import { MainIdeaBuilder } from './components/MainIdeaBuilder';
import { PasswordLockModal } from './components/PasswordLockModal';
import { UserNamePromptModal } from './components/UserNamePromptModal';

function AppContent() {
  const [currentView, setCurrentView] = useState<'splash' | 'main'>('splash');
  const [showDevModal, setShowDevModal] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const { theme } = useTheme();

  return (
    <main
      className={`w-full min-h-[100dvh] overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#edf2f7]' : 'bg-[#131314]'
      }`}
      id="app-root"
    >
      <AnimatePresence mode="wait">
        {currentView === 'splash' ? (
          <motion.div
            key="splash-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <SplashScreen
              onProceed={() => {
                try {
                  const savedName = localStorage.getItem('internsync_user_name') || localStorage.getItem('logbook_user_name');
                  setCurrentView('main');
                  if (!savedName) {
                    setShowNamePrompt(true);
                  }
                } catch {
                  setCurrentView('main');
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <MainIdeaBuilder onOpenDevStats={() => setShowDevModal(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <UserNamePromptModal
        isOpen={showNamePrompt}
        onComplete={() => {
          setShowNamePrompt(false);
          setCurrentView('main');
        }}
      />

      <PasswordLockModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
      />
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
