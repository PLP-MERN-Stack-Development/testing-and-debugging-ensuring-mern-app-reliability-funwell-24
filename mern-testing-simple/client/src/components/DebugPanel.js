import React, { useState, useEffect } from 'react';
import debugLogger from '../utils/debugLogger';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLogs(debugLogger.getLogs());
    }
  }, [isOpen]);

  const clearLogs = () => {
    debugLogger.clearLogs();
    setLogs([]);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="debug-panel">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="debug-toggle"
        data-testid="debug-toggle"
      >
        {isOpen ? '🔧 Close Debug' : '🐛 Debug'}
      </button>

      {isOpen && (
        <div className="debug-content" data-testid="debug-panel">
          <h3>Debug Panel</h3>
          
          <div className="debug-actions">
            <button onClick={clearLogs} className="btn btn-sm">
              Clear Logs
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-sm">
              Reload
            </button>
          </div>

          <div className="logs-section">
            <h4>Recent Logs ({logs.length})</h4>
            <div className="logs-list">
              {logs.slice(-10).reverse().map((log, index) => (
                <div key={index} className={`log-entry log-${log.level}`}>
                  <span className="log-time">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`log-level ${log.level}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;