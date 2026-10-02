import type { SecurityFinding } from './security-analysis';

export type EffectivenessOutcome = 'IMPROVED' | 'VALIDATED' | 'UNCHANGED' | 'NOT_VALIDATED';

export interface BeforeAfterState {
  runId: string;
  outcome: string;
  findings: SecurityFinding[];
  affectedAsset: string;
  relevantControlActive: boolean;
  attackPath: string[];
}

export interface EffectivenessComparison {
  remediationId: string;
  findingId: string;
  beforeRunId: string;
  afterRunId: string;
  scenarioId: string;
  before: BeforeAfterState;
  after: BeforeAfterState;
  control: string;
  outcome: EffectivenessOutcome;
  findingsRemoved: number;
  findingsRemaining: number;
  outcomeChanged: boolean;
  defenseDemonstrated: boolean;
  explanation: string;
  comparedAt: string; // ISO date
}
