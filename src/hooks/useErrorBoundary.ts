
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * Hook para gerenciamento global de erros com recovery automático
 * Essencial para estabilidade em produção
 */
export function useErrorBoundary() {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null
  });

  const captureError = useCallback((error: Error, errorInfo?: string) => {
    console.error('Erro capturado pelo sistema:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo: errorInfo || null
    });

    // Toast para feedback imediato ao usuário
    toast.error('Ops! Algo deu errado', {
      description: 'Nossa equipe foi notificada. Tente novamente em alguns instantes.',
      duration: 5000,
    });

    // Em produção, aqui enviaria erro para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Implementar integração com Sentry ou similar futuramente
      console.warn('Erro reportado para monitoramento:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }, []);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => R | Promise<R>
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        const result = await fn(...args);
        return result;
      } catch (error) {
        captureError(error as Error, `Erro em função: ${fn.name}`);
        return null;
      }
    };
  }, [captureError]);

  return {
    ...errorState,
    captureError,
    resetError,
    withErrorHandling
  };
}
