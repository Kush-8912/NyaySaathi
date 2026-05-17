'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClauseAnalysis } from '@/types/analysis';
import RiskBadge from './RiskBadge';
import { ChevronDown, ChevronUp, AlertTriangle, Lightbulb, Scale } from 'lucide-react';

interface ClauseRiskCardProps {
  clause: ClauseAnalysis;
  index: number;
}

export default function ClauseRiskCard({ clause, index }: ClauseRiskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const scoreColor = (v: number): string =>
    v >= 70 ? '#EF4444' : v >= 50 ? '#F97316' : v >= 30 ? '#EAB308' : '#10B981';

  const RiskBar = ({ value, label }: { value: number; label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 99, background: scoreColor(value) }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
        />
      </div>
    </div>
  );

  const chipStyle = (bg: string, border: string, color: string): React.CSSProperties => ({
    fontSize: '0.68rem', fontWeight: 700, color,
    background: bg, border: `1px solid ${border}`,
    borderRadius: 20, padding: '0.15rem 0.6rem',
    letterSpacing: '0.03em', flexShrink: 0
  });

  const infoBlock = (bg: string, border: string, label: string, labelColor: string, icon: React.ReactNode, text: string) => (
    <div style={{ padding: '0.85rem 1rem', borderRadius: 10, background: bg, border: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
        <span style={{ color: labelColor }}>{icon}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: labelColor, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{text}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Clickable Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', textAlign: 'left', padding: '1.1rem 1.25rem',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
          background: 'none', border: 'none', cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.6rem', alignItems: 'center' }}>
            <RiskBadge level={clause.severity} size="sm" />
            {clause.category && (
              <span style={chipStyle('rgba(148,163,184,0.12)', 'rgba(148,163,184,0.3)', '#CBD5E1')}>
                {clause.category}
              </span>
            )}
            {clause.isOneSided && (
              <span style={chipStyle('rgba(249,115,22,0.12)', 'rgba(249,115,22,0.3)', '#FB923C')}>
                One-sided
              </span>
            )}
            {clause.isAmbiguous && (
              <span style={chipStyle('rgba(234,179,8,0.12)', 'rgba(234,179,8,0.3)', '#FACC15')}>
                Ambiguous
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '0.35rem' }}>
            {clause.clauseTitle}
          </h3>
          <p style={{
            fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace',
            lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            &ldquo;{clause.clauseText}&rdquo;
          </p>
        </div>

        {/* Score + toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color: scoreColor(clause.riskScore) }}>
            {clause.riskScore}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>/ 100</span>
          {expanded
            ? <ChevronUp size={15} color="var(--text-muted)" />
            : <ChevronDown size={15} color="var(--text-muted)" />
          }
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              {/* Risk Dimensions */}
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Risk Dimensions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem' }}>
                  <RiskBar value={clause.riskDimensions.financial} label="Financial" />
                  <RiskBar value={clause.riskDimensions.employment} label="Employment" />
                  <RiskBar value={clause.riskDimensions.ipOwnership} label="IP Ownership" />
                  <RiskBar value={clause.riskDimensions.legalExposure} label="Legal Exposure" />
                  <RiskBar value={clause.riskDimensions.termination} label="Termination" />
                  <RiskBar value={clause.riskDimensions.ambiguity} label="Ambiguity" />
                </div>
              </div>

              {/* Plain English */}
              {clause.plainExplanation && infoBlock(
                'rgba(99,102,241,0.07)', 'rgba(99,102,241,0.2)',
                'Plain English', '#818CF8',
                <Scale size={12} />, clause.plainExplanation
              )}

              {/* Hidden Risk */}
              {clause.hiddenRisk && infoBlock(
                'rgba(239,68,68,0.07)', 'rgba(239,68,68,0.2)',
                'Hidden Risk', '#F87171',
                <AlertTriangle size={12} />, clause.hiddenRisk
              )}

              {/* Worst Case */}
              {clause.possibleWorstCase && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    ⚠ Worst-Case Scenario
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{clause.possibleWorstCase}</p>
                </div>
              )}

              {/* Negotiation Tip */}
              {clause.negotiationSuggestion && infoBlock(
                'rgba(52,211,153,0.07)', 'rgba(52,211,153,0.2)',
                'Negotiation Tip', '#34D399',
                <Lightbulb size={12} />, clause.negotiationSuggestion
              )}

              {/* Better Wording */}
              {clause.betterClauseSuggestion && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: 10, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    ✏ Suggested Better Wording
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', lineHeight: 1.65, background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.75rem', borderRadius: 8 }}>
                    {clause.betterClauseSuggestion}
                  </p>
                </div>
              )}

              {/* Questions */}
              {clause.questionsToAsk && clause.questionsToAsk.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                    Questions to Ask
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {clause.questionsToAsk.map((q, i) => (
                      <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', lineHeight: 1.6 }}>
                        <span style={{ color: '#A78BFA', flexShrink: 0 }}>→</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
