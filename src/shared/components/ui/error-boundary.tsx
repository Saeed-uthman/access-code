import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-red-500" />
          <h3 className="text-lg font-semibold text-red-800">Something went wrong</h3>
          <p className="mt-1 max-w-md text-sm text-red-600">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button variant="danger" size="sm" onClick={this.reset} className="mt-4">
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
