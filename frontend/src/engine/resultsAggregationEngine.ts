import type { HistoryRecord } from '../types/history';
import type { SecurityAnalysisResult } from '../types/security-analysis';
import type { SimulationLearningUpdate, LearningProfile } from '../types/learning';
import type { EffectivenessComparison } from '../types/remediation-effectiveness';
import type { AIReasoning } from '../types/ai';
import type { ComprehensiveSimulationResult } from '../types/results';

import { runSecurityAnalysis } from './securityAnalysisEngine';
import { updateLearningProfile } from './learningEngine';
import { generatePracticeRecommendations } from './recommendationEngine';

export interface AggregationContext {
  record: HistoryRecord;
  learningProfile: LearningProfile;
  fullHistory: HistoryRecord[];
  
  // Optional pre-computed or async fields that can be injected later
  remediationEffectiveness?: EffectivenessComparison;
  aiExplanation?: AIReasoning;
  
  // If the SimulationLab already computed the learning update, it can be passed in to avoid re-computation.
  // Otherwise, it will be calculated defensively.
  precomputedLearningImpact?: SimulationLearningUpdate;
}

/**
 * Transforms the disparate outputs of a simulation run (Phase 3-5) into a unified, structured 
 * Results layer for Phase 6 screens to consume.
 * 
 * Safely handles missing data and falls back gracefully.
 */
export function buildComprehensiveResult(ctx: AggregationContext): ComprehensiveSimulationResult {
  const { 
    record, 
    learningProfile, 
    fullHistory, 
    remediationEffectiveness, 
    aiExplanation,
    precomputedLearningImpact 
  } = ctx;

  // 1. Core deterministic Security Analysis
  let analysis: SecurityAnalysisResult = {
    findings: [],
    overallSeverity: 'LOW',
    affectedAssets: [],
    positiveControls: [],
    summary: 'Analysis unavailable.'
  };

  try {
    analysis = runSecurityAnalysis(record);
  } catch {
    // Fail safely if analysis crashes (e.g. malformed legacy record)
  }

  // 2. Learning Impact & Recommendations
  let learningImpact: SimulationLearningUpdate | undefined = precomputedLearningImpact;

  if (!learningImpact) {
    try {
      const { update } = updateLearningProfile(learningProfile, record);
      const otherHistory = fullHistory.filter(h => h.id !== record.id);
      const recommendations = generatePracticeRecommendations(learningProfile, [record, ...otherHistory]);
      
      update.practiceNext = recommendations[0] || undefined;
      learningImpact = update;
    } catch {
      // Fail safely if learning profile generation crashes
    }
  }

  return {
    id: record.id,
    timestamp: record.date,
    scenarioId: record.scenarioId,
    outcome: record.result,
    record,
    analysis,
    learningImpact,
    remediationEffectiveness,
    aiExplanation
  };
}
