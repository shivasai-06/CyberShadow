export type SkillCategory = 'IDENTITY' | 'SOCIAL ENGINEERING' | 'ENDPOINT' | 'CLOUD' | 'RESILIENCE';
import type { ScenarioDifficulty } from './scenarios';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  mastery: number; // 0-100
  simulationsCompleted: number;
  successfulDefenses: number;
  riskyDecisions: number;
  lastPracticed?: string; // ISO date string
  recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trend?: 'improving' | 'stable' | 'needs practice';
}

export interface LearningProfile {
  skills: Record<string, Skill>;
  overallMastery: number;
  totalSimulations: number;
}

export type RecommendationType = 
  | 'WEAK_SKILL'
  | 'REPEAT_PRACTICE'
  | 'NEXT_DIFFICULTY'
  | 'NEW_CATEGORY'
  | 'REINFORCEMENT';

export interface PracticeRecommendation {
  scenarioId: string;
  scenarioTitle: string;
  reason: string;
  targetSkillId: string;
  targetSkillName: string;
  currentMastery: number;
  recommendedDifficulty: ScenarioDifficulty;
  priority: number;
  type: RecommendationType;
  suggestedAction: string;
}

export interface LearningUpdateDelta {
  skillId: string;
  skillName: string;
  masteryChange: number;
}

export interface SimulationLearningUpdate {
  deltas: LearningUpdateDelta[];
  practiceNext?: PracticeRecommendation;
}
