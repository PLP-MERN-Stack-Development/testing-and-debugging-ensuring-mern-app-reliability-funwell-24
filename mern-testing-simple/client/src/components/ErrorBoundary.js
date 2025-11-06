import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      componentStack: ''
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
      componentStack: errorInfo.componentStack
    });
    
    // Debugging: Log to console with details
    console.error('🚨 Error Boundary Caught:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
    
    // Debugging: Send to error tracking service (mock)
    this.sendErrorToService(error, errorInfo);
  }

  sendErrorToService = (error, errorInfo) => {
    // Mock error reporting service
    const errorReport = {
      type: 'react_error_boundary',
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Error reported to service:', errorReport);
    // In real app: send to Sentry, LogRocket, etc.
  };

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" data-testid="error-boundary">
          <h2>🚨 Something went wrong</h2>
          <div className="error-details">
            <h3>Error Details (Debugging Info):</h3>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            
            <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
              <summary>Component Stack (Click to expand)</summary>
              {this.state.componentStack}
            </details>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
                <summary>Full Error Stack (Development)</summary>
                {this.state.error && this.state.error.stack}
              </details>
            )}
          </div>
          
          <div className="debug-actions">
            <button onClick={this.handleReset} className="btn btn-primary">
              Try Again
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-secondary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;