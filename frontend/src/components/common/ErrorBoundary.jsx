import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-4">
              An unexpected error occurred. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
            {this.state.error && (
              <pre className="mt-4 text-left text-sm text-red-500 overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;