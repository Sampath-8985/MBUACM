import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { getProfile, getUserRole, updateProfile } from '../services/profiles';
import { DEMO_ADMIN_PROFILE, DEMO_STUDENT_PROFILE } from '../lib/mockData';

interface AuthContextType {
  user: { id: string; email: string; displayName?: string; photoURL?: string } | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'admin' | 'student' | 'guest') => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACTIVE_KEY = 'mbu_acm_demo_active_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; displayName?: string; photoURL?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth state
  useEffect(() => {
    let isMounted = true;

    // Case 1: Live Firebase connected
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (!isMounted) return;

        if (firebaseUser) {
          const userObj = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          };
          setUser(userObj);

          let userProfile = await getProfile(firebaseUser.uid);
          if (!userProfile) {
            // Auto-create initial profile for Google / new auth user
            await updateProfile(firebaseUser.uid, {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'ACM Student',
              profile_completed: false,
            });
            userProfile = await getProfile(firebaseUser.uid);
          }

          const userRole = await getUserRole(firebaseUser.uid);
          setProfile(userProfile);
          setRole(userRole);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    }

    // Case 2: Demo / Local mode fallback
    async function initDemoAuth() {
      setIsLoading(true);
      const savedDemoUser = localStorage.getItem(DEMO_ACTIVE_KEY);

      if (savedDemoUser === 'admin') {
        const p = await getProfile(DEMO_ADMIN_PROFILE.id);
        setUser({ id: DEMO_ADMIN_PROFILE.id, email: DEMO_ADMIN_PROFILE.email, displayName: DEMO_ADMIN_PROFILE.full_name });
        setProfile(p || DEMO_ADMIN_PROFILE);
        setRole('admin');
      } else if (savedDemoUser === 'student') {
        const p = await getProfile(DEMO_STUDENT_PROFILE.id);
        setUser({ id: DEMO_STUDENT_PROFILE.id, email: DEMO_STUDENT_PROFILE.email, displayName: DEMO_STUDENT_PROFILE.full_name });
        setProfile(p || DEMO_STUDENT_PROFILE);
        setRole('user');
      } else if (savedDemoUser && savedDemoUser.startsWith('custom:')) {
        const customId = savedDemoUser.replace('custom:', '');
        const p = await getProfile(customId);
        if (p) {
          setUser({ id: p.id, email: p.email, displayName: p.full_name });
          setProfile(p);
          setRole('user');
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } else {
        // Default: logged in as Demo Student for instant interactive testing!
        const p = await getProfile(DEMO_STUDENT_PROFILE.id);
        setUser({ id: DEMO_STUDENT_PROFILE.id, email: DEMO_STUDENT_PROFILE.email, displayName: DEMO_STUDENT_PROFILE.full_name });
        setProfile(p || DEMO_STUDENT_PROFILE);
        setRole('user');
        localStorage.setItem(DEMO_ACTIVE_KEY, 'student');
      }

      setIsLoading(false);
    }

    initDemoAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const p = await getProfile(user.id);
    setProfile(p);
    const r = await getUserRole(user.id);
    setRole(r);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const userRole = await getUserRole(cred.user.uid);
        const userProfile = await getProfile(cred.user.uid);
        setUser({
          id: cred.user.uid,
          email: cred.user.email || '',
          displayName: cred.user.displayName || undefined,
          photoURL: cred.user.photoURL || undefined,
        });
        setRole(userRole);
        setProfile(userProfile);
        setIsLoading(false);
        return { success: true, role: userRole };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Invalid email or password.' };
      }
    }

    // Demo Mode simulated login
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === DEMO_ADMIN_PROFILE.email.toLowerCase() || cleanEmail.includes('admin')) {
      const p = await getProfile(DEMO_ADMIN_PROFILE.id);
      setUser({ id: DEMO_ADMIN_PROFILE.id, email: DEMO_ADMIN_PROFILE.email, displayName: DEMO_ADMIN_PROFILE.full_name });
      setProfile(p || DEMO_ADMIN_PROFILE);
      setRole('admin');
      localStorage.setItem(DEMO_ACTIVE_KEY, 'admin');
      setIsLoading(false);
      return { success: true, role: 'admin' };
    }

    if (cleanEmail === DEMO_STUDENT_PROFILE.email.toLowerCase() || cleanEmail.includes('student')) {
      const p = await getProfile(DEMO_STUDENT_PROFILE.id);
      setUser({ id: DEMO_STUDENT_PROFILE.id, email: DEMO_STUDENT_PROFILE.email, displayName: DEMO_STUDENT_PROFILE.full_name });
      setProfile(p || DEMO_STUDENT_PROFILE);
      setRole('user');
      localStorage.setItem(DEMO_ACTIVE_KEY, 'student');
      setIsLoading(false);
      return { success: true, role: 'user' };
    }

    // Any other email creates or logs in student
    const customId = `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '')}`;
    let existingProfile = await getProfile(customId);
    if (!existingProfile) {
      await updateProfile(customId, {
        id: customId,
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0],
        profile_completed: false,
      });
      existingProfile = await getProfile(customId);
    }

    setUser({ id: customId, email: cleanEmail, displayName: existingProfile?.full_name });
    setProfile(existingProfile);
    setRole('user');
    localStorage.setItem(DEMO_ACTIVE_KEY, `custom:${customId}`);
    setIsLoading(false);
    return { success: true, role: 'user' };
  };

  const signup = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const newProfile: UserProfile = {
          id: cred.user.uid,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          profile_completed: false,
          created_at: new Date().toISOString(),
        };

        await updateProfile(cred.user.uid, newProfile);
        setUser({
          id: cred.user.uid,
          email: cred.user.email || '',
          displayName: fullName.trim(),
        });
        setProfile(newProfile);
        setRole('user');
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Failed to create Firebase account.' };
      }
    }

    // Demo Mode Signup
    const cleanEmail = email.trim().toLowerCase();
    const customId = `user-${Date.now()}`;
    const newProfile: UserProfile = {
      id: customId,
      full_name: fullName.trim(),
      email: cleanEmail,
      profile_completed: false,
      created_at: new Date().toISOString(),
    };

    await updateProfile(customId, newProfile);
    setUser({ id: customId, email: cleanEmail, displayName: fullName.trim() });
    setProfile(newProfile);
    setRole('user');
    localStorage.setItem(DEMO_ACTIVE_KEY, `custom:${customId}`);
    setIsLoading(false);
    return { success: true };
  };

  // Google Authentication implementation
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const googleUser = result.user;

        let userProfile = await getProfile(googleUser.uid);
        if (!userProfile) {
          await updateProfile(googleUser.uid, {
            id: googleUser.uid,
            email: googleUser.email || '',
            full_name: googleUser.displayName || googleUser.email?.split('@')[0] || 'ACM Student',
            profile_completed: false,
          });
          userProfile = await getProfile(googleUser.uid);
        }

        const userRole = await getUserRole(googleUser.uid);
        setUser({
          id: googleUser.uid,
          email: googleUser.email || '',
          displayName: googleUser.displayName || undefined,
          photoURL: googleUser.photoURL || undefined,
        });
        setProfile(userProfile);
        setRole(userRole);
        setIsLoading(false);
        return { success: true, role: userRole };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Google Sign-in failed.' };
      }
    }

    // Demo Mode Google Sign-in simulation
    const googleDemoId = `google-student-${Date.now()}`;
    const googleProfile: UserProfile = {
      id: googleDemoId,
      full_name: 'Mohan Babu Scholar (Google Account)',
      email: 'student.acm@mbu.asia',
      branch: 'Computer Science & Engineering (CSE)',
      academic_year: '3rd Year (B.Tech)',
      profile_completed: true,
      created_at: new Date().toISOString(),
    };

    await updateProfile(googleDemoId, googleProfile);
    setUser({
      id: googleDemoId,
      email: googleProfile.email,
      displayName: googleProfile.full_name,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    });
    setProfile(googleProfile);
    setRole('user');
    localStorage.setItem(DEMO_ACTIVE_KEY, `custom:${googleDemoId}`);
    setIsLoading(false);
    return { success: true, role: 'user' };
  };

  const logout = async () => {
    setIsLoading(true);
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signout failed:', e);
      }
    }
    setUser(null);
    setProfile(null);
    setRole(null);
    localStorage.setItem(DEMO_ACTIVE_KEY, 'guest');
    setIsLoading(false);
  };

  const switchDemoRole = async (targetRole: 'admin' | 'student' | 'guest') => {
    if (targetRole === 'admin') {
      const p = await getProfile(DEMO_ADMIN_PROFILE.id);
      setUser({ id: DEMO_ADMIN_PROFILE.id, email: DEMO_ADMIN_PROFILE.email, displayName: DEMO_ADMIN_PROFILE.full_name });
      setProfile(p || DEMO_ADMIN_PROFILE);
      setRole('admin');
      localStorage.setItem(DEMO_ACTIVE_KEY, 'admin');
    } else if (targetRole === 'student') {
      const p = await getProfile(DEMO_STUDENT_PROFILE.id);
      setUser({ id: DEMO_STUDENT_PROFILE.id, email: DEMO_STUDENT_PROFILE.email, displayName: DEMO_STUDENT_PROFILE.full_name });
      setProfile(p || DEMO_STUDENT_PROFILE);
      setRole('user');
      localStorage.setItem(DEMO_ACTIVE_KEY, 'student');
    } else {
      setUser(null);
      setProfile(null);
      setRole(null);
      localStorage.setItem(DEMO_ACTIVE_KEY, 'guest');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin: role === 'admin',
        isAuthenticated: Boolean(user),
        isLoading,
        isFirebaseConnected: isFirebaseConfigured,
        login,
        signup,
        loginWithGoogle,
        logout,
        switchDemoRole,
        refreshProfile,
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
