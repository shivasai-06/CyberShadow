export type ScenarioCategory = 'ALL' | 'IDENTITY' | 'SOCIAL ENGINEERING' | 'ENDPOINT' | 'DATA' | 'CLOUD';
export type ScenarioDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
}

export interface ScenarioDefensiveControl {
  name: string;
  description: string;
}

export interface ScenarioAsset {
  name: string;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;
  description: string;
  attackPath: string[];
  affectedAssets: ScenarioAsset[];
  defensiveControls: ScenarioDefensiveControl[];
  learningObjectives: LearningObjective[];
  simulationOutcome: string;
}
