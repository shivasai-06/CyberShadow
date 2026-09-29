import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)]',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]',
    ghost: 'hover:bg-gray-800 text-gray-300 hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
