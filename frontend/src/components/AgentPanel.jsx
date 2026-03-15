import React from 'react';
import { Bot, UserSquare2, ShieldAlert, Cpu } from 'lucide-react';

export default function AgentPanel({ title, type, content, active, loading }) {
  const isAxiom = type === 'axiom';
  
  return (
    <div className={`glass-panel h-full flex flex-col transition-all duration-300 ${active ? (isAxiom ? 'glow-red border-neon-red/50' : 'glow-blue border-neon-blue/50') : 'opacity-70'}`}>
      <div className={`p-3 border-b border-zinc-800 flex items-center justify-between ${isAxiom ? 'bg-red-950/20' : 'bg-blue-950/20'}`}>
        <div className="flex items-center text-white font-heading font-semibold">
          {isAxiom ? <Bot className="w-5 h-5 mr-2 text-neon-red" /> : <UserSquare2 className="w-5 h-5 mr-2 text-neon-blue" />}
          {title}
        </div>
        {loading && <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>}
      </div>

      <div className="flex-1 p-4 overflow-auto min-h-[150px] relative">
        {content ? (
          <div className="prose prose-invert prose-sm max-w-none">
            {typeof content === 'string' ? (
              <p className="text-zinc-300 whitespace-pre-wrap font-mono text-sm bg-black/30 p-3 rounded-lg border border-zinc-800/50">
                {content}
              </p>
            ) : (
              content
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <Cpu className="w-8 h-8 opacity-20" />
            <span className="text-xs font-mono">Agent Idle</span>
          </div>
        )}
      </div>
    </div>
  );
}
