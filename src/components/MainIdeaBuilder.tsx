  const [sessions, setSessions] = useState<AppSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('internship_logbook_sessions');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (err) {
        console.error('Failed to parse saved sessions:', err);
      }
    }
    return [];
  });
