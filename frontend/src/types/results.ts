import type { HistoryRecord } from './history';
import type { SecurityAnalysisResult } from './security-analysis';
import type { SimulationLearningUpdate } from './learning';
import type { EffectivenessComparison } from './remediation-effectiveness';
import type { AIReasoning } from './ai';

/**
 * Phase 6.1 Results Foundation
 * Centralized result model that represents a completed CyberShadow simulation.
 * This structure aggregates information from the raw simulation history,
 * deterministic security analysis, remediation comparisons, and AI reasoning.
 */
export interface ComprehensiveSimulationResult {
  /** Unique identifier matching the simulation HistoryRecord */
  id: string;
  
  /** Timestamp of the simulation run */
  timestamp: string;
  
  /** The scenario executed */
  scenarioId: string;
  
  /** The final state of the simulation (e.g. ATTACK BLOCKED, SIMULATED COMPROMISE) */
  outcome: string;

  /** Raw deterministic simulation history record */
  record: HistoryRecord;

  /** Security findings and analysis generated for this run */
  analysis: SecurityAnalysisResult;

  /** Before/After effectiveness comparison (if this run validated a remediation) */
  remediationEffectiveness?: EffectivenessComparison;

  /** Learning impact and next-step practice recommendations */
  learningImpact?: SimulationLearningUpdate;

  /** AI-generated educational explanation context */
  aiExplanation?: AIReasoning;
}
