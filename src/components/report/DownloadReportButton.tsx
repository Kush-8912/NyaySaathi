'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';
import type { StoredAnalysis } from '@/types/analysis';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface DownloadReportButtonProps {
  analysis: StoredAnalysis;
}

export default function DownloadReportButton({ analysis }: DownloadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210;
      const H = 297;
      const margin = 20;
      const usable = W - margin * 2;
      let y = 0;

      // ── Color palette ─────────────────────────────────
      const C = {
        bg:         [8, 8, 20]      as [number,number,number],
        card:       [18, 18, 40]    as [number,number,number],
        indigo:     [99, 102, 241]  as [number,number,number],
        indigoL:    [129, 140, 248] as [number,number,number],
        text:       [232, 234, 246] as [number,number,number],
        muted:      [148, 163, 184] as [number,number,number],
        subtle:     [71, 85, 105]   as [number,number,number],
        border:     [30, 32, 60]    as [number,number,number],
        red:        [239, 68, 68]   as [number,number,number],
        orange:     [249, 115, 22]  as [number,number,number],
        yellow:     [234, 179, 8]   as [number,number,number],
        green:      [52, 211, 153]  as [number,number,number],
        violet:     [167, 139, 250] as [number,number,number],
      };

      const scoreColor = (s: number): [number,number,number] =>
        s >= 80 ? C.red : s >= 60 ? C.orange : s >= 40 ? C.yellow : C.green;

      const priorityColor = (p: string): [number,number,number] =>
        p === 'Critical' ? C.red : p === 'High' ? C.orange : p === 'Medium' ? C.yellow : C.green;

      // ── Core helpers ──────────────────────────────────
      const checkPage = (needed: number) => {
        if (y + needed > H - 20) {
          doc.addPage();
          doc.setFillColor(...C.bg);
          doc.rect(0, 0, W, H, 'F');
          // header strip
          doc.setFillColor(...C.card);
          doc.rect(0, 0, W, 10, 'F');
          doc.setFontSize(6.5); doc.setTextColor(...C.subtle); doc.setFont('helvetica', 'normal');
          doc.text('NyaySaathi — Contract Intelligence Report', margin, 7);
          y = 18;
        }
      };

      const txt = (
        text: string, size: number, bold: boolean,
        color: [number,number,number], x = margin, maxW = usable
      ) => {
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(String(text), maxW);
        checkPage(lines.length * size * 0.45 + 3);
        doc.text(lines, x, y);
        y += lines.length * size * 0.45 + 2;
      };

      const gap = (n = 4) => { y += n; };

      const hRule = (color: [number,number,number] = C.border) => {
        checkPage(6);
        doc.setDrawColor(...color);
        doc.setLineWidth(0.25);
        doc.line(margin, y, W - margin, y);
        y += 5;
      };

      const sectionBar = (label: string, color: [number,number,number] = C.indigoL) => {
        checkPage(16);
        gap(5);
        doc.setFillColor(...C.card);
        doc.rect(margin, y - 4, usable, 10, 'F');
        doc.setFillColor(...color);
        doc.rect(margin, y - 4, 3, 10, 'F');
        doc.setFontSize(9); doc.setTextColor(...color); doc.setFont('helvetica', 'bold');
        doc.text(label, margin + 6, y + 2.5);
        y += 10;
      };

      // ══════════════════════════════════════════════════
      // COVER PAGE
      // ══════════════════════════════════════════════════
      doc.setFillColor(...C.bg);
      doc.rect(0, 0, W, H, 'F');

      // Top indigo bar
      doc.setFillColor(...C.indigo);
      doc.rect(0, 0, W, 2, 'F');

      // Header band
      doc.setFillColor(...C.card);
      doc.rect(0, 0, W, 48, 'F');

      // Brand
      y = 15;
      doc.setFontSize(20); doc.setTextColor(...C.indigoL); doc.setFont('helvetica', 'bold');
      doc.text('NyaySaathi', margin, y);
      y += 6;
      doc.setFontSize(8.5); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
      doc.text('AI Contract Intelligence  |  Know Before You Sign', margin, y);
      y += 5;
      doc.setFontSize(7.5); doc.setTextColor(...C.subtle);
      doc.text(`Report generated: ${formatDate(analysis.createdAt)}`, margin, y);

      // Risk score (right aligned)
      const sc = analysis.overallRiskScore;
      const sc_c = scoreColor(sc);
      doc.setFontSize(34); doc.setTextColor(...sc_c); doc.setFont('helvetica', 'bold');
      doc.text(`${sc}`, W - margin, 26, { align: 'right' });
      doc.setFontSize(8); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
      doc.text('out of 100', W - margin, 33, { align: 'right' });
      doc.setFontSize(9); doc.setTextColor(...sc_c); doc.setFont('helvetica', 'bold');
      doc.text(analysis.riskLevel.toUpperCase(), W - margin, 40, { align: 'right' });

      y = 58;

      // Contract title
      doc.setFontSize(17); doc.setTextColor(...C.text); doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(analysis.title, usable);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 7 + 4;

      // Meta line
      const meta = [analysis.contractType, analysis.perspective ? `${analysis.perspective} perspective` : ''].filter(Boolean).join('  ·  ');
      if (meta) { doc.setFontSize(8.5); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal'); doc.text(meta, margin, y); y += 5; }

      hRule();

      // Summary
      txt('Executive Summary', 10, true, C.indigoL);
      gap(1);
      txt(analysis.summary, 9, false, C.muted);
      gap(4);

      // Plain English box
      doc.setFillColor(...C.card);
      const peLines = doc.splitTextToSize(analysis.plainEnglishSummary, usable - 12);
      const peH = peLines.length * 4.2 + 12;
      doc.rect(margin, y, usable, peH, 'F');
      doc.setFillColor(...C.indigo);
      doc.rect(margin, y, 3, peH, 'F');
      y += 5;
      txt('Plain English Summary', 8, true, C.indigoL, margin + 7, usable - 10);
      gap(1);
      txt(analysis.plainEnglishSummary, 8.5, false, C.text, margin + 7, usable - 10);
      y += 6;
      gap(4);

      // Red Flags on cover
      if (analysis.redFlags?.length) {
        hRule();
        txt('Red Flags', 9.5, true, C.red);
        gap(1);
        analysis.redFlags.slice(0, 6).forEach(f => {
          checkPage(9);
          doc.setFillColor(...C.red);
          doc.rect(margin + 2, y - 2.5, 1.5, 1.5, 'F');
          txt(f, 8.5, false, C.muted, margin + 6, usable - 6);
          gap(1);
        });
      }

      // Green Flags on cover
      if (analysis.greenFlags?.length) {
        gap(2);
        txt('What Works In Your Favour', 9.5, true, C.green);
        gap(1);
        analysis.greenFlags.slice(0, 4).forEach(f => {
          checkPage(9);
          doc.setFillColor(...C.green);
          doc.rect(margin + 2, y - 2.5, 1.5, 1.5, 'F');
          txt(f, 8.5, false, C.muted, margin + 6, usable - 6);
          gap(1);
        });
      }

      // ══════════════════════════════════════════════════
      // CLAUSE ANALYSIS
      // ══════════════════════════════════════════════════
      if (analysis.clauseAnalyses?.length) {
        doc.addPage();
        doc.setFillColor(...C.bg); doc.rect(0, 0, W, H, 'F');
        y = 18;
        sectionBar(`CLAUSE-BY-CLAUSE ANALYSIS  (${analysis.clauseAnalyses.length} clauses)`, C.red);

        analysis.clauseAnalyses.forEach((clause, i) => {
          checkPage(28);
          gap(3);

          // Clause number + title
          doc.setFontSize(7.5); doc.setTextColor(...C.subtle); doc.setFont('helvetica', 'bold');
          doc.text(`${String(i + 1).padStart(2, '0')}`, margin, y);
          const cTitleLines = doc.splitTextToSize(clause.clauseTitle, usable - 22);
          doc.setFontSize(10); doc.setTextColor(...C.text); doc.setFont('helvetica', 'bold');
          doc.text(cTitleLines, margin + 8, y);

          // Score
          doc.setFontSize(14); doc.setTextColor(...scoreColor(clause.riskScore)); doc.setFont('helvetica', 'bold');
          doc.text(`${clause.riskScore}`, W - margin, y, { align: 'right' });
          doc.setFontSize(6); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
          doc.text('/100', W - margin, y + 4, { align: 'right' });
          y += cTitleLines.length * 4.8 + 3;

          // Severity tag
          doc.setFontSize(7.5); doc.setTextColor(...scoreColor(clause.riskScore)); doc.setFont('helvetica', 'bold');
          doc.text(`[${clause.severity}]`, margin + 8, y);
          if (clause.category) {
            doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
            doc.text(clause.category, margin + 8 + (clause.severity?.length ?? 0) * 2.4 + 4, y);
          }
          if (clause.isOneSided) {
            doc.setTextColor(...C.orange); doc.setFont('helvetica', 'bold');
            doc.text('One-sided', margin + 8 + 40, y);
          }
          y += 5;

          // Clause text (monospace style)
          if (clause.clauseText) {
            doc.setFontSize(7.5); doc.setTextColor(...C.subtle); doc.setFont('helvetica', 'italic');
            const cq = doc.splitTextToSize(`"${clause.clauseText}"`, usable - 12);
            checkPage(cq.length * 3.5 + 3);
            doc.text(cq, margin + 8, y);
            y += cq.length * 3.5 + 3;
          }

          // Plain explanation
          if (clause.plainExplanation) {
            txt(clause.plainExplanation, 8.5, false, C.muted, margin + 8, usable - 10);
          }

          // Negotiation tip
          if (clause.negotiationSuggestion) {
            gap(1);
            doc.setFillColor(...C.card);
            const ntLines = doc.splitTextToSize(clause.negotiationSuggestion, usable - 18);
            const ntH = ntLines.length * 3.8 + 8;
            checkPage(ntH + 4);
            doc.rect(margin + 6, y, usable - 6, ntH, 'F');
            doc.setFillColor(...C.green);
            doc.rect(margin + 6, y, 2, ntH, 'F');
            y += 3;
            doc.setFontSize(6.5); doc.setTextColor(...C.green); doc.setFont('helvetica', 'bold');
            doc.text('NEGOTIATION TIP', margin + 11, y + 1.5);
            y += 5;
            txt(clause.negotiationSuggestion, 8, false, C.muted, margin + 11, usable - 16);
            gap(2);
          }

          // Divider between clauses
          hRule(C.border);
        });
      }

      // ══════════════════════════════════════════════════
      // NEGOTIATION PLAN
      // ══════════════════════════════════════════════════
      if (analysis.negotiationPlan?.length) {
        checkPage(40);
        sectionBar('NEGOTIATION PLAN', C.green);

        analysis.negotiationPlan.forEach((item, i) => {
          checkPage(24);
          const pc = priorityColor(item.priority);
          gap(2);

          // Priority indicator
          doc.setFillColor(...pc);
          doc.rect(margin, y - 1, 3, 1.5, 'F');

          const askLines = doc.splitTextToSize(item.ask, usable - 28);
          doc.setFontSize(9.5); doc.setTextColor(...C.text); doc.setFont('helvetica', 'bold');
          doc.text(askLines, margin + 6, y);
          // Priority label (right)
          doc.setFontSize(7.5); doc.setTextColor(...pc); doc.setFont('helvetica', 'bold');
          doc.text(item.priority, W - margin, y, { align: 'right' });
          y += askLines.length * 4.5 + 2;

          txt(item.reason, 8.5, false, C.muted, margin + 6, usable - 10);

          if (item.suggestedWording) {
            gap(1);
            const swLines = doc.splitTextToSize(item.suggestedWording, usable - 18);
            const swH = swLines.length * 3.8 + 10;
            checkPage(swH + 4);
            doc.setFillColor(...C.card);
            doc.rect(margin + 6, y, usable - 6, swH, 'F');
            doc.setFillColor(...C.violet);
            doc.rect(margin + 6, y, 2, swH, 'F');
            y += 4;
            doc.setFontSize(6.5); doc.setTextColor(...C.violet); doc.setFont('helvetica', 'bold');
            doc.text('SUGGESTED WORDING', margin + 11, y + 1.5);
            y += 5;
            txt(item.suggestedWording, 8, false, C.muted, margin + 11, usable - 16);
            gap(2);
          }
          hRule(C.border);
        });
      }

      // ══════════════════════════════════════════════════
      // QUESTIONS
      // ══════════════════════════════════════════════════
      if (analysis.questionsToAsk?.length) {
        checkPage(35);
        sectionBar('QUESTIONS TO ASK BEFORE SIGNING', C.violet);
        gap(2);
        analysis.questionsToAsk.forEach((q, i) => {
          checkPage(10);
          doc.setFontSize(7.5); doc.setTextColor(...C.indigoL); doc.setFont('helvetica', 'bold');
          doc.text(`${i + 1}.`, margin + 2, y);
          txt(q, 8.5, false, C.muted, margin + 9, usable - 9);
          gap(1);
        });
      }

      // ══════════════════════════════════════════════════
      // FINAL RECOMMENDATION
      // ══════════════════════════════════════════════════
      if (analysis.finalRecommendation) {
        checkPage(30);
        sectionBar('FINAL RECOMMENDATION', C.indigoL);
        gap(2);
        doc.setFillColor(...C.card);
        const recLines = doc.splitTextToSize(analysis.finalRecommendation, usable - 12);
        const recH = recLines.length * 4 + 10;
        doc.rect(margin, y, usable, recH, 'F');
        doc.setFillColor(...C.indigo);
        doc.rect(margin, y, 3, recH, 'F');
        y += 5;
        txt(analysis.finalRecommendation, 9, false, C.text, margin + 7, usable - 10);
        y += 5;
      }

      // ══════════════════════════════════════════════════
      // FOOTER + PAGE NUMBERS
      // ══════════════════════════════════════════════════
      checkPage(20);
      hRule(C.border);
      const disc = analysis.disclaimer || 'This report is for legal awareness only and does not constitute legal advice. Consult a qualified legal professional before signing any contract.';
      txt(disc, 7.5, false, C.subtle);
      gap(2);
      doc.setFontSize(7); doc.setTextColor(...C.subtle);
      doc.text('© 2026 NyaySaathi', margin, y);
      doc.setTextColor(...C.indigo);
      doc.text('nyaysaathi.in  |  Know Before You Sign', W - margin, y, { align: 'right' });

      // Page numbers on every page
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(...C.indigo);
        doc.rect(0, H - 1.5, W, 1.5, 'F');
        doc.setFontSize(6.5); doc.setTextColor(...C.subtle); doc.setFont('helvetica', 'normal');
        doc.text(`Page ${p} of ${totalPages}`, W / 2, H - 4, { align: 'center' });
      }

      doc.save(`NyaySaathi_${analysis.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}.pdf`);
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
