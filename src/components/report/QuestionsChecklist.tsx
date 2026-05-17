'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react';

interface QuestionsChecklistProps {
  questions: string[];
}

export default function QuestionsChecklist({ questions }: QuestionsChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const progress = questions.length > 0 ? Math.round((checked.size / questions.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

      {/* Progress bar */}
      {questions.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Progress
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: checked.size > 0 ? '#34D399' : 'var(--text-muted)' }}>
              {checked.size}/{questions.length} addressed
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #6366F1, #34D399)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      {/* Question items */}
      {questions.map((q, i) => {
        const done = checked.has(i);
        return (
          <motion.button
            key={i}
            onClick={() => toggle(i)}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              padding: '0.8rem 1rem', borderRadius: 10,
              background: done ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.03)',
              outline: `1px solid ${done ? 'rgba(52,211,153,0.25)' : 'var(--border-subtle)'}`,
              transition: 'all 0.2s ease',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseEnter={e => {
              if (!done) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.07)';
            }}
            onMouseLeave={e => {
              if (!done) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <span style={{ flexShrink: 0, marginTop: '0.05rem', color: done ? '#34D399' : 'var(--text-muted)' }}>
              {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            </span>
            <span style={{
              fontSize: '0.875rem', lineHeight: 1.65,
              color: done ? 'var(--text-muted)' : 'var(--text-secondary)',
              textDecoration: done ? 'line-through' : 'none',
              transition: 'all 0.2s ease',
            }}>
              {q}
            </span>
          </motion.button>
        );
      })}

      {/* Hint */}
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', paddingLeft: '0.25rem' }}>
        <HelpCircle size={12} />
        Click any question to mark it as asked
      </p>
    </div>
  );
}
