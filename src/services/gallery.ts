import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { EventGalleryItem } from '../types';
import { LocalStore } from './store';

/**
 * Fetch all gallery event albums.
 * If includeUnpublished is false, only returns published albums.
 */
export async function getGallery(includeUnpublished = false): Promise<EventGalleryItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      let q = query(collection(db, 'event_gallery'), orderBy('event_date', 'desc'));
      if (!includeUnpublished) {
        q = query(collection(db, 'event_gallery'), where('is_published', '==', true), orderBy('event_date', 'desc'));
      }
      const snap = await getDocs(q);
      const items: EventGalleryItem[] = [];
      snap.forEach((d) => items.push(d.data() as EventGalleryItem));
      return items;
    } catch (e) {
      console.warn('Error fetching gallery from Firebase Firestore:', e);
    }
  }

  // Fallback to local store
  const items = LocalStore.getGallery();
  const sorted = [...items].sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  if (includeUnpublished) {
    return sorted;
  }
  return sorted.filter((item) => item.is_published);
}

/**
 * Fetch a single gallery item by its ID.
 */
export async function getGalleryItemById(id: string): Promise<EventGalleryItem | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'event_gallery', id));
      if (snap.exists()) {
        return snap.data() as EventGalleryItem;
      }
    } catch (e) {
      console.warn('Error fetching gallery item from Firebase Firestore:', e);
    }
  }

  const items = LocalStore.getGallery();
  return items.find((item) => item.id === id) || null;
}

/**
 * Create a new event gallery album.
 */
export async function createGalleryItem(
  data: Omit<EventGalleryItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; item?: EventGalleryItem; error?: string }> {
  const newId = `gallery-${Date.now()}`;
  const now = new Date().toISOString();
  const newItem: EventGalleryItem = {
    ...data,
    id: newId,
    created_at: now,
    updated_at: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'event_gallery', newId), newItem);
      return { success: true, item: newItem };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create gallery album in Firebase' };
    }
  }

  const items = LocalStore.getGallery();
  items.unshift(newItem);
  LocalStore.saveGallery(items);
  return { success: true, item: newItem };
}

/**
 * Update an existing event gallery album.
 */
export async function updateGalleryItem(
  id: string,
  updates: Partial<EventGalleryItem>
): Promise<{ success: boolean; item?: EventGalleryItem; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      const albumRef = doc(db, 'event_gallery', id);
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await updateDoc(albumRef, payload);
      const snap = await getDoc(albumRef);
      return { success: true, item: snap.data() as EventGalleryItem };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update gallery album in Firebase' };
    }
  }

  const items = LocalStore.getGallery();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, error: 'Gallery album not found' };
  }

  const updated: EventGalleryItem = {
    ...items[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  items[index] = updated;
  LocalStore.saveGallery(items);
  return { success: true, item: updated };
}

/**
 * Delete a gallery album by ID.
 */
export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'event_gallery', id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete gallery album in Firebase' };
    }
  }

  const items = LocalStore.getGallery();
  const filtered = items.filter((item) => item.id !== id);
  LocalStore.saveGallery(filtered);
  return { success: true };
}
