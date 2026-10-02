import type { HistoryRecord } from '../../types/history';
import { Eye } from 'lucide-react';
import { Button } from '../ui/Button';

interface HistoryListProps {
  records: HistoryRecord[];
  onView: (id: string) => void;
}

export function HistoryList({ records, onView }: HistoryListProps) {
  if (records.length === 0) return null;

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060a14] border-b border-slate-800/80">
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SCENARIO</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">CATEGORY</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">RESULT</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">RISK</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">DATE</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {records.map(record => {
              const isBlocked = record.result === 'ATTACK BLOCKED' || record.result === 'DATA RECOVERED';
              return (
                <tr key={record.id} className="hover:bg-[#060a14] transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-wide">{record.scenarioName}</span>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 uppercase">Difficulty: {record.difficulty}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded">
                      {record.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                      isBlocked ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'
                    }`}>
                      {record.result}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      record.risk === 'LOW' ? 'text-green-400' :
                      record.risk === 'MEDIUM' ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {record.risk}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" onClick={() => onView(record.id)} className="text-[10px] uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={14} /> VIEW
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
