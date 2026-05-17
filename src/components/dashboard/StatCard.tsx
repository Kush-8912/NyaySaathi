'use client';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
  delay?: number;
}

export default function StatCard({ title, value, subtitle, icon, trend, accentColor = '#6366f1', delay = 0 }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bento-card p-5 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        {trend && (
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-display font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
