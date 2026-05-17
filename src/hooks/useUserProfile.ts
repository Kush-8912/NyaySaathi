'use client';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile as updateProfile } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/types/user';

export function useUserProfile(uid: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) { setProfile(null); return; }
    setLoading(true);
    getUserProfile(uid)
      .then(setProfile)
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [uid]);

  const saveProfile = async (data: Partial<UserProfile>) => {
    if (!uid) return;
    await updateProfile(uid, data);
    setProfile((prev) => (prev ? { ...prev, ...data } : { ...data } as UserProfile));
  };

  return { profile, loading, error, saveProfile, setProfile };
}
