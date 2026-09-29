export interface ReportOverviewMetrics {
  simulationsCompleted: number;
  attacksBlocked: number;
  simulatedCompromises: number;
  scenariosExplored: number;
  learningObjectives: number;
}

export interface ScenarioPerformanceMetric {
  scenarioName: string;
  simulations: number;
  blocked: number;
  compromised: number;
}

export interface DefenseImpact {
  controlName: string;
  status: 'ENABLED' | 'DISABLED';
  blockedCount: number;
  explanation: string;
}

export interface ReportInsight {
  id: string;
  category: string;
  description: string;
}

export interface AttackPathInsight {
  id: string;
  scenarioName: string;
  path: string[];
  blockedAt: string;
}

export interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  route: string;
}

export interface SimulationReportData {
  overview: ReportOverviewMetrics;
  scenarioPerformance: ScenarioPerformanceMetric[];
  defenseImpacts: DefenseImpact[];
  insights: ReportInsight[];
  attackPaths: AttackPathInsight[];
  recommendations: LearningRecommendation[];
}
