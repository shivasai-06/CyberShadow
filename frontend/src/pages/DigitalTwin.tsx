import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { Activity, Play, ShieldAlert, MonitorPlay, ArrowRight, User, ShieldCheck, RefreshCw } from 'lucide-react';
import type { TwinAsset, TwinSecurityControl } from '../types/digital-twin';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { DigitalTwin3D } from '../components/digital-twin/DigitalTwin3D';
import { TwinInspector } from '../components/digital-twin/TwinInspector';
import { SecurityControls } from '../components/digital-twin/SecurityControls';
import { TwinViewSwitcher } from '../components/digital-twin/TwinViewSwitcher';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import type { ControlId } from '../types/security';

const initialAssets: TwinAsset[] = [
  { id: 'ident_1', name: 'ALEX VANCE', type: 'IDENTITY', status: 'MONITORED', connections: 4, role: 'PRIMARY USER', simulationExposure: 'MEDIUM', potentialScenarios: ['Credential Stuffing', 'Spear Phishing'] },
  { id: 'laptop_1', name: 'LAPTOP', type: 'DEVICE', status: 'PROTECTED', connections: 2, role: 'PRIMARY ENDPOINT', simulationExposure: 'LOW', potentialScenarios: ['Malicious Attachment', 'Drive-by Download'] },
  { id: 'phone_1', name: 'SMARTPHONE', type: 'DEVICE', status: 'PROTECTED', connections: 2, role: 'MOBILE ENDPOINT', simulationExposure: 'LOW', potentialScenarios: ['Smishing', 'Rogue App'] },
  { id: 'email_1', name: 'EMAIL', type: 'DATA', status: 'EXPOSED', connections: 1, role: 'COMMUNICATION HUB', simulationExposure: 'HIGH', potentialScenarios: ['Account Takeover', 'Business Email Compromise'] },
  { id: 'cloud_1', name: 'CLOUD STORAGE', type: 'DATA', status: 'PROTECTED', connections: 1, role: 'FILE REPOSITORY', simulationExposure: 'LOW', potentialScenarios: ['Misconfiguration Leak', 'Ransomware'] },
  { id: 'social_1', name: 'SOCIAL ACCOUNT', type: 'DATA', status: 'MONITORED', connections: 1, role: 'PUBLIC PROFILE', simulationExposure: 'MEDIUM', potentialScenarios: ['Social Engineering', 'Oauth Abuse'] },
];

const CONTROL_DEFINITIONS: Record<ControlId, { name: string, description: string }> = {
  mfa: { name: 'MFA', description: 'Additional authentication step for identity verification.' },
  password_strength: { name: 'PASSWORD STRENGTH', description: 'Enforces complex credential requirements.' },
  automatic_updates: { name: 'AUTOMATIC UPDATES', description: 'Automatically applies security patches.' },
  backup: { name: 'BACKUP', description: 'Maintains offline copies of critical data.' },
  privacy: { name: 'PRIVACY', description: 'Restricts data sharing and footprint.' },
  security_awareness: { name: 'SECURITY AWARENESS', description: 'User training to recognize social engineering.' },
};

export function DigitalTwin() {
  const navigate = useNavigate();
  const [view, setView] = useState<'2D' | '3D'>('2D');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const { securityControls, updateSecurityControl, applySecurityPreset } = useCyberShadow();

  const selectedAsset = selectedAssetId ? initialAssets.find(a => a.id === selectedAssetId) || null : null;

  const handleControlChange = (id: string, newState: string) => {
    updateSecurityControl(id as ControlId, newState === 'ON');
  };

  const controls: TwinSecurityControl[] = (Object.keys(CONTROL_DEFINITIONS) as ControlId[]).map(key => ({
    id: key,
    name: CONTROL_DEFINITIONS[key].name,
    state: securityControls[key] ? 'ON' : 'OFF',
    description: CONTROL_DEFINITIONS[key].description,
    type: 'toggle'
  }));

  const enabledCount = Object.values(securityControls).filter(Boolean).length;
  const totalControls = Object.keys(securityControls).length;
  const isVulnerable = enabledCount <= totalControls / 2;

  const postureColor = isVulnerable ? 'text-amber-400' : 'text-green-400';
  const postureBg = isVulnerable ? 'bg-amber-500/10' : 'bg-green-500/10';
  const postureBorder = isVulnerable ? 'border-amber-500/20' : 'border-green-500/20';

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* PAGE HEADER / HERO */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <MonitorPlay size={12} /> DIGITAL TWIN / SYNTHETIC ENVIRONMENT
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Digital Twin</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore a fictional digital environment and understand how assets, identities, and security controls interact.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">SIMULATION ONLY</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">NO REAL SYSTEM ACCESS</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          </div>
          <Button variant="primary" className="gap-2" onClick={() => navigate('/simulation')}>
            <Play size={16} fill="currentColor" /> RUN SIMULATION
          </Button>
        </div>
      </div>

      {/* USER PROFILE & POSTURE HERO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel className="flex items-center gap-6 border-cyan-900/30 relative overflow-hidden bg-gradient-to-br from-[#0a101f] to-[#030712]">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <User size={120} />
          </div>
          <div className="w-20 h-20 rounded-full bg-cyan-950 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0 z-10">
            <User size={40} />
          </div>
          <div className="z-10">
            <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1">TARGET IDENTITY</div>
            <h2 className="text-2xl font-bold text-white tracking-wide">ALEX VANCE</h2>
            <p className="text-sm text-slate-400 mt-1">Primary User / Operations</p>
          </div>
        </Panel>

        <Panel className={`flex items-center gap-6 border ${postureBorder} ${postureBg} relative overflow-hidden transition-colors duration-500`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-white">
            {isVulnerable ? <ShieldAlert size={120} /> : <ShieldCheck size={120} />}
          </div>
          <div className={`w-20 h-20 rounded-full border flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${isVulnerable ? 'bg-amber-950/50 border-amber-500/30 text-amber-400' : 'bg-green-950/50 border-green-500/30 text-green-400'}`}>
            {isVulnerable ? <ShieldAlert size={40} /> : <ShieldCheck size={40} />}
          </div>
          <div className="z-10 flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">SECURITY POSTURE</div>
                <h2 className={`text-2xl font-bold tracking-wide transition-colors duration-500 ${postureColor}`}>
                  {isVulnerable ? 'VULNERABLE' : 'IMPROVED'}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  {enabledCount} of {totalControls} defensive controls active
                </p>
              </div>
              <Button variant="ghost" className="text-[10px] px-2 py-1 h-auto" onClick={() => applySecurityPreset('BALANCED')}>
                <RefreshCw size={12} className="mr-1" /> RESET DEFAULT
              </Button>
            </div>
          </div>
        </Panel>
      </div>

      {/* VIEW SWITCHER */}
      <div className="flex justify-center md:justify-start">
        <TwinViewSwitcher view={view} onViewChange={setView} />
      </div>

      {/* DIGITAL TWIN WORKSPACE */}
      <div className="flex flex-col gap-6">
        {view === '2D' ? (
          <DigitalTwinCanvas 
            assets={initialAssets} 
            selectedId={selectedAssetId} 
            onSelectAsset={setSelectedAssetId} 
          />
        ) : (
          <DigitalTwin3D />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TwinInspector asset={selectedAsset} />
          </div>
          <div className="lg:col-span-1">
            <SecurityControls controls={controls} onControlChange={handleControlChange} />
          </div>
          <div className="lg:col-span-1">
            <Panel className="h-full flex flex-col">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">ASSET SUMMARY</div>
              <div className="text-4xl font-light text-white mb-2">5 <span className="text-xl text-slate-500">ASSETS</span></div>
              
              <div className="space-y-3 mt-4 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Identity</span>
                  <span className="text-white font-mono">1</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Device</span>
                  <span className="text-white font-mono">1</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Mobile Device</span>
                  <span className="text-white font-mono">1</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white font-mono">1</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Cloud Environment</span>
                  <span className="text-white font-mono">1</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* LEARNING CONTEXT */}
      <Panel className="bg-slate-900/40 border-slate-800/50 mt-8">
        <h2 className="text-sm font-bold text-white tracking-wide mb-4">WHAT YOU'RE EXPLORING</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div className="space-y-2">
            <div className="text-cyan-400 mb-2"><Activity size={20} /></div>
            <p>Digital identities connect multiple assets together, forming a continuous attack surface.</p>
          </div>
          <div className="space-y-2">
            <div className="text-cyan-400 mb-2"><ShieldAlert size={20} /></div>
            <p>A weakness in one asset (like an exposed email account) can create a path to another connected asset.</p>
          </div>
          <div className="space-y-2">
            <div className="text-cyan-400 mb-2"><ArrowRight size={20} /></div>
            <p>Security controls actively change how a simulated attack progresses through the Digital Twin.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
