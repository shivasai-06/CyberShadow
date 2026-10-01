export type DefenseStatus = 'STRONG' | 'ACTIVE' | 'NEEDS PRACTICE' | 'NOT TESTED';

export type SecurityTrend = 'IMPROVING' | 'MIXED' | 'NEEDS PRACTICE' | 'INSUFFICIENT DATA';

export interface DefenseCoverageItem {
  controlName: string;
  relatedScenarios: string[];
  protectedOutcomesObserved: number;
  vulnerableOutcomesObserved: number;
  status: DefenseStatus;
  learningSkill: string;
}

export interface RecurringWeakness {
  id: string;
  title: string;
  category: string;
  occurrenceCount: number;
  affectedAssets: string[];
  highestSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  relatedSkill: string;
  recommendedPractice: string;
}

export interface SecurityPosture {
  totalAnalyzedSimulations: number;
  totalFindings: number;
  activeWeaknesses: number;
  recurringWeaknesses: RecurringWeakness[];
  defenseCoverage: DefenseCoverageItem[];
  severityBreakdown: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  categoryBreakdown: Record<string, number>;
  recentTrend: SecurityTrend;
  practicePriorities: string[];
}
