import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-acm-cyan border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-slate-400 font-mono tracking-wide">{message}</p>
    </div>
  );
};
