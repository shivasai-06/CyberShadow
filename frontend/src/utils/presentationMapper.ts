import type { SimulationStep } from '../types/simulation';
import type { SimulationRunPlan } from '../engine/simulationEngine';

export type ScreenId = 'email' | 'device' | 'browser' | 'identity' | 'defense' | 'cloud' | 'social' | 'outcome' | null;
export type ScreenState = 'IDLE' | 'ACTIVE' | 'WAITING' | 'SUCCESS' | 'WARNING' | 'BLOCKED' | 'COMPROMISED';

export interface ScreenPresentationState {
  screenId: ScreenId;
  state: ScreenState;
  title?: string;
  subtitle?: string;
  primaryMessage?: string;
  secondaryMessage?: string;
  focusCamera: boolean;
}

/**
 * Maps a single simulation step (and simulation context) directly into a purely presentational state.
 * This guarantees the 3D visual layer is fully driven by the deterministic engine without inventing sequences.
 */
export function mapSimulationStepToScreen(
  step: SimulationStep | null,
  simulationState: 'idle' | 'running' | 'paused' | 'completed',
  simulationPlan?: SimulationRunPlan | null
): ScreenPresentationState {
  
  if (simulationState === 'completed') {
    const isBlocked = simulationPlan?.outcome === 'ATTACK BLOCKED';
    const isSuccess = simulationPlan?.outcome === 'DATA RECOVERED';
    const stateVal = isBlocked ? 'BLOCKED' : isSuccess ? 'SUCCESS' : 'COMPROMISED';

    return {
      screenId: 'outcome',
      state: stateVal,
      title: 'SIMULATION COMPLETE',
      primaryMessage: simulationPlan?.outcome || 'SIMULATED COMPROMISE',
      secondaryMessage: simulationPlan?.finalExplanation || 'Simulation finished.',
      focusCamera: true,
    };
  }

  if (!step) {
    return { screenId: null, state: 'IDLE', focusCamera: false };
  }

  // Exact step name matching acts as the robust event contract
  switch (step.name) {
    // EMAIL
    case 'MESSAGE':
    case 'EMAIL':
      return { 
        screenId: 'email', 
        state: 'WARNING', 
        title: 'INBOX ALERT',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    // DEVICE (Endpoint)
    case 'USER INTERACTION':
    case 'ATTACHMENT':
    case 'ENDPOINT EXPOSURE':
    case 'DATA EVENT':
    case 'LOSS':
    case 'RECOVERY CHECK':
    case 'SIMULATED IMPACT':
      return { 
        screenId: 'device', 
        state: 'WARNING',
        title: 'DEVICE STATUS',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    // BROWSER (Simulated Web Interaction)
    case 'FAKE LOGIN':
    case 'LOGIN ATTEMPT':
    case 'WEAK PASSWORD':
      return { 
        screenId: 'browser', 
        state: 'WARNING',
        title: 'CYBERSHADOW BROWSER',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    // IDENTITY
    case 'CREDENTIAL EXPOSURE':
    case 'ACCOUNT TAKEOVER':
    case 'ACCOUNT ACCESS':
    case 'AUTHENTICATION':
      return { 
        screenId: 'identity', 
        state: 'WARNING',
        title: 'IDENTITY COMPROMISE',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    // DEFENSE
    case 'MFA CHALLENGE':
    case 'ATTACK BLOCKED':
      return { 
        screenId: 'defense', 
        state: 'BLOCKED',
        title: 'DEFENSE ACTIVE',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    // CLOUD
    case 'CONFIGURATION':
    case 'EXPOSURE':
    case 'DATA ACCESS':
      return { 
        screenId: 'cloud', 
        state: 'WARNING',
        title: 'CLOUD INFRASTRUCTURE',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    // SOCIAL
    case 'SOCIAL MESSAGE':
    case 'USER TRUST':
    case 'INFORMATION EXPOSURE':
      return { 
        screenId: 'social', 
        state: 'WARNING',
        title: 'SOCIAL NETWORK',
        primaryMessage: step.name,
        secondaryMessage: step.description,
        focusCamera: true 
      };

    default:
      return { 
        screenId: null, 
        state: 'ACTIVE',
        primaryMessage: step.name,
        focusCamera: false 
      };
  }
}
