import React from 'react';
import { Panel } from './Panel';
import { StatusBadge } from './StatusBadge';

interface SecurityControlCardProps {
  name: string;
  status: 'ON' | 'OFF' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  icon?: React.ReactNode;
}

export function SecurityControlCard({ name, status, category, icon }: SecurityControlCardProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'ON':
      case 'HIGH':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'OFF':
      case 'LOW':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Panel className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {icon && <div className="p-2 bg-gray-800 rounded-lg text-gray-400">{icon}</div>}
        <div>
          <p className="font-medium text-gray-200">{name}</p>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
      </div>
      <StatusBadge status={getStatusColor(status)} label={status} />
    </Panel>
  );
}
