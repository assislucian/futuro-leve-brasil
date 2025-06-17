
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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .toLowerCase(),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setAttemptCount(prev => prev + 1);
    
    try {
      console.log('Tentando fazer login para:', values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log('Resultado do login:', { data, error });

      if (error) {
        console.error('Erro no login:', error);
        
        // Tratamento específico de erros com mensagens user-friendly
        if (error.message.includes('Invalid login credentials')) {
          if (attemptCount >= 3) {
            toast.error('Muitas tentativas incorretas. Verifique suas credenciais ou redefina sua senha.');
          } else {
            toast.error('Email ou senha incorretos. Verifique e tente novamente.');
          }
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Verifique sua caixa de entrada.');
          localStorage.setItem('pendingEmailConfirmation', values.email);
          navigate('/email-confirmation');
          return;
        } else if (error.message.includes('Too many requests')) {
          toast.error('Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.');
        } else if (error.message.includes('User not found')) {
          toast.error('Conta não encontrada. Verifique o email ou crie uma nova conta.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Limite de tentativas excedido. Aguarde alguns minutos.');
        } else {
          toast.error('Erro no login. Tente novamente em alguns minutos.');
        }
        return;
      }

      if (data.user) {
        console.log('Login realizado com sucesso:', data.user.email);
        
        // Verificar se o email foi confirmado
        if (!data.user.email_confirmed_at) {
          toast.error('Email não confirmado. Verifique sua caixa de entrada.');
          localStorage.setItem('pendingEmailConfirmation', values.email);
          navigate('/email-confirmation');
          return;
        }
        
        toast.success("Login realizado com sucesso! Bem-vindo(a) de volta.", {
          duration: 3000,
        });
        
        // Reset attempt count on successful login
        setAttemptCount(0);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
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
                    placeholder="Sua senha" 
                    {...field}
                    autoComplete="current-password"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>

        {/* Aviso após múltiplas tentativas */}
        {attemptCount >= 3 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Problemas para acessar? Tente <Link to="/forgot-password" className="underline">redefinir sua senha</Link> ou 
              entre em contato conosco se precisar de ajuda.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
