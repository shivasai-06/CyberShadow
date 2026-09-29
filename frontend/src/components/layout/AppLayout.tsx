import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-[#030712] text-gray-100 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto relative flex flex-col bg-[#030712]">
        <TopBar />
        <div className="flex-1 p-6 md:p-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
