import { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { SimulationState, SimulationScenario } from '../../types/simulation';
import type { SimulationRunPlan } from '../../engine/simulationEngine';
import { Play } from 'lucide-react';
import { Button } from '../ui/Button';

import { mapSimulationStepToScreen } from '../../utils/presentationMapper';
import type { ScreenPresentationState } from '../../utils/presentationMapper';
import { useCyberShadow } from '../../contexts/CyberShadowContext';

import { VirtualEnvironment } from './virtual/VirtualEnvironment';
import { CentralSimulationDisplay } from './virtual/CentralSimulationDisplay';
import { CyberNetwork } from './virtual/CyberNetwork';
import { EventStreamDisplay, SecurityStatusDisplay, TelemetryDisplay, OutcomeDisplay } from './virtual/VirtualDisplays';

export interface CyberWorld3DProps {
  scenario?: SimulationScenario;
  simulationState?: SimulationState;
  simulationPlan?: SimulationRunPlan | null;
  currentStepIndex?: number;
  onStartSimulation?: () => void;
}

function CameraDirector({ presentationState, reducedMotion, simulationState }: { presentationState: ScreenPresentationState, reducedMotion: boolean, simulationState?: SimulationState }) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as any;

  useFrame(() => {
    if (reducedMotion || !controls) return;

    let tx = 0, ty = 1, tz = -2; // Default center focus
    let targetCameraPos = new THREE.Vector3(0, 4, 18); // Wide view for larger network

    if (simulationState === 'idle') {
      tx = 0; ty = 1; tz = -2;
      targetCameraPos = new THREE.Vector3(0, 4, 18);
    } else if (simulationState === 'completed') {
      tx = 0; ty = 2; tz = 0;
      targetCameraPos = new THREE.Vector3(0, 4, 16);
    } else if (presentationState.focusCamera && presentationState.screenId) {
       // Just subtle camera zooms instead of jumping around wildly.
       // Because the network is central, we just pull in slightly.
       targetCameraPos = new THREE.Vector3(0, 3, 14);

       if (presentationState.screenId === 'defense') {
         tx = 2; ty = 2;
       } else if (presentationState.screenId === 'cloud') {
         tx = 4; ty = 2;
       } else if (presentationState.screenId === 'email' || presentationState.screenId === 'social') {
         tx = -4; ty = 1;
       } else if (presentationState.screenId === 'device') {
         tx = -2; ty = 1;
       } else if (presentationState.screenId === 'identity') {
         tx = 2; ty = 1;
       }
    }

    controls.target.lerp(new THREE.Vector3(tx, ty, tz), 0.03);
    camera.position.lerp(targetCameraPos, 0.02);
  });
  return null;
}

export function CyberWorld3D({
  scenario,
  simulationState = 'idle',
  simulationPlan = null,
  currentStepIndex = 0,
  onStartSimulation
}: CyberWorld3DProps) {

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  const [hasWebGL] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  });

  const { securityControls } = useCyberShadow();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const currentStep = simulationState !== 'idle' && simulationPlan && currentStepIndex < simulationPlan.stepsToRun.length
    ? simulationPlan.stepsToRun[currentStepIndex]
    : null;

  const presentationState = mapSimulationStepToScreen(currentStep, simulationState, simulationPlan);

  if (!hasWebGL) {
    return (
      <div className="w-full h-[400px] rounded-xl border border-slate-800 bg-[#02040a] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-cyan-500 mb-4 text-4xl">⚠️</div>
        <h2 className="text-white font-bold tracking-widest uppercase mb-2">WebGL Required</h2>
        <p className="text-slate-400 text-sm max-w-md">Your browser does not support WebGL.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] lg:h-[800px] rounded-xl border border-slate-800/80 bg-[#02040a]">
      {/* Top Label Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-slate-700/50 rounded backdrop-blur-md shadow-xl">
          <div className={`w-2 h-2 rounded-full bg-cyan-500 ${!reducedMotion && simulationState !== 'idle' ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
            {simulationState === 'idle' ? 'CYBERSPACE / SYNTHETIC ENVIRONMENT' : 'SIMULATION ACTIVE'}
          </span>
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 3, 14], fov: 45 }} frameloop={reducedMotion ? "demand" : "always"} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <VirtualEnvironment />

        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minDistance={5}
          maxDistance={30}
          autoRotate={!reducedMotion && simulationState === 'idle'}
          autoRotateSpeed={0.3}
          target={[0, 1, -2]}
        />

        <CameraDirector presentationState={presentationState} reducedMotion={reducedMotion} simulationState={simulationState} />

        {/* HERO Central Simulation Display */}
        <CentralSimulationDisplay isActive={simulationState !== 'idle'}>
          <CyberNetwork activeScreenId={presentationState.screenId} activeState={presentationState.state} />
        </CentralSimulationDisplay>

        {/* Secondary Holographic Displays */}
        {simulationState !== 'idle' && (
          <>
            <EventStreamDisplay
              simulationPlan={simulationPlan}
              currentStepIndex={currentStepIndex}
              simulationState={simulationState}
            />

            <SecurityStatusDisplay
              controls={securityControls}
              defenseImpacts={simulationPlan?.defenseImpacts || []}
              simulationState={simulationState}
            />

            <TelemetryDisplay
              simulationPlan={simulationPlan}
              currentStepIndex={currentStepIndex}
              simulationState={simulationState}
            />
          </>
        )}


        {/* Outcome Display */}
        {simulationState === 'completed' && (
          <OutcomeDisplay
            state={presentationState.state}
            message={presentationState.secondaryMessage || ''}
            outcome={presentationState.primaryMessage || 'SIMULATED COMPROMISE'}
          />
        )}
      </Canvas>

      {/* SCENARIO BRIEFING (IDLE) */}
      {simulationState === 'idle' && scenario && onStartSimulation && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#02040a]/40 backdrop-blur-sm p-4">
           <div className="bg-[#0b1120]/95 border border-slate-700/80 rounded-xl p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-md pointer-events-auto animate-in zoom-in-95 duration-500">
             <div className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-4">SCENARIO BRIEFING</div>
             <h2 className="text-2xl font-bold tracking-widest uppercase text-white mb-6">
               {scenario.name}
             </h2>

             <div className="text-left mb-8 space-y-4">
               <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">MISSION</div>
                 <p className="text-sm text-slate-300 leading-relaxed">{scenario.description}</p>
               </div>
             </div>

             <div className="bg-amber-950/20 border border-amber-500/30 rounded p-3 mb-6">
               <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY • NO REAL SYSTEM ACCESS</span>
             </div>

             <Button variant="primary" onClick={onStartSimulation} className="w-full justify-center py-3 text-sm tracking-widest">
                <Play size={16} className="mr-2" /> BEGIN SIMULATION
             </Button>
           </div>
        </div>
      )}

      {/* HTML Overlays for Mobile/Fallback (Hidden on Desktop) */}
      {simulationState !== 'idle' && simulationState !== 'completed' && currentStep && (
        <div className="absolute bottom-6 right-4 left-4 md:hidden z-10 bg-[#0b1120]/90 backdrop-blur-md border border-slate-700/50 rounded-lg p-5 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
             <div className="text-[9px] font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full bg-cyan-500 ${simulationState === 'running' ? 'animate-pulse' : ''}`} />
               CURRENT EVENT
             </div>
             {simulationState === 'paused' && <span className="text-[9px] font-bold text-amber-500 tracking-widest uppercase">PAUSED</span>}
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{presentationState.primaryMessage || currentStep.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{presentationState.secondaryMessage || currentStep.description}</p>
        </div>
      )}
    </div>
  );
}
