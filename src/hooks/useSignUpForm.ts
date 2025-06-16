
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { signUpFormSchema, SignUpFormData } from "@/lib/validators/signup";

export function useSignUpForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: SignUpFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Iniciando cadastro para:', values.email);
      
      // Verificar se o email já está em uso
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .single();

      if (existingUser) {
        toast.error('Este email já possui uma conta. Tente fazer login ou use outro email.');
        setIsSubmitting(false);
        return;
      }

      // Armazenar o e-mail para possível reenvio
      localStorage.setItem('pendingEmailConfirmation', values.email);
      
      const redirectUrl = `${window.location.origin}/email-confirmation`;
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

      console.log('Resultado do cadastro:', { data, error });

      if (error) {
        console.error('Erro no cadastro:', error);
        
        // Tratamento específico de erros com mensagens user-friendly
        if (error.message.includes('User already registered')) {
          toast.error('Este email já está cadastrado. Tente fazer login ou recuperar sua senha.');
        } else if (error.message.includes('Invalid email')) {
          toast.error('Email inválido. Verifique o formato e tente novamente.');
        } else if (error.message.includes('Password')) {
          toast.error('Senha não atende aos critérios de segurança. Verifique os requisitos acima.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
        } else {
          toast.error('Erro no cadastro. Tente novamente em alguns minutos.');
        }
        return;
      }

      // Sucesso no cadastro
      if (data.user) {
        console.log('Usuário criado:', data.user.email);
        
        toast.success("Conta criada com sucesso! Verifique seu email para ativar a conta.", {
          duration: 5000,
        });
        
        form.reset();
        navigate('/email-confirmation');
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro no sistema. Tente novamente em alguns minutos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}
