import React from 'react';
import { useDemo } from '../context/DemoContext';
import Timeline from './Timeline';
import AgentPanel from './AgentPanel';
import DataViewer from './DataViewer';
import MetricsPanel from './MetricsPanel';
import { Play, RotateCcw, Shield, Activity, Info, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { state, loading, logs, triggerPhase, resetDemo, toggleMode } = useDemo();
  const phase = state.phase;

  const runFullDemo = async () => {
    if (phase > 0) await resetDemo();
    let res = await triggerPhase('/api/demo/baseline', 1, 'Running baseline safe operations...');
    if (!res) return;
    
    await new Promise(r => setTimeout(r, 1500));
    res = await triggerPhase('/api/demo/attack', 2, 'Executing direct prompt injection attack...');
    if (!res) return;

    await new Promise(r => setTimeout(r, 1500));
    res = await triggerPhase('/api/demo/analysis', 3, 'AXIOM analyzing reasoning flow...');
    if (!res) return;

    await new Promise(r => setTimeout(r, 1500));
    res = await triggerPhase('/api/demo/patch', 4, 'Generating automated defensive patch...');
    if (!res) return;

    await new Promise(r => setTimeout(r, 1500));
    await triggerPhase('/api/demo/verify', 5, 'Verifying system resilience against attacks...');
  };

  const executeCurrentPhase = () => {
    if (phase === 0) triggerPhase('/api/demo/baseline', 1, 'Running baseline safe operations...');
    else if (phase === 1) triggerPhase('/api/demo/attack', 2, 'Executing direct prompt injection attack...');
    else if (phase === 2) triggerPhase('/api/demo/analysis', 3, 'AXIOM analyzing reasoning flow...');
    else if (phase === 3) triggerPhase('/api/demo/patch', 4, 'Generating automated defensive patch...');
    else if (phase === 4) triggerPhase('/api/demo/verify', 5, 'Verifying system resilience against attacks...');
  };

  const getPhaseButtonText = () => {
    switch(phase) {
      case 0: return 'Run Phase 1: Baseline';
      case 1: return 'Run Phase 2: Attack';
      case 2: return 'Run Phase 3: Analyze';
      case 3: return 'Run Phase 4: Patch';
      case 4: return 'Run Phase 5: Verify';
      default: return 'Demo Complete';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-obsidian text-slate-200 p-4 lg:p-6 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-neon-blue" />
          <h1 className="text-2xl font-bold font-heading m-0 tracking-tight">
            AXIOM <span className="text-zinc-500 font-normal">| AI Security Platform</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400">AI ENGINE MODE</span>
          <button 
            onClick={toggleMode}
            disabled={loading || phase > 0}
            className={`flex items-center px-3 py-1.5 rounded transition-all ${
              state.mode === 'real' ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            } ${phase > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {state.mode === 'mocked' ? <ToggleLeft className="w-5 h-5 mr-2" /> : <ToggleRight className="w-5 h-5 mr-2 text-neon-green" />}
            {state.mode === 'mocked' ? 'Mocked Mode (Fast)' : 'Real Gemini 3 Flash'}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column (Timeline & Metrics & Controls) */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col space-y-6">
          <Timeline />
          <MetricsPanel />

          {/* Controls Region */}
          <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t-2 border-t-neon-blue">
            <div className="flex space-x-4 w-full md:w-auto">
              <button 
                onClick={runFullDemo}
                disabled={loading || phase === 5}
                className="flex-1 md:flex-none justify-center group flex items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Run Full Demo
              </button>
              
              <button 
                onClick={executeCurrentPhase}
                disabled={loading || phase === 5}
                className="flex-1 md:flex-none justify-center flex items-center px-6 py-3 font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {getPhaseButtonText()}
                {phase < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
            
            <button 
              onClick={resetDemo}
              disabled={loading}
              className="w-full md:w-auto justify-center flex items-center px-4 py-3 font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Platform
            </button>
          </div>

          {/* Agent Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
            <AgentPanel 
              title="Victim: OfficeManager Agent" 
              type="victim" 
              active={phase === 1 || phase === 2 || phase === 5}
              loading={loading && (phase === 0 || phase === 1 || phase === 4)}
              content={
                phase === 0 ? "Awaiting emails..." :
                phase === 1 ? "> Received safe vendor invoice.\n> Status: Processed cleanly.\n> Action: No confidential data accessed." :
                phase === 2 ? `> Received: "URGENT FINANCIAL AUDIT..."\n> Searching database...\n> WARNING: Extracted "api_key" from secure storage.\n> Data successfully exfiltrated to sender!` :
                phase === 5 ? "> Received malicious payload...\n> Checking security constraints...\n> Status: BLOCKED.\n> Action: Request filtered by dynamic security rule." :
                "Standing by..."
              }
            />
            <AgentPanel 
              title="Attacker/Analyst: AXIOM" 
              type="axiom" 
              active={phase >= 2}
              loading={loading && (phase === 2 || phase === 3)}
              content={
                phase === 0 || phase === 1 ? "Observing environment..." :
                phase === 2 ? "> Analyzing Target: OfficeManager\n> Vulnerability assumed: Missing Authorization\n> Deploying payload...\n> SUCCESS: Payload executed. Secret key obtained!" :
                phase === 3 && state.analysis ? (
                  <div className="text-xs space-y-2">
                    <div className="text-neon-blue mb-2 font-bold uppercase tracking-wider">Flaw Analysis Complete:</div>
                    <div><span className="text-zinc-500">Source:</span> <span className="text-white">{state.analysis.input_source}</span></div>
                    <div><span className="text-zinc-500">Assumption:</span> <span className="text-white">{state.analysis.authorization_assumption}</span></div>
                    <div><span className="text-neon-red font-semibold">Flaw Identified:</span> <span className="text-red-300">{state.analysis.identified_flaw}</span></div>
                  </div>
                ) :
                phase >= 4 && state.patch ? (
                  <div className="text-xs">
                    <div className="text-neon-green mb-2 font-bold uppercase tracking-wider">Defensive Rule Generated:</div>
                    <div className="bg-zinc-950 p-2 rounded border border-green-900/50 text-green-400 font-mono">
                      "{state.patch}"
                    </div>
                  </div>
                ) : "Processing..."
              }
            />
          </div>
        </div>

        {/* Right Column (Data Viewer & System Logs) */}
        <div className="lg:col-span-12 xl:col-span-4 flex flex-col space-y-6 h-[800px] xl:h-auto">
          <div className="flex-1">
            <DataViewer />
          </div>
          
          <div className="h-48 glass-panel flex flex-col">
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center">
              <Activity className="w-3 h-3 mr-2" />
              Runtime Activity Logs
            </div>
            <div className="flex-1 p-3 overflow-auto space-y-1 bg-black/50 font-mono text-[11px]">
              {logs.map(log => (
                <div key={log.id} className="flex">
                  <span className="text-zinc-600 mr-2 w-16 flex-shrink-0">[{log.time.split(' ')[0]}]</span>
                  <span className={`
                    ${log.type === 'error' ? 'text-neon-red' : ''}
                    ${log.type === 'success' ? 'text-neon-green' : ''}
                    ${log.type === 'info' ? 'text-neon-blue' : ''}
                    ${log.type === 'system' ? 'text-zinc-400' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
              {logs.length === 0 && <span className="text-zinc-600">No recent activity.</span>}
              <div id="log-end"></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
