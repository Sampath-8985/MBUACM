import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

// A user is an admin only if Firestore has a document  user_roles/{uid}  with  role: "admin"
export async function isAdminUser(uid: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const snap = await getDoc(doc(db, 'user_roles', uid));
    return snap.exists() && snap.data()?.role === 'admin';
  } catch (e) {
    console.warn('Error checking admin role:', e);
    return false;
  }
}
