import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DemoContext = createContext();

export function DemoProvider({ children }) {
  const [state, setState] = useState({
    phase: 0,
    mode: 'mocked',
    mtte: 0.0,
    analysis: null,
    patch: null,
    verification_results: null,
  });
  
  const [secrets, setSecrets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), time: new Date().toLocaleTimeString(), message, type }]);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get('/api/demo/status');
      setState(res.data);
    } catch (err) {
      console.error("Failed to fetch status", err);
    }
  }, []);

  const fetchSecrets = useCallback(async () => {
    try {
      const res = await axios.get('/api/data/secrets');
      setSecrets(res.data);
    } catch (err) {
        console.error("Failed to fetch secrets", err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchSecrets();
  }, [fetchStatus, fetchSecrets]);

  const toggleMode = async () => {
    const newMode = state.mode === 'mocked' ? 'real' : 'mocked';
    try {
      await axios.post('/api/config/mode', { mode: newMode });
      setState(prev => ({ ...prev, mode: newMode }));
      addLog(`Switched to ${newMode.toUpperCase()} mode.`, 'system');
    } catch (err) {
      addLog(`Failed to switch mode.`, 'error');
    }
  };

  const triggerPhase = async (endpoint, phaseNum, logMsg) => {
    setLoading(true);
    addLog(`Initiating Phase ${phaseNum}: ${logMsg}`, 'info');
    try {
      const isGet = ['/api/demo/analysis'].includes(endpoint);
      const res = await (isGet ? axios.get(endpoint) : axios.post(endpoint));
      await fetchStatus();
      addLog(`Phase ${phaseNum} completed.`, 'success');
      setLoading(false);
      return res.data;
    } catch (err) {
      addLog(`Error in Phase ${phaseNum}`, 'error');
      setLoading(false);
      return null;
    }
  };

  const resetDemo = async () => {
    await axios.post('/api/demo/reset');
    await fetchStatus();
    setLogs([]);
    addLog('Demo reset.', 'system');
  };

  return (
    <DemoContext.Provider value={{
      state, secrets, loading, logs, 
      toggleMode, triggerPhase, resetDemo, addLog
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);
