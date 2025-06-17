
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  signUpFormSchema, 
  SignUpFormData, 
  validatePasswordStrength,
  isValidEmail 
} from "@/lib/validators/signup";
import { AuthError } from "@supabase/supabase-js";

// Interface para estado do hook
interface UseSignUpFormState {
  isSubmitting: boolean;
  lastAttemptEmail: string | null;
}

// Interface para resultado do cadastro
interface SignUpResult {
  success: boolean;
  requiresEmailConfirmation: boolean;
  error?: string;
}

/**
 * Hook personalizado para gerenciar o formulário de cadastro
 * Fornece validação, submissão e tratamento de erros robusto
 */
export function useSignUpForm() {
  const navigate = useNavigate();
  const [state, setState] = useState<UseSignUpFormState>({
    isSubmitting: false,
    lastAttemptEmail: null
  });

  // Configuração do formulário com validação Zod
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange", // Validação em tempo real
  });

  /**
   * Trata erros específicos do Supabase Auth
   * @param error - Erro do Supabase
   * @returns Mensagem de erro user-friendly
   */
  const handleAuthError = (error: AuthError): string => {
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
  };

  /**
   * Executa o processo de cadastro
   * @param values - Dados do formulário
   * @returns Resultado do cadastro
   */
  const performSignUp = async (values: SignUpFormData): Promise<SignUpResult> => {
    try {
      // Gerar URL de redirecionamento segura
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/email-confirmation`;
      
      console.log('Iniciando cadastro para:', values.email);
      console.log('URL de redirecionamento:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        return {
          success: false,
          requiresEmailConfirmation: false,
          error: handleAuthError(error)
        };
      }

      if (data.user) {
        console.log('Usuário criado com sucesso:', data.user.email);
        
        // Armazenar email para possível reenvio de confirmação
        localStorage.setItem('pendingEmailConfirmation', values.email);
        
        return {
          success: true,
          requiresEmailConfirmation: !data.user.email_confirmed_at,
        };
      }

      return {
        success: false,
        requiresEmailConfirmation: false,
        error: 'Erro inesperado durante o cadastro.'
      };
      
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      return {
        success: false,
        requiresEmailConfirmation: false,
        error: 'Erro no sistema. Tente novamente em alguns minutos.'
      };
    }
  };

  /**
   * Handler principal do formulário
   * @param values - Dados validados do formulário
   */
  const onSubmit = async (values: SignUpFormData) => {
    // Prevenir múltiplas submissões
    if (state.isSubmitting) return;
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      console.log('Iniciando processo de cadastro...');
      
      // Validação adicional de email
      if (!isValidEmail(values.email)) {
        toast.error('Formato de email inválido. Verifique e tente novamente.');
        return;
      }
      
      // Validação rigorosa da senha
      const passwordValidation = validatePasswordStrength(values.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors[0]);
        return;
      }
      
      // Executar cadastro
      const result = await performSignUp(values);
      
      if (result.success) {
        // Sucesso - limpar formulário e redirecionar
        form.reset();
        setState(prev => ({ ...prev, lastAttemptEmail: values.email }));
        
        if (result.requiresEmailConfirmation) {
          toast.success(
            "Conta criada com sucesso! Verifique seu email para ativar a conta.", 
            { duration: 5000 }
          );
          navigate('/email-confirmation');
        } else {
          toast.success("Conta criada e ativada com sucesso!");
          navigate('/dashboard');
        }
      } else {
        toast.error(result.error || 'Erro no cadastro');
      }
      
    } catch (error) {
      console.error('Erro no handler de submit:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: state.isSubmitting,
    lastAttemptEmail: state.lastAttemptEmail,
  };
}
