import { useCyberShadow } from '../../contexts/CyberShadowContext';

export function ReportPracticeOutcomes() {
  const { securityPractices } = useCyberShadow();

  const completed = securityPractices.filter(p => p.status === 'COMPLETED');
  
  if (completed.length === 0) return null;

  const passed = completed.filter(p => p.result === 'PASSED');
  const needsPractice = completed.filter(p => p.result === 'NEEDS_PRACTICE');
  const skillsPracticed = new Set(completed.map(p => p.skillName)).size;

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">PRACTICE OUTCOMES</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Completed</div>
            <div className="text-3xl text-slate-200 font-light">{completed.length}</div>
          </div>
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Passed</div>
            <div className="text-3xl text-emerald-500 font-light">{passed.length}</div>
          </div>
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Needs Practice</div>
            <div className="text-3xl text-rose-500 font-light">{needsPractice.length}</div>
          </div>
          <div className="bg-[#060a14] border border-slate-800 rounded p-4 text-center">
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Skills Practiced</div>
            <div className="text-3xl text-teal-400 font-light">{skillsPracticed}</div>
          </div>
        </div>

        <div className="space-y-3">
          {completed.slice(-8).reverse().map(practice => (
            <div key={practice.id} className="p-3 bg-slate-900/30 border border-slate-800 rounded flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-slate-200 font-medium mb-1">{practice.title}</div>
                <div className="text-xs text-slate-400">{practice.skillName}</div>
              </div>
              <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border whitespace-nowrap ${
                practice.result === 'PASSED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' :
                'bg-rose-950/40 text-rose-400 border-rose-900/30'
              }`}>
                {practice.result?.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
