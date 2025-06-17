
import { AuthError } from "@supabase/supabase-js";

/**
 * Trata erros específicos do Supabase Auth
 * @param error - Erro do Supabase
 * @returns Mensagem de erro user-friendly
 */
export function handleAuthError(error: AuthError): string {
  const errorMap: Record<string, string> = {
    'User already registered': 'Este email já está cadastrado. Tente fazer login ou usar outro email.',
    'Invalid email': 'Email inválido. Verifique o formato e tente novamente.',
    'Password should be at least 6 characters': 'Senha não atende aos critérios de segurança.',
    'Signup is disabled': 'Cadastros estão temporariamente desabilitados.',
    'Email rate limit exceeded': 'Muitas tentativas de cadastro. Aguarde alguns minutos.',
    'Captcha verification failed': 'Falha na verificação de segurança. Tente novamente.',
  };

  // Busca por correspondência parcial na mensagem
  for (const [key, message] of Object.entries(errorMap)) {
    if (error.message.includes(key)) {
      return message;
    }
  }

  // Tratamento genérico baseado no status
  if (error.status === 422) {
    return 'Dados inválidos. Verifique as informações e tente novamente.';
  }
  
  if (error.status === 429) {
    return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
  }

  return 'Erro no cadastro. Tente novamente em alguns minutos.';
}
