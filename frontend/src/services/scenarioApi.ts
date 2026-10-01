import { apiClient } from './apiClient';
import type { ScenarioDefinition } from '../types/scenarios';

export const scenarioApi = {
  /**
   * Fetch all scenarios from the backend
   */
  async getScenarios(signal?: AbortSignal): Promise<ScenarioDefinition[]> {
    return apiClient.get<ScenarioDefinition[]>('/scenarios', { signal });
  },

  /**
   * Fetch a single scenario by ID
   */
  async getScenario(id: string, signal?: AbortSignal): Promise<ScenarioDefinition> {
    return apiClient.get<ScenarioDefinition>(`/scenarios/${id}`, { signal });
  }
};
