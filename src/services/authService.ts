
import { supabase } from "@/integrations/supabase/client";
import { SignUpFormData } from "@/lib/validators/signup";
import { SignUpResult } from "@/types/auth";
import { handleAuthError } from "@/utils/authErrors";

/**
 * Executa o processo de cadastro
 * @param values - Dados do formulário
 * @returns Resultado do cadastro
 */
export async function performSignUp(values: SignUpFormData): Promise<SignUpResult> {
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
}
