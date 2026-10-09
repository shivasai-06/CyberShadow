import React from 'react';
import { HolographicDisplay } from './HolographicDisplay';

interface CentralSimulationDisplayProps {
  children: React.ReactNode;
  isActive: boolean;
}

export function CentralSimulationDisplay({ children, isActive }: CentralSimulationDisplayProps) {
  return (
    <group position={[0, 1, -2]}>
      {/* 3D frame around the network */}
      <HolographicDisplay
        position={[0, -2, -6]} // pushed further back to avoid clipping with larger network
        title="VIRTUAL SIMULATION"
        width="1800px" // Increased size
        height="1200px"
        color="#0ea5e9"
        isActive={isActive}
        scale={0.012} // Slightly larger scale
        glow={isActive}
      >
        <div className="absolute top-4 left-4 text-slate-500 font-mono text-sm tracking-widest">
          TARGET: CORPORATE NETWORK
        </div>
        <div className="absolute bottom-4 right-4 text-slate-500 font-mono text-sm tracking-widest opacity-50">
          SIMULATION ONLY - SYNTHETIC ENVIRONMENT
        </div>
      </HolographicDisplay>
      
      {/* The 3D Network goes here */}
      <group position={[0, 0, 0]}>
        {children}
      </group>
    </group>
  );
}
