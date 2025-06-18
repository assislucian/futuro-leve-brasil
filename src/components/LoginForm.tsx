
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
import { useState, useRef } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isAuthenticatingRef = useRef(false);

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
    if (errorMsg.includes('too many requests') || errorMsg.includes('rate limit')) {
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
    // Prevenir múltiplas submissões simultâneas
    if (isAuthenticatingRef.current || loginState === 'authenticating') {
      console.log("🚫 LoginForm: Tentativa de login duplicada bloqueada");
      return;
    }
    
    isAuthenticatingRef.current = true;
    setLoginState('authenticating');
    setErrorMessage("");
    
    try {
      console.log('🔐 LoginForm: Tentativa de login para:', values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('❌ LoginForm: Erro no login:', error);
        setLoginState('error');
        setErrorMessage(getErrorMessage(error));
        return;
      }

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          setLoginState('error');
          setErrorMessage("Email ainda não foi confirmado. Verifique sua caixa de entrada.");
          localStorage.setItem('pendingEmailConfirmation', values.email);
          return;
        }
        
        console.log('✅ LoginForm: Login bem-sucedido');
        setLoginState('success');
        
        toast.success("Acesso realizado com sucesso! 🎉", {
          description: "Bem-vindo(a) de volta ao Plenus",
          duration: 3000,
        });
        
        // Aguardar um pouco para o AuthProvider processar a mudança
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('💥 LoginForm: Erro inesperado no login:', error);
      setLoginState('error');
      setErrorMessage("Erro no sistema. Tente novamente em alguns minutos.");
    } finally {
      isAuthenticatingRef.current = false;
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

        {/* Feedback de Erro */}
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

        {/* Feedback de Sucesso */}
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
