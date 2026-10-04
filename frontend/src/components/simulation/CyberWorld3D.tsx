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

import { CyberDesk } from './env3d/CyberDesk';
import { CyberEnvironment } from './env3d/CyberEnvironment';
import { CyberMonitor } from './env3d/CyberMonitor';
import { CyberLaptop } from './env3d/CyberLaptop';
import { CyberPhone } from './env3d/CyberPhone';
import { CyberServerRack } from './env3d/CyberServerRack';
import { CyberFirewall } from './env3d/CyberFirewall';
import { CyberOutcome } from './env3d/CyberOutcome';

export interface CyberWorld3DProps {
  scenario?: SimulationScenario;
  simulationState?: SimulationState;
  simulationPlan?: SimulationRunPlan | null;
  currentStepIndex?: number;
  onStartSimulation?: () => void;
}

const ZONES = {
  EMAIL: { id: 'email', position: [0, 0, -1.5], rotation: [0, 0, 0], color: '#8b5cf6' },
  BROWSER: { id: 'browser', position: [0, 0, -1.5], rotation: [0, 0, 0], color: '#f59e0b' },
  DEVICE: { id: 'device', position: [-2.5, 0, 1], rotation: [0, 0.3, 0], color: '#3b82f6' },
  IDENTITY: { id: 'identity', position: [3, 0, 1.5], rotation: [0, -0.2, 0], color: '#06b6d4' },
  SOCIAL: { id: 'social', position: [3, 0, 1.5], rotation: [0, -0.2, 0], color: '#ec4899' },
  DEFENSE: { id: 'defense', position: [-3.5, 0, -1.5], rotation: [0, 0.4, 0], color: '#10b981' },
  CLOUD: { id: 'cloud', position: [6, -4.2, -6], rotation: [0, -0.4, 0], color: '#6366f1' },
  OUTCOME: { id: 'outcome', position: [0, 3, 0], rotation: [0, 0, 0], color: '#ef4444' }
};

function CameraDirector({ presentationState, reducedMotion, simulationState }: { presentationState: ScreenPresentationState, reducedMotion: boolean, simulationState?: SimulationState }) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as any;
  
  useFrame(() => {
    if (reducedMotion || !controls) return;
    
    let tx = 0, ty = 0, tz = 0; // Center focus on desk
    let targetCameraPos = new THREE.Vector3(0, 5, 14); // Default wide view
    
    if (simulationState === 'idle') {
      tx = 0; ty = 0; tz = 0;
      targetCameraPos = new THREE.Vector3(0, 5, 14);
    } else if (presentationState.focusCamera && presentationState.screenId) {
      const targetZone = Object.values(ZONES).find(z => z.id === presentationState.screenId);
      if (targetZone) {
        const [zx, zy, zz] = targetZone.position;
        tx = zx;
        ty = zy;
        tz = zz;
        
        // Closer offset for physical devices
        const [, ry] = targetZone.rotation;
        const offsetZ = Math.cos(ry) * 6;
        const offsetX = Math.sin(ry) * 6;
        
        if (presentationState.screenId === 'cloud') {
           targetCameraPos = new THREE.Vector3(zx + offsetX * 1.5, zy + 6, zz + offsetZ * 1.5);
           ty = zy + 5;
        } else {
           targetCameraPos = new THREE.Vector3(zx + offsetX, zy + 2, zz + offsetZ);
        }
      }
    } else if (simulationState === 'completed') {
       const targetZone = ZONES.OUTCOME;
       tx = targetZone.position[0]; ty = targetZone.position[1]; tz = targetZone.position[2];
       targetCameraPos = new THREE.Vector3(tx, ty + 1, tz + 8);
    }
    
    controls.target.lerp(new THREE.Vector3(tx, ty, tz), 0.03);
    camera.position.lerp(targetCameraPos, 0.02);
  });
  return null;
}

function EmailScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-slate-800 pb-4 mb-4">
        <div className="text-sm text-slate-400 mb-2">FROM: <span className="text-violet-400">security-update@fictional-domain.test</span></div>
        <div className="text-lg font-bold text-white">SUBJECT: Security Verification Required</div>
      </div>
      <div className="text-base text-slate-300 leading-relaxed flex-1">
        Please verify your account details immediately to prevent suspension. <br/><br/>
        <span className="text-violet-400 underline font-bold">Click here to verify</span>
      </div>
      {isActive && (
        <div className="bg-amber-950/80 border-l-4 border-amber-500 p-4 mt-auto rounded animate-in fade-in slide-in-from-bottom-4">
          <div className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-1">SUSPICIOUS MESSAGE</div>
          <div className="text-xs text-amber-200/70">Phishing simulation event detected.</div>
        </div>
      )}
    </div>
  );
}

function DeviceScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="bg-[#02040a] border border-slate-800 p-8 rounded-xl w-full max-w-md text-center">
        <div className="text-blue-500 text-6xl mb-4">💻</div>
        <div className="text-blue-500 text-2xl font-bold mb-4 tracking-widest uppercase">ENDPOINT ACTIVITY</div>
        <div className="text-slate-400 text-sm">Simulated user workspace and background processes.</div>
      </div>
      {isActive && (
        <div className="mt-8 text-sm text-amber-500 font-bold tracking-widest uppercase animate-pulse">
          SIMULATED INTERACTION DETECTED
        </div>
      )}
    </div>
  );
}

function BrowserScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="bg-[#02040a] border border-slate-800 p-8 rounded-xl w-full max-w-md">
        <div className="text-amber-500 text-2xl font-bold mb-8 tracking-widest text-center uppercase">CYBERSHADOW BROWSER</div>
        <div className="space-y-4">
          <div className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-400 text-sm">Username: ••••••••</div>
          <div className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-400 text-sm">Password: ••••••••</div>
          <div className="w-full bg-amber-600/20 border border-amber-500/50 text-amber-400 text-center font-bold tracking-widest rounded p-3 mt-4">
            [ SIMULATED SIGN IN ]
          </div>
        </div>
      </div>
      {isActive && (
        <div className="mt-8 text-sm text-amber-500 font-bold tracking-widest uppercase animate-pulse">
          WEB SESSION ACTIVE
        </div>
      )}
    </div>
  );
}

function IdentityScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col justify-center gap-6">
      <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded border border-slate-800">
         <span className="text-slate-400 font-bold tracking-widest text-sm">CREDENTIAL STATE</span>
         <span className={`font-bold tracking-widest text-sm ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>{isActive ? 'EXPOSED' : 'SECURE'}</span>
      </div>
      <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded border border-slate-800">
         <span className="text-slate-400 font-bold tracking-widest text-sm">SESSION STATUS</span>
         <span className={`font-bold tracking-widest text-sm ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>{isActive ? 'AUTHENTICATING...' : 'IDLE'}</span>
      </div>
      {isActive && (
        <div className="bg-cyan-950/50 border border-cyan-500/30 p-6 rounded-lg text-center mt-4">
           <div className="text-cyan-400 text-lg font-bold tracking-widest mb-2">SIMULATED AUTHENTICATION</div>
           <div className="text-cyan-200/70 text-sm">Processing credential challenge in synthetic environment.</div>
        </div>
      )}
    </div>
  );
}

function DefenseScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className={`p-8 rounded-xl border-2 text-center transition-all duration-500 ${isActive ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
         <div className={`text-4xl mb-4 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>🛡️</div>
         <div className={`text-2xl font-bold tracking-widest uppercase mb-2 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
           {isActive ? 'DEFENSE ACTIVE' : 'MONITORING'}
         </div>
         <div className="text-sm text-slate-400 max-w-sm mx-auto">
           {isActive ? 'Security controls are actively challenging or blocking the simulated threat.' : 'Awaiting simulated events...'}
         </div>
      </div>
    </div>
  );
}

function CloudScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-24 rounded border flex items-center justify-center transition-all duration-300 ${isActive && i <= 3 ? 'bg-indigo-950/60 border-indigo-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
             <div className={`w-4 h-4 rounded-full ${isActive && i <= 3 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
          </div>
        ))}
      </div>
      {isActive && (
        <div className="text-center mt-8 text-indigo-400 font-bold tracking-widest uppercase">
          DATA ACCESS SIMULATED
        </div>
      )}
    </div>
  );
}

function SocialScreenContent({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
         <div className="w-12 h-12 rounded-full bg-pink-900 flex items-center justify-center text-pink-300 font-bold">JD</div>
         <div>
           <div className="text-white font-bold">John Doe</div>
           <div className="text-slate-400 text-sm">@johndoe</div>
         </div>
       </div>
       <div className="bg-slate-900/80 p-4 rounded border border-slate-800 mb-4 text-slate-300">
         Check out this urgent security notice: <br/>
         <span className="text-pink-400 underline mt-2 block">http://bit.ly/secure-auth-392</span>
       </div>
       {isActive && (
         <div className="mt-auto bg-pink-950/50 border border-pink-500/50 text-pink-400 p-4 text-center uppercase font-bold tracking-widest rounded animate-pulse">
           Social Engineering Link
         </div>
       )}
    </div>
  );
}

function OutcomeScreenContent({ state }: { isActive: boolean, state: string }) {
  const isBlocked = state === 'BLOCKED';
  const colorClass = isBlocked ? 'text-emerald-400' : 'text-red-500';
  const borderClass = isBlocked ? 'border-emerald-500/30' : 'border-red-500/30';
  const bgClass = isBlocked ? 'bg-emerald-950/20' : 'bg-red-950/20';

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className={`p-10 rounded-xl border-2 transition-all duration-500 ${bgClass} ${borderClass}`}>
         <div className={`text-6xl mb-6 text-center ${colorClass}`}>
           {isBlocked ? '🛡️' : '⚠️'}
         </div>
         <div className={`text-4xl font-bold tracking-widest uppercase mb-4 text-center ${colorClass}`}>
           {isBlocked ? 'ATTACK BLOCKED' : 'SIMULATED COMPROMISE'}
         </div>
         <div className="text-sm text-slate-400 max-w-lg mx-auto text-center leading-relaxed">
           Simulation concluded. Check the event timeline for a detailed breakdown of the scenario and your security configuration's effectiveness.
         </div>
      </div>
    </div>
  );
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
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (_e) {
      setHasWebGL(false);
    }
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
  
  // Determine active states for components based on presentationState
  const isEmail = presentationState.screenId === 'email';
  const isBrowser = presentationState.screenId === 'browser';
  const isDevice = presentationState.screenId === 'device';
  const isIdentity = presentationState.screenId === 'identity';
  const isSocial = presentationState.screenId === 'social';
  const isCloud = presentationState.screenId === 'cloud';
  const isDefense = presentationState.screenId === 'defense';

  return (
    <div className="relative w-full h-[500px] lg:h-[700px] rounded-xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-[#02040a] to-[#060a14]">
      {/* Top Label Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 border border-cyan-900/50 rounded backdrop-blur-sm shadow-xl">
          <div className={`w-2 h-2 rounded-full bg-cyan-500 ${!reducedMotion && simulationState !== 'idle' ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
            {simulationState === 'idle' ? 'CYBERSPACE / SYNTHETIC ENVIRONMENT' : 'SIMULATION ACTIVE'}
          </span>
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 4, 12], fov: 45 }} frameloop={reducedMotion ? "demand" : "always"} gl={{ antialias: true, powerPreference: "high-performance" }}>
        
        <CyberEnvironment />
        
        <OrbitControls 
          makeDefault
          enableZoom={true} 
          enablePan={true} 
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3}
          maxDistance={30}
          autoRotate={!reducedMotion && simulationState === 'idle'}
          autoRotateSpeed={0.2}
          target={[0, 0, 0]}
        />
        
        <CameraDirector presentationState={presentationState} reducedMotion={reducedMotion} simulationState={simulationState} />
        
        {/* Physical 3D Devices */}
        <CyberDesk position={[0, 0, 0]} />
        
        <CyberMonitor 
          position={ZONES.EMAIL.position as any} 
          rotation={ZONES.EMAIL.rotation as any}
          isActive={isEmail || isBrowser}
          status={isEmail ? presentationState.state : (isBrowser ? presentationState.state : 'IDLE')}
          color={isEmail ? ZONES.EMAIL.color : (isBrowser ? ZONES.BROWSER.color : '#334155')}
          title={isEmail ? ZONES.EMAIL.id.toUpperCase() : (isBrowser ? ZONES.BROWSER.id.toUpperCase() : 'MONITOR')}
          subtitle={isEmail ? 'COMMUNICATION' : (isBrowser ? 'WEB BROWSER' : 'SYSTEM IDLE')}
          renderContent={() => isEmail ? <EmailScreenContent isActive={isEmail} /> : (isBrowser ? <BrowserScreenContent isActive={isBrowser} /> : <div className="h-full flex items-center justify-center text-slate-700 tracking-widest">SYSTEM STANDBY</div>)}
        />
        
        <CyberLaptop 
          position={ZONES.DEVICE.position as any} 
          rotation={ZONES.DEVICE.rotation as any}
          isActive={isDevice}
          renderContent={() => <DeviceScreenContent isActive={isDevice} />}
        />
        
        <CyberPhone 
          position={ZONES.IDENTITY.position as any} 
          rotation={ZONES.IDENTITY.rotation as any}
          isActive={isIdentity || isSocial}
          status={isIdentity ? presentationState.state : (isSocial ? presentationState.state : 'IDLE')}
          color={isIdentity ? ZONES.IDENTITY.color : (isSocial ? ZONES.SOCIAL.color : '#334155')}
          title={isIdentity ? ZONES.IDENTITY.id.toUpperCase() : (isSocial ? ZONES.SOCIAL.id.toUpperCase() : 'MOBILE')}
          subtitle={isIdentity ? 'AUTHENTICATION' : (isSocial ? 'SOCIAL NETWORK' : 'LOCKED')}
          renderContent={() => isIdentity ? <IdentityScreenContent isActive={isIdentity} /> : (isSocial ? <SocialScreenContent isActive={isSocial} /> : <div className="h-full flex items-center justify-center text-slate-700 tracking-widest">LOCKED</div>)}
        />

        <CyberFirewall 
          position={ZONES.DEFENSE.position as any} 
          rotation={ZONES.DEFENSE.rotation as any}
          isActive={isDefense}
          status={isDefense ? presentationState.state : 'IDLE'}
          renderContent={() => <DefenseScreenContent isActive={isDefense} />}
        />

        <CyberServerRack 
          position={ZONES.CLOUD.position as any} 
          rotation={ZONES.CLOUD.rotation as any}
          isActive={isCloud}
          renderContent={() => <CloudScreenContent isActive={isCloud} />}
        />

        {simulationState === 'completed' && (
          <CyberOutcome 
            position={ZONES.OUTCOME.position as any} 
            rotation={ZONES.OUTCOME.rotation as any}
            isActive={true}
            status={presentationState.state}
            renderContent={() => <OutcomeScreenContent isActive={true} state={presentationState.state} />}
          />
        )}
      </Canvas>

      {/* SCENARIO BRIEFING (IDLE) */}
      {simulationState === 'idle' && scenario && onStartSimulation && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#02040a]/40 backdrop-blur-[2px] p-4">
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
               <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">YOU WILL LEARN</div>
                 <p className="text-xs text-slate-400 leading-relaxed">Observe how threat actors pivot through isolated zones and understand how security controls shape the final outcome.</p>
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

      {/* TIMELINE OVERLAY */}
      {simulationState !== 'idle' && simulationPlan && (
        <div className="absolute top-16 left-4 z-10 w-48 md:w-64 max-h-[calc(100%-8rem)] overflow-y-auto pointer-events-auto bg-[#0b1120]/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-4 shadow-xl hide-scrollbar hidden md:block">
          <div className="text-[9px] font-bold text-cyan-500 tracking-widest uppercase mb-4">SIMULATION TIMELINE</div>
          <div className="space-y-4 relative">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-700" />
            {simulationPlan.stepsToRun.map((step, idx) => {
              const isCompleted = idx < currentStepIndex || simulationState === 'completed';
              const isActive = idx === currentStepIndex && simulationState !== 'completed';
              return (
                <div key={idx} className={`relative pl-6 transition-all duration-300 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-50' : 'opacity-30'}`}>
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${isActive ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : isCompleted ? 'bg-slate-500 border-slate-700' : 'bg-transparent border-slate-700'}`} />
                  <div className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}>{step.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT INFO PANEL OVERLAY */}
      {simulationState !== 'idle' && simulationState !== 'completed' && currentStep && (
        <div className="absolute bottom-6 right-4 left-4 md:left-auto z-10 md:w-80 bg-[#0b1120]/90 backdrop-blur-md border border-slate-700/50 rounded-lg p-5 shadow-2xl pointer-events-auto transition-all duration-500">
          <div className="flex items-center justify-between mb-3">
             <div className="text-[9px] font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full bg-cyan-500 ${simulationState === 'running' ? 'animate-pulse' : ''}`} />
               CURRENT EVENT
             </div>
             {simulationState === 'paused' && <span className="text-[9px] font-bold text-amber-500 tracking-widest uppercase">PAUSED</span>}
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{presentationState.primaryMessage || currentStep.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{presentationState.secondaryMessage || currentStep.description}</p>
          <div className="pt-3 border-t border-slate-700/50">
            <div className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-1">WHY IT MATTERS</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{currentStep.learningContext}</p>
          </div>
        </div>
      )}

      {/* DEV DEBUG OVERLAY */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-4 left-4 z-50 bg-black/80 p-3 text-[10px] text-green-400 font-mono rounded border border-green-900 pointer-events-none">
          <div className="font-bold mb-1 border-b border-green-900 pb-1">DEV DEBUG</div>
          <div>EVENT: {currentStep?.name || 'NONE'}</div>
          <div>SCREEN: {presentationState.screenId || 'NONE'}</div>
          <div>STEP: {currentStepIndex + 1} / {simulationPlan?.stepsToRun.length || 0}</div>
          <div>STATE: {presentationState.state}</div>
        </div>
      )}

    </div>
  );
}
