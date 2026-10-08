import type { jsPDF as JsPDFType } from 'jspdf';
import type { ClauseAnalysis, NegotiationPoint, ScenarioSimulation, StoredAnalysis } from '@/types/analysis';
import { formatDate } from '@/lib/utils';

// Builds the downloadable contract report. Kept separate from the button component so it
// can be generated and checked outside the browser.

type RGB = [number, number, number];

// ── Palette (light, print-friendly) ──────────────────────────────────────────
const C = {
  ink: [17, 24, 39] as RGB,
  body: [55, 65, 81] as RGB,
  muted: [107, 114, 128] as RGB,
  faint: [156, 163, 175] as RGB,
  line: [229, 231, 235] as RGB,
  surface: [248, 250, 252] as RGB,
  white: [255, 255, 255] as RGB,
  indigo: [79, 70, 229] as RGB,
  indigoSoft: [238, 242, 255] as RGB,
  saffron: [232, 101, 10] as RGB,
  green: [5, 150, 105] as RGB,
  greenSoft: [236, 253, 245] as RGB,
  amber: [180, 120, 4] as RGB,
  amberSoft: [254, 249, 231] as RGB,
  red: [220, 38, 38] as RGB,
  redSoft: [254, 242, 242] as RGB,
};

const RISK: Record<string, { color: RGB; soft: RGB }> = {
  Critical: { color: [220, 38, 38], soft: [254, 242, 242] },
  High: { color: [234, 88, 12], soft: [255, 247, 237] },
  Medium: { color: [202, 138, 4], soft: [254, 252, 232] },
  Low: { color: [5, 150, 105], soft: [236, 253, 245] },
};
const riskStyle = (level: string) => RISK[level] ?? { color: C.indigo, soft: C.indigoSoft };
const levelForScore = (s: number) => (s >= 80 ? 'Critical' : s >= 60 ? 'High' : s >= 40 ? 'Medium' : 'Low');

// ── Text safety ──────────────────────────────────────────────────────────────
// jsPDF's built-in Helvetica only covers basic Latin characters. Anything else (₹, curly
// quotes, emoji, Devanagari) prints as garbage, so convert or drop it before drawing.
export const pdfSafe = (value: unknown): string =>
  String(value ?? '')
    .replace(/₹\s?/g, 'Rs. ')
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/…/g, '...')
    .replace(/[•·]/g, '-')
    .replace(/[   ]/g, ' ')
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '')
    .trim();

// Applies pdfSafe to every string in the report (also turns missing fields into '')
const deepPdfSafe = <T,>(value: T): T => {
  if (typeof value === 'string') return pdfSafe(value) as T;
  if (Array.isArray(value)) return value.map(deepPdfSafe) as T;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepPdfSafe(v)])) as T;
  }
  return value;
};

// ── Layout ───────────────────────────────────────────────────────────────────
const W = 210;
const H = 297;
const M = 18; // side margin
const CW = W - M * 2; // content width
const TOP = 24; // content start on pages 2+ (below the running header)
const BOTTOM = H - 20; // content must end above the footer

const PT = 0.3528; // mm per point
const lineH = (size: number) => size * PT * 1.45;
const ascent = (size: number) => size * PT * 0.78;

type FontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic';

// A piece of content whose height is known before drawing, so it can be kept on one page
interface Block {
  h: number;
  draw: (y: number) => void;
}

export interface ReportOptions {
  siteUrl: string;
  generatedAt?: Date;
}

export function buildReportPdf(JsPDF: typeof JsPDFType, original: StoredAnalysis, opts: ReportOptions): JsPDFType {
  const a = deepPdfSafe(original);
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const siteUrl = opts.siteUrl.replace(/\/$/, '');
  const siteHost = siteUrl.replace(/^https?:\/\//, '');
  const score = Math.round(Math.max(0, Math.min(100, Number(a.overallRiskScore) || 0)));
  const level = RISK[a.riskLevel] ? a.riskLevel : levelForScore(score);
  const risk = riskStyle(level);
  const title = a.title || 'Contract Analysis';

  let y = 0;

  // ── Primitive helpers ──────────────────────────────────────────────────────
  const font = (size: number, style: FontStyle = 'normal', color: RGB = C.body) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const wrap = (text: string, width: number, size: number, style: FontStyle = 'normal'): string[] => {
    if (!text) return [];
    font(size, style);
    return doc.splitTextToSize(text, width) as string[];
  };

  // Draws pre-wrapped lines with their top edge at yTop
  const drawLines = (lines: string[], x: number, yTop: number, size: number, style: FontStyle, color: RGB) => {
    font(size, style, color);
    lines.forEach((line, i) => doc.text(line, x, yTop + ascent(size) + i * lineH(size)));
  };

  const fill = (color: RGB) => doc.setFillColor(...color);
  const stroke = (color: RGB, width = 0.25) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(width);
  };

  const newPage = () => {
    doc.addPage();
    y = TOP;
  };

  const ensure = (h: number) => {
    if (y + h > BOTTOM) newPage();
  };

  // Rounded label; returns its width
  const pill = (text: string, x: number, yTop: number, color: RGB, soft: RGB, size = 7.5): number => {
    font(size, 'bold', color);
    const w = doc.getTextWidth(text) + 5;
    const h = size * PT + 2.6;
    fill(soft);
    doc.roundedRect(x, yTop, w, h, h / 2, h / 2, 'F');
    doc.text(text, x + 2.5, yTop + 1.3 + ascent(size));
    return w;
  };
  const pillH = (size = 7.5) => size * PT + 2.6;

  // A paragraph that may run across pages, one line at a time
  const flowText = (text: string, opts2: { x?: number; w?: number; size?: number; style?: FontStyle; color?: RGB; after?: number } = {}) => {
    const { x = M, w = CW, size = 9.5, style = 'normal', color = C.body, after = 3 } = opts2;
    for (const line of wrap(text, w, size, style)) {
      ensure(lineH(size));
      drawLines([line], x, y, size, style, color);
      y += lineH(size);
    }
    y += after;
  };

  // Section heading with a coloured accent; keeps at least `keepWith` mm of content on the same page
  const section = (heading: string, color: RGB = C.indigo, keepWith = 30) => {
    ensure(14 + keepWith);
    y += 4;
    fill(color);
    doc.roundedRect(M, y, 1.4, 6, 0.7, 0.7, 'F');
    drawLines([heading], M + 4.5, y - 0.2, 12.5, 'bold', C.ink);
    y += 9;
  };

  // Heading for a section made of cards: drawn by the first card, so it moves to a new
  // page together with that card instead of being stranded at the bottom of a page
  let pendingHeading: Block | null = null;
  const cardSection = (heading: string, color: RGB, intro?: string) => {
    const introLines = intro ? wrap(intro, CW, 8.5) : [];
    const introH = introLines.length ? introLines.length * lineH(8.5) + 3 : 0;
    pendingHeading = {
      h: 13 + introH,
      draw: (top) => {
        fill(color);
        doc.roundedRect(M, top + 4, 1.4, 6, 0.7, 0.7, 'F');
        drawLines([heading], M + 4.5, top + 3.8, 12.5, 'bold', C.ink);
        if (introLines.length) drawLines(introLines, M, top + 13, 8.5, 'normal', C.muted);
      },
    };
  };

  // Text block measured up front (label + paragraph), drawn at a given top
  const labelledText = (label: string, text: string, labelColor: RGB, width: number, x: number, size = 9): Block | null => {
    if (!text) return null;
    const lines = wrap(text, width, size);
    const h = 4.2 + lines.length * lineH(size);
    return {
      h,
      draw: (top) => {
        drawLines([label.toUpperCase()], x, top, 7, 'bold', labelColor);
        drawLines(lines, x, top + 4.2, size, 'normal', C.body);
      },
    };
  };

  // Tinted box with an accent bar, measured up front
  const calloutBlock = (label: string, text: string, color: RGB, soft: RGB, width: number, x: number, size = 9, style: FontStyle = 'normal'): Block | null => {
    if (!text) return null;
    const lines = wrap(text, width - 9, size, style);
    const h = 6 + 4.2 + lines.length * lineH(size) + 2;
    return {
      h,
      draw: (top) => {
        fill(soft);
        doc.roundedRect(x, top, width, h, 1.8, 1.8, 'F');
        fill(color);
        doc.rect(x, top + 2, 0.9, h - 4, 'F');
        drawLines([label.toUpperCase()], x + 5, top + 3, 7, 'bold', color);
        drawLines(lines, x + 5, top + 7.2, size, style, C.body);
      },
    };
  };

  // Draws blocks inside a bordered card. A card that fits in the remaining space is drawn
  // whole; a tall one continues on the next page (bordered on both) rather than leaving a
  // big gap. A card never starts in a small leftover space, so its heading isn't orphaned.
  const card = (blocks: (Block | null)[], accent: RGB, continuedLabel = '', gap = 3.2, pad = 5) => {
    const items = blocks.filter((b): b is Block => b !== null);
    const h = items.reduce((sum, b) => sum + b.h, 0) + gap * (items.length - 1) + pad * 2;
    const headingH = pendingHeading?.h ?? 0;
    const remaining = BOTTOM - y - headingH;
    if (h > remaining && remaining < 55) newPage();
    if (pendingHeading) {
      pendingHeading.draw(y);
      y += pendingHeading.h;
      pendingHeading = null;
    }

    const closeSegment = (top: number, bottom: number) => {
      stroke(C.line);
      doc.roundedRect(M, top, CW, bottom - top, 2.5, 2.5, 'D');
      fill(accent);
      doc.roundedRect(M, top, 1.6, bottom - top, 0.8, 0.8, 'F');
    };

    let segTop = y;
    y += pad;
    items.forEach((b, i) => {
      if (i > 0 && y + b.h > BOTTOM - pad) {
        closeSegment(segTop, y - gap + pad);
        newPage();
        segTop = y;
        y += pad;
        if (continuedLabel) {
          drawLines([`${continuedLabel} (continued)`], M + 6.5, y, 7.5, 'italic', C.faint);
          y += 5;
        }
      }
      b.draw(y);
      y += b.h + gap;
    });
    closeSegment(segTop, y - gap + pad);
    y += pad - gap + 4.5;
  };

  const bulletList = (items: string[], color: RGB, marker: 'dot' | 'check' | 'cross' = 'dot') => {
    items.forEach((item) => {
      const lines = wrap(item, CW - 7, 9.5);
      const h = lines.length * lineH(9.5);
      ensure(h + 1.5);
      const cy = y + ascent(9.5) - 1.1;
      if (marker === 'dot') {
        fill(color);
        doc.circle(M + 1.6, cy, 0.9, 'F');
      } else {
        stroke(color, 0.5);
        if (marker === 'check') {
          doc.line(M + 0.6, cy, M + 1.5, cy + 0.9);
          doc.line(M + 1.5, cy + 0.9, M + 3, cy - 1);
        } else {
          doc.line(M + 0.7, cy - 0.9, M + 2.5, cy + 0.9);
          doc.line(M + 2.5, cy - 0.9, M + 0.7, cy + 0.9);
        }
      }
      drawLines(lines, M + 6, y, 9.5, 'normal', C.body);
      y += h + 1.8;
    });
    y += 2;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // COVER
  // ══════════════════════════════════════════════════════════════════════════
  fill(C.indigo);
  doc.rect(0, 0, W * 0.62, 2.2, 'F');
  fill(C.saffron);
  doc.rect(W * 0.62, 0, W * 0.38, 2.2, 'F');

  drawLines(['NyaySaathi'], M, 11, 17, 'bold', C.indigo);
  drawLines(['AI Contract Risk Report'], M, 18.5, 8.5, 'normal', C.muted);
  font(8.5, 'normal', C.muted);
  doc.text(`Generated ${formatDate(opts.generatedAt ?? new Date())}`, W - M, 14.2, { align: 'right' });
  if (a.createdAt) doc.text(`Analysed ${formatDate(a.createdAt)}`, W - M, 18.6 + ascent(8.5) - 1.2, { align: 'right' });
  stroke(C.line);
  doc.line(M, 27, W - M, 27);

  // Title + tags
  y = 34;
  const titleLines = wrap(title, CW, 19, 'bold');
  drawLines(titleLines, M, y, 19, 'bold', C.ink);
  y += titleLines.length * lineH(19) + 2.5;
  let tx = M;
  if (a.contractType) tx += pill(a.contractType, tx, y, C.indigo, C.indigoSoft) + 2;
  if (a.perspective) tx += pill(`${a.perspective} perspective`, tx, y, C.body, C.surface) + 2;
  if (a.truncated) pill('Partial review', tx, y, C.amber, C.amberSoft);
  y += pillH() + 7;

  // Risk summary card: score on the left, executive summary on the right
  {
    const leftW = 46;
    const summaryLines = wrap(a.summary, CW - leftW - 14, 9.5);
    const summaryH = 4.2 + summaryLines.length * lineH(9.5);
    const bodyH = Math.max(34, summaryH);
    const scaleTop = bodyH + 10;
    const h = scaleTop + 14;
    fill(risk.soft);
    doc.roundedRect(M, y, CW, h, 3, 3, 'F');

    drawLines(['OVERALL RISK'], M + 6, y + 6, 7, 'bold', risk.color);
    font(34, 'bold', risk.color);
    doc.text(String(score), M + 6, y + 11 + ascent(34));
    const scoreW = doc.getTextWidth(String(score));
    drawLines(['/ 100'], M + 7.5 + scoreW, y + 19.5, 10, 'normal', C.muted);
    pill(level.toUpperCase(), M + 6, y + 28.5, C.white, risk.color, 8);

    stroke([0, 0, 0], 0);
    fill(C.white);
    doc.rect(M + leftW, y + 6, 0.3, bodyH - 2, 'F');
    drawLines(['EXECUTIVE SUMMARY'], M + leftW + 7, y + 6, 7, 'bold', C.muted);
    drawLines(summaryLines, M + leftW + 7, y + 10.2, 9.5, 'normal', C.body);

    // Risk scale: Low | Medium | High | Critical with a marker at the score
    const sx = M + 6;
    const sw = CW - 12;
    const sy = y + scaleTop;
    const bands: [number, number, string][] = [[0, 40, 'Low'], [40, 60, 'Medium'], [60, 80, 'High'], [80, 100, 'Critical']];
    bands.forEach(([from, to, name]) => {
      const bx = sx + (sw * from) / 100;
      const bw = (sw * (to - from)) / 100;
      fill(RISK[name].color);
      doc.rect(bx, sy, bw - 0.6, 2.2, 'F');
      font(6.5, name === level ? 'bold' : 'normal', name === level ? RISK[name].color : C.muted);
      doc.text(name, bx + bw / 2, sy + 6.5, { align: 'center' });
    });
    const mx = sx + (sw * score) / 100;
    fill(C.ink);
    doc.triangle(mx - 1.6, sy - 2.6, mx + 1.6, sy - 2.6, mx, sy - 0.3, 'F');
    y += h + 6;
  }

  // At-a-glance numbers
  {
    const clauses = a.clauseAnalyses ?? [];
    const serious = clauses.filter((c) => c.severity === 'High' || c.severity === 'Critical').length;
    const stats: [string, string, RGB][] = [
      [String(clauses.length), 'Clauses reviewed', C.indigo],
      [String(serious), 'High / critical clauses', serious ? C.red : C.green],
      [String(a.redFlags?.length ?? 0), 'Red flags', a.redFlags?.length ? C.saffron : C.green],
      [String(a.negotiationPlan?.length ?? 0), 'Points to negotiate', C.green],
    ];
    const gap = 3.5;
    const bw = (CW - gap * 3) / 4;
    stats.forEach(([value, label, color], i) => {
      const bx = M + i * (bw + gap);
      fill(C.white);
      stroke(C.line);
      doc.roundedRect(bx, y, bw, 17, 2, 2, 'FD');
      drawLines([value], bx + 4, y + 3, 16, 'bold', color);
      drawLines([label], bx + 4, y + 11, 7.5, 'normal', C.muted);
    });
    y += 17 + 4;
  }

  // Plain English summary
  if (a.plainEnglishSummary) {
    section('In plain English', C.indigo, 20);
    const block = calloutBlock('What this contract means for you', a.plainEnglishSummary, C.indigo, C.indigoSoft, CW, M, 9.5);
    if (block && block.h <= BOTTOM - TOP) {
      ensure(block.h);
      block.draw(y);
      y += block.h + 4;
    } else {
      flowText(a.plainEnglishSummary);
    }
  }

  // Key findings
  if (a.redFlags?.length) {
    section('Red flags', C.red, 12);
    bulletList(a.redFlags, C.red, 'cross');
  }
  if (a.missingProtections?.length) {
    section('Missing protections', C.amber, 12);
    bulletList(a.missingProtections, C.amber, 'dot');
  }
  if (a.greenFlags?.length) {
    section('What works in your favour', C.green, 12);
    bulletList(a.greenFlags, C.green, 'check');
  }
  if (a.obligationsAcceptedByUser?.length) {
    section('Obligations you accept', C.saffron, 12);
    bulletList(a.obligationsAcceptedByUser, C.saffron, 'dot');
  }
  if (a.rightsGivenAway?.length) {
    section('Rights you give away', C.red, 12);
    bulletList(a.rightsGivenAway, C.red, 'dot');
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CLAUSE-BY-CLAUSE
  // ══════════════════════════════════════════════════════════════════════════
  if (a.clauseAnalyses?.length) {
    cardSection('Clause-by-clause analysis', C.indigo,
      `${a.clauseAnalyses.length} clauses reviewed, in the order they appear in the contract. Scores run from 0 (safe) to 100 (severe).`);
    a.clauseAnalyses.forEach((clause, i) =>
      card(clauseBlocks(clause, i), riskStyle(clause.severity).color, `${i + 1}. ${clause.clauseTitle || 'Clause'}`));
  }

  function clauseBlocks(c: ClauseAnalysis, i: number): (Block | null)[] {
    const st = riskStyle(c.severity);
    const x = M + 6.5;
    const w = CW - 13;
    const clauseScore = Math.round(Number(c.riskScore) || 0);

    const titleLines = wrap(c.clauseTitle || `Clause ${i + 1}`, w - 32, 11, 'bold');
    const header: Block = {
      h: Math.max(titleLines.length * lineH(11), 7) + 1.5 + pillH() ,
      draw: (top) => {
        fill(st.color);
        doc.circle(x + 3, top + 3, 3, 'F');
        font(8, 'bold', C.white);
        doc.text(String(i + 1), x + 3, top + 3 + 1.1, { align: 'center' });
        drawLines(titleLines, x + 8.5, top, 11, 'bold', C.ink);
        font(15, 'bold', st.color);
        doc.text(String(clauseScore), W - M - 6 - 7.5, top + ascent(15), { align: 'right' });
        drawLines(['/100'], W - M - 6 - 7, top + 1.9, 7.5, 'normal', C.muted);
        let px = x + 8.5;
        const py = top + Math.max(titleLines.length * lineH(11), 7) + 1.5;
        px += pill(c.severity || 'Unknown', px, py, st.color, st.soft) + 1.8;
        if (c.category) px += pill(c.category, px, py, C.body, C.surface) + 1.8;
        if (c.isOneSided) px += pill('One-sided', px, py, C.saffron, [255, 237, 213]) + 1.8;
        if (c.isAmbiguous) pill('Ambiguous', px, py, C.amber, C.amberSoft);
      },
    };

    let quote: Block | null = null;
    if (c.clauseText) {
      let lines = wrap(`"${c.clauseText}"`, w - 8, 8.5, 'italic');
      if (lines.length > 7) lines = [...lines.slice(0, 7), '...'];
      quote = {
        h: lines.length * lineH(8.5) + 5,
        draw: (top) => {
          fill(C.surface);
          doc.roundedRect(x, top, w, lines.length * lineH(8.5) + 5, 1.5, 1.5, 'F');
          fill(C.faint);
          doc.rect(x, top + 1.5, 0.7, lines.length * lineH(8.5) + 2, 'F');
          drawLines(lines, x + 4, top + 2.5, 8.5, 'italic', C.muted);
        },
      };
    }

    const dims = c.riskDimensions;
    let dimBlock: Block | null = null;
    if (dims) {
      const entries: [string, number][] = [
        ['Financial', dims.financial], ['Privacy', dims.privacy], ['Employment', dims.employment],
        ['IP', dims.ipOwnership], ['Legal exposure', dims.legalExposure], ['Termination', dims.termination],
        ['Ambiguity', dims.ambiguity],
      ].map(([k, v]) => [k as string, Math.round(Number(v) || 0)] as [string, number]).filter(([, v]) => v > 0);
      if (entries.length) {
        const cols = 4;
        const colW = w / cols;
        const rows = Math.ceil(entries.length / cols);
        dimBlock = {
          h: 4.2 + rows * 7.5,
          draw: (top) => {
            drawLines(['RISK DIMENSIONS'], x, top, 7, 'bold', C.muted);
            entries.forEach(([name, v], k) => {
              const cx = x + (k % cols) * colW;
              const cy = top + 4.2 + Math.floor(k / cols) * 7.5;
              font(7, 'normal', C.muted);
              doc.text(name, cx, cy + ascent(7));
              font(7, 'bold', C.body);
              doc.text(String(v), cx + colW - 4, cy + ascent(7), { align: 'right' });
              fill(C.line);
              doc.roundedRect(cx, cy + 3.6, colW - 4, 1.4, 0.7, 0.7, 'F');
              fill(riskStyle(levelForScore(v)).color);
              doc.roundedRect(cx, cy + 3.6, Math.max(1.4, ((colW - 4) * v) / 100), 1.4, 0.7, 0.7, 'F');
            });
          },
        };
      }
    }

    return [
      header,
      quote,
      labelledText('What it means', c.plainExplanation, C.indigo, w, x),
      labelledText('Hidden risk', c.hiddenRisk, C.red, w, x),
      labelledText('Worst case', c.possibleWorstCase, C.saffron, w, x),
      calloutBlock('How to negotiate', c.negotiationSuggestion, C.green, C.greenSoft, w, x),
      dimBlock,
    ];
  }

  // ══════════════════════════════════════════════════════════════════════════
  // NEGOTIATION PLAN
  // ══════════════════════════════════════════════════════════════════════════
  if (a.negotiationPlan?.length) {
    cardSection('Negotiation plan', C.green, 'What to ask for, most important first, with wording you can propose.');
    a.negotiationPlan.forEach((item, i) =>
      card(negotiationBlocks(item, i), riskStyle(item.priority).color, `${i + 1}. ${item.ask}`.slice(0, 80)));
  }

  function negotiationBlocks(n: NegotiationPoint, i: number): (Block | null)[] {
    const x = M + 6.5;
    const w = CW - 13;
    const st = riskStyle(n.priority);
    const askLines = wrap(n.ask || '', w - 30, 10.5, 'bold');
    return [
      {
        h: Math.max(askLines.length * lineH(10.5), pillH()),
        draw: (top) => {
          drawLines([`${i + 1}.`], x, top, 10.5, 'bold', C.faint);
          drawLines(askLines, x + 6, top, 10.5, 'bold', C.ink);
          font(7.5, 'bold');
          const label = `${n.priority || 'Medium'} priority`;
          const pw = doc.getTextWidth(label) + 5;
          pill(label, W - M - 6 - pw, top, st.color, st.soft);
        },
      },
      labelledText('Why', n.reason, C.muted, w - 6, x + 6),
      calloutBlock('Suggested wording', n.suggestedWording, C.indigo, C.indigoSoft, w - 6, x + 6, 9, 'italic'),
    ];
  }

  // ══════════════════════════════════════════════════════════════════════════
  // WORST-CASE SCENARIOS
  // ══════════════════════════════════════════════════════════════════════════
  if (a.scenarioSimulations?.length) {
    cardSection('Worst-case scenarios', C.saffron, 'How this contract could play out if things go wrong.');
    a.scenarioSimulations.forEach((s) => card(scenarioBlocks(s), C.saffron, 'Scenario'));
  }

  function scenarioBlocks(s: ScenarioSimulation): (Block | null)[] {
    const x = M + 6.5;
    const w = CW - 13;
    const lines = wrap(s.scenario, w, 10, 'bold');
    return [
      { h: lines.length * lineH(10), draw: (top) => drawLines(lines, x, top, 10, 'bold', C.ink) },
      labelledText('What could happen', s.outcome, C.red, w, x),
      labelledText('Why it matters', s.risk, C.saffron, w, x),
      calloutBlock('Prevent it', s.preventiveAction, C.green, C.greenSoft, w, x),
    ];
  }

  // ══════════════════════════════════════════════════════════════════════════
  // QUESTIONS, RECOMMENDATION, DISCLAIMER
  // ══════════════════════════════════════════════════════════════════════════
  if (a.questionsToAsk?.length) {
    section('Questions to ask before signing', C.indigo, 20);
    a.questionsToAsk.forEach((q) => {
      const lines = wrap(q, CW - 9, 9.5);
      const h = lines.length * lineH(9.5);
      ensure(h + 2.5);
      stroke(C.faint, 0.35);
      fill(C.white);
      doc.roundedRect(M + 0.3, y + 0.4, 3.6, 3.6, 0.6, 0.6, 'FD');
      drawLines(lines, M + 7.5, y, 9.5, 'normal', C.body);
      y += h + 2.6;
    });
    y += 2;
  }

  const disclaimer = a.disclaimer || 'This report is for legal awareness only and does not constitute legal advice. Consult a qualified legal professional before signing any contract.';
  const disclaimerLines = wrap(disclaimer, CW, 7.5);
  const disclaimerH = disclaimerLines.length * lineH(7.5) + 4;

  if (a.finalRecommendation) {
    const block = calloutBlock('Our recommendation', a.finalRecommendation, risk.color, risk.soft, CW, M, 10);
    // Keep heading, recommendation and disclaimer on one page so the report doesn't end on a near-empty page
    if (block) ensure(17 + block.h + 6 + disclaimerH);
    section('Final recommendation', risk.color, 0);
    if (block && block.h <= BOTTOM - TOP) {
      block.draw(y);
      y += block.h + 6;
    } else {
      flowText(a.finalRecommendation, { size: 10 });
    }
  }

  {
    const lines = disclaimerLines;
    ensure(disclaimerH);
    stroke(C.line);
    doc.line(M, y, W - M, y);
    y += 3;
    drawLines(lines, M, y, 7.5, 'normal', C.faint);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RUNNING HEADER + FOOTER (drawn last, when the page count is known)
  // ══════════════════════════════════════════════════════════════════════════
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    if (p > 1) {
      font(7.5, 'bold', C.indigo);
      doc.text('NyaySaathi', M, 11);
      const brandW = doc.getTextWidth('NyaySaathi ');
      font(7.5, 'normal', C.muted);
      const shortTitle = doc.splitTextToSize(title, CW - brandW - 40)[0] as string;
      doc.text(shortTitle, M + brandW, 11);
      font(7.5, 'bold', risk.color);
      doc.text(`${score}/100  ${level}`, W - M, 11, { align: 'right' });
      stroke(C.line);
      doc.line(M, 14, W - M, 14);
    }
    stroke(C.line);
    doc.line(M, H - 13, W - M, H - 13);
    font(7.5, 'normal', C.faint);
    doc.text('Generated by NyaySaathi - legal awareness, not legal advice', M, H - 8.5);
    font(7.5, 'normal', C.indigo);
    const linkText = siteHost;
    const pageLabel = `Page ${p} of ${pages}`;
    font(7.5, 'normal', C.muted);
    const pageW = doc.getTextWidth(pageLabel);
    doc.text(pageLabel, W - M, H - 8.5, { align: 'right' });
    font(7.5, 'normal', C.indigo);
    const linkW = doc.getTextWidth(linkText);
    doc.textWithLink(linkText, W - M - pageW - 5 - linkW, H - 8.5, { url: siteUrl });
  }

  return doc;
}

export const reportFileName = (analysis: StoredAnalysis) =>
  `NyaySaathi_${pdfSafe(analysis.title || 'Report').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 50) || 'Report'}.pdf`;
