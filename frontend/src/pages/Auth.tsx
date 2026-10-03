import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Key, Loader2, AlertCircle, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CyberShadowLogo } from '../components/ui/CyberShadowLogo';

export function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Cinematic Sequence State
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(prefersReducedMotion ? 3 : 0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 2500);
    const t3 = setTimeout(() => setPhase(3), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      z: Math.random() * 2 + 1
    }));

    let gridOffset = 0;

    const render = () => {
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, w, h);

      // Floor Grid
      gridOffset += 1;
      if (gridOffset > 40) gridOffset = 0;

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;

      // Horizontal grid lines (perspective)
      for (let i = 0; i < 40; i++) {
        const y = h / 2 + Math.pow(i, 1.4) * 3 + (gridOffset * Math.pow(i, 0.4));
        if (y > h / 2 && y < h) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // Vertical grid lines
      for (let i = -40; i < 40; i++) {
        const x = w / 2 + i * 60;
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(x + (x - w / 2) * 5, h);
        ctx.stroke();
      }

      // Nodes & Connecting Lines
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.z, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.globalAlpha = 1 - dist / 120;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [prefersReducedMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase!.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setSuccess('Registration successful. You can now sign in.');
        setIsSignUp(false);
        setPassword('');
      } else {
        const { error: signInError } = await supabase!.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (signInError) throw signInError;
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#02040a] flex flex-col items-center justify-center font-sans text-gray-100">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040a]/40 to-[#02040a] z-10 pointer-events-none" />

      {/* Safety Message */}
      <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-1 px-4 py-2 bg-amber-950/20 border border-amber-900/30 rounded backdrop-blur-md">
        <div className="flex items-center gap-2 text-amber-500">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] font-bold tracking-widest uppercase">SIMULATION ONLY</span>
        </div>
        <span className="text-[9px] text-amber-500/70 uppercase tracking-widest">NO REAL SYSTEM ACCESS</span>
      </div>

      {/* Intro Sequence (Phases 0, 1, 2) */}
      <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none ${phase < 3 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center justify-center gap-6" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}>
          <div className={`transition-all duration-1000 ${phase >= 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
            <CyberShadowLogo size="xl" showWordmark={true} animated={false} interactive={false} />
          </div>

          <div className={`transition-all duration-1000 delay-300 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-xs md:text-sm text-cyan-400 font-mono tracking-[0.2em] uppercase text-center border border-cyan-900/50 bg-cyan-950/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-sm">
              SECURE SIMULATION ENVIRONMENT
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400 font-mono tracking-[0.15em] uppercase mt-8 bg-gray-950/50 px-4 py-2 rounded">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
              AUTHENTICATION SYSTEM READY...
            </div>
          </div>
        </div>
      </div>

      {/* Login Form (Phase 3) */}
      <div
        className={`relative z-30 w-full max-w-[440px] px-6 transition-all duration-1000 transform ${phase === 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'}`}
        style={{ perspective: '1200px' }}
      >
        <div
          className="w-full p-8 bg-[#060a14]/70 backdrop-blur-xl border border-cyan-900/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-transform duration-300 ease-out pointer-events-auto"
          style={{ transform: `rotateX(${-mousePos.y * 0.4}deg) rotateY(${mousePos.x * 0.4}deg)` }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <CyberShadowLogo size="md" showWordmark={true} animated={false} interactive={false} />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-[0.15em] uppercase text-center mt-2">
              {isSignUp ? 'CREATE ACCOUNT' : 'ENTER SECURE ENVIRONMENT'}
            </h2>
            <p className="text-gray-400 text-xs mt-3 text-center tracking-wider max-w-[280px] font-mono">
              {isSignUp ? 'Register for simulation access' : 'Authenticate to access your digital security simulation environment.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-950/30 border border-green-900/50 rounded-lg flex items-start gap-3 backdrop-blur-sm">
              <Lock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest mb-2 font-mono">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-[#02040a]/80 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                  placeholder="operative@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest mb-2 font-mono">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-[#02040a]/80 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-[0.2em] mt-4 flex items-center justify-center uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSignUp ? (
                'REGISTER'
              ) : (
                'AUTHENTICATE'
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4 font-mono">OR</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1"></div>
          </div>

          <div className="mt-8">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold tracking-wider flex items-center justify-center border border-gray-700/50 hover:border-gray-500/50 transition-all backdrop-blur-sm"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  CONTINUE WITH GOOGLE
                </span>
              )}
            </Button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-[11px] text-gray-500 hover:text-cyan-400 transition-colors font-mono tracking-wide"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
