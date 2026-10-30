import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firestore safely
export const db = getFirestore(app, "ai-studio-internsync-90160725-742d-4a4f-ab0e-7788742fe611");

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
