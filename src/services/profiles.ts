import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { LocalStore } from './store';

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'profiles', userId));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.warn('Error querying Firebase Firestore profiles:', e);
    }
  }

  // Local store fallback
  const profiles = LocalStore.getProfiles();
  return profiles[userId] || null;
}

export async function getUserRole(userId: string): Promise<UserRole> {
  if (isFirebaseConfigured && db) {
    try {
      const roleSnap = await getDoc(doc(db, 'user_roles', userId));
      if (roleSnap.exists() && roleSnap.data()?.role) {
        return roleSnap.data().role as UserRole;
      }
    } catch (e) {
      console.warn('Error checking user role in Firebase Firestore:', e);
    }
  }

  // In demo mode: admin-user-001 is admin, others default to 'user'
  return userId === 'admin-user-001' ? 'admin' : 'user';
}

export async function updateProfile(
  userId: string,
  profileData: Partial<UserProfile>
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
  if (isFirebaseConfigured && db) {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const payload = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };
      await setDoc(profileRef, payload, { merge: true });
      const updatedSnap = await getDoc(profileRef);
      return { success: true, profile: updatedSnap.data() as UserProfile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile in Firebase' };
    }
  }

  // Local store update
  const profiles = LocalStore.getProfiles();
  const existing = profiles[userId] || {
    id: userId,
    full_name: 'Student User',
    email: 'user@mbu.asia',
    profile_completed: false,
  };

  const updated: UserProfile = {
    ...existing,
    ...profileData,
    updated_at: new Date().toISOString(),
  };

  profiles[userId] = updated;
  LocalStore.saveProfiles(profiles);
  return { success: true, profile: updated };
}

export async function completeStudentProfile(
  userId: string,
  data: {
    full_name: string;
    roll_number: string;
    branch: string;
    academic_year: string;
    phone?: string;
  }
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
  // Validate roll number uniqueness in local store if Firebase not active
  if (!isFirebaseConfigured) {
    const profiles = LocalStore.getProfiles();
    const isRollTaken = Object.values(profiles).some(
      (p) => p.id !== userId && p.roll_number?.trim().toUpperCase() === data.roll_number.trim().toUpperCase()
    );
    if (isRollTaken) {
      return { success: false, error: 'A student with this University Roll Number already exists.' };
    }
  }

  return updateProfile(userId, {
    ...data,
    roll_number: data.roll_number.trim().toUpperCase(),
    profile_completed: true,
  });
}
