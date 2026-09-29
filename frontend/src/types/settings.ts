export interface LearningProfile {
  displayName: string;
  role: string;
  experienceLevel: string;
  learningFocus: string;
}

export type DifficultyPreference = 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';
export type LearningMode = 'Guided' | 'Exploration' | 'Challenge';
export type SimulationSpeed = 'Slow' | 'Normal' | 'Fast';

export interface AppSettings {
  profile: LearningProfile;
  learning: {
    difficulty: DifficultyPreference;
    mode: LearningMode;
    showExplanations: boolean;
    showAttackPaths: boolean;
    showSafetyNotices: boolean;
  };
  simulation: {
    speed: SimulationSpeed;
    autoAdvance: boolean;
    pauseAtCriticalEvents: boolean;
    showSimulatedRisk: boolean;
  };
  interface: {
    compactNavigation: boolean;
    reduceMotion: boolean;
    highContrastMode: boolean;
  };
  notifications: {
    simulationCompletion: boolean;
    learningMilestones: boolean;
    newScenarios: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    displayName: 'ALEX VANCE',
    role: 'Cybersecurity Learner',
    experienceLevel: 'Intermediate',
    learningFocus: 'Identity Security',
  },
  learning: {
    difficulty: 'Adaptive',
    mode: 'Guided',
    showExplanations: true,
    showAttackPaths: true,
    showSafetyNotices: true,
  },
  simulation: {
    speed: 'Normal',
    autoAdvance: true,
    pauseAtCriticalEvents: true,
    showSimulatedRisk: true,
  },
  interface: {
    compactNavigation: false,
    reduceMotion: false,
    highContrastMode: false,
  },
  notifications: {
    simulationCompletion: true,
    learningMilestones: true,
    newScenarios: false,
  },
};
