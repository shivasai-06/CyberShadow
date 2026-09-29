import type { ScenarioDifficulty, ScenarioCategory } from './scenarios';

export type SimulationResultState = 'ATTACK BLOCKED' | 'SIMULATED COMPROMISE';
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
