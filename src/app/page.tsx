'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/layout/Footer';
import {
  Shield, Zap, FileSearch, AlertTriangle, Scale, Lock, Globe,
  ArrowRight, Star, Brain, FileText, Briefcase, Home, CreditCard, Eye, FileWarning,
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const agents = [
  { num: '01', name: 'Clause Extractor',         desc: 'Hunts down and categorizes every single legal clause in your document',         color: '#818CF8' },
  { num: '02', name: 'Risk Analyst',              desc: 'Scores each clause across 7 risk dimensions — severity rated and ranked',        color: '#FB923C' },
  { num: '03', name: 'Adversarial Reasoner',      desc: 'Thinks like the stronger party — surfaces hidden traps and exploitation vectors', color: '#F43F5E' },
  { num: '04', name: 'Plain Language Explainer',  desc: 'Cuts through the legalese — explains every clause in plain, simple English',     color: '#60A5FA' },
  { num: '05', name: 'Negotiation Coach',         desc: 'Suggests better wording, smarter asks, and fallback positions that actually work',color: '#34D399' },
  { num: '06', name: 'Report Builder',            desc: 'Compiles everything into a structured, visual, action-ready intelligence report', color: '#A78BFA' },
];

const riskCategories = [
  { icon: AlertTriangle, label: 'Non-Compete',     desc: 'Career restriction clauses',     color: '#F87171' },
  { icon: Brain,         label: 'IP Ownership',    desc: 'Who owns your ideas?',            color: '#A78BFA' },
  { icon: Scale,         label: 'Arbitration',     desc: 'One-sided dispute resolution',   color: '#FB923C' },
  { icon: Lock,          label: 'Data Privacy',    desc: 'Data collection and sharing',    color: '#60A5FA' },
  { icon: FileWarning,   label: 'Termination',     desc: 'Sudden or unfair firing risk',   color: '#FACC15' },
  { icon: CreditCard,    label: 'Hidden Penalties',desc: 'Buried fines and forfeiture',     color: '#34D399' },
  { icon: Globe,         label: 'Jurisdiction',    desc: 'Unfavorable legal geography',    color: '#22D3EE' },
  { icon: Eye,           label: 'Ambiguity',       desc: 'Vague, exploitable wording',     color: '#A78BFA' },
];

const useCases = [
  { icon: Briefcase, title: 'Job Offer Letter',    story: 'A 24-month global non-compete buried on page 6. NyaySaathi flagged it — Priya negotiated it down to 6 months before day one.', city: '📍 Bengaluru' },
  { icon: Home,      title: 'Rental Agreement',    story: 'A clause forfeiting the full deposit for any damage whatsoever. NyaySaathi caught it — Rahul got a fair wear-and-tear exception added.', city: '📍 Mumbai' },
  { icon: FileText,  title: 'Freelance Contract',  story: 'An IP clause transferring rights to unpaid pitches. NyaySaathi spotted it — Ananya retained ownership of her pre-existing work.', city: '📍 Hyderabad' },
  { icon: CreditCard,title: 'SaaS Subscription',  story: 'A 60-day cancellation window buried before auto-renewal. NyaySaathi flagged it — Karan cancelled in time and saved ₹12,000.', city: '📍 Delhi' },
];

const stats = [
  { value: '50+', label: 'Clause Types Detected' },
  { value: '7',   label: 'Risk Dimensions Scored' },
  { value: '6',   label: 'AI Agents Working Together' },
  { value: '100%',label: 'Your Data Stays Yours' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const ctaHref = user ? '/analyze' : '/signup';

  return (
    <div style={{ position: 'relative' }}>

      {/* ═══ HERO ══════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-orb" style={{ width: 600, height: 600, top: '0%', left: '-5%', background: 'rgba(99,102,241,0.18)', animationDelay: '0s' }} />
        <div className="hero-orb" style={{ width: 500, height: 500, bottom: '-10%', right: '-5%', background: 'rgba(249,115,22,0.12)', animationDelay: '3s' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 820, padding: '0 1.5rem', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="section-chip chip-indigo" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Zap size={11} /> न्याय • साथी — India&apos;s AI Contract Intelligence Platform
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', marginBottom: '1rem', lineHeight: 1.08 }}>
            Don&apos;t sign what you<br />
            <span className="gradient-saffron">don&apos;t understand.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.18rem)', color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 0.75rem', lineHeight: 1.75 }}>
            NyaySaathi reads every clause, detects hidden risks, explains the real-world
            consequences in plain English, and tells you exactly what to negotiate —
            <strong style={{ color: 'var(--text-primary)' }}> before you sign.</strong>
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '2.25rem' }}>
            &ldquo;The fine print is where they hide the traps. We expose them.&rdquo;
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={ctaHref} className="btn-primary glow-indigo"
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', borderRadius: 12, gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
              <FileSearch size={18} /> Analyze a Contract <ArrowRight size={15} />
            </Link>
            <Link href="/login" className="btn-ghost"
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Sign In
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            Free to use · Not legal advice · AI-powered awareness 🇮🇳
          </motion.p>
        </div>
      </section>

      {/* ═══ TICKER ══════════════════════════════════════════ */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '0.8rem 0', background: 'rgba(99,102,241,0.05)' }}>
        <div style={{ display: 'flex', gap: '3rem', animation: 'marquee 30s linear infinite', willChange: 'transform' }}>
          {[...Array(2)].flatMap(() =>
            ['⚖️ Employment Offer Letter', '🏠 Rent Agreement', '💼 Freelance Contract', '📱 SaaS Subscription', '🔏 NDA / Secrecy Agreement', '🤝 Partnership Deed', '🏢 Vendor Agreement', '📋 Service Agreement', '🎓 Internship Letter', "🔑 Founder's Agreement"]
          ).map((item, i) => (
            <span key={i} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STATS ═══════════════════════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div className="grid-4-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {stats.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="stat-card" style={{ textAlign: 'center' }}>
                <p className="gradient-saffron" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontFamily: "'Rozha One', serif", marginBottom: '0.4rem' }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM ══════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div {...fadeUp()}>
            <span className="section-chip chip-saffron" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>😤 The Reality</span>
            <h2 style={{ marginBottom: '1rem' }}>
              Contracts are written by lawyers.<br />
              <span className="gradient-saffron">For lawyers. Not for you.</span>
            </h2>
            <p style={{ maxWidth: 580, margin: '0 auto 3rem', fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-muted)' }}>
              HR says &ldquo;sign by tomorrow.&rdquo; The landlord says &ldquo;it&apos;s standard.&rdquo;
              The client says &ldquo;everyone agrees to this.&rdquo; And most people — 73% of them — sign anyway.
              NyaySaathi is the friend who actually reads it for you.
            </p>
          </motion.div>

          <div className="grid-3-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
            {[
              { emoji: '😟', stat: '73%',  desc: 'of people sign contracts without reading them — trusting a handshake instead' },
              { emoji: '⚖️', stat: '60%',  desc: 'of employment contracts contain overly broad non-compete clauses' },
              { emoji: '💸', stat: '₹2L+', desc: 'average financial loss from unfair rental deposit clauses in Indian cities' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{item.emoji}</div>
                <p className="gradient-saffron" style={{ fontSize: '2.2rem', fontFamily: "'Rozha One', serif", marginBottom: '0.5rem' }}>{item.stat}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══ HOW IT WORKS ════════════════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div {...fadeUp()}>
              <span className="section-chip chip-indigo" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>🔄 How It Works</span>
              <h2>From upload to <span className="gradient-text">contract clarity</span><br />in under a minute.</h2>
            </motion.div>
          </div>
          <div className="grid-3-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { step: '1', icon: FileText, title: 'Upload or Paste',  desc: 'Drop a PDF, DOCX, or paste raw contract text — we handle any format', badge: '5 sec' },
              { step: '2', icon: Brain,    title: 'AI Analyzes',      desc: '6 specialized agents scan, score, and reason about every clause in parallel', badge: '~30 sec' },
              { step: '3', icon: Shield,   title: 'Get Your Report',  desc: 'Plain English risk report with negotiation tactics — ready to act on', badge: 'Instant' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.12)} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                    <Icon size={22} color="#818CF8" />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--saffron)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, background: 'rgba(249,115,22,0.1)', padding: '0.15rem 0.6rem', borderRadius: 20, border: '1px solid rgba(249,115,22,0.25)' }}>
                    Step {item.step} · {item.badge}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', marginTop: '0.75rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 6 AGENTS ═════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div {...fadeUp()}>
              <span className="section-chip chip-indigo" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>🤖 AI Architecture</span>
              <h2>Six expert agents.<br /><span className="gradient-text">One mission: protect you.</span></h2>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0.75rem auto 0', fontSize: '0.95rem' }}>
                Not one generic prompt — a full specialist team. Each agent has a distinct role,
                and together they see what no single AI pass would catch.
              </p>
            </motion.div>
          </div>
          <div className="grid-agents" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {agents.map((agent, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)} className="agent-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontFamily: "'Rozha One', serif", fontSize: '2rem', color: agent.color, opacity: 0.3 }}>{agent.num}</span>
                  <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
                  <h3 style={{ fontSize: '0.9rem' }}>{agent.name}</h3>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══ RISK COVERAGE ════════════════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div {...fadeUp()}>
              <span className="section-chip chip-pink" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>⚠️ Risk Coverage</span>
              <h2>We catch what you&apos;d miss<br /><span className="gradient-text">at 11pm under deadline pressure.</span></h2>
            </motion.div>
          </div>
          <div className="grid-4-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {riskCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.05)} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cat.color}18`, border: `1px solid ${cat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <Icon size={16} color={cat.color} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{cat.label}</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ INDIAN USE CASES ═════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div {...fadeUp()}>
              <span className="section-chip chip-saffron" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>🇮🇳 Real Stories from India</span>
              <h2>Built for the <span className="gradient-saffron">Indian professional.</span></h2>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                From IT campuses in Bengaluru to co-working spaces in Delhi — NyaySaathi speaks your reality.
              </p>
            </motion.div>
          </div>
          <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} color="#818CF8" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{uc.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{uc.city}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>&ldquo;{uc.story}&rdquo;</p>
                  <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.75rem' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#FACC15" color="#FACC15" />)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ══════════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 7rem' }}>
        <div className="container">
          <motion.div {...fadeUp()} className="glass-card"
            style={{ textAlign: 'center', padding: 'clamp(2.5rem, 6vw, 5rem) 2rem', position: 'relative', overflow: 'hidden', borderColor: 'rgba(99,102,241,0.2)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 50%, rgba(249,115,22,0.05) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #6366F1, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                <Shield size={30} color="#fff" />
              </div>
              <h2 style={{ marginBottom: '0.75rem' }}>
                Your next contract is waiting.<br />
                <span className="gradient-saffron">Are you going in blind?</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Every Indian professional deserves to understand what they&apos;re signing.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.85rem' }}>
                Powered by Google Gemini · Secured by Firebase · 🇮🇳 Built for India
              </p>
              <Link href={ctaHref} className="btn-primary glow-indigo"
                style={{ padding: '1rem 2.5rem', fontSize: '1rem', borderRadius: 12, gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
                <Zap size={18} /> Analyze Free — No Card Needed <ArrowRight size={15} />
              </Link>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Not legal advice · AI-powered awareness · Your data stays yours 🙏
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
