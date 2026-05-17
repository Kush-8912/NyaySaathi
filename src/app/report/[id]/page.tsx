'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getAnalysis } from '@/lib/firebase/firestore';
import type { StoredAnalysis } from '@/types/analysis';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import RiskGauge from '@/components/report/RiskGauge';
import RiskBadge from '@/components/report/RiskBadge';
import ClauseRiskCard from '@/components/report/ClauseRiskCard';
import NegotiationPlanView from '@/components/report/NegotiationPlan';
import ScenarioSimulationView from '@/components/report/ScenarioSimulation';
import QuestionsChecklist from '@/components/report/QuestionsChecklist';
import DownloadReportButton from '@/components/report/DownloadReportButton';
import {
  AlertTriangle, CheckCircle, Copy, ArrowLeft, Scale,
  Lightbulb, HelpCircle, Eye, FileWarning, Lock,
  BookOpen, ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function SectionCard({ title, icon, color = '#818CF8', children, id }: {
  title: string; icon: React.ReactNode; color?: string; children: React.ReactNode; id?: string;
}) {
  return (
    <motion.section id={id} {...fadeUp(0.05)} className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        marginBottom: '1.25rem', paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
      borderRadius: 20, padding: '0.2rem 0.7rem',
    }}>{label}</span>
  );
}

function ReportContent() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<StoredAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !id) return;
    getAnalysis(user.uid, id)
      .then(a => { if (a) setAnalysis(a); else setError('Report not found'); })
      .catch(() => setError('Failed to load report'))
      .finally(() => setLoading(false));
  }, [user, id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '2px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366F1',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );

  if (error || !analysis) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <FileWarning size={48} color="var(--text-muted)" />
      <p style={{ color: 'var(--text-muted)' }}>{error || 'Report not found'}</p>
      <Link href="/history" className="btn-ghost" style={{ padding: '0.5rem 1.25rem', borderRadius: 10, fontSize: '0.875rem' }}>
        ← Back to History
      </Link>
    </div>
  );

  const a = analysis;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ maxWidth: 880 }}>

        {/* Breadcrumb */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '1.75rem' }}>
          <Link href="/history" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600,
          }}>
            <ArrowLeft size={14} /> History
          </Link>
        </motion.div>

        {/* ── Hero Header ─────────────────────────────── */}
        <motion.div {...fadeUp(0.04)} className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderColor: 'rgba(99,102,241,0.15)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Gauge */}
              <div style={{ flexShrink: 0 }}>
                <RiskGauge score={a.overallRiskScore} size={140} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <RiskBadge level={a.riskLevel} size="lg" />
                  {a.contractType && <Chip label={a.contractType} />}
                  {a.perspective && <Chip label={`${a.perspective} perspective`} />}
                </div>
                <h1 style={{
                  fontFamily: "'Rozha One', serif",
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  lineHeight: 1.2, marginBottom: '0.4rem',
                  color: 'var(--text-primary)',
                }}>
                  {a.title}
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {formatDate(a.createdAt)}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {a.summary}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
              paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)',
            }}>
              <DownloadReportButton analysis={a} />
              <button
                onClick={() => { navigator.clipboard.writeText(a.plainEnglishSummary); toast.success('Summary copied!'); }}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', borderRadius: 10, fontSize: '0.875rem' }}
              >
                <Copy size={14} /> Copy Summary
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Sections ────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Plain English Summary */}
          <SectionCard title="Plain English Summary" icon={<BookOpen size={16} />} color="#818CF8" id="summary">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {a.plainEnglishSummary}
            </p>
          </SectionCard>

          {/* Key Findings */}
          {(a.redFlags?.length > 0 || a.greenFlags?.length > 0) && (
            <SectionCard title="Key Findings" icon={<Eye size={16} />} color="#FB923C">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {a.redFlags?.length > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <AlertTriangle size={12} /> Red Flags
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {a.redFlags.map((f, i) => (
                        <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', lineHeight: 1.6 }}>
                          <span style={{ color: '#F87171', flexShrink: 0 }}>›</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {a.greenFlags?.length > 0 && (
                  <div style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 10, padding: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={12} /> Green Flags
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {a.greenFlags.map((f, i) => (
                        <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', lineHeight: 1.6 }}>
                          <span style={{ color: '#34D399', flexShrink: 0 }}>›</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Obligations & Rights */}
          {(a.obligationsAcceptedByUser?.length > 0 || a.rightsGivenAway?.length > 0) && (
            <SectionCard title="What You're Agreeing To" icon={<Scale size={16} />} color="#60A5FA">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {a.obligationsAcceptedByUser?.length > 0 && (
                  <div style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 10, padding: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FB923C', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Obligations You Accept</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {a.obligationsAcceptedByUser.map((o, i) => (
                        <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', lineHeight: 1.6 }}>
                          <span style={{ color: '#FB923C', flexShrink: 0 }}>→</span> {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {a.rightsGivenAway?.length > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Rights You Give Away</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {a.rightsGivenAway.map((r, i) => (
                        <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', lineHeight: 1.6 }}>
                          <span style={{ color: '#F87171', flexShrink: 0 }}>✗</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Missing Protections */}
          {a.missingProtections?.length > 0 && (
            <SectionCard title="Missing Protections" icon={<Lock size={16} />} color="#FACC15">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {a.missingProtections.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: '#FACC15', flexShrink: 0 }}>⚠</span> {m}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Clause Analysis */}
          {a.clauseAnalyses?.length > 0 && (
            <SectionCard title={`Clause-by-Clause Analysis (${a.clauseAnalyses.length} clauses)`} icon={<FileWarning size={16} />} color="#F43F5E" id="clauses">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {a.clauseAnalyses.map((c, i) => <ClauseRiskCard key={i} clause={c} index={i} />)}
              </div>
            </SectionCard>
          )}

          {/* Worst-Case Scenarios */}
          {a.scenarioSimulations?.length > 0 && (
            <SectionCard title="Worst-Case Scenarios" icon={<AlertTriangle size={16} />} color="#F87171">
              <ScenarioSimulationView simulations={a.scenarioSimulations} />
            </SectionCard>
          )}

          {/* Negotiation Plan */}
          {a.negotiationPlan?.length > 0 && (
            <SectionCard title="Negotiation Plan" icon={<Lightbulb size={16} />} color="#34D399" id="negotiate">
              <NegotiationPlanView plan={a.negotiationPlan} />
            </SectionCard>
          )}

          {/* Questions to Ask */}
          {a.questionsToAsk?.length > 0 && (
            <SectionCard title="Questions to Ask Before Signing" icon={<HelpCircle size={16} />} color="#A78BFA">
              <QuestionsChecklist questions={a.questionsToAsk} />
            </SectionCard>
          )}

          {/* Final Recommendation */}
          {a.finalRecommendation && (
            <SectionCard title="Final Recommendation" icon={<ShieldAlert size={16} />} color="#818CF8">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {a.finalRecommendation}
              </p>
            </SectionCard>
          )}

          {/* Disclaimer */}
          <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.15)', borderRadius: 12, padding: '1rem 1.25rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <span style={{ color: '#FACC15', fontWeight: 700 }}>⚠ Disclaimer: </span>
              {a.disclaimer || 'NyaySaathi analysis is for educational awareness only. It does not constitute legal advice. Consult a qualified legal professional before signing any contract.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return <ProtectedRoute><ReportContent /></ProtectedRoute>;
}
