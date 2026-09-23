"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

function DefaultCartErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Card className="mx-auto mt-10 max-w-md border border-[var(--shop-hairline)] bg-white p-6 shadow-none">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-[var(--shop-purple-wash)] p-3">
            <AlertTriangle className="h-6 w-6 text-[var(--shop-purple)]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-[var(--shop-ink)]">{t('cart.error.title')}</h3>
            <p className="text-sm text-[var(--shop-muted)]">{t('cart.error.description')}</p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-[var(--shop-muted)]">
                  {t('cart.error.details')}
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded-xl bg-[var(--shop-canvas-muted)] p-2 text-xs text-[var(--shop-ink)]">
                  {error.message}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button
              onClick={resetError}
              variant="outline"
              className="inline-flex h-11 min-h-11 flex-1 items-center justify-center rounded-full border border-[var(--shop-hairline)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--shop-ink)] hover:bg-[var(--shop-canvas-muted)]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('cart.error.retry')}
            </Button>
            <Button onClick={() => window.location.reload()} className={cn('flex-1', shopChrome.inkCta)}>
              {t('cart.error.reload')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CartErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface CartErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetError: () => void;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error boundary specifically designed for cart components
 * Handles cart-related errors gracefully and provides recovery options
 */
export class CartErrorBoundary extends React.Component<
  CartErrorBoundaryProps,
  CartErrorBoundaryState
> {
  constructor(props: CartErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<CartErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Cart Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Cart Error: ${error.message}`,
        fatal: false,
      });
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={this.resetError} 
          />
        );
      }

      return (
        <DefaultCartErrorFallback
          error={this.state.error!}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for cart error reporting
 */
export function useCartErrorReporting() {
  const reportError = React.useCallback((error: Error, context: string) => {
    console.error(`🛒 Cart Error (${context}):`, {
      error: error.message,
      context,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Report to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Cart ${context}: ${error.message}`,
        fatal: false,
      });
    }
  }, []);

  return { reportError };
}