import { Panel } from '../ui/Panel';

const stages = [
  { id: 'INTRODUCED', label: '01', title: 'INTRODUCED', desc: 'Learn the concept' },
  { id: 'DEVELOPING', label: '02', title: 'DEVELOPING', desc: 'Build consistency' },
  { id: 'PRACTICING', label: '03', title: 'PRACTICING', desc: 'Apply decisions' },
  { id: 'CONFIDENT', label: '04', title: 'CONFIDENT', desc: 'Handle more complex scenarios' },
  { id: 'STRONG', label: '05', title: 'STRONG', desc: 'Continue advanced practice' },
];

export function MasteryProgression() {
  return (
    <Panel className="bg-[#060a14] border-slate-800/80 p-6 overflow-x-auto">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
        SIMULATED MASTERY PROGRESSION
      </h3>
      
      <div className="flex items-center justify-between min-w-[700px]">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="flex-1 flex flex-col items-center relative group">
            {/* Connecting Line */}
            {idx < stages.length - 1 && (
              <div className="absolute top-[28px] left-[50%] right-[-50%] h-0.5 bg-slate-800" />
            )}
            
            {/* Node */}
            <div className="w-14 h-14 rounded-full bg-[#0b1120] border-2 border-slate-700 flex items-center justify-center z-10 mb-4 transition-colors group-hover:border-cyan-500">
              <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-cyan-400">{stage.label}</span>
            </div>
            
            {/* Content */}
            <div className="text-center px-2">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{stage.title}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{stage.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
