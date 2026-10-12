import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { ClubEvent } from '../types';
import { LocalStore } from './store';

export async function getEvents(includeUnpublished = false): Promise<ClubEvent[]> {
  if (isFirebaseConfigured && db) {
    try {
      // No orderBy here (it would need a composite index); we sort in the browser instead
      const q = includeUnpublished
        ? query(collection(db, 'events'))
        : query(collection(db, 'events'), where('status', '==', 'published'));
      const snap = await getDocs(q);
      const items: ClubEvent[] = [];
      snap.forEach((d) => items.push(d.data() as ClubEvent));
      return items.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    } catch (e) {
      console.error('Error fetching events from Firebase Firestore:', e);
      return [];
    }
  }

  // Local store
  const allEvents = LocalStore.getEvents();
  if (includeUnpublished) {
    return allEvents;
  }
  return allEvents.filter((ev) => ev.status === 'published');
}

export async function getEventById(id: string): Promise<ClubEvent | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'events', id));
      return snap.exists() ? (snap.data() as ClubEvent) : null;
    } catch (e) {
      console.error('Error getting event by ID from Firebase:', e);
      return null;
    }
  }

  const allEvents = LocalStore.getEvents();
  return allEvents.find((e) => e.id === id) || null;
}

export async function createEvent(
  eventData: Omit<ClubEvent, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; event?: ClubEvent; error?: string }> {
  const newId = `event-${Date.now()}`;
  const now = new Date().toISOString();
  const newEvent: ClubEvent = {
    ...eventData,
    id: newId,
    created_at: now,
    updated_at: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'events', newId), newEvent);
      return { success: true, event: newEvent };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create event in Firebase' };
    }
  }

  const events = LocalStore.getEvents();
  events.unshift(newEvent);
  LocalStore.saveEvents(events);
  return { success: true, event: newEvent };
}

export async function updateEvent(
  id: string,
  updates: Partial<ClubEvent>
): Promise<{ success: boolean; event?: ClubEvent; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      const eventRef = doc(db, 'events', id);
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await updateDoc(eventRef, payload);
      const snap = await getDoc(eventRef);
      return { success: true, event: snap.data() as ClubEvent };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update event in Firebase' };
    }
  }

  const events = LocalStore.getEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return { success: false, error: 'Event not found' };
  }

  const updated: ClubEvent = {
    ...events[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  events[index] = updated;
  LocalStore.saveEvents(events);
  return { success: true, event: updated };
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'events', id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete event in Firebase' };
    }
  }

  const events = LocalStore.getEvents();
  const filtered = events.filter((e) => e.id !== id);
  LocalStore.saveEvents(filtered);

  return { success: true };
}
