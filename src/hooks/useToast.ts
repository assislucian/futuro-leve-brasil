
import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

/**
 * Hook centralizado para gerenciamento de notificações toast
 * Oferece uma API simples e consistente para toda a aplicação
 */
export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(({
    title,
    description,
    variant = "default",
    duration = 5000,
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
    };

    setState((prevState) => ({
      toasts: [...prevState.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        setState((prevState) => ({
          toasts: prevState.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return {
      id,
      dismiss: () => {
        setState((prevState) => ({
          toasts: prevState.toasts.filter((t) => t.id !== id),
        }));
      },
    };
  }, []);

  const dismiss = useCallback((toastId: string) => {
    setState((prevState) => ({
      toasts: prevState.toasts.filter((t) => t.id !== toastId),
    }));
  }, []);

  const dismissAll = useCallback(() => {
    setState({ toasts: [] });
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
    dismissAll,
  };
}

// Funções utilitárias para tipos específicos de toast
export const useSuccessToast = () => {
  const { toast } = useToast();
  return useCallback((description: string, title?: string) => 
    toast({ title, description, variant: "success" }), [toast]);
};

export const useErrorToast = () => {
  const { toast } = useToast();
  return useCallback((description: string, title?: string) => 
    toast({ title: title || "Erro", description, variant: "destructive" }), [toast]);
};

export const useWarningToast = () => {
  const { toast } = useToast();
  return useCallback((description: string, title?: string) => 
    toast({ title: title || "Atenção", description, variant: "warning" }), [toast]);
};
