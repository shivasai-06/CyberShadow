import { Html } from '@react-three/drei';
import React from 'react';

export interface HolographicDisplayProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  width?: string;
  height?: string;
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
  color?: string;
  glow?: boolean;
}

export function HolographicDisplay({
  position,
  rotation = [0, 0, 0],
  scale = 0.005, // Standard mapping 1000px = 5 units
  width = '800px',
  height = '600px',
  title,
  children,
  isActive = false,
  color = '#0ea5e9',
  glow = false
}: HolographicDisplayProps) {
  
  const rgb = hexToRgb(color);
  const glowShadow = glow || isActive ? `0 0 30px rgba(${rgb}, 0.4), inset 0 0 20px rgba(${rgb}, 0.2)` : 'none';
  const borderColor = isActive ? color : `rgba(${rgb}, 0.3)`;

  console.log("Rendering HolographicDisplay:", title, "at position:", position);

  return (
    <group position={position} rotation={rotation}>
      <Html transform center position={[0, 0, 0]} zIndexRange={[100, 0]} scale={scale}>
        <div 
          className={`flex flex-col relative overflow-hidden transition-all duration-500 rounded-xl`}
        style={{
            width,
            height,
            backgroundColor: 'rgba(15, 23, 42, 0.85)', // solid darker blue
            border: `2px solid ${borderColor}`,
            boxShadow: glowShadow,
          }}
        >
          {/* Subtle animated scanline / glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div 
            className="flex items-center px-6 py-3 border-b"
            style={{ 
              borderColor: `rgba(${rgb}, 0.2)`,
              backgroundColor: `rgba(${rgb}, 0.05)`
            }}
          >
            <div className="flex-1 text-xs font-bold tracking-[0.2em] uppercase" style={{ color }}>
              {title}
            </div>
            {isActive && (
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                 <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color }}>ACTIVE</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 relative p-6 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </Html>
    </group>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  if (h.length === 3) return `${parseInt(h[0]+h[0],16)}, ${parseInt(h[1]+h[1],16)}, ${parseInt(h[2]+h[2],16)}`;
  if (h.length === 6) return `${parseInt(h.substring(0,2),16)}, ${parseInt(h.substring(2,4),16)}, ${parseInt(h.substring(4,6),16)}`;
  return '255, 255, 255';
}
