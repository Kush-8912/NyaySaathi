import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLevel } from '@/types/analysis';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(level: RiskLevel | string): string {
  switch (level) {
    case 'Critical': return 'text-red-500';
    case 'High': return 'text-orange-500';
    case 'Medium': return 'text-yellow-500';
    case 'Low': return 'text-emerald-500';
    default: return 'text-slate-400';
  }
}

export function getRiskBgColor(level: RiskLevel | string): string {
  switch (level) {
    case 'Critical': return 'bg-red-500/20 border-red-500/40';
    case 'High': return 'bg-orange-500/20 border-orange-500/40';
    case 'Medium': return 'bg-yellow-500/20 border-yellow-500/40';
    case 'Low': return 'bg-emerald-500/20 border-emerald-500/40';
    default: return 'bg-slate-500/20 border-slate-500/40';
  }
}

export function getRiskGaugeColor(score: number): string {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#eab308';
  return '#10b981';
}

export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}
