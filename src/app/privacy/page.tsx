'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Eye, Lock, Database, Globe, Mail, ArrowLeft } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const sections = [
  {
    icon: Database,
    title: 'What Data We Collect',
    color: '#818CF8',
    items: [
      { head: 'Account Information', body: 'When you sign up, we collect your name, email address, and authentication credentials. If you use Google Sign-In, we receive your name and email from Google — we do not store your Google password.' },
      { head: 'Contract Text You Submit', body: 'The text or files you upload for analysis are temporarily processed by our AI pipeline (Google Gemini) and stored in your secure Firestore database, tied only to your authenticated UID. We do not read, share, or use your contracts for any other purpose.' },
      { head: 'Analysis Results', body: 'Risk reports, clause data, scores, and negotiation recommendations generated from your documents are stored in your private Firestore collection and are accessible only by you.' },
      { head: 'Usage Metadata', body: 'We collect anonymous usage signals — page visits, error counts, feature usage — to improve the product. This data is never linked to your identity or your document content.' },
    ],
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    color: '#34D399',
    items: [
      { head: 'Firebase Security Rules', body: 'All Firestore and Firebase Storage access is governed by strict security rules that enforce UID-level isolation. No user can access another user\'s data — not even NyaySaathi\'s team without direct database access.' },
      { head: 'Encrypted in Transit', body: 'All data between your browser and our servers is encrypted using TLS 1.3. We use HTTPS exclusively — no HTTP fallback.' },
      { head: 'AI Processing', body: 'Contract text is sent to Google Gemini 1.5 Flash via the Gemini API. Google\'s enterprise API terms prohibit using API input data for training. Your documents are not used to train any AI model.' },
      { head: 'No Third-Party Sharing', body: 'We do not sell, rent, or share your personal data or document contents with any third party for marketing, analytics resale, or any commercial purpose whatsoever.' },
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    color: '#FB923C',
    items: [
      { head: 'Contract Analysis', body: 'Your contract text is the sole input to our 6-agent AI pipeline (Clause Extractor, Risk Analyst, Adversarial Reasoner, Plain Language Explainer, Negotiation Coach, Report Builder). Analysis is performed exclusively to serve you the risk report.' },
      { head: 'Account Management', body: 'Your email is used to send account-related communications — verification emails, password resets, and critical security notifications. We do not send marketing emails without explicit opt-in.' },
      { head: 'Product Improvement', body: 'Aggregated, anonymized usage statistics (e.g., "the analyze feature was used 500 times today") help us improve performance and prioritize features. No document content is ever part of this aggregation.' },
    ],
  },
  {
    icon: Globe,
    title: 'Data Retention & Deletion',
    color: '#FACC15',
    items: [
      { head: 'Your Analyses', body: 'Analysis reports remain in your account indefinitely until you delete them. You can delete individual analyses from the History page at any time. Deletion is permanent and immediate.' },
      { head: 'Account Deletion', body: 'You may request full account deletion by emailing us (see contact below). Upon deletion, all your Firestore data, uploaded files, and authentication records are permanently purged within 30 days.' },
      { head: 'Cookies', body: 'We use only essential session cookies required for authentication (Firebase Auth tokens). We do not use tracking cookies, advertising cookies, or third-party analytics cookies.' },
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights (India — DPDP Act 2023)',
    color: '#F43F5E',
    items: [
      { head: 'Right to Access', body: 'You can access all your stored analysis data directly from your dashboard and History page at any time.' },
      { head: 'Right to Correction', body: 'If your profile information is incorrect, you can update it from your Account page.' },
      { head: 'Right to Erasure', body: 'You may request deletion of all your personal data. We will process this within 30 days of a verified request.' },
      { head: 'Right to Grievance Redressal', body: 'Under the Digital Personal Data Protection Act 2023, you may raise a grievance with our Data Protection Officer. We will respond within 72 hours.' },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ maxWidth: 860 }}>

        {/* Back */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: '3rem' }}>
          <span className="section-chip chip-indigo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <Lock size={11} /> Privacy Policy
          </span>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.75rem' }}>
            Your Data. <span className="gradient-text">Your Rights. Full Stop.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 620 }}>
            NyaySaathi is built on one principle: your contract data belongs to you — not us, not advertisers, not AI trainers.
            Here&apos;s exactly what we collect, how we protect it, and your rights under Indian law.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📅 Last updated: May 2026</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🇮🇳 Governed by DPDP Act 2023</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🔒 Zero third-party data sales</span>
          </div>
        </motion.div>

        {/* TL;DR box */}
        <motion.div {...fadeUp(0.15)} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem', borderColor: 'rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.05)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>⚡ The Short Version</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { emoji: '✅', text: 'Your contracts are private — never sold, never shared, never seen by us' },
              { emoji: '✅', text: 'AI only processes your text to generate your report. That\'s it.' },
              { emoji: '✅', text: 'Delete everything — permanently — any time you want. No questions asked.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sections.map((section, si) => {
            const Icon = section.icon;
            return (
              <motion.div key={si} {...fadeUp(0.2 + si * 0.06)} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${section.color}15`, border: `1px solid ${section.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={section.color} />
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{section.title}</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {section.items.map((item, ii) => (
                    <div key={ii} style={{ paddingLeft: '1rem', borderLeft: `2px solid ${section.color}30` }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.head}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact */}
        <motion.div {...fadeUp(0.5)} className="glass-card" style={{ padding: '1.75rem', marginTop: '2rem', textAlign: 'center', borderColor: 'rgba(249,115,22,0.2)' }}>
          <Mail size={24} color="var(--saffron)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Questions about your data?</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Contact our Data Protection Officer at{' '}
            <a href="mailto:privacy@nyaysaathi.in" style={{ color: 'var(--saffron-light)', fontWeight: 700 }}>privacy@nyaysaathi.in</a>
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>We respond to all privacy requests within 72 hours.</p>
        </motion.div>

      </div>
    </div>
  );
}
