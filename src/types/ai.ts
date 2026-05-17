export interface AIAgentStep {
  agent: string;
  status: 'pending' | 'running' | 'done' | 'error';
  message: string;
}

export interface AIRequestOptions {
  contractText: string;
  contractType: string;
  perspective: string;
  preferredLanguage: string;
}

export interface AILog {
  analysisId?: string;
  model: string;
  promptType: string;
  success: boolean;
  createdAt: Date | string;
}
