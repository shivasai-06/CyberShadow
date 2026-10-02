import { apiClient } from './apiClient';

import type { AIAgentContext, AIReasoning, DashboardAIRequest, DashboardAIResponse, AssistantRequest, AssistantResponse } from '../types/ai';

export interface AIResponse {
  success: boolean;
  response: string;
  error?: string;
}

export interface AgentRequest {
  message: string;
  context: AIAgentContext;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  explanation: string;
  recommendation: string;
  next_action: string;
  reasoning?: AIReasoning;
  error?: string;
  source?: string;
}

export const aiApi = {
  /**
   * Test the AI connection and model with a basic prompt
   */
  async testAI(message: string, signal?: AbortSignal): Promise<AIResponse> {
    return apiClient.post<AIResponse>('/ai/test', { message }, { signal });
  },

  /**
   * Run the AI agent to get personalized learning guidance
   */
  async runAIAgent(context: AgentRequest, signal?: AbortSignal): Promise<AgentResponse> {
    return apiClient.post<AgentResponse>('/ai/agent', context, { signal });
  },

  /**
   * Run the AI agent to get dashboard intelligence
   */
  async analyzeDashboard(context: DashboardAIRequest, signal?: AbortSignal): Promise<DashboardAIResponse> {
    return apiClient.post<DashboardAIResponse>('/ai/dashboard', context, { signal });
  },

  /**
   * Send a message to the AI Assistant
   */
  async sendMessage(request: AssistantRequest, signal?: AbortSignal): Promise<AssistantResponse> {
    return apiClient.post<AssistantResponse>('/ai/assistant', request, { signal });
  }
};
