import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { EventCategoryItem } from '../types';
import { LocalStore } from './store';

export const DEFAULT_CATEGORIES: EventCategoryItem[] = [
  { id: 'hackathon', label: 'Hackathon' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'talk', label: 'Tech Talk' },
  { id: 'contest', label: 'Contest' },
  { id: 'general', label: 'General Event' },
];

// One fetch per page load; cleared whenever the admin adds/removes a category
let cache: Promise<EventCategoryItem[]> | null = null;

async function fetchCategories(): Promise<EventCategoryItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const items: EventCategoryItem[] = [];
      snap.forEach((d) => items.push(d.data() as EventCategoryItem));
      if (items.length > 0) {
        return items.sort((a, b) => a.label.localeCompare(b.label));
      }
      return DEFAULT_CATEGORIES;
    } catch (e) {
      console.warn('Error fetching categories from Firestore:', e);
      return DEFAULT_CATEGORIES;
    }
  }
  return LocalStore.getCategories(DEFAULT_CATEGORIES);
}

export function getCategories(): Promise<EventCategoryItem[]> {
  if (!cache) cache = fetchCategories();
  return cache;
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createCategory(
  label: string
): Promise<{ success: boolean; category?: EventCategoryItem; error?: string }> {
  const clean = label.trim();
  if (!clean) return { success: false, error: 'Category name is required.' };

  const id = slugify(clean);
  if (!id) return { success: false, error: 'Please use letters or numbers in the category name.' };

  const existing = await getCategories();
  if (existing.some((c) => c.id === id || c.label.toLowerCase() === clean.toLowerCase())) {
    return { success: false, error: 'This category already exists.' };
  }

  const category: EventCategoryItem = { id, label: clean };

  if (isFirebaseConfigured && db) {
    try {
      // First custom category: save the defaults too so they don't disappear
      const snap = await getDocs(collection(db, 'categories'));
      if (snap.empty) {
        for (const c of DEFAULT_CATEGORIES) {
          await setDoc(doc(db, 'categories', c.id), c);
        }
      }
      await setDoc(doc(db, 'categories', id), category);
      cache = null;
      return { success: true, category };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save category.' };
    }
  }

  LocalStore.saveCategories([...existing, category]);
  cache = null;
  return { success: true, category };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'categories', id));
      cache = null;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete category.' };
    }
  }
  const existing = await getCategories();
  LocalStore.saveCategories(existing.filter((c) => c.id !== id));
  cache = null;
  return { success: true };
}

export function resolveCategoryLabel(id: string | undefined, list: EventCategoryItem[]): string {
  const key = id || 'general';
  const found = list.find((c) => c.id === key) || DEFAULT_CATEGORIES.find((c) => c.id === key);
  if (found) return found.label;
  return key.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}
