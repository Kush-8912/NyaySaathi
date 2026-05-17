'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, Key } from 'lucide-react';
import { confirmUserPasswordReset, verifyResetCode } from '@/lib/firebase/auth';
import PasswordChecklist from '@/components/auth/PasswordChecklist';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [codeValid, setCodeValid] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [linkInput, setLinkInput] = useState('');

  useEffect(() => {
    if (!oobCode) {
      setValidating(false);
      return;
    }
    
    // Verify the code is valid and hasn't expired
    verifyResetCode(oobCode)
      .then((emailAddress) => {
        setEmail(emailAddress);
        setCodeValid(true);
      })
      .catch(() => {
        setCodeValid(false);
      })
      .finally(() => {
        setValidating(false);
      });
  }, [oobCode]);

  const handleUseLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const raw = String(linkInput || '').trim();
    if (!raw) {
      setError('Please paste the reset link from your email.');
      return;
    }
    try {
      const parsed = new URL(raw);
      const code = parsed.searchParams.get('oobCode');
      const parsedMode = parsed.searchParams.get('mode');
      if (!code) {
        setError('Could not find reset code in this link.');
        return;
      }
      if (parsedMode && parsedMode !== 'resetPassword') {
        setError('This is not a password reset link.');
        return;
      }
      router.push(`/reset-password?mode=resetPassword&oobCode=${encodeURIComponent(code)}`);
    } catch {
      setError('That does not look like a valid URL. Please paste the full email link.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode || newPw !== confirmPw || newPw.length < 8) return;
    
    setLoading(true);
    try {
      await confirmUserPasswordReset(oobCode, newPw);
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      toast.error('Failed to reset password. The link might have expired.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid var(--border-default)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    padding: '0.8rem 1rem 0.8rem 1rem',
    fontSize: '0.95rem',
    fontFamily: "'Outfit', sans-serif",
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 700,
    color: 'var(--text-secondary)', marginBottom: '0.5rem',
    letterSpacing: '0.04em', textTransform: 'uppercase' as const,
  };

  if (validating) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Verifying reset link...</p>
      </div>
    );
  }

  if (!codeValid) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 17,
          background: 'linear-gradient(135deg, #EF4444, #F97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 30px rgba(239,68,68,0.35)',
        }}>
          <Key size={28} color="#fff" />
        </div>
        <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          Invalid or <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)' }}>Expired Link</span>
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
          This password reset link has expired or has already been used. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: 10 }}>
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 17,
          background: 'linear-gradient(135deg, #10B981, #34D399)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 30px rgba(16,185,129,0.35)',
        }}>
          <CheckCircle size={28} color="#fff" />
        </div>
        <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          Password <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}>Reset!</span>
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
          Your password has been successfully updated. Redirecting you to login...
        </p>
        <Link href="/login" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: 10 }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 17,
          background: 'linear-gradient(135deg, #6366F1, #F97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 30px rgba(99,102,241,0.35)',
        }}>
          <Lock size={28} color="#fff" />
        </div>
        <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: '1.6rem', marginBottom: '0.4rem' }}>
          Set New <span className="gradient-text">Password</span>
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          {oobCode ? `Create a new, strong password for ${email}.` : 'Please paste the reset link from your email below.'}
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', color: '#F87171', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {!oobCode ? (
        <form onSubmit={handleUseLink} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Paste Reset Link</label>
            <textarea
              value={linkInput}
              onChange={(e) => { setError(''); setLinkInput(e.target.value); }}
              placeholder="https://nyaysaathi-19db9.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '0.85rem', fontSize: '0.95rem', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            Use This Link
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>New Password</label>
            <input
              type={showPw ? "text" : "password"} value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }}
              required
            />
            <button
              type="button"
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
              required
            />
            <button
              type="button"
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
            type="submit"
            disabled={loading || !newPw || newPw !== confirmPw || newPw.length < 8}
            className="btn-primary"
            style={{
              padding: '0.85rem', fontSize: '0.95rem', borderRadius: 10,
              marginTop: '0.5rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.5rem',
              opacity: (loading || !newPw || newPw !== confirmPw || newPw.length < 8) ? 0.6 : 1,
              cursor: (loading || !newPw || newPw !== confirmPw || newPw.length < 8) ? 'not-allowed' : 'pointer',
            }}
          >
            <Lock size={15} />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      paddingTop: '5.5rem',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Background orbs */}
      <div className="hero-orb" style={{ width: 400, height: 400, top: '10%', left: '5%', background: 'rgba(99,102,241,0.1)', animationDelay: '0s' }} />
      <div className="hero-orb" style={{ width: 350, height: 350, bottom: '10%', right: '5%', background: 'rgba(249,115,22,0.07)', animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 2 }}
      >
        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
