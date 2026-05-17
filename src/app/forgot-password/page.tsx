'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Scale, Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { resetPassword } from '@/lib/firebase/auth';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      await resetPassword(email, resetUrl);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch {
      toast.error('Could not send reset email. Double-check the address.');
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
    padding: '0.8rem 1rem 0.8rem 2.75rem',
    fontSize: '0.95rem',
    fontFamily: "'Outfit', sans-serif",
    outline: 'none',
  };

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
        {/* Back link */}
        <Link href="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none',
          fontWeight: 600, marginBottom: '1.5rem',
        }}>
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          {/* Icon */}
          <div style={{
            width: 60, height: 60, borderRadius: 17,
            background: 'linear-gradient(135deg, #6366F1, #F97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 30px rgba(99,102,241,0.35)',
          }}>
            <AnimatePresence mode="wait">
              {sent
                ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                    <CheckCircle size={28} color="#fff" />
                  </motion.div>
                : <motion.div key="scale" initial={{ scale: 1 }} animate={{ scale: 1 }}>
                    <Scale size={28} color="#fff" />
                  </motion.div>
              }
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                  Check your <span className="gradient-text">inbox.</span>
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                  We sent a reset link to
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--saffron-light)', marginBottom: '1.5rem' }}>
                  {email}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  Didn&apos;t get it? Check your spam folder or{' '}
                  <button
                    onClick={() => setSent(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--indigo-light)', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                  >
                    try again
                  </button>
                  .
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: '1.6rem', marginBottom: '0.4rem' }}>
                    Forgot your <span className="gradient-text">password?</span>
                  </h1>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                    No worries. Enter your email and we&apos;ll send you a secure reset link instantly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '0.8rem', fontWeight: 700,
                      color: 'var(--text-secondary)', marginBottom: '0.5rem',
                      letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                    }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="aap@company.in"
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn-primary"
                    style={{
                      padding: '0.85rem', fontSize: '0.95rem', borderRadius: 10,
                      marginTop: '0.25rem', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '0.5rem',
                      opacity: (loading || !email) ? 0.6 : 1,
                      cursor: (loading || !email) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Send size={15} />
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                  Remember it now?{' '}
                  <Link href="/login" style={{ color: 'var(--saffron-light)', fontWeight: 700 }}>Sign in</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
