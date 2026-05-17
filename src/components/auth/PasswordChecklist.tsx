'use client';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const rules = [
  { label: '8+ characters',   test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number',           test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character',test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordChecklist({ password }: { password: string }) {
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
      {rules.map(rule => {
        const pass = rule.test(password);
        return (
          <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: pass ? '#34D399' : 'var(--text-muted)', transition: 'color 0.2s ease' }}>
            {pass
              ? <Check size={12} style={{ color: '#34D399', flexShrink: 0 }} />
              : <X     size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            }
            {rule.label}
          </div>
        );
      })}
    </motion.div>
  );
}
