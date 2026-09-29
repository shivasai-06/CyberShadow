export type TwinAssetStatus = 'PROTECTED' | 'MONITORED' | 'EXPOSED';
export type TwinAssetType = 'IDENTITY' | 'DEVICE' | 'DATA' | 'NETWORK';

export interface TwinAsset {
  id: string;
  name: string;
  type: TwinAssetType;
  status: TwinAssetStatus;
  connections: number;
  role: string;
  simulationExposure: 'LOW' | 'MEDIUM' | 'HIGH';
  potentialScenarios: string[];
}

export interface TwinIdentity extends TwinAsset {
  type: 'IDENTITY';
}

export interface TwinConnection {
  sourceId: string;
  targetId: string;
}

export interface TwinSecurityControl {
  id: string;
  name: string;
  state: 'ON' | 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  type: 'toggle' | 'level';
}
