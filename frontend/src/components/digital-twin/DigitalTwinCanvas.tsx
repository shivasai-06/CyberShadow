import type { TwinAsset } from '../../types/digital-twin';
import { DigitalTwinNode } from './DigitalTwinNode';

interface DigitalTwinCanvasProps {
  assets: TwinAsset[];
  selectedId: string | null;
  onSelectAsset: (id: string) => void;
}

export function DigitalTwinCanvas({ assets, selectedId, onSelectAsset }: DigitalTwinCanvasProps) {
  const getAsset = (name: string) => assets.find(a => a.name === name);
  
  const identity = getAsset('ALEX VANCE');
  const cloud = getAsset('CLOUD STORAGE');
  const email = getAsset('EMAIL');
  const laptop = getAsset('LAPTOP');
  const phone = getAsset('SMARTPHONE');
  const social = getAsset('SOCIAL ACCOUNT');

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-[#030712] rounded-lg border border-slate-800/80 overflow-x-auto overflow-y-hidden flex items-center justify-center custom-scrollbar">
      <div className="min-w-[700px] w-full h-full relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVMMDAgMzkuNXoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTM5LjUgMEwzOS41IDQweiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-30" />
      
      {/* SVG Connections Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* We will rely on absolute positioning for lines, assuming a fixed central coordinate layout */}
        {/* Center: 50%, 50% */}
        {/* Cloud: 50%, 15% */}
        <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
        {/* Email: 15%, 50% */}
        <line x1="50%" y1="50%" x2="20%" y2="50%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
        {/* Laptop: 85%, 50% */}
        <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
        {/* Phone: 50%, 75% */}
        <line x1="50%" y1="50%" x2="50%" y2="75%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
        {/* Social: 50%, 95% (From phone) */}
        <line x1="50%" y1="75%" x2="50%" y2="90%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      <div className="relative z-10 w-full h-full max-w-4xl mx-auto">
        {cloud && (
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2">
            <DigitalTwinNode asset={cloud} isSelected={selectedId === cloud.id} onClick={() => onSelectAsset(cloud.id)} />
          </div>
        )}
        
        {email && (
          <div className="absolute top-1/2 -translate-y-1/2 left-[5%]">
            <DigitalTwinNode asset={email} isSelected={selectedId === email.id} onClick={() => onSelectAsset(email.id)} />
          </div>
        )}

        {identity && (
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <DigitalTwinNode asset={identity} isSelected={selectedId === identity.id} onClick={() => onSelectAsset(identity.id)} isCentral />
          </div>
        )}

        {laptop && (
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%]">
            <DigitalTwinNode asset={laptop} isSelected={selectedId === laptop.id} onClick={() => onSelectAsset(laptop.id)} />
          </div>
        )}

        {phone && (
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2">
            <DigitalTwinNode asset={phone} isSelected={selectedId === phone.id} onClick={() => onSelectAsset(phone.id)} />
          </div>
        )}

        {social && (
          <div className="absolute top-[88%] left-1/2 -translate-x-1/2">
            <DigitalTwinNode asset={social} isSelected={selectedId === social.id} onClick={() => onSelectAsset(social.id)} />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <div className="px-2 py-1 bg-[#060a14] border border-slate-800 rounded text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          TOPOLOGY VIEW / 2D
        </div>
      </div>
      </div>
    </div>
  );
}
