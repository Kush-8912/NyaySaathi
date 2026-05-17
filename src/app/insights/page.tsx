'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyses } from '@/hooks/useAnalyses';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import RiskChart from '@/components/dashboard/RiskChart';
import { BarChart3, TrendingUp, ShieldAlert, AlertTriangle, Brain } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { formatDate } from '@/lib/utils';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function InsightsContent() {
  const { user } = useAuth();
  const { analyses, loading } = useAnalyses(user?.uid ?? null);

  const chartData = useMemo(() => {
    const map: Record<string, { count: number; totalScore: number }> = {};
    analyses.forEach(a => {
      if (!map[a.contractType]) map[a.contractType] = { count: 0, totalScore: 0 };
      map[a.contractType].count++;
      map[a.contractType].totalScore += a.overallRiskScore;
    });
    return Object.entries(map).map(([category, v]) => ({
      category, count: v.count, avgScore: Math.round(v.totalScore / v.count),
    }));
  }, [analyses]);

  const trendData = useMemo(() =>
    [...analyses].reverse().slice(-20).map(a => ({
      date: formatDate(a.createdAt),
      score: a.overallRiskScore,
    })), [analyses]);

  const clauseFrequency = useMemo(() => {
    const map: Record<string, number> = {};
    analyses.forEach(a => a.clauseAnalyses?.forEach(c => {
      map[c.category] = (map[c.category] || 0) + 1;
    }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([category, count]) => ({ category, count, avgScore: 0 }));
  }, [analyses]);

  const avgScore = analyses.length
    ? Math.round(analyses.reduce((s, a) => s + a.overallRiskScore, 0) / analyses.length)
    : 0;
  const criticalCount = analyses.filter(a => a.riskLevel === 'Critical').length;

  const scoreColor = avgScore >= 70 ? '#EF4444' : avgScore >= 40 ? '#F97316' : '#34D399';

  const stats = [
    { label: 'Total Analyzed',    value: analyses.length,    icon: ShieldAlert,    color: '#818CF8', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)' },
    { label: 'Avg Risk Score',    value: `${avgScore}/100`,  icon: TrendingUp,     color: scoreColor, bg: `${scoreColor}18`,      border: `${scoreColor}35` },
    { label: 'Critical Contracts',value: criticalCount,      icon: AlertTriangle,  color: '#F87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
    { label: 'Contract Types',    value: chartData.length,   icon: BarChart3,      color: '#34D399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)' },
  ];

  const aiInsight = avgScore >= 70
    ? 'Most of your contracts are high-risk. Consider having a lawyer review before signing any new agreements.'
    : avgScore >= 40
    ? "You're dealing with moderately risky contracts. Pay close attention to non-compete and IP ownership clauses."
    : 'Your contracts appear relatively fair. Keep reviewing termination and arbitration clauses carefully.';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.25rem' }}>
            <span className="gradient-text">Insights</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Your personal contract risk intelligence dashboard.
          </p>
        </motion.div>

        {analyses.length === 0 ? (
          <motion.div {...fadeUp(0.05)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BarChart3 size={28} color="#818CF8" />
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No data yet</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Analyze your first contract to see risk insights here.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Stat Cards ─────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    {...fadeUp(i * 0.07)}
                    className="glass-card"
                    style={{ padding: '1.25rem' }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 11,
                      background: s.bg, border: `1px solid ${s.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '1rem',
                    }}>
                      <Icon size={18} color={s.color} />
                    </div>
                    <p style={{ fontSize: '1.7rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
                      {s.value}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Charts row ─────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

              {/* Risk Score Trend */}
              <motion.div {...fadeUp(0.18)} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Risk Score Trend</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your last {trendData.length} analyses</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(8,8,20,0.97)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, fontSize: 12, fontFamily: "'Outfit', sans-serif" }}
                      labelStyle={{ color: '#818CF8' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#6366F1', r: 3, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Contract Type Breakdown */}
              <motion.div {...fadeUp(0.22)} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Analyses by Contract Type</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Count of contracts reviewed</p>
                </div>
                <RiskChart data={chartData} type="bar" />
              </motion.div>
            </div>

            {/* ── Clause Frequency ───────────────────────── */}
            {clauseFrequency.length > 0 && (
              <motion.div {...fadeUp(0.26)} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Most Common Clause Categories</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Across all your analyzed contracts</p>
                </div>
                <RiskChart data={clauseFrequency} type="bar" />
              </motion.div>
            )}

            {/* ── AI Pattern Insight ─────────────────────── */}
            <motion.div
              {...fadeUp(0.3)}
              className="glass-card"
              style={{ padding: '1.5rem', borderColor: 'rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Brain size={18} color="#818CF8" />
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    AI Pattern Insight
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                    Based on your <strong style={{ color: 'var(--text-primary)' }}>{analyses.length}</strong> analyzed contract{analyses.length !== 1 ? 's' : ''}, your average risk score is{' '}
                    <strong style={{ color: scoreColor }}>{avgScore}/100</strong>. {aiInsight}
                    {criticalCount > 0 && (
                      <span style={{ color: '#F87171' }}>
                        {' '}You have <strong>{criticalCount}</strong> critical-risk contract{criticalCount > 1 ? 's' : ''} that need immediate attention.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </div>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 900px) {
          .insights-grid-2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .insights-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function InsightsPage() {
  return <ProtectedRoute><InsightsContent /></ProtectedRoute>;
}
