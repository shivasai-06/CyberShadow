import type { ScenarioDefinition } from './scenarios';
import type { HistoryRecord } from './history';

export interface AIAgentContext {
  learner?: {
    profile: string;
    experienceLevel: string;
    learningMode: string;
  };
  currentScenario?: Partial<ScenarioDefinition>;
  currentSimulation?: {
    outcome?: string;
    protectiveDecisions?: number;
    riskyDecisions?: number;
    skillsPracticed?: string[];
    defensesActive?: string[];
  };
  learning?: {
    overallMastery: number;
    topSkills: string[];
    weakSkills: string[];
  };
  recommendations?: {
    recommendedNextPractice?: string;
    recommendedReason?: string;
    recommendedDifficulty?: string;
  };
  recentHistory?: Partial<HistoryRecord>[];
}
