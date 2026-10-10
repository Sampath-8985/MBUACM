import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { ContactSubmission } from '../types';
import { LocalStore } from './store';

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const newId = `contact-${Date.now()}`;
  const newSubmission: ContactSubmission = {
    id: newId,
    name: data.name.trim(),
    email: data.email.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'contacts', newId), newSubmission);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Submission failed in Firebase' };
    }
  }

  const contacts = LocalStore.getContacts();
  contacts.unshift(newSubmission);
  LocalStore.saveContacts(contacts);
  return { success: true };
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'contacts'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      const items: ContactSubmission[] = [];
      snap.forEach((d) => items.push(d.data() as ContactSubmission));
      return items;
    } catch (e) {
      console.warn('Error fetching contact submissions from Firebase Firestore:', e);
    }
  }

  return LocalStore.getContacts();
}

export async function updateContactStatus(
  id: string,
  status: 'new' | 'reviewed' | 'archived'
): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'contacts', id), { status });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update status in Firebase' };
    }
  }

  const contacts = LocalStore.getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    contacts[index].status = status;
    LocalStore.saveContacts(contacts);
  }
  return { success: true };
}
