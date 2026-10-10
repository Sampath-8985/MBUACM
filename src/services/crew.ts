import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { CrewMember } from '../types';
import { LocalStore } from './store';

export async function getCrew(includeUnpublished = false): Promise<CrewMember[]> {
  if (isFirebaseConfigured && db) {
    try {
      let q = query(collection(db, 'crew_members'), orderBy('display_order', 'asc'));
      if (!includeUnpublished) {
        q = query(collection(db, 'crew_members'), where('is_published', '==', true), orderBy('display_order', 'asc'));
      }
      const snap = await getDocs(q);
      const items: CrewMember[] = [];
      snap.forEach((d) => items.push(d.data() as CrewMember));
      return items;
    } catch (e) {
      console.warn('Error fetching crew from Firebase Firestore:', e);
    }
  }

  const crew = LocalStore.getCrew();
  const sorted = [...crew].sort((a, b) => a.display_order - b.display_order);
  if (includeUnpublished) {
    return sorted;
  }
  return sorted.filter((c) => c.is_published);
}

export async function createCrewMember(
  data: Omit<CrewMember, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; crew?: CrewMember; error?: string }> {
  const newId = `crew-${Date.now()}`;
  const now = new Date().toISOString();
  const newMember: CrewMember = {
    ...data,
    id: newId,
    created_at: now,
    updated_at: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'crew_members', newId), newMember);
      return { success: true, crew: newMember };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create crew member in Firebase' };
    }
  }

  const crewList = LocalStore.getCrew();
  crewList.push(newMember);
  LocalStore.saveCrew(crewList);
  return { success: true, crew: newMember };
}

export async function updateCrewMember(
  id: string,
  updates: Partial<CrewMember>
): Promise<{ success: boolean; crew?: CrewMember; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      const crewRef = doc(db, 'crew_members', id);
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await updateDoc(crewRef, payload);
      return { success: true, crew: { id, ...updates } as CrewMember };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update crew member in Firebase' };
    }
  }

  const crewList = LocalStore.getCrew();
  const index = crewList.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, error: 'Crew member not found' };
  }

  const updated: CrewMember = {
    ...crewList[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  crewList[index] = updated;
  LocalStore.saveCrew(crewList);
  return { success: true, crew: updated };
}

export async function deleteCrewMember(id: string): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'crew_members', id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete crew member in Firebase' };
    }
  }

  const crewList = LocalStore.getCrew();
  const filtered = crewList.filter((c) => c.id !== id);
  LocalStore.saveCrew(filtered);
  return { success: true };
}
