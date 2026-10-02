import type { HistoryRecord } from './history';
import type { SecurityTrend } from './security-posture';
import type { EffectivenessComparison } from './remediation-effectiveness';

export interface DashboardMetrics {
  totalSimulations: number;
  blockedSimulations: number;
  compromisedSimulations: number;
  totalFindings: number;
  findingsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  activeDefenses: number;
  disabledDefenses: number;
  totalDefenses: number;
}

export interface DashboardSecurityStatus {
  trend: SecurityTrend;
  remediations: {
    total: number;
    open: number;
    inProgress: number;
    validated: number;
  };
  coveragePercent: number;
}

export type ActivityType = 'SIMULATION' | 'REMEDIATION_CREATED' | 'REMEDIATION_VALIDATED' | 'PRACTICE_COMPLETED';

export interface DashboardActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  status?: string; // 'SUCCESS' | 'WARNING' | 'NEUTRAL'
}

export interface DashboardData {
  metrics: DashboardMetrics;
  securityStatus: DashboardSecurityStatus;
  recentHistory: HistoryRecord[];
  recentActivity: DashboardActivity[];
  validatedEffectiveness: EffectivenessComparison[];
}
