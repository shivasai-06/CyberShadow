export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}
