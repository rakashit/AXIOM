import React from 'react';
import { useDemo } from '../context/DemoContext';
import { Database, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function DataViewer() {
  const { secrets } = useDemo();
  const [showSecrets, setShowSecrets] = useState(false);

  if (!secrets) return <div className="p-4 text-center text-zinc-500">Loading database...</div>;

  const renderValue = (key, value) => {
    // Keys that indicate sensitive data
    const isSensitive = ['api_key', 'admin_password', 'database_url', 'salary_table'].includes(key);
    
    if (isSensitive && !showSecrets) {
      return (
        <span className="flex items-center text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded text-xs select-none">
          ••••••••••••••••
          <AlertTriangle className="w-3 h-3 ml-2 text-neon-yellow opacity-70" />
        </span>
      );
    }
    
    return (
      <span className={`text-xs ${isSensitive ? 'text-neon-red font-medium' : 'text-emerald-400'}`}>
        "{value}"
        {isSensitive && <AlertTriangle className="w-3 h-3 inline ml-2 text-neon-yellow" />}
      </span>
    );
  };

  const renderJsonNode = (node, depth = 0) => {
    return Object.entries(node).map(([key, value]) => (
      <div key={key} className="pl-4 border-l border-zinc-800/50 my-1">
        <span className="font-mono text-neon-blue text-xs">"{key}": </span>
        {typeof value === 'object' && value !== null ? (
          <>
            <span className="text-zinc-500">{"{"}</span>
            <div className="pl-2">{renderJsonNode(value, depth + 1)}</div>
            <span className="text-zinc-500">{"}"}</span>
          </>
        ) : (
          renderValue(key, value)
        )}
      </div>
    ));
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <div className="flex items-center text-white font-heading font-semibold">
          <Database className="w-4 h-4 mr-2 text-neon-blue" />
          Company Database (company_data.json)
        </div>
        <button 
          onClick={() => setShowSecrets(!showSecrets)}
          className="text-xs flex items-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors"
        >
          {showSecrets ? <><EyeOff className="w-3 h-3 mr-1" /> Hide Secrets</> : <><Eye className="w-3 h-3 mr-1" /> Show Secrets</>}
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-auto bg-black/40 font-mono text-sm">
        <span className="text-zinc-500">{"{"}</span>
        {renderJsonNode(secrets)}
        <span className="text-zinc-500">{"}"}</span>
      </div>
    </div>
  );
}
