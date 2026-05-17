'use client';
import { useEffect, useRef } from 'react';
import { getRiskGaugeColor } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  size?: number;
}

export default function RiskGauge({ score, size = 160 }: RiskGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 54;
  const stroke = 10;
  const circumference = Math.PI * radius; // half circle
  const progress = ((100 - clampedScore) / 100) * circumference;
  const color = getRiskGaugeColor(clampedScore);

  const label =
    clampedScore >= 80 ? 'Critical' :
    clampedScore >= 60 ? 'High' :
    clampedScore >= 40 ? 'Medium' : 'Low';

  const labelColor =
    clampedScore >= 80 ? '#ef4444' :
    clampedScore >= 60 ? '#f97316' :
    clampedScore >= 40 ? '#eab308' : '#10b981';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Track */}
        <path
          d={`M ${stroke} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke} ${size / 2}`}
          fill="none"
          stroke="rgba(99,102,241,0.15)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M ${stroke} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {clampedScore}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          fill={labelColor}
          fontSize="12"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          {label}
        </text>
      </svg>
      <p className="text-xs text-slate-500">Risk Score / 100</p>
    </div>
  );
}
