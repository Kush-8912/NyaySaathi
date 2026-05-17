'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Menu, X, LogOut, LayoutDashboard, FileSearch, History, BarChart3, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/firebase/auth';
import { toast } from 'sonner';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze',   label: 'Analyze',   icon: FileSearch },
  { href: '/history',   label: 'History',   icon: History },
  { href: '/insights',  label: 'Insights',  icon: BarChart3 },
];

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/login');
  };

  const isPublicPage = ['/', '/login', '/signup', '/forgot-password'].includes(pathname);
  const initials = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  return (
    <header className="navbar">
      <div className="container" style={{ height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #6366F1, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(99,102,241,0.35)', flexShrink: 0 }}>
            <Scale size={15} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: "'Rozha One', serif", fontSize: '1.05rem', background: 'linear-gradient(135deg, #818CF8, #FB923C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              NyaySaathi
            </span>
            <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.03em', fontWeight: 500 }}>न्याय • साथी • AI</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        {user && !isPublicPage && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 0.9rem', borderRadius: 10,
                  fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? '#818CF8' : 'var(--text-muted)',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}>
                  <Icon size={15} /> {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Desktop right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          {user ? (
            <>
              <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: 10, textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                  {initials}
                </div>
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: 10, background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'color 0.2s ease, border-color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F87171'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', borderRadius: 10 }}>Login</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', borderRadius: 10 }}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'none', cursor: 'pointer' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(8,8,15,0.97)', backdropFilter: 'blur(20px)' }}>
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user && navLinks.map(link => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', borderRadius: 10, textDecoration: 'none',
                    color: active ? '#818CF8' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem',
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  }}>
                    <Icon size={16} /> {link.label}
                  </Link>
                );
              })}
              {user ? (
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', borderRadius: 10, background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost" style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>Login</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          nav.desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
