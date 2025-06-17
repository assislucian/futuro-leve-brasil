
import { useState, useCallback } from "react";
import { AuthError } from "@supabase/supabase-js";

interface AuthErrorState {
  message: string;
  suggestion: string;
  severity: 'info' | 'warning' | 'error';
  action?: string;
}

/**
 * Hook especializado para tratamento inteligente de erros de autenticação
 * Fornece mensagens contextuais e sugestões baseadas no tipo de erro
 */
export function useAuthError() {
  const [errorState, setErrorState] = useState<AuthErrorState | null>(null);

  const parseAuthError = useCallback((error: AuthError | Error, context?: string): AuthErrorState => {
    const errorMsg = error.message?.toLowerCase() || "";
    
    // Erros de credenciais inválidas
    if (errorMsg.includes('invalid login credentials') || errorMsg.includes('invalid credentials')) {
      return {
        message: "Email ou senha incorretos",
        suggestion: "Verifique suas credenciais ou use 'Esqueci minha senha'",
        severity: 'warning',
        action: 'retry_or_reset'
      };
    }

    // Email não confirmado
    if (errorMsg.includes('email not confirmed') || errorMsg.includes('signup_disabled')) {
      return {
        message: "Email ainda não foi confirmado",
        suggestion: "Verifique sua caixa de entrada e spam",
        severity: 'info',
        action: 'confirm_email'
      };
    }

    // Rate limiting
    if (errorMsg.includes('too many requests') || errorMsg.includes('rate limit')) {
      return {
        message: "Muitas tentativas em pouco tempo",
        suggestion: "Aguarde alguns minutos antes de tentar novamente",
        severity: 'warning',
        action: 'wait'
      };
    }

    // Usuário não encontrado
    if (errorMsg.includes('user not found') || errorMsg.includes('user_not_found')) {
      return {
        message: "Conta não encontrada",
        suggestion: "Verifique o email ou crie uma nova conta",
        severity: 'info',
        action: 'signup'
      };
    }

    // Email já em uso
    if (errorMsg.includes('user already registered') || errorMsg.includes('already registered')) {
      return {
        message: "Este email já possui uma conta",
        suggestion: "Tente fazer login ou use outro email",
        severity: 'info',
        action: 'login'
      };
    }

    // Senha muito fraca
    if (errorMsg.includes('password') && (errorMsg.includes('weak') || errorMsg.includes('short'))) {
      return {
        message: "Senha não atende aos critérios de segurança",
        suggestion: "Use pelo menos 8 caracteres com letras, números e símbolos",
        severity: 'warning',
        action: 'improve_password'
      };
    }

    // Problemas de rede
    if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('timeout')) {
      return {
        message: "Problema de conexão",
        suggestion: "Verifique sua internet e tente novamente",
        severity: 'error',
        action: 'retry'
      };
    }

    // Erro genérico
    return {
      message: "Erro durante a autenticação",
      suggestion: "Tente novamente ou entre em contato se persistir",
      severity: 'error',
      action: 'contact_support'
    };
  }, []);

  const setError = useCallback((error: AuthError | Error, context?: string) => {
    const errorState = parseAuthError(error, context);
    setErrorState(errorState);
    
    // Auto-clear após 30 segundos para erros menos críticos
    if (errorState.severity !== 'error') {
      setTimeout(() => {
        setErrorState(null);
      }, 30000);
    }
  }, [parseAuthError]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    errorState,
    setError,
    clearError,
    hasError: !!errorState
  };
}
