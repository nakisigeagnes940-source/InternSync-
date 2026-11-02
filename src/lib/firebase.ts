import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  signInAnonymously 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAifCj3wIbgOazj2atjPDtzbKAFPu4Ry78",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "predictive-coder-1xjsq.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "predictive-coder-1xjsq",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "predictive-coder-1xjsq.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "617920453540",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:617920453540:web:c500593e6ec14fc9717f31"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore safely
export const db = getFirestore(app, "ai-studio-internsync-90160725-742d-4a4f-ab0e-7788742fe611");

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return null;
  }
};

export const logoutUser = () => signOut(auth);
export { onAuthStateChanged };
export type { User };

export async function ensureAuthenticated(): Promise<string> {
  try {
    if (auth && auth.currentUser) {
      return auth.currentUser.uid;
    }
    if (auth && !auth.currentUser) {
      try {
        const cred = await signInAnonymously(auth);
        if (cred.user) return cred.user.uid;
      } catch (authErr) {
        console.warn('Anonymous sign-in notice:', authErr);
      }
    }
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
