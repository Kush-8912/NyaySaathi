'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScenarioSimulation } from '@/types/analysis';
import { AlertTriangle, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ScenarioSimulationProps {
  simulations: ScenarioSimulation[];
}

export default function ScenarioSimulationView({ simulations }: ScenarioSimulationProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {simulations.map((sim, i) => {
        const isOpen = openIndex === i;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${isOpen ? 'rgba(249,115,22,0.25)' : 'var(--border-subtle)'}`,
              borderRadius: 14, overflow: 'hidden',
              transition: 'border-color 0.25s ease',
            }}
          >
            {/* ── Scenario header (always visible) ── */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '1.1rem 1.25rem', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {/* Scenario number badge */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isOpen ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isOpen ? 'rgba(249,115,22,0.35)' : 'var(--border-subtle)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
              }}>
                <AlertTriangle size={16} color={isOpen ? '#FB923C' : 'var(--text-muted)'} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: isOpen ? '#FB923C' : 'var(--text-muted)',
                  marginBottom: '0.3rem', transition: 'color 0.2s ease',
                }}>
                  Scenario {i + 1}
                </p>
                <p style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {sim.scenario}
                </p>
              </div>

              <span style={{ flexShrink: 0, marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </span>
            </button>

            {/* ── Expanded content ── */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '0 1.25rem 1.25rem 1.25rem',
                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  }}>
                    {/* Outcome */}
                    <div style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      padding: '0.85rem 1rem', borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          What Happens
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {sim.outcome}
                        </p>
                      </div>
                    </div>

                    {/* Risk level */}
                    <div style={{
                      padding: '0.85rem 1rem', borderRadius: 10,
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        ⚠ Risk
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                        {sim.risk}
                      </p>
                    </div>

                    {/* Preventive action */}
                    <div style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      padding: '0.85rem 1rem', borderRadius: 10,
                      background: 'rgba(52,211,153,0.06)',
                      border: '1px solid rgba(52,211,153,0.2)',
                    }}>
                      <ShieldCheck size={15} color="#34D399" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          How to Protect Yourself
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {sim.preventiveAction}
                        </p>
                      </div>
                    </div>
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
