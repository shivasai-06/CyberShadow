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

export interface AIReasoning {
  situation?: string;
  cause?: string;
  keyFactor?: string;
  securityWeakness?: string;
  defenseImpact?: string;
  learnerInsight?: string;
  nextLearningStep?: string;
  learningConcept?: string;
  securityConcept?: string;
  decisionImpact?: string;
  defenseLesson?: string;
  commonMistake?: string;
  practicalHabit?: string;
  focusedPractice?: string;
}
