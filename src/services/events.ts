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
import { ClubEvent } from '../types';
import { LocalStore } from './store';

export async function getEvents(includeUnpublished = false): Promise<ClubEvent[]> {
  if (isFirebaseConfigured && db) {
    try {
      let q = query(collection(db, 'events'), orderBy('start_at', 'asc'));
      if (!includeUnpublished) {
        q = query(collection(db, 'events'), where('status', '==', 'published'), orderBy('start_at', 'asc'));
      }
      const snap = await getDocs(q);
      const items: ClubEvent[] = [];
      snap.forEach((d) => items.push(d.data() as ClubEvent));
      return items;
    } catch (e) {
      console.warn('Error fetching events from Firebase Firestore:', e);
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
      if (snap.exists()) {
        return snap.data() as ClubEvent;
      }
    } catch (e) {
      console.warn('Error getting event by ID from Firebase:', e);
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

  // Also clean up related registrations in local store
  const registrations = LocalStore.getRegistrations();
  LocalStore.saveRegistrations(registrations.filter((r) => r.event_id !== id));

  return { success: true };
}
