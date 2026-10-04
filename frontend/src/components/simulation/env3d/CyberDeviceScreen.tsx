import { Html } from '@react-three/drei';

export interface CyberDeviceScreenProps {
  title: string;
  subtitle: string;
  isActive: boolean;
  status?: string;
  color: string;
  width?: string;
  height?: string;
  scale?: number;
  children: React.ReactNode;
}

export function CyberDeviceScreen({ 
  title, 
  subtitle, 
  isActive, 
  status = 'IDLE', 
  color,
  width = '800px',
  height = '480px',
  scale = 0.005,
  children 
}: CyberDeviceScreenProps) {
  return (
    <Html transform position={[0, 0, 0.01]} scale={scale} zIndexRange={[1, 10]} occlude="blending">
      <div 
        className={`bg-[#0b1120]/95 backdrop-blur-md rounded border flex flex-col overflow-hidden transition-all duration-500 
        ${isActive ? 'opacity-100' : 'opacity-60'} 
        ${isActive ? 'shadow-[0_0_40px_rgba(var(--glow-color),0.3)]' : ''}
        ${!isActive ? 'border-slate-800' : 'border-[var(--glow-color-solid)]'}
      `}
      style={{
        width,
        height,
        '--glow-color': color === '#8b5cf6' ? '139,92,246' : 
                        color === '#3b82f6' ? '59,130,246' : 
                        color === '#f59e0b' ? '245,158,11' : 
                        color === '#06b6d4' ? '6,182,212' : 
                        color === '#10b981' ? '16,185,129' : 
                        color === '#6366f1' ? '99,102,241' : 
                        color === '#ec4899' ? '236,72,153' : 
                        color === '#ef4444' ? '239,68,68' : '255,255,255',
        '--glow-color-solid': color
      } as React.CSSProperties}
      >
        {/* Header */}
        <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">{subtitle}</div>
            <div className="text-base font-bold tracking-widest text-white uppercase">{title}</div>
          </div>
          <div className="flex gap-3 items-center bg-[#02040a] px-4 py-2 rounded-lg border border-slate-800">
            <div className={`text-xs font-bold tracking-widest uppercase ${isActive ? (status === 'WARNING' || status === 'BLOCKED' ? 'text-amber-500 animate-pulse' : 'text-cyan-400 animate-pulse') : 'text-slate-600'}`}>{status}</div>
            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? (status === 'WARNING' || status === 'BLOCKED' ? 'bg-amber-500' : 'bg-cyan-500') : 'bg-slate-700'}`} />
          </div>
        </div>
        {/* Content Body */}
        <div className="flex-1 relative p-6 flex flex-col">
          {children}
        </div>
      </div>
    </Html>
  );
}
