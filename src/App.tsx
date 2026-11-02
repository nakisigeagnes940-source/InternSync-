import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { SplashScreen } from './components/SplashScreen';
import { MainIdeaBuilder } from './components/MainIdeaBuilder';
import { PasswordLockModal } from './components/PasswordLockModal';
import { UserNamePromptModal } from './components/UserNamePromptModal';
import { GoogleAuthButton } from './components/GoogleAuthButton';
import { auth, onAuthStateChanged, logoutUser, User } from './lib/firebase';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'splash' | 'main'>('splash');
  const [showDevModal, setShowDevModal] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className={`w-full min-h-[100dvh] flex items-center justify-center ${theme === 'light' ? 'bg-[#edf2f7] text-gray-800' : 'bg-[#131314] text-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading InternSync...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className={`w-full min-h-[100dvh] flex flex-col items-center justify-center ${theme === 'light' ? 'bg-[#edf2f7]' : 'bg-[#131314]'}`}>
        <div className="w-full max-w-md mx-auto p-4">
          <GoogleAuthButton />
        </div>
      </main>
    );
  }

  return (
    <main
      className={`w-full min-h-[100dvh] overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#edf2f7]' : 'bg-[#131314]'
      }`}
      id="app-root"
    >
      <header className={`flex justify-between items-center px-6 py-3 border-b ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1e1f20] border-gray-800'}`}>
        <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
          Welcome, {user.displayName || user.email}
        </span>
        <button
          onClick={() => logoutUser()}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </header>

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
                  if (!savedName && user.displayName) {
                    localStorage.setItem('internsync_user_name', user.displayName);
                  }
                  if (!savedName && !user.displayName) {
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
