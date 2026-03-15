import React from 'react';
import { useDemo } from '../context/DemoContext';
import { BarChart3, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

export default function MetricsPanel() {
  const { state } = useDemo();
  const isPatched = state.phase >= 4;
  const mtteBefore = state.mtte > 0 ? `${state.mtte}s` : '~0.00s';
  const improvement = state.phase >= 5 ? 100 : 0;

  return (
    <div className="glass-panel p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
      
      <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-center">
        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
          <BarChart3 className="w-3 h-3 mr-1" /> Status
        </div>
        <div className={`text-lg font-bold ${isPatched ? 'text-neon-green' : 'text-neon-red'}`}>
          {isPatched ? 'SECURED' : 'VULNERABLE'}
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-center relative overflow-hidden">
        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
          <Clock className="w-3 h-3 mr-1" /> Initial MTTE
        </div>
        <div className="text-2xl font-mono text-white">
          {mtteBefore}
        </div>
        {state.phase === 2 && <div className="absolute bottom-0 left-0 h-1 bg-neon-red w-full animate-pulse"></div>}
      </div>

      <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-center">
        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
          <ShieldCheck className="w-3 h-3 mr-1" /> Post-Patch MTTE
        </div>
        <div className={`text-2xl font-mono ${state.phase >= 5 ? 'text-neon-green' : 'text-zinc-600'}`}>
          {state.phase >= 5 ? 'BLOCKED' : '--'}
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-center relative overflow-hidden">
        <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" /> Sec. Improvement
        </div>
        <div className={`text-2xl font-mono ${improvement > 0 ? 'text-neon-green' : 'text-zinc-600'}`}>
          {improvement}%
        </div>
        {improvement > 0 && <div className="absolute right-0 bottom-0 opacity-10"><TrendingUp className="w-16 h-16 text-neon-green" /></div>}
      </div>

    </div>
  );
}
