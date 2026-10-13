import React from 'react';

export const CardSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-[#0e141d] border border-[#1f2d3d] animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-slate-800"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="h-3 bg-slate-800/60 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-800/50 rounded w-full"></div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-[#1f2d3d] flex justify-between">
        <div className="h-4 bg-slate-800 rounded w-20"></div>
        <div className="h-4 bg-slate-800 rounded w-16"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="rounded-2xl border border-[#1f2d3d] bg-[#0e141d] overflow-hidden animate-pulse">
      <div className="p-4 border-b border-[#1f2d3d] bg-[#121924] flex gap-4">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
      </div>
      <div className="divide-y divide-[#1f2d3d]/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800/70 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800/70 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
