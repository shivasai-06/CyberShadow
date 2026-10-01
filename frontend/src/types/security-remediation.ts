export type RemediationStatus = 'OPEN' | 'IN_PROGRESS' | 'VALIDATED';

export interface RemediationAction {
  id: string;
  findingId: string;
  findingTitle: string;
  title: string;
  description: string;
  relatedControl: string;
  relatedScenarioId: string;
  affectedAsset: string;
  status: RemediationStatus;
  createdAt: string; // ISO date
  validatedAt?: string; // ISO date
  validationRunId?: string;
  sourceRunId?: string;
  source: 'simulation';
}
