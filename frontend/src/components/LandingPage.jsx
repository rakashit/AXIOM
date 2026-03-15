import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
      
      <div className="max-w-3xl space-y-8 z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-blue blur-xl opacity-20 rounded-full"></div>
            <Shield className="w-24 h-24 text-neon-blue relative z-10" />
            <Cpu className="w-10 h-10 text-neon-green absolute -bottom-2 -right-2 z-20" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white m-0">
          AXIOM <span className="text-neon-blue">AI</span>
        </h1>
        
        <h2 className="text-xl md:text-2xl text-slate-400 font-medium">
          Adversarial X-agent Intelligence & Optimization Manager
        </h2>
        
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Watch an AI agent autonomously discover vulnerabilities, exploit them via prompt injection, 
          analyze the flaw, and generate defensive patches in real-time.
        </p>

        <div className="pt-8">
          <button 
            onClick={() => navigate('/demo')}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-heading rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 glow-blue"
          >
            Launch Demo Platform
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
