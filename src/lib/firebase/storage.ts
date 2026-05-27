import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import app from './config';

export const storage = getStorage(app);

export async function uploadFile(uid: string, file: File, folder = 'documents'): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `users/${uid}/${folder}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function uploadProfileImage(uid: string, file: File): Promise<{ url: string; path: string }> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `users/${uid}/profile/avatar.${ext}`;
  const storageRef = ref(storage, path);

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Storage upload timed out after 10s')), 10000)
  );

  try {
    const snapshot = await Promise.race([uploadBytes(storageRef, file), timeout]);
    const url = await getDownloadURL(snapshot.ref);
    return { url, path };
  } catch (error) {
    console.warn('Firebase Storage upload failed (will use Base64 fallback):', error);
    throw error;
  }
}

export async function deleteFile(path: string) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
