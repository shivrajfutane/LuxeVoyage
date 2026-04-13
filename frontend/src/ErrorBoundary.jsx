import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', backgroundColor: '#111', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ff5555' }}>Something went wrong.</h1>
          <p>Please send this error message to the developer:</p>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', overflow: 'auto', marginTop: '20px' }}>
            <h3 style={{ color: '#ffaaaa' }}>Error:</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error && this.state.error.toString()}</pre>
            <h3 style={{ color: '#ffaaaa', marginTop: '20px' }}>Component Stack:</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
