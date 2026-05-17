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
  // Extract extension from file name or mime-type
  const ext = file.name.split('.').pop() || 'png';
  const path = `users/${uid}/profile/avatar.${ext}`;
  const storageRef = ref(storage, path);
  
  return new Promise((resolve, reject) => {
    // Simpler uploadBytes
    uploadBytes(storageRef, file)
      .then(async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref);
        resolve({ url, path });
      })
      .catch((error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(error);
      });
  });
}

export async function deleteFile(path: string) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
