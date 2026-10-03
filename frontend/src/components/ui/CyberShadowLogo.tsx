import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showWordmark?: boolean;
  animated?: boolean;
  interactive?: boolean;
}

export function CyberShadowLogo({ 
  className = '', 
  size = 'md', 
  showWordmark = true,
  animated = false,
  interactive = false
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
    '2xl': 'text-5xl md:text-7xl'
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!interactive || prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, prefersReducedMotion]);

  const style = interactive && !prefersReducedMotion ? {
    transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
  } : {};

  return (
    <div 
      className={`flex flex-col items-center justify-center gap-4 transition-transform duration-300 ease-out ${className}`}
      style={style}
    >
      {animated && !prefersReducedMotion && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dashSpin {
            100% { transform: rotate(360deg); }
          }
          @keyframes drawPath {
            0% { stroke-dasharray: 0 400; opacity: 0; }
            100% { stroke-dasharray: 400 0; opacity: 1; }
          }
          @keyframes corePulse {
            0%, 100% { opacity: 0.5; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes wordmarkFade {
            0% { opacity: 0; transform: translateY(10px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes floatFragments {
            0% { opacity: 0; transform: scale(0.8) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-dash-spin { animation: dashSpin 25s linear infinite; transform-origin: center; }
          .animate-draw-path { animation: drawPath 2s ease-out forwards; }
          .animate-core-pulse { animation: corePulse 3s ease-in-out infinite; transform-origin: center; }
          .animate-wordmark { animation: wordmarkFade 1.5s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards; opacity: 0; }
          .animate-fragments { animation: floatFragments 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}} />
      )}

      <div className={`relative ${sizeClasses[size]} ${animated && !prefersReducedMotion ? 'animate-fragments' : ''}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" aria-label="CyberShadow Logo">
          {/* Shadow/Twin Layer */}
          <g transform="translate(50, 50)" className={animated && !prefersReducedMotion ? 'animate-dash-spin' : ''}>
            <path 
              d="M0 -40 L35 -25 L35 15 L0 40 L-35 15 L-35 -25 Z" 
              stroke="rgba(6,182,212,0.3)" 
              strokeWidth="1.5" 
              strokeDasharray="4 6" 
              transform="translate(4, 4)"
            />
          </g>
          
          {/* Primary Shield */}
          <path 
            d="M50 10 L85 25 L85 65 L50 90 L15 65 L15 25 Z" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinejoin="round"
            className={animated && !prefersReducedMotion ? 'animate-draw-path' : ''}
          />
          
          {/* Inner Core Shield */}
          <path 
            d="M50 28 L68 38 L68 58 L50 72 L32 58 L32 38 Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            opacity="0.6"
            className={animated && !prefersReducedMotion ? 'animate-draw-path' : ''}
            style={animated && !prefersReducedMotion ? { animationDelay: '0.5s', opacity: 0 } : {}}
          />
          
          {/* Digital Core */}
          <circle 
            cx="50" cy="50" r="5" 
            fill="currentColor"
            className={animated && !prefersReducedMotion ? 'animate-core-pulse' : ''}
          />
          
          {/* Connections */}
          <g className={animated && !prefersReducedMotion ? 'animate-draw-path' : ''} style={animated && !prefersReducedMotion ? { animationDelay: '1s', opacity: 0 } : {}}>
            <line x1="50" y1="10" x2="50" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <line x1="50" y1="72" x2="50" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <line x1="15" y1="25" x2="32" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <line x1="85" y1="25" x2="68" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          </g>
        </svg>
      </div>

      {showWordmark && (
        <span className={`${textClasses[size]} font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] ${animated && !prefersReducedMotion ? 'animate-wordmark' : ''}`}>
          CYBERSHADOW
        </span>
      )}
    </div>
  );
}
