'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';
import type { StoredAnalysis } from '@/types/analysis';
import { toast } from 'sonner';

interface DownloadReportButtonProps {
  analysis: StoredAnalysis;
}

export default function DownloadReportButton({ analysis }: DownloadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const [{ jsPDF }, { buildReportPdf, reportFileName }] = await Promise.all([
        import('jspdf'),
        import('@/lib/report/reportPdf'),
      ]);
      // The footer links back to wherever the app is running, so it's always the right address
      const doc = buildReportPdf(jsPDF, analysis, { siteUrl: window.location.origin });
      doc.save(reportFileName(analysis));
      toast.success('Report downloaded!');
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="btn-primary"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.55rem 1.25rem', borderRadius: 10,
        fontSize: '0.875rem', fontWeight: 600,
        opacity: loading ? 0.7 : 1,
      }}
    >
      <Download size={15} />
      {loading ? 'Generating PDF...' : 'Download Report'}
    </button>
  );
}
