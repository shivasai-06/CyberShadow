export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  category: string;
  affectedAsset: string;
  cause: string;
  impact: string;
  recommendation: string;
  source: 'simulation';
}

export interface SecurityAnalysisResult {
  findings: SecurityFinding[];
  overallSeverity: SecuritySeverity;
  affectedAssets: string[];
  positiveControls: string[];
  summary: string;
}
