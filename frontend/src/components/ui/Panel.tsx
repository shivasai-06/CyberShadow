import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function Panel({ children, className = '', noPadding = false, ...props }: PanelProps) {
  return (
    <div 
      className={`bg-[#0b1120] border border-slate-800/80 rounded-lg shadow-sm ${noPadding ? '' : 'p-5 md:p-6'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
