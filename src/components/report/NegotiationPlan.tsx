'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NegotiationPoint } from '@/types/analysis';
import { ChevronDown, ChevronUp, AlertTriangle, Zap, Info, Lightbulb } from 'lucide-react';

interface NegotiationPlanProps {
  plan: NegotiationPoint[];
}

type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

const PRIORITY_CONFIG: Record<Priority, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  Critical: { icon: AlertTriangle, color: '#F87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', label: 'Critical' },
  High:     { icon: AlertTriangle, color: '#FB923C', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', label: 'High' },
  Medium:   { icon: Zap,           color: '#FACC15', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)',  label: 'Medium' },
  Low:      { icon: Info,          color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', label: 'Low' },
};

export default function NegotiationPlanView({ plan }: NegotiationPlanProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {plan.map((item, i) => {
        const cfg = PRIORITY_CONFIG[item.priority as Priority] ?? PRIORITY_CONFIG.Low;
        const Icon = cfg.icon;
        const isOpen = openIndex === i;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${isOpen ? cfg.border : 'var(--border-subtle)'}`,
              borderRadius: 12,
              overflow: 'hidden',
              transition: 'border-color 0.25s ease',
            }}
          >
            {/* Header row — always visible */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '1rem 1.25rem', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {/* Priority badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                flexShrink: 0, marginTop: '0.1rem',
                fontSize: '0.68rem', fontWeight: 700,
                color: cfg.color, background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 20, padding: '0.2rem 0.65rem',
              }}>
                <Icon size={10} /> {cfg.label}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: '0.25rem' }}>
                  {item.ask}
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {item.reason}
                </p>
              </div>

              {/* Expand toggle */}
              {item.suggestedWording && (
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '0.15rem' }}>
                  {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
              )}
            </button>

            {/* Suggested wording — expandable */}
            <AnimatePresence>
              {isOpen && item.suggestedWording && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '0.85rem 1.25rem 1.25rem',
                    borderTop: `1px solid ${cfg.border}`,
                    background: cfg.bg,
                  }}>
                    <p style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      color: cfg.color, letterSpacing: '0.07em',
                      textTransform: 'uppercase', marginBottom: '0.6rem',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      <Lightbulb size={11} /> Suggested Wording
                    </p>
                    <p style={{
                      fontSize: '0.83rem', color: 'var(--text-secondary)',
                      fontFamily: 'monospace', lineHeight: 1.75,
                      background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem',
                      borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {item.suggestedWording}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
