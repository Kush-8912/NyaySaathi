'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, Brain, Scale, Shield, ArrowLeft, Info } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const disclaimers = [
  {
    icon: Scale,
    title: 'Not Legal Advice',
    color: '#F87171',
    critical: true,
    content: 'NyaySaathi is an AI-powered legal awareness and risk education tool. Nothing on this platform — including risk reports, clause summaries, risk scores, negotiation suggestions, plain-language explanations, or any other output — constitutes legal advice, legal opinion, or the practice of law.',
    detail: 'NyaySaathi is not a law firm, is not staffed by lawyers acting in a legal capacity, and does not create an attorney-client relationship. For any legal matter with real financial, professional, or personal consequences, you must consult a qualified, licensed advocate or legal professional registered with the Bar Council of India (or the relevant bar in your jurisdiction).',
  },
  {
    icon: Brain,
    title: 'AI Limitations & Accuracy',
    color: '#FB923C',
    critical: false,
    content: 'NyaySaathi uses large language models (Google Gemini) to analyze contract text. While we have engineered our 6-agent pipeline to maximize accuracy, AI systems have inherent limitations and can make mistakes.',
    bullets: [
      'AI may misinterpret ambiguous legal language, jurisdiction-specific jargon, or novel clause structures.',
      'Risk scores are indicative estimates, not definitive legal evaluations. A "Low Risk" score does not guarantee a clause is safe or enforceable.',
      'AI-generated negotiation suggestions may not be appropriate for your specific jurisdiction, industry, counterparty, or personal circumstances.',
      'The analysis does not account for verbal agreements, side letters, prevailing local custom, or regulatory guidance that may affect clause interpretation.',
      'NyaySaathi cannot detect fraud, forgery, unauthorized modifications, or missing pages in submitted documents.',
      'Output quality depends entirely on the quality of text extracted from your document. Scanned PDFs, handwritten contracts, or poorly formatted files may yield lower-quality analysis.',
    ],
  },
  {
    icon: Shield,
    title: 'No Guarantee of Outcome',
    color: '#FACC15',
    critical: false,
    content: 'Using NyaySaathi does not guarantee any particular legal or negotiation outcome. Contract enforceability, risk exposure, and negotiation leverage depend on many factors beyond the scope of any AI tool, including:',
    bullets: [
      'The specific governing law and jurisdiction of the contract',
      'The relative bargaining power of the parties involved',
      'Evolving court interpretations, regulatory changes, or new legislation',
      'Facts and circumstances beyond the four corners of the document',
      'Actions taken or not taken by you or the other contracting party',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Third-Party AI Services',
    color: '#A78BFA',
    critical: false,
    content: 'NyaySaathi\'s analysis is powered by Google Gemini, a third-party AI service. While we route your data through the Gemini API under enterprise terms that restrict training data usage, we cannot make absolute guarantees about the behavior of third-party AI infrastructure.',
    detail: 'We are not responsible for downtime, inaccuracies, policy changes, or errors originating from third-party AI providers. Google Gemini\'s own Terms of Service and AI principles also apply to the extent our use invokes them.',
  },
  {
    icon: Info,
    title: 'Use in High-Stakes Situations',
    color: '#34D399',
    critical: true,
    content: 'NyaySaathi analysis should be treated as a starting point for awareness — not a final answer. We strongly urge you to:',
    bullets: [
      '🔴 Consult a qualified lawyer before signing any contract with significant financial, employment, or legal consequences.',
      '🟡 Use NyaySaathi reports as a briefing tool to prepare better questions for your legal counsel — not to replace them.',
      '🟡 Double-check any clause interpretation or negotiation suggestion against current Indian legislation, judicial decisions, or applicable industry standards.',
      '🟢 Use NyaySaathi freely for initial due diligence, awareness, and education — that is precisely what it is designed for.',
    ],
  },
];

export default function DisclaimerPage() {
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
          <span className="section-chip chip-saffron" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <AlertTriangle size={11} /> Disclaimer
          </span>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.75rem' }}>
            Important <span className="gradient-saffron">Disclaimers</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 620 }}>
            NyaySaathi is a powerful tool for contract awareness — but it is not a lawyer. 
            Understanding these limitations is essential to using the platform responsibly.
          </p>
        </motion.div>

        {/* Critical banner */}
        <motion.div {...fadeUp(0.15)} style={{ padding: '1.25rem 1.5rem', borderRadius: 14, border: '1.5px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)', marginBottom: '2.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={20} color="#F87171" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F87171', marginBottom: '0.3rem' }}>
              Critical Notice: This is NOT Legal Advice
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              NyaySaathi reports are for educational awareness only. Before signing any contract, 
              consult a qualified advocate registered with the <strong style={{ color: 'var(--text-primary)' }}>Bar Council of India</strong> or 
              the relevant bar in your jurisdiction. AI analysis does not replace professional legal counsel.
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {disclaimers.map((section, si) => {
            const Icon = section.icon;
            return (
              <motion.div key={si} {...fadeUp(0.2 + si * 0.07)} className="glass-card"
                style={{ padding: '2rem', borderColor: section.critical ? `${section.color}25` : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${section.color}15`, border: `1px solid ${section.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={section.color} />
                  </div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{section.title}</h2>
                  {section.critical && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 20, background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Critical
                    </span>
                  )}
                </div>

                <div style={{ paddingLeft: '1rem', borderLeft: `2px solid ${section.color}30`, marginBottom: 'bullets' in section ? '1rem' : 0 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{section.content}</p>
                  {'detail' in section && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75, marginTop: '0.75rem' }}>{section.detail as string}</p>
                  )}
                </div>

                {'bullets' in section && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '0.5rem', marginTop: '0.75rem' }}>
                    {(section.bullets as string[]).map((bullet, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        {!bullet.startsWith('🔴') && !bullet.startsWith('🟡') && !bullet.startsWith('🟢') && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: section.color, marginTop: '0.55rem', flexShrink: 0 }} />
                        )}
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{bullet}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div {...fadeUp(0.55)} style={{ marginTop: '2.5rem', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            By using NyaySaathi you acknowledge these disclaimers and agree to our{' '}
            <Link href="/terms" style={{ color: '#818CF8', fontWeight: 700 }}>Terms of Use</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#818CF8', fontWeight: 700 }}>Privacy Policy</Link>.
            {' '}For legal help, visit{' '}
            <a href="https://www.sci.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--saffron-light)', fontWeight: 700 }}>Supreme Court of India</a>
            {' '}or find an advocate at{' '}
            <a href="https://www.barcouncilofindia.org" target="_blank" rel="noreferrer" style={{ color: 'var(--saffron-light)', fontWeight: 700 }}>Bar Council of India</a>.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
