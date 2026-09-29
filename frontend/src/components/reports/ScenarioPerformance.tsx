import type { ScenarioPerformanceMetric } from '../../types/reports';
import { useNavigate } from 'react-router-dom';

interface ScenarioPerformanceProps {
  performance: ScenarioPerformanceMetric[];
}

export function ScenarioPerformance({ performance }: ScenarioPerformanceProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-slate-800/80">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SCENARIO PERFORMANCE</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060a14] border-b border-slate-800/80">
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SCENARIO</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">SIMULATIONS</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">BLOCKED</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">COMPROMISED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {performance.map((item, idx) => (
              <tr 
                key={idx} 
                onClick={() => navigate('/scenarios')}
                className="hover:bg-[#060a14] transition-colors cursor-pointer group"
              >
                <td className="p-4">
                  <span className="text-sm font-bold text-slate-300 tracking-wide group-hover:text-cyan-400 transition-colors">
                    {item.scenarioName}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm text-slate-400 font-mono">{item.simulations}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm text-green-400 font-mono">{item.blocked}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm text-red-400 font-mono">{item.compromised}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
