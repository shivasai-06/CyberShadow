export type SimulationState = 'idle' | 'running' | 'paused' | 'completed';
export type SimulationMode = 'STANDARD' | 'CHALLENGE';

export type AttackStepStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'BLOCKED' | 'COMPROMISED' | 'RECOVERED';
export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CheckpointAction = 'block' | 'mitigate' | 'recover' | 'change_path' | 'continue';

export interface DefenseCheckpointConfig {
  control: string; // matches SecurityControlsState keys
  onActive?: {
    action: CheckpointAction;
    message: string; 
    overrideStep?: {
      name: string;
      description: string;
      learningContext: string;
    };
    impactLevel?: ImpactLevel;
    finalOutcome?: string;
  };
  onInactive?: {
    action: CheckpointAction;
    message: string;
    overrideStep?: {
      name: string;
      description: string;
      learningContext: string;
    };
    impactLevel?: ImpactLevel;
    finalOutcome?: string;
  };
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  isProtective: boolean;
  consequenceMessage: string;
  effect: {
    action: CheckpointAction;
    message: string;
    overrideStep?: {
      name: string;
      description: string;
      learningContext: string;
    };
    impactLevel?: ImpactLevel;
    finalOutcome?: string;
  };
}

export interface SimulationDecision {
  id: string;
  title: string;
  situation: string;
  explanation: string;
  options: DecisionOption[];
}

export interface SimulationStep {
  id: string;
  name: string;
  description: string;
  learningContext: string;
  
  checkpoint?: DefenseCheckpointConfig;
  decision?: SimulationDecision;

  // Legacy (Phase 3.3)
  isDefenseCheckpoint?: boolean; 
  controlEvaluated?: string; 
  blockedStepOverride?: {
    name: string;
    description: string;
    learningContext: string;
  };
}

export interface LearningFeedback {
  whatHappened: string;
  whyItHappened: string;
  whatStoppedIt?: string;
  whatCouldHaveHelped?: string;
  keyLesson: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  description: string;
  estimatedTime: string;
  controlsInvolved: string[];
  affectedAssets?: string[];
  severity?: ImpactLevel;
  steps: SimulationStep[];
  successResult: {
    title: string;
    description: string;
    keyFactor: string;
    learningFeedback?: LearningFeedback;
  };
  blockedResult: {
    title: string;
    description: string;
    keyFactor: string;
    learningFeedback?: LearningFeedback;
  };
}

export interface DefenseImpact {
  control: string;
  isActive: boolean;
  effectDescription: string;
}

export type UserDecisionsRecord = Record<string, string>; // decisionId -> optionId

export interface UserDecisionHistory {
  decisionId: string;
  optionId: string;
  isProtective: boolean;
  label: string;
  consequenceMessage: string;
  situation: string;
}
