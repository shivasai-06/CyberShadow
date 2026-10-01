import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, ShieldCheck, Play, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';

export function RemediationCenter() {
  const navigate = useNavigate();
  const { remediations } = useCyberShadow();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openCount = remediations.filter(r => r.status === 'OPEN').length;
  const inProgressCount = remediations.filter(r => r.status === 'IN_PROGRESS').length;
  const validatedCount = remediations.filter(r => r.status === 'VALIDATED').length;

  const selectedRemediation = remediations.find(r => r.id === selectedId);

  return (
    <div className="flex flex-col gap-6 h-full p-6 bg-[#030712] overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="text-orange-500" />
            SECURITY REMEDIATION
          </h1>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-orange-400 font-mono tracking-widest uppercase border border-orange-900/50 bg-orange-950/20 px-2 py-1 rounded">
              SIMULATION ONLY
            </span>
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
              • FICTIONAL ENVIRONMENT
            </span>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate('/security')}>
          Back to Security Center
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Panel className="bg-[#0b1120] border-slate-800/80 p-4">
          <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-2">Open</div>
          <div className="text-3xl font-light text-orange-400">{openCount}</div>
        </Panel>
        <Panel className="bg-[#0b1120] border-slate-800/80 p-4">
          <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-2">In Progress</div>
          <div className="text-3xl font-light text-amber-400">{inProgressCount}</div>
        </Panel>
        <Panel className="bg-[#0b1120] border-slate-800/80 p-4">
          <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-2">Validated</div>
          <div className="text-3xl font-light text-green-400">{validatedCount}</div>
        </Panel>
        <Panel className="bg-[#0b1120] border-slate-800/80 p-4">
          <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-2">Total Actions</div>
          <div className="text-3xl font-light text-slate-200">{remediations.length}</div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">ACTION ITEMS</h2>
          
          {remediations.length === 0 ? (
            <div className="text-slate-500 text-sm italic p-4 text-center border border-dashed border-slate-800 rounded">
              No simulated remediations pending.<br />Run a simulation to identify findings.
            </div>
          ) : (
            [...remediations].reverse().map(rem => (
              <div 
                key={rem.id}
                onClick={() => setSelectedId(rem.id)}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  selectedId === rem.id 
                    ? 'bg-slate-800/50 border-slate-500' 
                    : 'bg-[#0b1120] border-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    rem.status === 'VALIDATED' ? 'bg-green-950/50 text-green-500' :
                    rem.status === 'IN_PROGRESS' ? 'bg-amber-950/50 text-amber-500' :
                    'bg-orange-950/50 text-orange-500'
                  }`}>
                    {rem.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(rem.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-slate-200 mb-1">{rem.title}</h3>
                <div className="text-xs text-slate-400 mb-2 truncate">Finding: {rem.findingTitle}</div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-slate-500 font-mono">{rem.affectedAsset}</span>
                  <ArrowRight size={14} className="text-slate-600" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedRemediation ? (
            <Panel className="bg-[#0b1120] border-slate-800/80 h-full flex flex-col">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-2">SIMULATED REMEDIATION</div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedRemediation.title}</h2>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      selectedRemediation.status === 'VALIDATED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      selectedRemediation.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {selectedRemediation.status === 'VALIDATED' && <ShieldCheck size={14} />}
                      {selectedRemediation.status === 'IN_PROGRESS' && <Play size={14} />}
                      {selectedRemediation.status === 'OPEN' && <AlertTriangle size={14} />}
                      {selectedRemediation.status.replace('_', ' ')}
                    </div>
                  </div>
                  {selectedRemediation.status === 'VALIDATED' && selectedRemediation.validatedAt && (
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">VALIDATED ON</div>
                      <div className="text-sm text-green-400">{new Date(selectedRemediation.validatedAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                      <Info size={14} /> WHAT WAS FOUND
                    </h3>
                    <div className="text-slate-300 text-sm mb-2"><span className="text-slate-500">Finding:</span> {selectedRemediation.findingTitle}</div>
                    <div className="text-slate-300 text-sm"><span className="text-slate-500">Affected Asset:</span> {selectedRemediation.affectedAsset}</div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">WHY IT MATTERS</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {selectedRemediation.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyan-950/20 border border-cyan-900/30 p-4 rounded">
                      <h3 className="text-[11px] font-bold text-cyan-500 uppercase tracking-[0.15em] mb-2">SIMULATED DEFENSE</h3>
                      <div className="text-slate-200 text-sm font-semibold">{selectedRemediation.relatedControl}</div>
                    </div>
                    <div className="bg-violet-950/20 border border-violet-900/30 p-4 rounded">
                      <h3 className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.15em] mb-2">RELATED SCENARIO</h3>
                      <div className="text-slate-200 text-sm font-semibold">{selectedRemediation.relatedScenarioId}</div>
                    </div>
                  </div>

                  <div className="bg-[#060a14] p-4 rounded border border-slate-800">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">VALIDATION METHOD</h3>
                    <p className="text-slate-400 text-sm">
                      Run the scenario again with the appropriate defense ({selectedRemediation.relatedControl}) enabled and successfully protect the fictional environment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-800 bg-[#060a14] mt-auto">
                <Button 
                  className="w-full justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white"
                  onClick={() => navigate(`/simulation?scenario=${selectedRemediation.relatedScenarioId}`)}
                >
                  <Play size={16} />
                  START PRACTICE
                </Button>
                <p className="text-center text-[10px] text-slate-500 mt-3 font-mono tracking-wide uppercase">
                  Navigate to simulation lab to practice this scenario
                </p>
              </div>
            </Panel>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800/80 rounded bg-[#0b1120]/50 p-12">
              <Shield size={48} className="text-slate-700 mb-4 opacity-50" />
              <p className="text-sm">Select an action item to view remediation details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
