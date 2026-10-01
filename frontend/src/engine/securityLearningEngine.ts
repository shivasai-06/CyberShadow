import type { RemediationAction } from '../types/security-remediation';
import type { EffectivenessComparison } from '../types/remediation-effectiveness';
import type { SecurityLearningImpact, LearningState } from '../types/security-learning';
import { INITIAL_SKILLS } from './learningEngine';

const CONTROL_TO_SKILL: Record<string, string> = {
  'Security Awareness': 'security_awareness',
  'MFA': 'authentication_security',
  'Automatic Updates': 'endpoint_security',
  'Privacy': 'privacy_protection',
  'Backup': 'backup_recovery',
  'Password Strength': 'password_security'
};

export function deriveSecurityLearningImpacts(
  remediations: RemediationAction[],
  effectivenessComparisons: EffectivenessComparison[]
): SecurityLearningImpact[] {
  const impacts: SecurityLearningImpact[] = [];

  for (const remediation of remediations) {
    const skillId = CONTROL_TO_SKILL[remediation.relatedControl];
    if (!skillId) continue;

    const skillInfo = INITIAL_SKILLS[skillId];
    if (!skillInfo) continue;

    const comparison = effectivenessComparisons.find(c => c.remediationId === remediation.id);

    let learningState: LearningState = 'INSUFFICIENT_DATA';
    let explanation = '';
    let recommendedAction = '';

    if (remediation.status === 'VALIDATED' && comparison) {
      if (comparison.outcome === 'IMPROVED' || comparison.outcome === 'VALIDATED') {
        learningState = 'DEMONSTRATED';
        if (comparison.after.outcome === 'DATA RECOVERED') {
          explanation = `Your simulation showed that backup/recovery successfully reduced the simulated impact of data loss.`;
        } else {
          explanation = `Successful validation demonstrated the related defensive concept in a simulated environment.`;
        }
        recommendedAction = `Continue applying ${skillInfo.name} best practices.`;
      } else {
        learningState = 'REINFORCE';
        explanation = `Validation did not demonstrate successful protection yet. Simulated outcome was ${comparison.after.outcome}.`;
        recommendedAction = `Review ${skillInfo.name} strategies and try again.`;
      }
    } else if (remediation.status === 'IN_PROGRESS' || remediation.status === 'OPEN') {
      learningState = remediation.status === 'IN_PROGRESS' ? 'DEVELOPING' : 'REINFORCE';
      explanation = `Your simulated scenario was not successfully prevented during validation.`;
      recommendedAction = `Practice ${skillInfo.name} defenses before retrying.`;
    }

    if (learningState !== 'INSUFFICIENT_DATA') {
      impacts.push({
        id: `sl_${remediation.id}`,
        skillId: skillInfo.id,
        skillName: skillInfo.name,
        category: skillInfo.category,
        scenarioId: remediation.relatedScenarioId,
        scenarioName: remediation.relatedScenarioId.replace('sc_', '').toUpperCase(),
        sourceFindingId: remediation.findingId,
        remediationId: remediation.id,
        effectivenessOutcome: comparison?.outcome,
        learningState,
        explanation,
        recommendedAction,
        timestamp: comparison ? comparison.comparedAt : remediation.createdAt
      });
    }
  }

  // Sort newest first
  return impacts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
