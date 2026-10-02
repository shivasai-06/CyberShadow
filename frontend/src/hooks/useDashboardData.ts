import { useMemo } from 'react';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import type { DashboardData, DashboardActivity } from '../types/dashboard';

export function useDashboardData(): DashboardData {
  const {
    history,
    securityControls,
    securityPosture,
    remediations,
    effectivenessComparisons,
    securityPractices
  } = useCyberShadow();

  return useMemo(() => {
    // 1. Metrics
    const totalSimulations = history.length;
    
    // Count exact outcomes based on existing Result states ('ATTACK BLOCKED' and 'SIMULATED COMPROMISE')
    const blockedSimulations = history.filter(r => r.result === 'ATTACK BLOCKED').length;
    const compromisedSimulations = history.filter(r => r.result === 'SIMULATED COMPROMISE').length;

    const totalFindings = securityPosture.totalFindings;
    const findingsBySeverity = {
      critical: securityPosture.severityBreakdown.CRITICAL || 0,
      high: securityPosture.severityBreakdown.HIGH || 0,
      medium: securityPosture.severityBreakdown.MEDIUM || 0,
      low: securityPosture.severityBreakdown.LOW || 0,
    };

    const controlValues = Object.values(securityControls);
    const totalDefenses = controlValues.length;
    const activeDefenses = controlValues.filter(Boolean).length;
    const disabledDefenses = totalDefenses - activeDefenses;

    // 2. Security Status
    const trend = securityPosture.recentTrend;
    const remediationStats = {
      total: remediations.length,
      open: remediations.filter(r => r.status === 'OPEN').length,
      inProgress: remediations.filter(r => r.status === 'IN_PROGRESS').length,
      validated: remediations.filter(r => r.status === 'VALIDATED').length,
    };

    const coveragePercent = totalDefenses > 0 ? Math.round((activeDefenses / totalDefenses) * 100) : 0;

    // 3. Recent History
    const recentHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // 4. Recent Activity (Aggregating simulations, remediations, and practices into a timeline)
    const activities: DashboardActivity[] = [];

    // Add simulations to activity
    history.forEach(record => {
      activities.push({
        id: `act_sim_${record.id}`,
        type: 'SIMULATION',
        title: `Simulation: ${record.scenarioName}`,
        description: `Outcome: ${record.result}`,
        timestamp: record.date,
        status: record.result === 'ATTACK BLOCKED' ? 'SUCCESS' : 'WARNING'
      });
    });

    // Add remediation creation and validations to activity
    remediations.forEach(rem => {
      activities.push({
        id: `act_rem_create_${rem.id}`,
        type: 'REMEDIATION_CREATED',
        title: 'New Remediation Created',
        description: `Finding: ${rem.findingTitle}`,
        timestamp: rem.createdAt,
        status: 'NEUTRAL'
      });

      if (rem.status === 'VALIDATED' && rem.validatedAt) {
        activities.push({
          id: `act_rem_valid_${rem.id}`,
          type: 'REMEDIATION_VALIDATED',
          title: 'Remediation Validated',
          description: `Successfully mitigated: ${rem.findingTitle}`,
          timestamp: rem.validatedAt,
          status: 'SUCCESS'
        });
      }
    });

    // Add completed practices to activity
    securityPractices.filter(p => p.status === 'COMPLETED' && p.completedAt).forEach(practice => {
      activities.push({
        id: `act_prac_${practice.id}`,
        type: 'PRACTICE_COMPLETED',
        title: 'Security Practice Completed',
        description: `Skill: ${practice.skillName}`,
        timestamp: practice.completedAt!,
        status: practice.result === 'PASSED' ? 'SUCCESS' : 'WARNING'
      });
    });

    // Sort activities by timestamp descending and take top 10
    const recentActivity = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      metrics: {
        totalSimulations,
        blockedSimulations,
        compromisedSimulations,
        totalFindings,
        findingsBySeverity,
        activeDefenses,
        disabledDefenses,
        totalDefenses
      },
      securityStatus: {
        trend,
        remediations: remediationStats,
        coveragePercent
      },
      recentHistory,
      recentActivity,
      validatedEffectiveness: effectivenessComparisons
    };
  }, [history, securityControls, securityPosture, remediations, effectivenessComparisons, securityPractices]);
}
