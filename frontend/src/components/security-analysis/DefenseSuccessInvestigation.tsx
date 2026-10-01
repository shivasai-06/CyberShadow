import { CheckCircle2, ShieldCheck, BookOpen } from 'lucide-react';

interface DefenseSuccessInvestigationProps {
  positiveControls: string[];
  scenarioCategory: string;
  simulationResult: string;
}

export function DefenseSuccessInvestigation({ positiveControls, scenarioCategory, simulationResult }: DefenseSuccessInvestigationProps) {
  // Try to determine a skill based on category, simplified approach
  const skillReinforced = 
    scenarioCategory === 'SOCIAL ENGINEERING' ? 'Security Awareness / Phishing Defense' :
    scenarioCategory === 'IDENTITY SECURITY' ? 'Authentication Security' :
    scenarioCategory === 'ENDPOINT SECURITY' ? 'Endpoint Security' :
    scenarioCategory === 'CLOUD SECURITY' ? 'Cloud Privacy' :
    'Defensive Operations';

  return (
    <div className="border border-green-500/30 bg-[#060a14] rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-5 py-4 border-b border-green-500/30 bg-green-950/20 flex justify-between items-center">
        <div className="flex items-center gap-3 text-green-500">
          <ShieldCheck size={18} />
          <h3 className="font-bold tracking-wide uppercase">DEFENSE SUCCESS</h3>
        </div>
        <div className="px-2 py-1 rounded bg-black/40 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase">
          {simulationResult === 'DATA RECOVERED' ? 'DATA RECOVERED' : 'ATTACK BLOCKED'}
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-green-400" />
            <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
              {simulationResult === 'DATA RECOVERED' ? 'What Reduced The Impact' : 'What Stopped the Attack'}
            </h4>
          </div>
          <ul className="space-y-2">
            {positiveControls.map((pc, idx) => (
              <li key={idx} className="text-sm text-green-100/90 flex items-start gap-2 bg-green-950/20 border border-green-900/30 p-3 rounded">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                <span>{pc}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-violet-400" />
            <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Why It Matters</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {simulationResult === 'DATA RECOVERED' 
              ? 'Although the simulated attack successfully occurred, defense-in-depth relies on recovery controls (like backups) to restore compromised data, significantly reducing the permanent impact.' 
              : 'Defense-in-depth relies on these active controls to intercept threats before they can compromise critical assets. Proper configuration and quick decision-making directly prevent simulated data loss and account takeover.'}
          </p>
        </div>

        <div className="border-t border-slate-800/50 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0f1c] p-4 rounded border border-slate-800/80">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SKILL REINFORCED</div>
              <div className="text-sm font-bold text-white">{skillReinforced}</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">RECOMMENDED PRACTICE</div>
              <div className="text-sm text-cyan-400 font-medium">Continue applying these controls in future simulations.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
