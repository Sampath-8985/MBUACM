// Image uploads go to Cloudinary (unsigned preset). No Firebase Storage needed.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined) || 'acm_uploads';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME);

export async function uploadImage(
  file: File,
  folder: 'event-posters' | 'crew-photos' | 'gallery-photos'
): Promise<{ url: string; error?: string }> {
  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { url: '', error: 'File size exceeds 5MB limit. Please upload an image under 5MB.' };
  }

  if (!file.type.startsWith('image/')) {
    return { url: '', error: 'Invalid file type. Please upload a PNG, JPEG, or WebP image.' };
  }

  if (isCloudinaryConfigured) {
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', UPLOAD_PRESET);
      form.append('folder', `acm/${folder}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.secure_url) {
        return { url: '', error: data?.error?.message || 'Cloudinary upload failed.' };
      }
      return { url: data.secure_url as string };
    } catch (err: any) {
      return { url: '', error: err.message || 'Cloudinary upload failed.' };
    }
  }

  // Cloudinary not configured: local preview only (not saved permanently)
  return readAsDataUrl(file);
}

function readAsDataUrl(file: File): Promise<{ url: string; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result as string });
    reader.onerror = () => resolve({ url: '', error: 'Failed to read image file.' });
    reader.readAsDataURL(file);
  });
}
