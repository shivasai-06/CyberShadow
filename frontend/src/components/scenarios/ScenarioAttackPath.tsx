import { ArrowDown } from 'lucide-react';

interface ScenarioAttackPathProps {
  path: string[];
}

export function ScenarioAttackPath({ path }: ScenarioAttackPathProps) {
  return (
    <div className="bg-[#060a14] p-6 rounded-lg border border-slate-800/80 flex flex-col items-center">
      {path.map((node, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="px-4 py-2 bg-[#0b1120] border border-slate-700 rounded text-xs font-bold text-slate-300 tracking-wide uppercase min-w-[200px] text-center shadow-sm">
            {node}
          </div>
          {idx < path.length - 1 && (
            <ArrowDown size={16} className="my-2 text-slate-600" />
          )}
        </div>
      ))}
    </div>
  );
}
