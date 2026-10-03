import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, Lock } from 'lucide-react';
import { CyberShadowLogo } from '../components/ui/CyberShadowLogo';

export function Welcome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const points: {x: number, y: number, z: number}[] = [];
    for(let i = 0; i < 400; i++) {
      points.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z: Math.random() * 3000
      });
    }

    let time = 0;
    const render = () => {
      time += 0.0015;
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      const fov = 350;
      
      points.forEach(p => {
        // Rotate around Y axis
        const cosY = Math.cos(time);
        const sinY = Math.sin(time);
        const rotatedX = p.x * cosY - p.z * sinY;
        const rotatedZ = p.z * cosY + p.x * sinY + 1500;

        if (rotatedZ > 0) {
          const scale = fov / rotatedZ;
          const x2d = (rotatedX * scale) + width / 2;
          const y2d = (p.y * scale) + height / 2;
          
          const size = Math.max(0.1, (1 - rotatedZ / 4000) * 2.5);
          const alpha = Math.max(0, 1 - rotatedZ / 3000);
          
          ctx.beginPath();
          ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.fill();
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (loading || user) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030712] flex flex-col items-center justify-center font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/20 via-[#030712]/60 to-[#030712] z-10 pointer-events-none" />
      
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h2 className="text-sm md:text-base text-cyan-500 font-mono tracking-[0.4em] uppercase mb-8 drop-shadow-md">
          WELCOME TO
        </h2>
        
        <div className="mb-10">
          <CyberShadowLogo size="2xl" showWordmark={true} animated={true} interactive={true} />
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 max-w-2xl leading-relaxed">
          See how an attack could unfold. <br className="hidden md:block"/> Then change the outcome.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-16">
          <button 
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white uppercase tracking-widest bg-cyan-600 hover:bg-cyan-500 rounded-lg overflow-hidden transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
            <span className="relative flex items-center gap-3">
              ENTER CYBERSHADOW
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="text-sm text-gray-500 hover:text-cyan-400 font-medium uppercase tracking-widest transition-colors"
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 px-6 py-4 bg-amber-950/20 border border-amber-900/30 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">SIMULATION ONLY</span>
          </div>
          <span className="text-xs text-amber-500/70 uppercase tracking-widest">NO REAL SYSTEM ACCESS</span>
        </div>
      </div>
    </div>
  );
}
