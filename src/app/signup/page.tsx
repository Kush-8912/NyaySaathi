'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';
import GoogleButton from '@/components/auth/GoogleButton';

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 3rem', position: 'relative', zIndex: 10 }}>
      <div style={{ position: 'absolute', width: 400, height: 400, top: '5%', right: '5%', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, bottom: '5%', left: '5%', borderRadius: '50%', background: 'rgba(249,115,22,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 2 }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #6366F1, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
              <Scale size={26} color="#fff" />
            </div>
            <h2 style={{ marginBottom: '0.4rem', fontSize: '1.6rem' }}>
              Start for <span className="gradient-text">free.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your NyaySaathi account — know before you sign</p>
          </div>

          <GoogleButton label="Sign up with Google" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          <SignupForm />

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--saffron-light)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
