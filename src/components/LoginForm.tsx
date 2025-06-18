
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .toLowerCase(),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

type LoginState = 'idle' | 'authenticating' | 'success' | 'error';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getErrorMessage = (error: any): string => {
    const errorMsg = error.message?.toLowerCase() || "";
    
    if (errorMsg.includes('invalid login credentials')) {
      return "Email ou senha incorretos. Verifique suas credenciais.";
    }
    if (errorMsg.includes('email not confirmed')) {
      return "Email ainda não foi confirmado. Verifique sua caixa de entrada.";
    }
    if (errorMsg.includes('too many requests')) {
      return "Muitas tentativas. Aguarde alguns minutos.";
    }
    if (errorMsg.includes('user not found')) {
      return "Conta não encontrada. Verifique o email ou crie uma conta.";
    }
    if (errorMsg.includes('network')) {
      return "Problema de conexão. Verifique sua internet.";
    }
    
    return "Erro no acesso à sua conta. Tente novamente.";
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loginState === 'authenticating') return;
    
    setLoginState('authenticating');
    setErrorMessage("");
    
    try {
      console.debug('🚀 Tentativa de login para:', values.email);
      
      // ✅ TAREFA 3: Callback/Redirects - Login sem redirectTo manual
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('🚀 Erro no login:', error);
        setLoginState('error');
        setErrorMessage(getErrorMessage(error));
        return;
      }

      if (data.user && data.session) {
        console.debug("🚀 Login bem-sucedido:", {
          userId: data.user.id,
          sessionExpiry: new Date(data.session.expires_at! * 1000)
        });
        
        setLoginState('success');
        
        toast.success("Login realizado com sucesso! 🎉", {
          description: "Redirecionando para o dashboard...",
          duration: 2000,
        });
        
        // ✅ TAREFA 3: Aguardar um pouco para garantir que o AuthProvider processe
        setTimeout(() => {
          const redirectPath = location.state?.from?.pathname || '/dashboard';
          console.debug('🚀 Redirecionando para:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error('🚀 Erro inesperado no login:', error);
      setLoginState('error');
      setErrorMessage("Erro no sistema. Tente novamente em alguns minutos.");
    }
  }

  const getButtonText = () => {
    switch (loginState) {
      case 'authenticating': return "Entrando...";
      case 'success': return "Sucesso! ✓";
      default: return "Entrar";
    }
  };

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
                  disabled={loginState === 'authenticating'}
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
                    disabled={loginState === 'authenticating'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginState === 'authenticating'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

        {errorMessage && loginState === 'error' && (
          <Alert className="border-l-4 border-amber-500 bg-amber-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">{errorMessage}</p>
              <Link 
                to="/forgot-password" 
                className="text-sm underline font-medium text-primary hover:text-primary/80 block"
              >
                → Redefinir minha senha
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {loginState === 'success' && (
          <Alert className="border-l-4 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <p className="font-medium">Login realizado com sucesso!</p>
              <p className="text-sm">Redirecionando para seu painel...</p>
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginState === 'authenticating' || loginState === 'success'}
        >
          {getButtonText()}
        </Button>
      </form>
    </Form>
  );
}
