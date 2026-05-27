'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { uploadProfileImage } from '@/lib/firebase/storage';
import { updateUserProfile as updateAuthProfile, changeUserPassword } from '@/lib/firebase/auth';
import { toast } from 'sonner';
import { Camera, Save, Lock, User, MapPin, Briefcase, Key, CheckCircle, Globe, Eye, EyeOff } from 'lucide-react';
import { USER_TYPES, PREFERRED_LANGUAGES, INDIAN_STATES } from '@/lib/constants';
import PasswordChecklist from '@/components/auth/PasswordChecklist';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1.5px solid var(--border-default)',
  borderRadius: 10,
  color: 'var(--text-primary)',
  padding: '0.75rem 1rem',
  fontSize: '0.9rem',
  fontFamily: "'Outfit', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid var(--border-subtle)',
};

function AccountContent() {
  const { user } = useAuth();
  const { profile, saveProfile } = useUserProfile(user?.uid ?? null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    city: '',
    state: '',
    userType: 'Other',
    preferredLanguage: 'English',
  });

  useEffect(() => {
    if (user || profile) {
      setFormData({
        name: user?.displayName || profile?.name || '',
        bio: profile?.bio || '',
        city: profile?.city || '',
        state: profile?.state || '',
        userType: profile?.userType || 'Other',
        preferredLanguage: profile?.preferredLanguage || 'English',
      });
    }
  }, [user, profile]);

  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 120;
          const MAX_HEIGHT = 120;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75); // Compress to 75% quality JPEG
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    // Reset input so the same file can be re-selected after an error
    e.target.value = '';
    setUploading(true);

    try {
      // 1. Try Firebase Storage → store HTTPS URL in both Auth + Firestore
      const { url } = await uploadProfileImage(user.uid, file);
      await updateAuthProfile(user, { photoURL: url });
      await saveProfile({ photoURL: url });
      toast.success('Profile photo updated!');
    } catch (storageError) {
      console.warn('Storage upload failed, using Base64 fallback:', storageError);

      try {
        // 2. Fallback: compress → Base64 → Firestore only
        // (Firebase Auth rejects data: URLs, so we skip updateAuthProfile here)
        const base64Url = await compressAndConvertToBase64(file);
        await saveProfile({ photoURL: base64Url });
        toast.success('Profile photo updated!');
      } catch (fallbackError) {
        console.error('Base64 fallback also failed:', fallbackError);
        toast.error('Upload failed — please try again');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateAuthProfile(user, { displayName: formData.name });
      await saveProfile({ name: formData.name, bio: formData.bio, city: formData.city, state: formData.state, userType: formData.userType as any, preferredLanguage: formData.preferredLanguage as any });
      toast.success('Profile saved successfully!');
    } catch { toast.error('Failed to save — try again'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setChangingPw(true);
    try {
      await changeUserPassword(user, currentPw, newPw);
      toast.success('Password changed successfully!');
      setPwSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err.message?.includes('invalid-credential') ? 'Current password is incorrect' : 'Failed to change password');
    } finally { setChangingPw(false); }
  };

  // Prefer Firestore profile photo (covers Base64 fallback) over Firebase Auth photoURL
  const photoURL = profile?.photoURL || user?.photoURL || '';
  const initials = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ maxWidth: 760 }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Signed in as</p>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '0.25rem' }}>
            My <span className="gradient-text">Account</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email}</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── Avatar Card ─────────────────────────────── */}
          <motion.div {...fadeUp(0.07)} className="glass-card" style={{ padding: '2rem' }}>
            <div style={sectionHeaderStyle}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={15} color="#818CF8" />
              </div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Profile Photo</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: 'linear-gradient(135deg, #6366F1, #F97316)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', boxShadow: '0 0 24px rgba(99,102,241,0.3)',
                  border: '2px solid rgba(99,102,241,0.3)',
                }}>
                  {photoURL
                    ? <img src={photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: "'Rozha One', serif" }}>{initials}</span>
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: 'absolute', bottom: -6, right: -6,
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #F97316)',
                    border: '2px solid var(--bg-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', opacity: uploading ? 0.6 : 1,
                  }}
                >
                  <Camera size={12} color="#fff" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </div>

              <div>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {user?.displayName || 'Your Name'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{user?.email}</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--indigo-light)',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 8, padding: '0.35rem 0.85rem', cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Profile Details ──────────────────────────── */}
          <motion.div {...fadeUp(0.12)} className="glass-card" style={{ padding: '2rem' }}>
            <div style={sectionHeaderStyle}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={15} color="#FB923C" />
              </div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Profile Details</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </div>

              {/* Bio */}
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                  rows={3} placeholder="Tell us about yourself — what you do, what you sign..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                />
              </div>

              {/* City + State */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text" value={formData.city}
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    placeholder="Mumbai"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <select
                    value={formData.state}
                    onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* User Type + Language */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>I am a...</label>
                  <select
                    value={formData.userType}
                    onChange={e => setFormData(p => ({ ...p, userType: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {USER_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Explanation Style</label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={e => setFormData(p => ({ ...p, preferredLanguage: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {PREFERRED_LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave} disabled={saving}
                className="btn-primary"
                style={{
                  padding: '0.8rem 1.75rem', fontSize: '0.9rem', borderRadius: 10,
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  opacity: saving ? 0.7 : 1, alignSelf: 'flex-start',
                }}
              >
                <Save size={15} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>

          {/* ── Change Password ──────────────────────────── */}
          {user?.email && (
            <motion.div {...fadeUp(0.17)} className="glass-card" style={{ padding: '2rem' }}>
              <div style={sectionHeaderStyle}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={15} color="#F43F5E" />
                </div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Change Password</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type={showPw ? "text" : "password"} value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: '0.8rem', bottom: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type={showPw ? "text" : "password"} value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: '0.8rem', top: '2.1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <PasswordChecklist password={newPw} />
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type={showPw ? "text" : "password"} value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: '0.8rem', top: '2.1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {confirmPw && newPw !== confirmPw && (
                    <p style={{ fontSize: '0.78rem', color: '#F87171', marginTop: '0.35rem' }}>Passwords don&apos;t match</p>
                  )}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={changingPw || !currentPw || !newPw || newPw !== confirmPw}
                  className="btn-ghost"
                  style={{
                    padding: '0.8rem 1.75rem', fontSize: '0.9rem', borderRadius: 10,
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    alignSelf: 'flex-start',
                    opacity: (changingPw || !currentPw || !newPw || newPw !== confirmPw) ? 0.5 : 1,
                    cursor: (changingPw || !currentPw || !newPw) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pwSuccess ? <CheckCircle size={15} color="#34D399" /> : <Key size={15} />}
                  {changingPw ? 'Updating...' : pwSuccess ? 'Password Updated!' : 'Update Password'}
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return <ProtectedRoute><AccountContent /></ProtectedRoute>;
}
