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
