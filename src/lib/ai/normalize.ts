import type {
  AIAnalysisResult,
  ClauseAnalysis,
  ClauseCategory,
  NegotiationPoint,
  RiskDimensions,
  RiskLevel,
  ScenarioSimulation,
  TopRisk,
} from '@/types/analysis';
import { scoreToRiskLevel } from '@/lib/utils';

// The AI's JSON is untrusted: fields can be missing, mistyped or out of range.
// Everything the report pages read is coerced here, so a sloppy response can't crash them.

type Obj = Record<string, unknown>;

const RISK_LEVELS: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];

const CLAUSE_CATEGORIES: ClauseCategory[] = [
  'Payment', 'Termination', 'Liability', 'Indemnity', 'Intellectual Property', 'Confidentiality',
  'Non-compete', 'Non-solicit', 'Arbitration', 'Jurisdiction', 'Data Privacy', 'Auto-renewal',
  'Cancellation', 'Refund', 'Performance Obligation', 'Employment Restriction', 'Ownership Transfer',
  'Penalty', 'Ambiguous Wording', 'Other',
];

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');

const strList = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);

const objList = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);

const score = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number.parseFloat(str(v));
  return Number.isFinite(n) ? Math.round(Math.min(100, Math.max(0, n))) : 0;
};

const riskLevel = (v: unknown, fallbackScore: number): RiskLevel => {
  const s = str(v).toLowerCase();
  return RISK_LEVELS.find((level) => level.toLowerCase() === s) ?? scoreToRiskLevel(fallbackScore);
};

const category = (v: unknown): ClauseCategory => {
  const s = str(v).toLowerCase();
  return CLAUSE_CATEGORIES.find((c) => c.toLowerCase() === s) ?? 'Other';
};

const dimensions = (v: unknown): RiskDimensions => {
  const d = isObj(v) ? v : {};
  return {
    financial: score(d.financial),
    privacy: score(d.privacy),
    employment: score(d.employment),
    ipOwnership: score(d.ipOwnership),
    legalExposure: score(d.legalExposure),
    termination: score(d.termination),
    ambiguity: score(d.ambiguity),
  };
};

const clause = (c: Obj): ClauseAnalysis => {
  const riskScore = score(c.riskScore);
  return {
    clauseTitle: str(c.clauseTitle) || 'Untitled clause',
    clauseText: str(c.clauseText),
    category: category(c.category),
    severity: riskLevel(c.severity, riskScore),
    riskScore,
    riskDimensions: dimensions(c.riskDimensions),
    plainExplanation: str(c.plainExplanation),
    simpleExplanation: str(c.simpleExplanation),
    hiddenRisk: str(c.hiddenRisk),
    possibleWorstCase: str(c.possibleWorstCase),
    isOneSided: c.isOneSided === true,
    isAmbiguous: c.isAmbiguous === true,
    negotiationSuggestion: str(c.negotiationSuggestion),
    betterClauseSuggestion: str(c.betterClauseSuggestion),
    questionsToAsk: strList(c.questionsToAsk),
  };
};

const topRisk = (r: Obj): TopRisk => {
  const s = score(r.score);
  return {
    title: str(r.title),
    category: str(r.category),
    severity: riskLevel(r.severity, s),
    score: s,
    whyItMatters: str(r.whyItMatters),
    realWorldImpact: str(r.realWorldImpact),
    whatToDo: str(r.whatToDo),
  };
};

const scenario = (s: Obj): ScenarioSimulation => ({
  scenario: str(s.scenario),
  outcome: str(s.outcome),
  risk: str(s.risk),
  preventiveAction: str(s.preventiveAction),
});

const negotiationPoint = (n: Obj): NegotiationPoint => {
  const priority = str(n.priority);
  return {
    priority: RISK_LEVELS.find((level) => level.toLowerCase() === priority.toLowerCase()) ?? 'Medium',
    ask: str(n.ask),
    reason: str(n.reason),
    suggestedWording: str(n.suggestedWording),
  };
};

/**
 * Returns a complete, well-typed analysis, or null if the response is too broken to use
 * (not an object, or no clauses at all).
 */
export function normalizeAnalysis(
  raw: unknown,
  request: { contractType: string; perspective: string },
): AIAnalysisResult | null {
  if (!isObj(raw)) return null;

  const clauseAnalyses = objList(raw.clauseAnalyses).map(clause);
  if (clauseAnalyses.length === 0) return null;

  // If the overall score is missing, fall back to the average clause score
  const overallRiskScore = raw.overallRiskScore === undefined
    ? Math.round(clauseAnalyses.reduce((sum, c) => sum + c.riskScore, 0) / clauseAnalyses.length)
    : score(raw.overallRiskScore);

  return {
    title: str(raw.title) || `${request.contractType} Contract Analysis`,
    contractType: request.contractType,
    perspective: request.perspective,
    overallRiskScore,
    riskLevel: riskLevel(raw.riskLevel, overallRiskScore),
    executiveSummary: str(raw.executiveSummary),
    plainEnglishSummary: str(raw.plainEnglishSummary),
    simpleSummary: str(raw.simpleSummary),
    topRisks: objList(raw.topRisks).map(topRisk).filter((r) => r.title),
    clauseAnalyses,
    missingProtections: strList(raw.missingProtections),
    obligationsAcceptedByUser: strList(raw.obligationsAcceptedByUser),
    rightsGivenAway: strList(raw.rightsGivenAway),
    redFlags: strList(raw.redFlags),
    greenFlags: strList(raw.greenFlags),
    scenarioSimulations: objList(raw.scenarioSimulations).map(scenario).filter((s) => s.scenario),
    negotiationPlan: objList(raw.negotiationPlan).map(negotiationPoint).filter((n) => n.ask),
    questionsToAskBeforeSigning: strList(raw.questionsToAskBeforeSigning),
    finalRecommendation: str(raw.finalRecommendation),
    disclaimer: str(raw.disclaimer),
  };
}
