import type { HistoryRecord } from '../types/history';
import type { UserDecisionHistory } from '../types/simulation';

export interface DecisionDifference {
  decisionId: string;
  situation: string;
  firstRunOptionId: string;
  firstRunLabel: string;
  firstRunProtective: boolean;
  replayOptionId: string;
  replayLabel: string;
  replayProtective: boolean;
  isDifferent: boolean;
}

export interface ReplayComparison {
  firstRun: HistoryRecord;
  replayRun: HistoryRecord;
  outcomeChanged: boolean;
  impactChanged: boolean;
  decisionDifferences: DecisionDifference[];
  decisionsChangedCount: number;
}

export function getDecisionDifferences(firstRun: HistoryRecord, replayRun: HistoryRecord): DecisionDifference[] {
  const diffs: DecisionDifference[] = [];
  
  const firstDecisions = firstRun.decisionsMade || [];
  const replayDecisions = replayRun.decisionsMade || [];
  
  // Create a union of all decisions encountered in either run
  const decisionMap = new Map<string, { first?: UserDecisionHistory; replay?: UserDecisionHistory }>();
  
  for (const d of firstDecisions) {
    decisionMap.set(d.decisionId, { first: d });
  }
  
  for (const d of replayDecisions) {
    const existing = decisionMap.get(d.decisionId) || {};
    existing.replay = d;
    decisionMap.set(d.decisionId, existing);
  }
  
  for (const [decisionId, { first, replay }] of decisionMap.entries()) {
    // We mainly care about decisions where at least one run made a choice
    const situation = first?.situation || replay?.situation || 'Unknown situation';
    
    diffs.push({
      decisionId,
      situation,
      firstRunOptionId: first?.optionId || 'none',
      firstRunLabel: first?.label || 'Did not reach this decision',
      firstRunProtective: first?.isProtective || false,
      replayOptionId: replay?.optionId || 'none',
      replayLabel: replay?.label || 'Did not reach this decision',
      replayProtective: replay?.isProtective || false,
      isDifferent: (first?.optionId || 'none') !== (replay?.optionId || 'none')
    });
  }
  
  return diffs;
}

export function compareSimulationRuns(firstRun: HistoryRecord, replayRun: HistoryRecord): ReplayComparison {
  const diffs = getDecisionDifferences(firstRun, replayRun);
  const changedCount = diffs.filter(d => d.isDifferent).length;
  
  return {
    firstRun,
    replayRun,
    outcomeChanged: firstRun.result !== replayRun.result,
    impactChanged: firstRun.impactLevel !== replayRun.impactLevel,
    decisionDifferences: diffs,
    decisionsChangedCount: changedCount
  };
}

export function createReplayComparison(firstRun: HistoryRecord, replayRun: HistoryRecord): ReplayComparison {
  return compareSimulationRuns(firstRun, replayRun);
}
