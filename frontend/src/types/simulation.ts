export type SimulationState = 'idle' | 'running' | 'paused' | 'completed';

export type AttackStepStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'BLOCKED' | 'COMPROMISED';

export interface SimulationStep {
  id: string;
  name: string;
  description: string;
  learningContext: string;
  isDefenseCheckpoint?: boolean; // If true, this step evaluates a control
  controlEvaluated?: string; // e.g. "MFA"
}

export interface SimulationScenario {
  id: string;
  name: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  description: string;
  estimatedTime: string;
  controlsInvolved: string[];
  steps: SimulationStep[];
  successResult: {
    title: string;
    description: string;
    keyFactor: string;
  };
  blockedResult: {
    title: string;
    description: string;
    keyFactor: string;
  };
}
