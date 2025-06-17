
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  signUpFormSchema, 
  SignUpFormData, 
  validatePasswordStrength,
  isValidEmail 
} from "@/lib/validators/signup";
import { UseSignUpFormState } from "@/types/auth";
import { performSignUp } from "@/services/authService";

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
