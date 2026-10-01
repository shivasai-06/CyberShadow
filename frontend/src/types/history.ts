import type { ScenarioDifficulty, ScenarioCategory } from './scenarios';
import type { DefenseImpact, UserDecisionHistory } from './simulation';

export type SimulationResultState = 'ATTACK BLOCKED' | 'SIMULATED COMPROMISE' | 'DATA RECOVERED' | 'DATA LOSS' | string;
export type SimulationRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface HistoryRecord {
  id: string;
  scenarioId: string;
  scenarioName: string;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;
  date: string; // ISO date string
  duration: string; // e.g. "45s"
  result: SimulationResultState;
  risk: SimulationRisk;
  defensesActive: string[];
  explanation: string;
  learningPoints: string[];
  attackPath: string[];
  completedSteps: number; // to visualize where the attack stopped
  
  // Phase 3.4 New fields (optional for backward compatibility)
  impactLevel?: string;
  controlResponsible?: string;
  blockedAtStep?: string;
  defenseImpacts?: DefenseImpact[];
  
  decisionsMade?: UserDecisionHistory[];
  protectiveDecisions?: number;
  riskyDecisions?: number;
  decisionCount?: number;
  
  // Phase 3.6 New field
  skillsPracticed?: string[];
  
  // Phase 3.8 New fields
  runType?: 'ORIGINAL' | 'REPLAY';
  replayOfId?: string;
}

export interface LearningProgressMetrics {
  simulationsCompleted: number;
  scenariosExplored: number;
  attacksBlocked: number;
  learningObjectivesCompleted: number;
  categoryProgress: {
    category: ScenarioCategory;
    percentage: number;
  }[];
}

export interface LearningInsight {
  id: string;
  title: string;
  description: string;
}
