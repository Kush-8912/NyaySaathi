import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged as _onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth';
import app from './config';

let _auth: Auth | null = null;

function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export const auth = { get current() { return getFirebaseAuth(); } };
export const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function signupWithEmail(email: string, password: string, name: string) {
  const result = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  await updateProfile(result.user, { displayName: name });
  return result;
}

export async function loginWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

export async function logout() {
  return signOut(getFirebaseAuth());
}

export async function resetPassword(email: string, continueUrl?: string) {
  if (continueUrl) {
    return sendPasswordResetEmail(getFirebaseAuth(), email, { url: continueUrl, handleCodeInApp: false });
  }
  return sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function confirmUserPasswordReset(oobCode: string, newPassword: string) {
  return confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword);
}

export async function verifyResetCode(oobCode: string) {
  return verifyPasswordResetCode(getFirebaseAuth(), oobCode);
}

export async function updateUserProfile(user: User, data: { displayName?: string; photoURL?: string }) {
  return updateProfile(user, data);
}

export async function changeUserPassword(user: User, currentPassword: string, newPassword: string) {
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  return updatePassword(user, newPassword);
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  try {
    return _onAuthStateChanged(getFirebaseAuth(), callback);
  } catch (err) {
    console.warn('[NyaySaathi] Firebase Auth not available — add API keys to .env.local');
    callback(null);
    return () => {};
  }
}

export type { User };
