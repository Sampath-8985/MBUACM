import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { EventRegistration } from '../types';
import { LocalStore } from './store';
import { getEventById } from './events';
import { getProfile } from './profiles';

export async function getUserRegistrations(userId: string): Promise<EventRegistration[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'event_registrations'),
        where('user_id', '==', userId),
        orderBy('registered_at', 'desc')
      );
      const snap = await getDocs(q);
      const items: EventRegistration[] = [];
      for (const d of snap.docs) {
        const reg = d.data() as EventRegistration;
        const ev = await getEventById(reg.event_id);
        items.push({
          ...reg,
          event: ev || undefined,
        });
      }
      return items;
    } catch (e) {
      console.warn('Error fetching registrations from Firebase Firestore:', e);
    }
  }

  // Local store
  const allRegistrations = LocalStore.getRegistrations();
  const userRegs = allRegistrations.filter((r) => r.user_id === userId);
  const allEvents = LocalStore.getEvents();

  return userRegs.map((reg) => ({
    ...reg,
    event: allEvents.find((e) => e.id === reg.event_id),
  }));
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'event_registrations'),
        where('event_id', '==', eventId),
        orderBy('registered_at', 'desc')
      );
      const snap = await getDocs(q);
      const items: EventRegistration[] = [];
      for (const d of snap.docs) {
        const reg = d.data() as EventRegistration;
        const prof = await getProfile(reg.user_id);
        items.push({
          ...reg,
          profile: prof || undefined,
        });
      }
      return items;
    } catch (e) {
      console.warn('Error fetching event registrations from Firebase Firestore:', e);
    }
  }

  const allRegistrations = LocalStore.getRegistrations();
  const filtered = allRegistrations.filter((r) => r.event_id === eventId);
  const profiles = LocalStore.getProfiles();
  const allEvents = LocalStore.getEvents();

  return filtered.map((r) => ({
    ...r,
    event: allEvents.find((e) => e.id === r.event_id),
    profile: profiles[r.user_id] || undefined,
  }));
}

export async function getAllRegistrations(): Promise<EventRegistration[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'event_registrations'),
        orderBy('registered_at', 'desc')
      );
      const snap = await getDocs(q);
      const items: EventRegistration[] = [];
      for (const d of snap.docs) {
        const reg = d.data() as EventRegistration;
        const [ev, prof] = await Promise.all([
          getEventById(reg.event_id),
          getProfile(reg.user_id),
        ]);
        items.push({
          ...reg,
          event: ev || undefined,
          profile: prof || undefined,
        });
      }
      return items;
    } catch (e) {
      console.warn('Error fetching all registrations from Firebase Firestore:', e);
    }
  }

  const allRegistrations = LocalStore.getRegistrations();
  const profiles = LocalStore.getProfiles();
  const allEvents = LocalStore.getEvents();

  return allRegistrations.map((r) => ({
    ...r,
    event: allEvents.find((e) => e.id === r.event_id),
    profile: profiles[r.user_id] || undefined,
  }));
}

export async function registerForEvent(
  eventId: string,
  userId: string
): Promise<{ success: boolean; error?: string; registration?: EventRegistration }> {
  // 1. Fetch event to validate
  const event = await getEventById(eventId);
  if (!event) {
    return { success: false, error: 'Event not found.' };
  }

  if (event.status !== 'published') {
    return { success: false, error: 'This event is not open for registration.' };
  }

  if (!event.registration_enabled) {
    return { success: false, error: 'Internal registration is currently disabled for this event.' };
  }

  if (event.registration_type !== 'internal') {
    return { success: false, error: 'This event requires external registration.' };
  }

  if (event.registration_deadline) {
    const deadline = new Date(event.registration_deadline).getTime();
    if (Date.now() > deadline) {
      return { success: false, error: 'Registration deadline has passed.' };
    }
  }

  // 2. Check if student profile is complete
  const profile = await getProfile(userId);
  if (!profile || !profile.profile_completed) {
    return { success: false, error: 'Please complete your student profile before registering for events.' };
  }

  const regId = `reg-${Date.now()}-${userId.substring(0, 5)}`;
  const now = new Date().toISOString();
  const newReg: EventRegistration = {
    id: regId,
    event_id: eventId,
    user_id: userId,
    registered_at: now,
    status: 'registered',
    event,
    profile,
  };

  // 3. Firebase registration
  if (isFirebaseConfigured && db) {
    try {
      // Check existing
      const existingQuery = query(
        collection(db, 'event_registrations'),
        where('event_id', '==', eventId),
        where('user_id', '==', userId)
      );
      const existingSnap = await getDocs(existingQuery);
      if (!existingSnap.empty) {
        return { success: false, error: 'You are already registered for this event!' };
      }

      await setDoc(doc(db, 'event_registrations', regId), newReg);
      return { success: true, registration: newReg };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to complete registration in Firebase' };
    }
  }

  // Local store registration
  const registrations = LocalStore.getRegistrations();
  const alreadyRegistered = registrations.some(
    (r) => r.event_id === eventId && r.user_id === userId
  );

  if (alreadyRegistered) {
    return { success: false, error: 'You are already registered for this event!' };
  }

  registrations.unshift(newReg);
  LocalStore.saveRegistrations(registrations);
  return { success: true, registration: newReg };
}

export async function cancelRegistration(
  registrationId: string
): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'event_registrations', registrationId));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to cancel registration in Firebase' };
    }
  }

  const registrations = LocalStore.getRegistrations();
  const filtered = registrations.filter((r) => r.id !== registrationId);
  LocalStore.saveRegistrations(filtered);
  return { success: true };
}
