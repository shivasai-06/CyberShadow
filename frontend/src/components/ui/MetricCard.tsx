import React from 'react';
import { Panel } from './Panel';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, description, trend, trendValue, icon }: MetricCardProps) {
  return (
    <Panel className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trendValue && (
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-400' : 
            trend === 'down' ? 'text-red-400' : 
            'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
          </span>
        )}
      </div>
      
      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}
    </Panel>
  );
}
