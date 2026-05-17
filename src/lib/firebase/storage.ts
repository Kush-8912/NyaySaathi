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
  const path = `users/${uid}/profile/avatar`;
  const storageRef = ref(storage, path);
  
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Fallback timeout in case Firebase SDK hangs indefinitely (common with CORS issues)
    const timeout = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error("Upload timed out. This is usually caused by missing Firebase Storage CORS rules or a blocked network."));
    }, 15000);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        clearTimeout(timeout);
        console.error("Firebase Storage Error:", error);
        reject(error);
      }, 
      async () => {
        clearTimeout(timeout);
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export async function deleteFile(path: string) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
