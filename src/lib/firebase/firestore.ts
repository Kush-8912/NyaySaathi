import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import app from './config';
import type { UserProfile } from '@/types/user';
import type { StoredAnalysis } from '@/types/analysis';

export const db = getFirestore(app);

// ── User profile ──────────────────────────────────────────
export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    uid,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
  } as UserProfile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ── Analyses ──────────────────────────────────────────────
export async function saveAnalysis(uid: string, analysis: Omit<StoredAnalysis, 'id'>) {
  const ref = await addDoc(collection(db, 'users', uid, 'analyses'), {
    ...analysis,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAnalysis(uid: string, analysisId: string): Promise<StoredAnalysis | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'analyses', analysisId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
  } as StoredAnalysis;
}

export async function getUserAnalyses(uid: string, maxResults = 50): Promise<StoredAnalysis[]> {
  const q = query(
    collection(db, 'users', uid, 'analyses'),
    orderBy('createdAt', 'desc'),
    limit(maxResults),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    } as StoredAnalysis;
  });
}

export async function deleteAnalysis(uid: string, analysisId: string) {
  await deleteDoc(doc(db, 'users', uid, 'analyses', analysisId));
}

// ── Activity log ─────────────────────────────────────────
export async function logActivity(uid: string, activity: { type: string; title: string; description: string; analysisId?: string }) {
  await addDoc(collection(db, 'users', uid, 'activities'), {
    ...activity,
    createdAt: serverTimestamp(),
  });
}

export async function getUserActivities(uid: string, maxResults = 10) {
  const q = query(
    collection(db, 'users', uid, 'activities'),
    orderBy('createdAt', 'desc'),
    limit(maxResults),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    };
  });
}

// ── AI Log ───────────────────────────────────────────────
export async function saveAILog(uid: string, log: { analysisId?: string; model: string; promptType: string; success: boolean }) {
  await addDoc(collection(db, 'users', uid, 'aiLogs'), {
    ...log,
    createdAt: serverTimestamp(),
  });
}
