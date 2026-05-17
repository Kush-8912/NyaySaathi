'use client';
import { motion } from 'framer-motion';
import { AGENT_STEPS } from '@/lib/constants';
import { CheckCircle, Loader2, Circle } from 'lucide-react';

interface AgentThinkingProps {
  currentStep: string;
  currentMessage: string;
  isComplete?: boolean;
}

export default function AgentThinking({ currentStep, currentMessage, isComplete }: AgentThinkingProps) {
  const currentIdx = AGENT_STEPS.findIndex(s => s.key === currentStep);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card" style={{ padding: '1.5rem', borderColor: 'rgba(99,102,241,0.2)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isComplete
            ? <CheckCircle size={16} color="#34D399" />
            : <Loader2 size={16} color="#818CF8" style={{ animation: 'spin 1s linear infinite' }} />
          }
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#818CF8' }}>NyaySaathi · 6-Agent AI Analysis</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            {isComplete ? '✓ Analysis complete — your report is ready!' : currentMessage}
          </p>
        </div>
        {!isComplete && (
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <span key={i} className="thinking-dot" style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#818CF8' }} />
            ))}
          </div>
        )}
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {AGENT_STEPS.map((step, i) => {
          const done    = i < currentIdx || isComplete;
          const running = i === currentIdx && !isComplete;
          return (
            <motion.div key={step.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.5rem 0.75rem', borderRadius: 10, transition: 'all 0.3s ease',
                background: running ? 'rgba(99,102,241,0.08)' : 'transparent',
                border: running ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              }}>
              {done
                ? <CheckCircle size={15} color="#34D399" style={{ flexShrink: 0 }} />
                : running
                  ? <Loader2 size={15} color="#818CF8" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                  : <Circle size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.83rem', fontWeight: 600, color: done ? '#34D399' : running ? '#818CF8' : 'var(--text-muted)' }}>
                  {step.label}
                </p>
                {running && (
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
