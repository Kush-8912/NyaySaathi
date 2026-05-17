'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { StoredAnalysis } from '@/types/analysis';
import RiskBadge from '@/components/report/RiskBadge';
import { formatDate, truncateText } from '@/lib/utils';
import { FileText, ArrowRight } from 'lucide-react';

interface RecentAnalysisCardProps {
  analysis: StoredAnalysis;
  index: number;
}

export default function RecentAnalysisCard({ analysis, index }: RecentAnalysisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        href={`/report/${analysis.id}`}
        style={{ cursor: 'none' }}
        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{analysis.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{analysis.contractType} · {formatDate(analysis.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RiskBadge level={analysis.riskLevel} size="sm" showIcon={false} />
          <span className="text-sm font-bold" style={{
            color: analysis.overallRiskScore >= 80 ? '#ef4444' : analysis.overallRiskScore >= 60 ? '#f97316' : '#eab308'
          }}>{analysis.overallRiskScore}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
