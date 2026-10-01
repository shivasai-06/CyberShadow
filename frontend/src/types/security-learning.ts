export type LearningState = 'REINFORCE' | 'DEVELOPING' | 'DEMONSTRATED' | 'INSUFFICIENT_DATA';

export interface SecurityLearningImpact {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  scenarioId: string;
  scenarioName: string;
  sourceFindingId?: string;
  remediationId?: string;
  effectivenessOutcome?: string;
  learningState: LearningState;
  explanation: string;
  recommendedAction: string;
  timestamp: string; // ISO date
}
