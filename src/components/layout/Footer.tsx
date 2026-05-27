import Link from 'next/link';
import { Scale } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
  Product: [
    { href: '/analyze',   label: 'Analyze Contract' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/history',   label: 'History' },
    { href: '/insights',  label: 'Insights' },
  ],
  Account: [
    { href: '/login',    label: 'Sign In' },
    { href: '/signup',   label: 'Sign Up' },
    { href: '/account',  label: 'Profile' },
  ],
  Legal: [
    { href: '/privacy',    label: 'Privacy Policy' },
    { href: '/terms',      label: 'Terms of Use' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-default)', background: 'var(--footer-bg)', marginTop: '2rem' }}>
      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #6366F1, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Rozha One', serif", backgroundImage: 'linear-gradient(135deg, #4F46E5, #E8650A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.1rem' }}>
                {APP_NAME}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 240 }}>
              Read before you sign. Know before you agree.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              AI-powered legal awareness. Not a substitute for qualified legal advice. 🇮🇳
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {section}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(link => (
                  <Link key={link.label} href={link.href} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            © 2026 {APP_NAME}. Built for PromptWars — Scaler School of Technology.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Powered by Google Gemini · Firebase
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
