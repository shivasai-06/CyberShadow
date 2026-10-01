import { Panel } from '../ui/Panel';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ImpactLevel } from '../../types/simulation';

interface SimulationResultProps {
  result: string; // 'ATTACK BLOCKED', 'SIMULATED COMPROMISE', 'DATA RECOVERED', 'DATA LOSS'
  title: string;
  description: string;
  keyFactor: string;
  impactLevel?: ImpactLevel;
}

export function SimulationResult({ result, title, description, keyFactor, impactLevel }: SimulationResultProps) {
  const isBlocked = result === 'ATTACK BLOCKED' || result === 'DATA RECOVERED' || result === 'BLOCKED';

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-amber-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <Panel className={`border ${isBlocked ? 'border-green-500/30' : 'border-red-500/30'} flex flex-col md:flex-row gap-8 items-center overflow-hidden relative`}>
      <div className={`absolute top-0 right-0 p-8 opacity-5 pointer-events-none ${isBlocked ? 'text-green-500' : 'text-red-500'}`}>
        {isBlocked ? <ShieldCheck size={200} /> : <ShieldAlert size={200} />}
      </div>
      
      <div className="flex-1 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SIMULATION OUTCOME</div>
          {impactLevel && (
            <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-current ${getImpactColor(impactLevel)} bg-black/20`}>
              IMPACT: {impactLevel}
            </div>
          )}
        </div>
        <h2 className={`text-3xl font-bold tracking-tight mb-4 ${isBlocked ? 'text-green-400' : 'text-red-400'}`}>
          {title}
        </h2>
        <p className="text-slate-300 max-w-2xl text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className={`md:w-64 p-6 rounded-lg border flex flex-col items-center justify-center text-center z-10 bg-[#060a14] ${isBlocked ? 'border-green-900/50' : 'border-red-900/50'}`}>
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">
          {isBlocked ? 'DEFENSE CONTROL' : 'KEY FACTOR'}
        </div>
        <div className="text-sm font-bold text-white mb-2">{keyFactor}</div>
        <div className={`px-2 py-1 text-[9px] font-bold rounded uppercase tracking-widest ${
          isBlocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isBlocked ? 'PROTECTED' : 'UNPROTECTED'}
        </div>
      </div>
    </Panel>
  );
}
