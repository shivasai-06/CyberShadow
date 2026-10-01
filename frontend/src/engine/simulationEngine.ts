import type { SecurityControlsState } from '../contexts/CyberShadowContext';
import type { 
  SimulationScenario, 
  SimulationStep, 
  ImpactLevel, 
  DefenseImpact,
  DefenseCheckpointConfig,
  SimulationDecision,
  UserDecisionsRecord,
  UserDecisionHistory
} from '../types/simulation';

export interface SimulationRunPlan {
  stepsToRun: SimulationStep[];
  isBlocked: boolean;
  blockedAtStepIndex: number | null;
  finalExplanation: string;
  impactLevel: ImpactLevel;
  controlResponsible: string | null;
  outcome: string;
  defenseImpacts: DefenseImpact[];
  
  pendingDecision: SimulationDecision | null;
  pendingDecisionStepIndex: number | null;
  
  decisionsMadeHistory: UserDecisionHistory[];
}

export function evaluateCheckpoint(
  checkpoint: DefenseCheckpointConfig,
  isActive: boolean
) {
  return isActive ? checkpoint.onActive : checkpoint.onInactive;
}

export function createSimulationPlan(
  scenario: SimulationScenario,
  controls: SecurityControlsState,
  userDecisions: UserDecisionsRecord = {}
): SimulationRunPlan {
  let isBlocked = false;
  let blockedAtStepIndex: number | null = null;
  let finalExplanation = scenario.blockedResult.description;
  let impactLevel = scenario.severity || 'HIGH';
  let controlResponsible: string | null = null;
  let outcome = 'SIMULATED COMPROMISE';
  const stepsToRun: SimulationStep[] = [];
  const defenseImpacts: DefenseImpact[] = [];
  const evaluatedControls = new Set<string>();
  
  let pendingDecision: SimulationDecision | null = null;
  let pendingDecisionStepIndex: number | null = null;
  const decisionsMadeHistory: UserDecisionHistory[] = [];

  for (let i = 0; i < scenario.steps.length; i++) {
    const originalStep = scenario.steps[i];

    // Handle interactive decisions first
    if (originalStep.decision) {
      const decisionId = originalStep.decision.id;
      const selectedOptionId = userDecisions[decisionId];
      
      if (selectedOptionId) {
        const selectedOption = originalStep.decision.options.find(o => o.id === selectedOptionId);
        if (selectedOption) {
          decisionsMadeHistory.push({
            decisionId,
            optionId: selectedOptionId,
            isProtective: selectedOption.isProtective,
            label: selectedOption.label,
            consequenceMessage: selectedOption.consequenceMessage,
            situation: originalStep.decision.situation
          });

          const effect = selectedOption.effect;
          if (effect) {
            const stepToPush = effect.overrideStep ? {
              ...originalStep,
              name: effect.overrideStep.name,
              description: effect.overrideStep.description,
              learningContext: effect.overrideStep.learningContext
            } : originalStep;
            
            stepsToRun.push(stepToPush);

            if (effect.impactLevel) impactLevel = effect.impactLevel;

            if (effect.action === 'block' || effect.action === 'recover') {
              isBlocked = effect.action === 'block';
              blockedAtStepIndex = i;
              finalExplanation = effect.message;
              controlResponsible = 'USER DECISION';
              outcome = effect.finalOutcome || (effect.action === 'block' ? 'ATTACK BLOCKED' : 'DATA RECOVERED');
              break; 
            } else if (effect.action === 'mitigate' || effect.action === 'change_path' || effect.action === 'continue') {
              continue; 
            }
          }
        }
      } else {
        // Decision is required but not yet made by user
        pendingDecision = originalStep.decision;
        pendingDecisionStepIndex = i;
        stepsToRun.push(originalStep); // Push the step so it renders up to this point
        break; // Pause engine here
      }
    } else if (originalStep.checkpoint) {
      const controlKey = originalStep.checkpoint.control as keyof SecurityControlsState;
      const isControlActive = controls[controlKey];
      evaluatedControls.add(originalStep.checkpoint.control);

      const effect = evaluateCheckpoint(originalStep.checkpoint, isControlActive);

      if (effect) {
        defenseImpacts.push({
          control: originalStep.checkpoint.control,
          isActive: isControlActive,
          effectDescription: effect.message
        });

        const stepToPush = effect.overrideStep ? {
          ...originalStep,
          name: effect.overrideStep.name,
          description: effect.overrideStep.description,
          learningContext: effect.overrideStep.learningContext
        } : originalStep;
        
        stepsToRun.push(stepToPush);

        if (effect.impactLevel) {
          impactLevel = effect.impactLevel;
        }

        if (effect.action === 'block' || effect.action === 'recover') {
          isBlocked = effect.action === 'block';
          blockedAtStepIndex = i;
          finalExplanation = effect.message;
          controlResponsible = originalStep.checkpoint.control;
          outcome = effect.finalOutcome || (effect.action === 'block' ? 'ATTACK BLOCKED' : 'DATA RECOVERED');
          break; // Stop running further steps
        } else if (effect.action === 'mitigate' || effect.action === 'change_path' || effect.action === 'continue') {
          continue; 
        }
      } else {
        stepsToRun.push(originalStep);
      }
    } else if (originalStep.isDefenseCheckpoint && originalStep.controlEvaluated) {
      // Legacy Phase 3.3 backwards compatibility
      const controlKey = originalStep.controlEvaluated as keyof SecurityControlsState;
      const isControlActive = controls[controlKey];
      
      if (isControlActive) {
        isBlocked = true;
        blockedAtStepIndex = i;
        controlResponsible = originalStep.controlEvaluated;
        outcome = 'ATTACK BLOCKED';
        impactLevel = 'LOW';
        
        if (originalStep.blockedStepOverride) {
          stepsToRun.push({
            ...originalStep,
            name: originalStep.blockedStepOverride.name,
            description: originalStep.blockedStepOverride.description,
            learningContext: originalStep.blockedStepOverride.learningContext
          });
        } else {
          stepsToRun.push(originalStep);
        }

        finalExplanation = scenario.successResult.description || "A security control blocked the simulated attack path.";
        break;
      }
      stepsToRun.push(originalStep);
    } else {
      stepsToRun.push(originalStep);
    }
  }

  // Only add remaining controls if simulation completed without pending decision
  if (!pendingDecision) {
    scenario.controlsInvolved.forEach(c => {
      const key = c.toLowerCase().replace(' ', '_');
      if (!evaluatedControls.has(key) && !defenseImpacts.find(d => d.control === key)) {
        defenseImpacts.push({
          control: key,
          isActive: controls[key as keyof SecurityControlsState] || false,
          effectDescription: 'Control was not reached or had no effect.'
        });
      }
    });
  }

  return {
    stepsToRun,
    isBlocked,
    blockedAtStepIndex,
    finalExplanation,
    impactLevel,
    controlResponsible,
    outcome,
    defenseImpacts,
    pendingDecision,
    pendingDecisionStepIndex,
    decisionsMadeHistory
  };
}

export function calculateSimulationOutcome(
  scenario: SimulationScenario,
  controls: SecurityControlsState,
  userDecisions?: UserDecisionsRecord
) {
  return createSimulationPlan(scenario, controls, userDecisions);
}

export const calculateSimulationPath = createSimulationPlan;
