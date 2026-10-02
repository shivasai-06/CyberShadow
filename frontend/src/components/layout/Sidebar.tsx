import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  MonitorPlay, 
  ShieldAlert, 
  TestTube2, 
  History, 
  FileText, 
  ShieldCheck, 
  Settings,
  Menu,
  X,
  Cpu,
  GraduationCap,
  Brain,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Digital Twin', path: '/digital-twin', icon: MonitorPlay },
  { name: 'Scenarios', path: '/scenarios', icon: ShieldAlert },
  { name: 'Learning Path', path: '/learning-path', icon: GraduationCap },
  { name: 'Simulation Lab', path: '/simulation', icon: TestTube2 },
  { name: 'History', path: '/history', icon: History },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Brain },
];

const secondaryNavItems = [
  { name: 'Security Center', path: '/security', icon: ShieldCheck },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-gray-900 rounded border border-gray-800 text-gray-400 hover:text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-[260px] flex-shrink-0 bg-[#060a14] border-r border-gray-800/80 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 pb-4 border-b border-gray-800/50">
          <div className="flex items-center gap-2.5 text-cyan-400 mb-1">
            <Cpu className="w-6 h-6" />
            <span className="text-[1.1rem] font-bold tracking-[0.1em] text-gray-100">CYBERSHADOW</span>
          </div>
          <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase ml-8">
            Digital Attack<br/>Simulation Twin
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all relative group
                ${isActive 
                  ? 'text-cyan-300 bg-gray-800/30' 
                  : 'text-gray-400 hover:bg-gray-900/40 hover:text-gray-200'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  )}
                  <item.icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400'} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="mt-8 mb-2 px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            System
          </div>
          
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all relative group
                ${isActive 
                  ? 'text-cyan-300 bg-gray-800/30' 
                  : 'text-gray-400 hover:bg-gray-900/40 hover:text-gray-200'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  )}
                  <item.icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400'} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Status Area */}
        <div className="p-5 border-t border-gray-800/50 bg-[#030712]">
          <div className="flex flex-col gap-4">
            
            {/* User Auth Status */}
            <div className="flex items-center justify-between">
              {user ? (
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-7 h-7 rounded bg-cyan-900/50 flex items-center justify-center flex-shrink-0 border border-cyan-800/50">
                    <User size={14} className="text-cyan-400" />
                  </div>
                  <div className="text-xs text-gray-400 truncate pr-2">
                    {user.email}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Guest Session
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-2">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded border border-gray-700/50 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={closeSidebar}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded border border-cyan-500/30 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <LogIn size={14} />
                  Sign In
                </NavLink>
              )}
            </div>

            <div className="h-px w-full bg-gray-800/50 my-1" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">SANDBOX ONLINE</div>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <ShieldAlert size={12} className="text-amber-500/70" />
                <div className="text-[10px] font-bold uppercase tracking-widest">SIMULATION ONLY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
