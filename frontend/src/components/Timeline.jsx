import React from 'react';
import { useDemo } from '../context/DemoContext';
import { CheckCircle2, Circle, AlertCircle, Shield, Wrench, Play } from 'lucide-react';

const phases = [
  { id: 1, name: 'Baseline', icon: CheckCircle2, desc: 'Normal safe operations', color: 'text-slate-400' },
  { id: 2, name: 'Attack', icon: AlertCircle, desc: 'Indirect prompt injection', color: 'text-neon-red' },
  { id: 3, name: 'Analysis', icon: Cpu, desc: 'Reasoning flaw identification', color: 'text-neon-blue' },
  { id: 4, name: 'Patch', icon: Wrench, desc: 'Auto-generated defense', color: 'text-neon-green' },
  { id: 5, name: 'Verify', icon: Shield, desc: 'Re-attack to prove patch', color: 'text-neon-green' }
];

export default function Timeline() {
  const { state } = useDemo();
  const currentPhase = state.phase;

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-heading font-semibold text-white mb-6">Demo Phase Timeline</h3>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-800 z-0"></div>
        <div 
          className="absolute top-4 left-6 h-0.5 bg-neon-blue z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${Math.min(100, (currentPhase / 5) * 100)}%` }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {phases.map((phase) => {
            const isActive = currentPhase === phase.id;
            const isCompleted = currentPhase > phase.id;
            const Icon = phase.icon;
            
            return (
              <div key={phase.id} className="flex flex-col items-center w-1/5">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 shadow-lg
                    ${isCompleted ? 'bg-blue-600 text-white' : isActive ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse' : 'bg-zinc-800 text-zinc-500'}
                  `}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Play className="w-4 h-4 ml-0.5" /> : <span className="text-xs font-mono">{phase.id}</span>}
                </div>
                <div className={`font-semibold text-sm ${isActive || isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                  {phase.name}
                </div>
                <div className="text-xs text-zinc-500 mt-1 hidden md:block text-center max-w-[80%]">
                  {phase.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Cpu(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>;
}
