export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ClauseCategory =
  | 'Payment'
  | 'Termination'
  | 'Liability'
  | 'Indemnity'
  | 'Intellectual Property'
  | 'Confidentiality'
  | 'Non-compete'
  | 'Non-solicit'
  | 'Arbitration'
  | 'Jurisdiction'
  | 'Data Privacy'
  | 'Auto-renewal'
  | 'Cancellation'
  | 'Refund'
  | 'Performance Obligation'
  | 'Employment Restriction'
  | 'Ownership Transfer'
  | 'Penalty'
  | 'Ambiguous Wording'
  | 'Other';

export interface RiskDimensions {
  financial: number;
  privacy: number;
  employment: number;
  ipOwnership: number;
  legalExposure: number;
  termination: number;
  ambiguity: number;
}

export interface ClauseAnalysis {
  clauseTitle: string;
  clauseText: string;
  category: ClauseCategory;
  severity: RiskLevel;
  riskScore: number;
  riskDimensions: RiskDimensions;
  plainExplanation: string;
  hinglishExplanation: string;
  hiddenRisk: string;
  possibleWorstCase: string;
  isOneSided: boolean;
  isAmbiguous: boolean;
  negotiationSuggestion: string;
  betterClauseSuggestion: string;
  questionsToAsk: string[];
}

export interface TopRisk {
  title: string;
  category: string;
  severity: RiskLevel;
  score: number;
  whyItMatters: string;
  realWorldImpact: string;
  whatToDo: string;
}

export interface ScenarioSimulation {
  scenario: string;
  outcome: string;
  risk: string;
  preventiveAction: string;
}

export interface NegotiationPoint {
  priority: string;
  ask: string;
  reason: string;
  suggestedWording: string;
}

export interface AIAnalysisResult {
  title: string;
  contractType: string;
  perspective: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  executiveSummary: string;
  plainEnglishSummary: string;
  hinglishSummary: string;
  topRisks: TopRisk[];
  clauseAnalyses: ClauseAnalysis[];
  missingProtections: string[];
  obligationsAcceptedByUser: string[];
  rightsGivenAway: string[];
  redFlags: string[];
  greenFlags: string[];
  scenarioSimulations: ScenarioSimulation[];
  negotiationPlan: NegotiationPoint[];
  questionsToAskBeforeSigning: string[];
  finalRecommendation: string;
  disclaimer: string;
}

export interface StoredAnalysis {
  id?: string;
  documentId?: string;
  title: string;
  contractType: string;
  perspective: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  plainEnglishSummary: string;
  hinglishSummary: string;
  keyFindings: string[];
  clauseAnalyses: ClauseAnalysis[];
  negotiationPlan: NegotiationPoint[];
  redlineSuggestions: string[];
  questionsToAsk: string[];
  scenarioSimulations: ScenarioSimulation[];
  redFlags: string[];
  greenFlags: string[];
  missingProtections: string[];
  obligationsAcceptedByUser: string[];
  rightsGivenAway: string[];
  topRisks: TopRisk[];
  finalRecommendation: string;
  disclaimer: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  status: string;
}
