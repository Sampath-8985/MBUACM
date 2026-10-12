import { ClubEvent, CrewMember, ContactSubmission, EventGalleryItem, EventCategoryItem } from '../types';
import {
  INITIAL_CREW,
  INITIAL_EVENTS,
  INITIAL_CONTACT_SUBMISSIONS,
  INITIAL_GALLERY,
} from '../lib/mockData';

// Local (browser) storage is only used when Firebase keys are not set (local demo mode).
const STORAGE_KEYS = {
  EVENTS: 'mbu_acm_events',
  CREW: 'mbu_acm_crew',
  CONTACTS: 'mbu_acm_contacts',
  GALLERY: 'mbu_acm_gallery',
  CATEGORIES: 'mbu_acm_categories',
  DEMO_ADMIN: 'mbu_acm_demo_admin',
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
  getEvents: (): ClubEvent[] => getFromStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS),
  saveEvents: (events: ClubEvent[]): void => setToStorage(STORAGE_KEYS.EVENTS, events),

  getCrew: (): CrewMember[] => getFromStorage(STORAGE_KEYS.CREW, INITIAL_CREW),
  saveCrew: (crew: CrewMember[]): void => setToStorage(STORAGE_KEYS.CREW, crew),

  getContacts: (): ContactSubmission[] => getFromStorage(STORAGE_KEYS.CONTACTS, INITIAL_CONTACT_SUBMISSIONS),
  saveContacts: (contacts: ContactSubmission[]): void => setToStorage(STORAGE_KEYS.CONTACTS, contacts),

  getGallery: (): EventGalleryItem[] => getFromStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY),
  saveGallery: (items: EventGalleryItem[]): void => setToStorage(STORAGE_KEYS.GALLERY, items),

  getCategories: (defaults: EventCategoryItem[]): EventCategoryItem[] =>
    getFromStorage(STORAGE_KEYS.CATEGORIES, defaults),
  saveCategories: (items: EventCategoryItem[]): void => setToStorage(STORAGE_KEYS.CATEGORIES, items),

  isDemoAdmin: (): boolean => getFromStorage(STORAGE_KEYS.DEMO_ADMIN, false),
  setDemoAdmin: (value: boolean): void => setToStorage(STORAGE_KEYS.DEMO_ADMIN, value),
};
