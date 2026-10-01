import type { ApiError } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.code = error.code;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'An unexpected error occurred';
    let code: string | undefined;

    try {
      const data = await response.json();
      message = data.message || data.detail || message;
      code = data.code;
    } catch (e) {
      // Not JSON
      if (response.status === 404) message = 'Not Found';
      if (response.status >= 500) message = 'Server Error';
    }

    throw new ApiClientError({ status: response.status, message, code });
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  async get<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${API_PREFIX}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...init,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      throw new ApiClientError({ status: 0, message: 'Network failure' });
    }
  },

  async post<T>(endpoint: string, data?: unknown, init?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${API_PREFIX}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...init,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      throw new ApiClientError({ status: 0, message: 'Network failure' });
    }
  },

  async put<T>(endpoint: string, data?: unknown, init?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${API_PREFIX}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...init,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      throw new ApiClientError({ status: 0, message: 'Network failure' });
    }
  },

  async delete<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${API_PREFIX}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...init,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      throw new ApiClientError({ status: 0, message: 'Network failure' });
    }
  }
};
