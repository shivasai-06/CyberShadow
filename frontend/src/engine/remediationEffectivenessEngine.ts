import { runSecurityAnalysis } from './securityAnalysisEngine';
import type { RemediationAction } from '../types/security-remediation';
import type { HistoryRecord } from '../types/history';
import type { EffectivenessComparison, EffectivenessOutcome, BeforeAfterState } from '../types/remediation-effectiveness';

export function getRemediationEffectiveness(
  remediation: RemediationAction,
  historyRecords: HistoryRecord[]
): EffectivenessComparison | null {
  if (!remediation.validationRunId || !remediation.sourceRunId) {
    return null;
  }

  const beforeRecord = historyRecords.find(r => r.id === remediation.sourceRunId);
  const afterRecord = historyRecords.find(r => r.id === remediation.validationRunId);

  if (!beforeRecord || !afterRecord) {
    return null;
  }

  let beforeAnalysis, afterAnalysis;
  try {
    beforeAnalysis = runSecurityAnalysis(beforeRecord);
    afterAnalysis = runSecurityAnalysis(afterRecord);
  } catch {
    return null;
  }

  const beforeProtected = beforeRecord.result === 'ATTACK BLOCKED' || beforeRecord.result === 'DATA RECOVERED';
  const afterProtected = afterRecord.result === 'ATTACK BLOCKED' || afterRecord.result === 'DATA RECOVERED';

  const isRelevantControl = (record: HistoryRecord) => {
    return record.defensesActive.some(d => d.toUpperCase() === remediation.relatedControl.toUpperCase()) ||
           record.controlResponsible?.toLowerCase() === remediation.relatedControl.toLowerCase().replace(' ', '_');
  };

  const before: BeforeAfterState = {
    runId: beforeRecord.id,
    outcome: beforeRecord.result,
    findings: beforeAnalysis.findings,
    affectedAsset: remediation.affectedAsset,
    relevantControlActive: isRelevantControl(beforeRecord)
  };

  const after: BeforeAfterState = {
    runId: afterRecord.id,
    outcome: afterRecord.result,
    findings: afterAnalysis.findings,
    affectedAsset: remediation.affectedAsset,
    relevantControlActive: isRelevantControl(afterRecord)
  };

  const findingsRemoved = Math.max(0, before.findings.length - after.findings.length);
  const outcomeChanged = before.outcome !== after.outcome;
  const defenseDemonstrated = isRelevantControl(afterRecord) || 
    (remediation.relatedControl === 'Security Awareness' && !!afterRecord.decisionsMade?.some(d => d.isProtective));

  let outcome: EffectivenessOutcome = 'NOT_VALIDATED';

  if (afterProtected && defenseDemonstrated) {
    if (!beforeProtected) {
      outcome = 'IMPROVED';
    } else {
      outcome = 'VALIDATED';
    }
  } else {
    if (before.outcome === after.outcome) {
      outcome = 'UNCHANGED';
    }
  }

  let explanation = 'Simulation outcome unchanged or not validated.';
  if (outcome === 'IMPROVED') {
    if (after.outcome === 'DATA RECOVERED') {
      explanation = 'The simulation demonstrated that backup/recovery reduced the simulated impact.';
    } else {
      explanation = 'Simulation demonstrated improved protection.';
    }
  } else if (outcome === 'VALIDATED') {
    explanation = 'Simulated control successfully validated.';
  }

  return {
    remediationId: remediation.id,
    findingId: remediation.findingId,
    beforeRunId: before.runId,
    afterRunId: after.runId,
    scenarioId: remediation.relatedScenarioId,
    before,
    after,
    control: remediation.relatedControl,
    outcome,
    findingsRemoved,
    findingsRemaining: after.findings.length,
    outcomeChanged,
    defenseDemonstrated,
    explanation,
    comparedAt: afterRecord.date
  };
}
