import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAifCj3wIbgOazj2atjPDtzbKAFPu4Ry78",
  authDomain: "predictive-coder-1xjsq.firebaseapp.com",
  projectId: "predictive-coder-1xjsq",
  storageBucket: "predictive-coder-1xjsq.firebasestorage.app",
  messagingSenderId: "617920453540",
  appId: "1:617920453540:web:c500593e6ec14fc9717f31"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with robust local offline persistence cache to prevent network timeout warnings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, "ai-studio-logbookaibuildyo-593763b5-abd1-4d37-98c4-0ffcdd0d95a9");

export async function ensureAuthenticated(): Promise<string> {
  try {
    let uid = localStorage.getItem('logbook_user_id');
    if (!uid) {
      uid = `user-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
      localStorage.setItem('logbook_user_id', uid);
    }
    return uid;
  } catch (err) {
    return 'default-user';
  }
}
