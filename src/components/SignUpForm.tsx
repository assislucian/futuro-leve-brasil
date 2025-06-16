
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

// Validação simplificada de senha para evitar problemas de tipo
const passwordSchema = z.string()
  .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
  .refine((password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
  }, {
    message: "A senha deve conter pelo menos: uma letra minúscula, uma maiúscula, um número e um caractere especial (@$!%*?&)"
  });

const formSchema = z.object({
  fullName: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços" }),
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = form.watch("password");

  async function onSubmit(values: FormData) {
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Seu nome completo" 
                  {...field}
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="seu@email.com" 
                  type="email"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Crie uma senha forte" 
                    {...field}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              
              {/* Indicador de força da senha usando o componente dedicado */}
              <PasswordStrengthIndicator password={password} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Digite a senha novamente" 
                    {...field}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <span className="text-sm font-normal text-muted-foreground">
                    Eu li e aceito os{' '}
                    <Link to="/terms" target="_blank" className="font-medium text-primary hover:underline">
                      Termos de Serviço
                    </Link>{' '}
                    e a{' '}
                    <Link to="/privacy" target="_blank" className="font-medium text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Aviso de segurança */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>100% Seguro:</strong> Seus dados são criptografados e protegidos. 
            Nunca compartilhamos informações pessoais com terceiros.
          </AlertDescription>
        </Alert>

        <Button 
          type="submit" 
          className="w-full btn-primary" 
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? "Criando conta..." : "Criar Conta Gratuita"}
        </Button>
      </form>
    </Form>
  );
}
