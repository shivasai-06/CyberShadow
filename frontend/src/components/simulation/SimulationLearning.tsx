import { Panel } from '../ui/Panel';
import { Layers, Network, RefreshCw } from 'lucide-react';

export function SimulationLearning() {
  return (
    <div className="space-y-4">
      <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">WHAT YOU LEARNED</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel className="bg-[#060a14] border-slate-800/60 hover:border-violet-900/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-violet-950/30 text-violet-400 border border-violet-900/50">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 mb-1">01</div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-2">DEFENSE LAYERS MATTER</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One security control can change the outcome of a simulated attack path.
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="bg-[#060a14] border-slate-800/60 hover:border-violet-900/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-violet-950/30 text-violet-400 border border-violet-900/50">
              <Network size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 mb-1">02</div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-2">ATTACK PATHS ARE CONNECTED</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A weakness in one stage can create a path toward another asset.
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="bg-[#060a14] border-slate-800/60 hover:border-violet-900/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-violet-950/30 text-violet-400 border border-violet-900/50">
              <RefreshCw size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 mb-1">03</div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-2">SECURITY IS A PROCESS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Changing defensive controls and testing again helps reveal how protection changes outcomes.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
