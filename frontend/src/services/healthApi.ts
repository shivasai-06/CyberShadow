import { apiClient } from './apiClient';
import type { HealthResponse } from '../types/api';

export const healthApi = {
  /**
   * Check backend health
   * Expected to hit /api/v1/health
   */
  async getBackendHealth(signal?: AbortSignal): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>('/health', { signal });
  }
};
