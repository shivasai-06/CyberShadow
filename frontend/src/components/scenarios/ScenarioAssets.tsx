import type { ScenarioAsset } from '../../types/scenarios';
import { Button } from '../ui/Button';
import { MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScenarioAssetsProps {
  assets: ScenarioAsset[];
}

export function ScenarioAssets({ assets }: ScenarioAssetsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#060a14] p-5 rounded-lg border border-slate-800/80 h-full flex flex-col">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">AFFECTED ASSETS</h4>
      
      <div className="flex flex-wrap gap-2 mb-6 flex-1">
        {assets.map((asset, i) => (
          <div key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-bold text-slate-300 uppercase tracking-wide">
            {asset.name}
          </div>
        ))}
      </div>
      
      <Button variant="secondary" onClick={() => navigate('/digital-twin')} className="w-full text-[10px] uppercase tracking-widest gap-2 justify-center border-slate-700">
        <MonitorPlay size={14} className="text-cyan-500" /> VIEW IN DIGITAL TWIN
      </Button>
    </div>
  );
}
