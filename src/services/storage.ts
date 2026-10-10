import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../lib/firebase';

export async function uploadImage(
  file: File,
  folder: 'event-posters' | 'crew-photos' | 'gallery-photos'
): Promise<{ url: string; error?: string }> {
  // Validate file size: maximum 5MB
  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { url: '', error: 'File size exceeds 5MB limit. Please upload an image under 5MB.' };
  }

  // Validate mime type
  if (!file.type.startsWith('image/')) {
    return { url: '', error: 'Invalid file type. Please upload a PNG, JPEG, or WebP image.' };
  }

  // If Firebase is configured and connected, upload to Firebase Storage
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      const downloadUrl = await getDownloadURL(storageRef);
      return { url: downloadUrl };
    } catch (err: any) {
      console.warn('Firebase Storage upload error, falling back to local base64:', err);
      return readAsDataUrl(file);
    }
  }

  // Local Data URL preview
  return readAsDataUrl(file);
}

function readAsDataUrl(file: File): Promise<{ url: string; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file.' });
    };
    reader.readAsDataURL(file);
  });
}
