import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const icons = { Critical: AlertCircle, High: AlertTriangle, Medium: Info, Low: CheckCircle };

const styleConfig = {
  Critical: { color: '#F87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  High:     { color: '#FB923C', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  Medium:   { color: '#FACC15', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)' },
  Low:      { color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  Unknown:  { color: '#818CF8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
};

export default function RiskBadge({ level, size = 'md', showIcon = true }: RiskBadgeProps) {
  const Icon = icons[level as keyof typeof icons] || Info;
  const cfg = styleConfig[level as keyof typeof styleConfig] || styleConfig.Unknown;

  const sizing = {
    sm: { padding: '0.15rem 0.55rem', fontSize: '0.68rem', iconSize: 11 },
    md: { padding: '0.2rem 0.75rem',  fontSize: '0.75rem', iconSize: 13 },
    lg: { padding: '0.25rem 1rem',    fontSize: '0.85rem', iconSize: 15 },
  }[size];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      fontWeight: 700, borderRadius: 20,
      padding: sizing.padding, fontSize: sizing.fontSize,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      letterSpacing: '0.03em', flexShrink: 0
    }}>
      {showIcon && <Icon size={sizing.iconSize} />}
      {level}
    </span>
  );
}
