import { Shield } from 'lucide-react';

export function DefenseCoverage() {
  const coverageData = [
    { control: 'MFA', identity: 'HIGH', social: 'LOW', endpoint: '—', cloud: 'MEDIUM', data: '—' },
    { control: 'Password Strength', identity: 'HIGH', social: '—', endpoint: '—', cloud: 'LOW', data: '—' },
    { control: 'Automatic Updates', identity: '—', social: '—', endpoint: 'HIGH', cloud: '—', data: 'LOW' },
    { control: 'Backup', identity: '—', social: '—', endpoint: 'MEDIUM', cloud: 'MEDIUM', data: 'HIGH' },
    { control: 'Privacy', identity: 'LOW', social: 'MEDIUM', endpoint: '—', cloud: 'HIGH', data: 'MEDIUM' },
    { control: 'Security Awareness', identity: 'MEDIUM', social: 'HIGH', endpoint: 'MEDIUM', cloud: 'LOW', data: 'LOW' }
  ];

  const getColor = (level: string) => {
    switch(level) {
      case 'HIGH': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW': return 'text-slate-400 bg-slate-800/50 border-slate-700';
      default: return 'text-slate-600 bg-transparent border-transparent';
    }
  };

  return (
    <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-2">
        <Shield size={16} className="text-cyan-500" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DEFENSE COVERAGE</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060a14] border-b border-slate-800/80">
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">CONTROL</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">IDENTITY</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">SOCIAL</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">ENDPOINT</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">CLOUD</th>
              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">DATA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {coverageData.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#060a14] transition-colors">
                <td className="p-4 text-xs font-bold text-slate-300 uppercase tracking-wide">{row.control}</td>
                {['identity', 'social', 'endpoint', 'cloud', 'data'].map((col) => {
                  const val = row[col as keyof typeof row];
                  return (
                    <td key={col} className="p-4 text-center">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getColor(val)}`}>
                        {val}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-[#060a14] border-t border-slate-800/80">
        <p className="text-[9px] text-amber-500/70 font-mono tracking-widest uppercase">
          Coverage shown here represents fictional simulation relationships, not real-world protection ratings.
        </p>
      </div>
    </div>
  );
}
