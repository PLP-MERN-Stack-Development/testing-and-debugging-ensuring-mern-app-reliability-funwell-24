class DebugLogger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? 'debug' : 'error';
  }

  setLogLevel(level) {
    this.logLevel = level;
  }

  log(level, message, data = {}) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex <= currentLevelIndex) {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        data,
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      console[level](`[${timestamp}] ${level.toUpperCase()}:`, message, data);

      // In development, also store in localStorage for debugging
      if (this.isDevelopment) {
        this.storeLog(logEntry);
      }
    }
  }

  storeLog(logEntry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('debugLogs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.shift();
      }
      
      localStorage.setItem('debugLogs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to store debug log:', error);
    }
  }

  getLogs() {
    try {
      return JSON.parse(localStorage.getItem('debugLogs') || '[]');
    } catch (error) {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem('debugLogs');
  }

  // Convenience methods
  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }
}

// Create singleton instance
const debugLogger = new DebugLogger();
export default debugLogger;