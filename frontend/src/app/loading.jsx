import React from 'react';

export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse pb-12">
      
      <div className="space-y-2">
        <div className="h-6 w-48 bg-zinc-800 rounded-lg"></div>
        <div className="h-3 w-80 bg-zinc-800/60 rounded-md"></div>
      </div>

      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-6 space-y-6">
        
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-900">
          <div className="w-4 h-4 rounded bg-zinc-800"></div>
          <div className="h-4 w-32 bg-zinc-800 rounded"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-800 shrink-0"></div>
          
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-zinc-800 rounded"></div>
              <div className="h-10 w-full bg-zinc-800/50 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-zinc-800 rounded"></div>
              <div className="h-10 w-full bg-zinc-800/50 rounded-xl"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="h-3 w-28 bg-zinc-800 rounded"></div>
          <div className="h-10 w-full bg-zinc-800/50 rounded-xl"></div>
        </div>

      </div>

      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-6 space-y-4">
        <div className="h-4 w-40 bg-zinc-800 rounded"></div>
        <div className="h-20 w-full bg-zinc-800/30 rounded-xl"></div>
      </div>

    </div>
  );
}