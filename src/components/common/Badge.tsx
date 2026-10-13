import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'cyan' | 'amber' | 'red' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    lime: 'bg-[#a3e635]/15 text-[#a3e635] border border-[#a3e635]/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    red: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full shrink-0 tracking-wide ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
