import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';

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
  !firebaseConfig.projectId.includes('your-project-id')
);

// If keys are provided, initialize real Firebase; otherwise, initialize a placeholder app (local demo data)
const app = getApps().length > 0
  ? getApp()
  : initializeApp(isFirebaseConfigured ? firebaseConfig : {
      apiKey: 'demo-api-key-placeholder',
      authDomain: 'mbu-acm-chapter.firebaseapp.com',
      projectId: 'mbu-acm-chapter',
      appId: '1:123456789012:web:abcdef123456',
    });

export const auth = getAuth(app);

// Ignore empty (undefined) optional fields instead of throwing an error
let firestore: Firestore;
try {
  firestore = initializeFirestore(app, { ignoreUndefinedProperties: true });
} catch {
  firestore = getFirestore(app); // already initialised (hot reload)
}
export const db = firestore;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
