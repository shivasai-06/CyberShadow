import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { Activity, Play, ShieldAlert, MonitorPlay, ArrowRight } from 'lucide-react';
import type { TwinAsset, TwinSecurityControl } from '../types/digital-twin';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { DigitalTwin3D } from '../components/digital-twin/DigitalTwin3D';
import { TwinInspector } from '../components/digital-twin/TwinInspector';
import { SecurityControls } from '../components/digital-twin/SecurityControls';
import { TwinViewSwitcher } from '../components/digital-twin/TwinViewSwitcher';

const initialAssets: TwinAsset[] = [
  { id: 'ident_1', name: 'ALEX VANCE', type: 'IDENTITY', status: 'MONITORED', connections: 4, role: 'PRIMARY USER', simulationExposure: 'MEDIUM', potentialScenarios: ['Credential Stuffing', 'Spear Phishing'] },
  { id: 'laptop_1', name: 'LAPTOP', type: 'DEVICE', status: 'PROTECTED', connections: 2, role: 'PRIMARY ENDPOINT', simulationExposure: 'LOW', potentialScenarios: ['Malicious Attachment', 'Drive-by Download'] },
  { id: 'phone_1', name: 'SMARTPHONE', type: 'DEVICE', status: 'PROTECTED', connections: 2, role: 'MOBILE ENDPOINT', simulationExposure: 'LOW', potentialScenarios: ['Smishing', 'Rogue App'] },
  { id: 'email_1', name: 'EMAIL', type: 'DATA', status: 'EXPOSED', connections: 1, role: 'COMMUNICATION HUB', simulationExposure: 'HIGH', potentialScenarios: ['Account Takeover', 'Business Email Compromise'] },
  { id: 'cloud_1', name: 'CLOUD STORAGE', type: 'DATA', status: 'PROTECTED', connections: 1, role: 'FILE REPOSITORY', simulationExposure: 'LOW', potentialScenarios: ['Misconfiguration Leak', 'Ransomware'] },
  { id: 'social_1', name: 'SOCIAL ACCOUNT', type: 'DATA', status: 'MONITORED', connections: 1, role: 'PUBLIC PROFILE', simulationExposure: 'MEDIUM', potentialScenarios: ['Social Engineering', 'Oauth Abuse'] },
];

const initialControls: TwinSecurityControl[] = [
  { id: 'mfa', name: 'MFA', state: 'OFF', description: 'Additional authentication layer is disabled in this simulation.', type: 'toggle' },
  { id: 'pwd', name: 'PASSWORD STRENGTH', state: 'MEDIUM', description: 'Standard complexity requirements are enforced.', type: 'level' },
  { id: 'upd', name: 'AUTOMATIC UPDATES', state: 'ON', description: 'System patches are applied automatically.', type: 'toggle' },
  { id: 'bak', name: 'BACKUP', state: 'ON', description: 'Daily offline backups are enabled.', type: 'toggle' },
  { id: 'prv', name: 'PRIVACY', state: 'MEDIUM', description: 'Standard data sharing policies in place.', type: 'level' },
  { id: 'awa', name: 'SECURITY AWARENESS', state: 'MEDIUM', description: 'User has completed basic security training.', type: 'level' },
];

export function DigitalTwin() {
  const navigate = useNavigate();
  const [view, setView] = useState<'2D' | '3D'>('2D');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [controls, setControls] = useState<TwinSecurityControl[]>(initialControls);

  const selectedAsset = selectedAssetId ? initialAssets.find(a => a.id === selectedAssetId) || null : null;

  const handleControlChange = (id: string, newState: string) => {
    setControls(prev => prev.map(c => c.id === id ? { ...c, state: newState as any } : c));
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* PAGE HEADER */}
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
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[11px] font-bold text-amber-500 tracking-widest uppercase">ISOLATED SIMULATION</span>
          </div>
          <Button variant="primary" className="gap-2" onClick={() => navigate('/simulation')}>
            <Play size={16} fill="currentColor" /> RUN SIMULATION
          </Button>
        </div>
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

      {/* SIMULATION CONNECTION */}
      <div className="pt-12 pb-6 text-center">
        <h2 className="text-lg font-bold text-white mb-2">READY TO EXPERIENCE A SCENARIO?</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Choose a fictional attack scenario and observe how it moves through the Digital Twin.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/scenarios')}>
            EXPLORE SCENARIOS
          </Button>
          <Button variant="primary" onClick={() => navigate('/simulation')}>
            OPEN SIMULATION LAB
          </Button>
        </div>
      </div>
    </div>
  );
}
