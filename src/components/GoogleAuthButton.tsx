import React, { useState, useEffect } from 'react';
import { signInWithGoogle } from '../lib/firebase';

export const GoogleAuthButton: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      window.location.reload();
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? '#0b0f19' : '#f3f4f6',
        color: isDark ? '#ffffff' : '#111827',
        padding: '1.5rem',
        zIndex: 9999,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Top Header Controls - Theme Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{
            background: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            color: isDark ? '#f9fafb' : '#1f2937',
            padding: '0.6rem',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {isDark ? (
            /* Sun Icon for Light Mode switch */
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            /* Moon Icon for Dark Mode switch */
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* App Logo */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <img
          src="/pwa-192x192.png"
          alt="InternSync Logo"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          }}
        />
      </div>

      {/* Heading Text */}
      <h1
        style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          textAlign: 'center',
          color: isDark ? '#ffffff' : '#111827',
        }}
      >
        Welcome to InternSync
      </h1>

      <p
        style={{
          fontSize: '0.95rem',
          color: isDark ? '#9ca3af' : '#4b5563',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '320px',
        }}
      >
        Sign in with your Google account to start logging daily tasks
      </p>

      {/* Google Sign-In Button */}
      <button
        onClick={handleLogin}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '300px',
          padding: '0.85rem 1.5rem',
          borderRadius: '14px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.14v3.15C3.15 21.36 7.23 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.14C.41 8.08 0 9.74 0 12s.41 3.92 1.14 5.4l4.14-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.64 1.14 6.6l4.14 3.15c.95-2.84 3.6-4.95 6.72-4.95z" />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
};
