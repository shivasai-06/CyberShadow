import type { SecurityFinding } from './security-analysis';

export interface SecurityFindingInvestigation {
  finding: SecurityFinding;
  whatHappened: string;
  whyItHappened: string;
  affectedAsset: string;
  impact: string;
  defense: string;
  whyItMatters: string;
  learningConnection: string;
  recommendedPractice: string;
}
