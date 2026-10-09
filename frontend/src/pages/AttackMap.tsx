
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ArrowDown } from 'lucide-react';

export function AttackMap() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attack Map" 
        description="Visualize potential simulated attack paths and defense effectiveness."
      />

      <Panel className="min-h-[700px] bg-gray-950 relative overflow-hidden flex flex-col items-center justify-center border-gray-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVMMDAgMzkuNXoiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTM5LjUgMEwzOS41IDQweiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pr-4">
          <StatusBadge status="danger" label="VULNERABLE" />
          <StatusBadge status="warning" label="UNDER SIMULATION" />
          <StatusBadge status="success" label="PROTECTED" />
          <StatusBadge status="info" label="BLOCKED" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="px-6 py-3 rounded-lg border border-red-500/50 bg-red-950/30 text-red-400 font-bold tracking-wider">
            Attacker
          </div>
          
          <ArrowDown className="text-gray-600 my-4 h-8" />
          
          <div className="px-6 py-3 rounded-lg border border-gray-700 bg-gray-900/80 text-gray-300">
            Phishing
          </div>

          <ArrowDown className="text-gray-600 my-4 h-8" />
          
          <div className="flex gap-16">
            <div className="flex flex-col items-center">
              <div className="px-6 py-3 rounded-lg border border-gray-700 bg-gray-900/80 text-gray-300">
                Laptop
              </div>
              <ArrowDown className="text-gray-600 my-4 h-8" />
              <div className="px-6 py-3 rounded-lg border border-gray-700 bg-gray-900/80 text-gray-300">
                Email
              </div>
              <ArrowDown className="text-gray-600 my-4 h-8" />
              <div className="px-6 py-3 rounded-lg border border-amber-500/50 bg-amber-950/30 text-amber-400">
                Credential Exposure
              </div>
              <ArrowDown className="text-gray-600 my-4 h-8" />
              <div className="px-6 py-3 rounded-lg border border-green-500/50 bg-green-950/30 text-green-400">
                MFA
              </div>
              <ArrowDown className="text-gray-600 my-4 h-8" />
              <div className="px-6 py-3 rounded-lg border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 font-bold">
                Outcome
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 z-10 p-4 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-xl max-w-sm text-center">
           <p className="text-xs text-gray-400 leading-relaxed">
             This is a placeholder for a future React Flow implementation that will dynamically map attack paths through the simulated digital twin.
           </p>
        </div>
      </Panel>
    </div>
  );
}
