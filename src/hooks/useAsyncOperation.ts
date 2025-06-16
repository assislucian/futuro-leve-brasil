
import { useState, useCallback } from "react";
import { useErrorToast, useSuccessToast } from "./useToast";

interface AsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

/**
 * Hook para gerenciar operações assíncronas com estados consistentes
 * Fornece loading, error e success states automaticamente
 */
export function useAsyncOperation<T = any>(
  operation: () => Promise<T>,
  options: AsyncOperationOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const execute = useCallback(async (): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await operation();
      setData(result);
      
      if (options.showSuccessToast && options.successMessage) {
        successToast(options.successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : options.errorMessage || "Ocorreu um erro inesperado";
      
      setError(errorMessage);
      
      if (options.showErrorToast !== false) {
        errorToast(errorMessage);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [operation, options, successToast, errorToast]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    reset,
    isLoading,
    error,
    data,
    isSuccess: !isLoading && !error && data !== null,
  };
}
