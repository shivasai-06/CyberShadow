import type { TwinAsset, TwinAssetStatus } from '../../types/digital-twin';
import { Laptop, Smartphone, Mail, Cloud, User, Server } from 'lucide-react';

interface DigitalTwinNodeProps {
  asset: TwinAsset;
  isSelected: boolean;
  onClick: () => void;
  isCentral?: boolean;
}

export function DigitalTwinNode({ asset, isSelected, onClick, isCentral = false }: DigitalTwinNodeProps) {
  const getIcon = () => {
    switch (asset.name.toUpperCase()) {
      case 'LAPTOP': return <Laptop size={isCentral ? 24 : 16} />;
      case 'SMARTPHONE': return <Smartphone size={isCentral ? 24 : 16} />;
      case 'EMAIL': return <Mail size={isCentral ? 24 : 16} />;
      case 'CLOUD STORAGE': return <Cloud size={isCentral ? 24 : 16} />;
      case 'ALEX VANCE': return <User size={isCentral ? 24 : 16} />;
      default: return <Server size={isCentral ? 24 : 16} />;
    }
  };

  const getStatusColor = (status: TwinAssetStatus) => {
    switch (status) {
      case 'PROTECTED': return 'bg-green-500 text-green-400';
      case 'MONITORED': return 'bg-amber-500 text-amber-400';
      case 'EXPOSED': return 'bg-red-500 text-red-400';
      default: return 'bg-slate-500 text-slate-400';
    }
  };

  const statusColorObj = getStatusColor(asset.status);
  const statusDot = statusColorObj.split(' ')[0];
  const statusText = statusColorObj.split(' ')[1];

  if (isCentral) {
    return (
      <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all
          ${isSelected 
            ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
            : 'bg-[#060a14] border-cyan-900/40 hover:border-cyan-700/60 hover:bg-[#0a101f]'}
        `}
      >
        <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-900/50">
          {getIcon()}
        </div>
        <div className="text-center">
          <h3 className="text-white font-bold tracking-wide">{asset.name}</h3>
          <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mt-1">SYNTHETIC IDENTITY</p>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">DIGITAL PRESENCE</p>
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all w-48
        ${isSelected 
          ? 'bg-slate-800/60 border-slate-600 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
          : 'bg-[#0b1120] border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'}
      `}
    >
      <div className={`p-2 rounded bg-slate-900 border border-slate-800 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold text-slate-200 truncate">{asset.name}</h3>
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">{asset.type}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          <span className={`text-[9px] font-bold tracking-widest uppercase ${statusText}`}>
            {asset.status}
          </span>
        </div>
      </div>
    </button>
  );
}
