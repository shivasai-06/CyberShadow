export type PracticeDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PracticeStatus = 'AVAILABLE' | 'COMPLETED';
export type PracticeResult = 'PASSED' | 'NEEDS_PRACTICE';
export type PracticeType = 'DECISION' | 'IDENTIFICATION' | 'DEFENSIVE_SCENARIO' | 'KNOWLEDGE_CHECK';

export interface PracticeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface SecurityPracticeTask {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  scenarioId: string;
  scenarioName: string;
  title: string;
  description: string;
  objective: string;
  difficulty: PracticeDifficulty;
  practiceType: PracticeType;
  status: PracticeStatus;
  source: string;
  createdAt: string;
  completedAt?: string;
  result?: PracticeResult;
  explanation?: string;
  
  // Specific fields for UI rendering
  question: string;
  options: PracticeOption[];
}
