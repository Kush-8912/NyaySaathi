'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import GoogleButton from '@/components/auth/GoogleButton';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem 3rem', position: 'relative', zIndex: 10 }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, top: '10%', left: '5%', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, bottom: '10%', right: '5%', borderRadius: '50%', background: 'rgba(249,115,22,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 2 }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #6366F1, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
              <Scale size={26} color="#fff" />
            </div>
            <h2 style={{ marginBottom: '0.4rem', fontSize: '1.6rem' }}>
              Welcome <span className="gradient-text">back.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your NyaySaathi account</p>
          </div>

          <GoogleButton label="Continue with Google" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          <LoginForm />

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--saffron-light)', fontWeight: 700 }}>Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
