import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('your-firebase-api-key') &&
  !firebaseConfig.projectId.includes('your-firebase-project-id')
);

// If keys are provided, initialize real Firebase; otherwise, initialize a mock fallback app
const app = getApps().length > 0
  ? getApp()
  : initializeApp(isFirebaseConfigured ? firebaseConfig : {
      apiKey: 'demo-api-key-placeholder',
      authDomain: 'mbu-acm-chapter.firebaseapp.com',
      projectId: 'mbu-acm-chapter',
      storageBucket: 'mbu-acm-chapter.appspot.com',
      messagingSenderId: '123456789012',
      appId: '1:123456789012:web:abcdef123456',
    });

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
