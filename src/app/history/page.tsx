'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyses } from '@/hooks/useAnalyses';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { formatDate } from '@/lib/utils';
import { Search, Trash2, ArrowRight, FileText, Clock, BarChart3, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const riskColors: Record<string, string> = {
  Critical: '#F87171', High: '#FB923C', Medium: '#FACC15', Low: '#34D399',
};

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1.5px solid var(--border-default)',
  borderRadius: 10, color: 'var(--text-primary)', padding: '0.6rem 0.85rem',
  fontSize: '0.875rem', fontFamily: "'Outfit', sans-serif", outline: 'none',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none', WebkitAppearance: 'none',
  paddingRight: '2rem', cursor: 'pointer', position: 'relative', zIndex: 1
};

function HistoryContent() {
  const { user } = useAuth();
  const { analyses, loading, remove } = useAnalyses(user?.uid ?? null);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');

  const filtered = useMemo(() => {
    return analyses.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !search || a.title.toLowerCase().includes(q) || a.contractType.toLowerCase().includes(q);
      const matchType = filterType === 'All' || a.contractType === filterType;
      const matchRisk = filterRisk === 'All' || a.riskLevel === filterRisk;
      return matchSearch && matchType && matchRisk;
    });
  }, [analyses, search, filterType, filterRisk]);

  const contractTypes = ['All', ...Array.from(new Set(analyses.map(a => a.contractType)))];

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this analysis? This cannot be undone.')) return;
    await remove(id);
    toast.success('Analysis deleted.');
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      <div className="container">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '0.4rem' }}>
            Analysis <span className="gradient-text">History</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {analyses.length} contract{analyses.length !== 1 ? 's' : ''} analyzed · Search and filter your reports
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>

          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or contract type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '2.25rem', width: '100%' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
              {contractTypes.map(t => <option key={t} value={t} style={{ background: '#0E0E1A' }}>{t}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} style={selectStyle}>
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(r => (
                <option key={r} value={r} style={{ background: '#0E0E1A' }}>{r}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }} />
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: 88, borderRadius: 16 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card"
            style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Clock size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: "'Rozha One', serif", fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              {analyses.length === 0 ? 'Nothing here yet.' : 'No matches found.'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {analyses.length === 0
                ? 'Analyze your first contract to see it here.'
                : 'Try adjusting your search or filters.'}
            </p>
            {analyses.length === 0 && (
              <Link href="/analyze" className="btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem', borderRadius: 10, display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                Analyze Your First Contract
              </Link>
            )}
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((analysis, i) => {
              const riskColor = riskColors[analysis.riskLevel] || '#818CF8';
              return (
                <motion.div key={analysis.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => router.push(`/report/${analysis.id}`)}
                  className="glass-card"
                  style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  }}
                >

                  {/* Icon */}
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BarChart3 size={19} color="#818CF8" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {analysis.title}
                      </p>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 6, background: `${riskColor}18`, color: riskColor, border: `1px solid ${riskColor}30`, flexShrink: 0 }}>
                        {analysis.riskLevel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FileText size={11} /> {analysis.contractType}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={11} /> {formatDate(analysis.createdAt)}
                      </span>
                      {analysis.overallRiskScore !== undefined && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Score: <strong style={{ color: riskColor }}>{analysis.overallRiskScore}/100</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <button onClick={(e) => { e.stopPropagation(); if (analysis.id) handleDelete(analysis.id); }} title="Delete"
                      style={{ width: 34, height: 34, borderRadius: 9, background: 'transparent', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F87171'; (e.currentTarget as HTMLElement).style.color = '#F87171'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                      <Trash2 size={14} />
                    </button>
                    <div
                      style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8', transition: 'all 0.2s ease' }}
                    >
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return <ProtectedRoute><HistoryContent /></ProtectedRoute>;
}
