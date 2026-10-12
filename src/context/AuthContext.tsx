import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { isAdminUser } from '../services/roles';
import { LocalStore } from '../services/store';

interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoAdmin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN: AdminUser = { id: 'demo-admin', email: 'admin@local.demo', displayName: 'Demo Admin' };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Live Firebase: only users with an admin role document stay signed in
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const admin = await isAdminUser(firebaseUser.uid);
        if (admin) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          });
        } else {
          setUser(null);
          await signOut(auth);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }

    // No Firebase keys: local demo mode (admin session remembered in the browser)
    setUser(LocalStore.isDemoAdmin() ? DEMO_ADMIN : null);
    setIsLoading(false);
  }, []);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, error: 'Firebase is not configured. Add your keys to the .env file.' };
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const admin = await isAdminUser(result.user.uid);
      if (!admin) {
        await signOut(auth);
        return { success: false, error: 'This Google account is not authorised as an admin.' };
      }
      setUser({
        id: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
      });
      return { success: true };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in was cancelled.' };
      }
      return { success: false, error: err.message || 'Google sign-in failed.' };
    }
  };

  // Email and password sign-in (the account must exist in Firebase Authentication)
  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, error: 'Firebase is not configured. Add your keys to the .env file.' };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      // NOTE: admin role is checked by onAuthStateChanged once the session updates,
      // so we just set the signed-in user here.
      setUser({
        id: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
      });
      return { success: true };
    } catch (err: any) {
      switch (err?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return { success: false, error: 'Incorrect email or password.' };
        case 'auth/invalid-email':
          return { success: false, error: 'Please enter a valid email address.' };
        case 'auth/user-disabled':
          return { success: false, error: 'This account has been disabled.' };
        case 'auth/too-many-requests':
          return { success: false, error: 'Too many attempts. Please wait a few minutes and try again.' };
        case 'auth/network-request-failed':
          return { success: false, error: 'Network error. Check your internet connection.' };
        case 'auth/operation-not-allowed':
          return { success: false, error: 'Email and password sign-in is not enabled in Firebase.' };
        default:
          return { success: false, error: err?.message || 'Sign-in failed.' };
      }
    }
  };

  const loginDemoAdmin = () => {
    LocalStore.setDemoAdmin(true);
    setUser(DEMO_ADMIN);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signout failed:', e);
      }
    }
    LocalStore.setDemoAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user),
        isAuthenticated: Boolean(user),
        isLoading,
        isFirebaseConnected: isFirebaseConfigured,
        loginWithGoogle,
        loginWithEmail,
        loginDemoAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
