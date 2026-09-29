export type ControlId = 'mfa' | 'password_strength' | 'automatic_updates' | 'backup' | 'privacy' | 'security_awareness';

export interface SecurityControlDef {
  id: ControlId;
  name: string;
  description: string;
  effect: string;
  beforePath: string[];
  afterPath: string[];
}

export type SimulatedRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityPostureMetrics {
  coveragePercent: number;
  activeControls: number;
  totalControls: number;
  simulatedRisk: SimulatedRisk;
  vulnerablePaths: number;
  blockedPaths: number;
}

export type PresetType = 'BALANCED' | 'HIGH_PROTECTION' | 'TEST_VULNERABILITIES';
