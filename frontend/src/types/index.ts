export interface DigitalTwin {
  id: string;
  name: string;
  type: 'PERSON' | 'SYSTEM' | 'NETWORK';
  assets: Asset[];
  securityControls: SecurityControl[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'LAPTOP' | 'SMARTPHONE' | 'EMAIL' | 'CLOUD_STORAGE' | 'SOCIAL_ACCOUNT';
}

export interface SecurityControl {
  id: string;
  name: string;
  status: 'ON' | 'OFF' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'AUTHENTICATION' | 'DEVICE' | 'DATA' | 'AWARENESS';
}

export interface AttackScenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedAssets: string[];
  category: string;
}

export interface Simulation {
  id: string;
  scenarioId: string;
  digitalTwinId: string;
  status: 'READY' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  outcome?: SimulationOutcome;
}

export interface SimulationStep {
  id: string;
  order: number;
  name: string;
  description: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'BLOCKED';
  type: 'ATTACK' | 'DEFENSE' | 'OUTCOME';
}

export interface SimulationOutcome {
  status: 'BLOCKED' | 'VULNERABLE' | 'COMPLETED';
  description: string;
  pathTaken: string[];
}
