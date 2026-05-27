'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyses } from '@/hooks/useAnalyses';
import { useLegalTip, fetchLegalTipFromAPI } from '@/hooks/useLegalTip';
import {
  FileSearch, TrendingUp, Shield, AlertTriangle, Clock,
  ArrowRight, BarChart3, Plus, CheckCircle, RefreshCw,
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const riskColors: Record<string, string> = {
  Critical: '#F87171', High: '#FB923C', Medium: '#FACC15', Low: '#34D399',
};

function DashboardContent() {
  const { user } = useAuth();
  const { analyses, loading } = useAnalyses(user?.uid ?? null);
  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0];

  const totalAnalyses = analyses.length;
  const avgRisk = totalAnalyses > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.overallRiskScore ?? 0), 0) / totalAnalyses)
    : 0;
  const criticalCount = analyses.filter(a => a.riskLevel === 'Critical').length;
  const recentFive = analyses.slice(0, 5);

  // AI-generated tip
  const { tip: aiTip, loading: tipLoading } = useLegalTip();
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const displayTip = currentTip ?? aiTip;

  async function handleRefreshTip() {
    setRefreshing(true);
    const fresh = await fetchLegalTipFromAPI();
    setCurrentTip(fresh);
    setRefreshing(false);
  }

  return (
    <div style={{ padding: '2rem 1.5rem', minHeight: '100vh', paddingTop: '5.5rem', position: 'relative', zIndex: 10 }}>
      <div className="container">

        {/* ── Header ──────────────────────────────────── */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Welcome back,</p>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '0.5rem' }}>
            {firstName} <span className="gradient-text">👋</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {totalAnalyses === 0
              ? 'No contracts analyzed yet. Drop your first document and see what you\'ve been signing.'
              : `You've analyzed ${totalAnalyses} contract${totalAnalyses > 1 ? 's' : ''}. Here's your risk overview.`}
          </p>
        </motion.div>

        {/* ── Quick Action ─────────────────────────────── */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: '2rem' }}>
          <Link href="/analyze" className="btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', borderRadius: 12, gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
            <Plus size={17} /> Analyze New Contract <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* ── Stats ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Analyzed',   value: totalAnalyses, icon: FileSearch, color: '#818CF8', suffix: '' },
            { label: 'Avg Risk Score',   value: avgRisk,       icon: TrendingUp, color: '#FB923C', suffix: '/100' },
            { label: 'Critical Risks',   value: criticalCount, icon: AlertTriangle, color: '#F87171', suffix: '' },
            { label: 'Contracts Saved',  value: totalAnalyses, icon: Shield,     color: '#34D399', suffix: '' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.06)} className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${stat.color}15`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={stat.color} />
                  </div>
                </div>
                <p style={{ fontSize: '2rem', fontFamily: "'Rozha One', serif", color: stat.color, marginBottom: '0.2rem' }}>
                  {loading ? '—' : stat.value}{stat.suffix}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main content: Recent + Tip ────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

          {/* Recent Analyses */}
          <motion.div {...fadeUp(0.2)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Analyses</h2>
              <Link href="/history" style={{ fontSize: '0.82rem', color: 'var(--indigo-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 14 }} />)}
              </div>
            ) : recentFive.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <FileSearch size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: "'Rozha One', serif", fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nothing analyzed yet.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Drop your first contract and find out what you&apos;ve been agreeing to.
                </p>
                <Link href="/analyze" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem', borderRadius: 10, display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                  <Plus size={15} /> Analyze a Contract
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentFive.map((analysis, i) => (
                  <motion.div key={analysis.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                    <Link href={`/report/${analysis.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div className="glass-card"
                        style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                        }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <BarChart3 size={18} color="#818CF8" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {analysis.title}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {analysis.contractType} · {new Date(analysis.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 6, background: `${riskColors[analysis.riskLevel] || '#818CF8'}18`, color: riskColors[analysis.riskLevel] || '#818CF8', border: `1px solid ${riskColors[analysis.riskLevel] || '#818CF8'}30` }}>
                            {analysis.riskLevel}
                          </span>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Tip Card */}
            <motion.div {...fadeUp(0.25)} className="glass-card" style={{ padding: '1.5rem', borderColor: 'rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} color="var(--saffron)" />
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--saffron)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Legal Tip of the Day</p>
                  <span style={{ fontSize: '0.6rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: 4, background: 'rgba(249,115,22,0.15)', color: 'var(--saffron)', letterSpacing: '0.04em' }}>AI</span>
                </div>
                <button
                  onClick={handleRefreshTip}
                  disabled={refreshing || tipLoading}
                  title="Get a new tip"
                  style={{
                    background: 'none', border: 'none', cursor: refreshing || tipLoading ? 'not-allowed' : 'pointer',
                    color: 'var(--saffron)', opacity: refreshing || tipLoading ? 0.4 : 0.7,
                    padding: '0.2rem', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { if (!refreshing && !tipLoading) (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = refreshing || tipLoading ? '0.4' : '0.7'; }}
                >
                  <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                </button>
              </div>
              {tipLoading && !displayTip ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '90%' }} />
                  <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '75%' }} />
                  <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '55%' }} />
                </div>
              ) : (
                <motion.p
                  key={displayTip}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}
                >
                  {displayTip}
                </motion.p>
              )}
            </motion.div>

            {/* Quick Links */}
            <motion.div {...fadeUp(0.3)} className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { href: '/analyze',  icon: FileSearch, label: 'Analyze a Contract' },
                  { href: '/history',  icon: Clock,      label: 'View History' },
                  { href: '/insights', icon: BarChart3,  label: 'See Insights' },
                ].map(link => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.25)'; (e.currentTarget as HTMLElement).style.color = '#818CF8'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
                      <Icon size={15} /> {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
