import { ClubEvent, CrewMember, EventRegistration, ContactSubmission, UserProfile, EventGalleryItem } from '../types';
import {
  INITIAL_CREW,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CONTACT_SUBMISSIONS,
  INITIAL_GALLERY,
  DEMO_ADMIN_PROFILE,
  DEMO_STUDENT_PROFILE
} from '../lib/mockData';

const STORAGE_KEYS = {
  EVENTS: 'mbu_acm_events',
  CREW: 'mbu_acm_crew',
  REGISTRATIONS: 'mbu_acm_registrations',
  PROFILES: 'mbu_acm_profiles',
  CONTACTS: 'mbu_acm_contacts',
  GALLERY: 'mbu_acm_gallery',
  CURRENT_USER_ID: 'mbu_acm_active_user_id',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for key ${key}:`, e);
    return fallback;
  }
}

function setToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error setting localStorage for key ${key}:`, e);
  }
}

export const LocalStore = {
  getEvents: (): ClubEvent[] => {
    return getFromStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },
  saveEvents: (events: ClubEvent[]): void => {
    setToStorage(STORAGE_KEYS.EVENTS, events);
  },

  getCrew: (): CrewMember[] => {
    return getFromStorage(STORAGE_KEYS.CREW, INITIAL_CREW);
  },
  saveCrew: (crew: CrewMember[]): void => {
    setToStorage(STORAGE_KEYS.CREW, crew);
  },

  getRegistrations: (): EventRegistration[] => {
    return getFromStorage(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
  },
  saveRegistrations: (regs: EventRegistration[]): void => {
    setToStorage(STORAGE_KEYS.REGISTRATIONS, regs);
  },

  getProfiles: (): Record<string, UserProfile> => {
    const defaultProfiles = {
      [DEMO_ADMIN_PROFILE.id]: DEMO_ADMIN_PROFILE,
      [DEMO_STUDENT_PROFILE.id]: DEMO_STUDENT_PROFILE,
    };
    return getFromStorage(STORAGE_KEYS.PROFILES, defaultProfiles);
  },
  saveProfiles: (profiles: Record<string, UserProfile>): void => {
    setToStorage(STORAGE_KEYS.PROFILES, profiles);
  },

  getContacts: (): ContactSubmission[] => {
    return getFromStorage(STORAGE_KEYS.CONTACTS, INITIAL_CONTACT_SUBMISSIONS);
  },
  saveContacts: (contacts: ContactSubmission[]): void => {
    setToStorage(STORAGE_KEYS.CONTACTS, contacts);
  },

  getGallery: (): EventGalleryItem[] => {
    return getFromStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },
  saveGallery: (items: EventGalleryItem[]): void => {
    setToStorage(STORAGE_KEYS.GALLERY, items);
  },

  resetToDefault: (): void => {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.CREW);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
};
