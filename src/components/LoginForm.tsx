
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
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .toLowerCase(),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

type LoginState = 'idle' | 'checking' | 'authenticating' | 'success' | 'error';

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [attemptCount, setAttemptCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [suggestedAction, setSuggestedAction] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getIntelligentErrorMessage = (error: any, email: string) => {
    const errorMsg = error.message?.toLowerCase() || "";
    
    console.log("Analisando erro de login:", error);
    
    if (errorMsg.includes('invalid login credentials') || errorMsg.includes('invalid credentials')) {
      if (attemptCount === 0) {
        setErrorMessage("Email ou senha incorretos. Verifique suas credenciais.");
        setSuggestedAction(`Primeira tentativa com ${email}. Tente novamente ou redefina sua senha.`);
      } else if (attemptCount === 1) {
        setErrorMessage("Credenciais ainda incorretas. Tem certeza dos seus dados?");
        setSuggestedAction("Verifique se não há erros de digitação ou use 'Esqueci minha senha'.");
      } else {
        setErrorMessage("Muitas tentativas incorretas detectadas.");
        setSuggestedAction("Recomendamos redefinir sua senha para maior segurança.");
      }
      return;
    }

    if (errorMsg.includes('email not confirmed') || errorMsg.includes('signup_disabled')) {
      setErrorMessage("Email ainda não foi confirmado.");
      setSuggestedAction("Verifique sua caixa de entrada e spam. Podemos reenviar o email se necessário.");
      return;
    }

    if (errorMsg.includes('too many requests') || errorMsg.includes('rate limit')) {
      setErrorMessage("Muitas tentativas em pouco tempo.");
      setSuggestedAction("Aguarde 5 minutos antes de tentar novamente por segurança.");
      return;
    }

    if (errorMsg.includes('user not found') || errorMsg.includes('user_not_found')) {
      setErrorMessage("Conta não encontrada com este email.");
      setSuggestedAction("Verifique o email ou crie uma nova conta usando o botão 'Criar Conta'.");
      return;
    }

    if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      setErrorMessage("Problema de conexão detectado.");
      setSuggestedAction("Verifique sua internet e tente novamente em alguns segundos.");
      return;
    }

    // Erro genérico
    setErrorMessage("Erro no acesso à sua conta.");
    setSuggestedAction("Tente novamente ou entre em contato se o problema persistir.");
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuggestedAction("");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loginState === 'authenticating') return;
    
    setLoginState('checking');
    clearMessages();
    setAttemptCount(prev => prev + 1);
    
    try {
      console.log(`Tentativa ${attemptCount + 1} de login para:`, values.email);
      
      // Fase 1: Verificar se usuário existe (simulado via tentativa de login)
      setLoginState('authenticating');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log('Resultado do login:', { 
        success: !!data.user, 
        error: error?.message,
        emailConfirmed: data.user?.email_confirmed_at 
      });

      if (error) {
        console.error('Erro no login:', error);
        setLoginState('error');
        getIntelligentErrorMessage(error, values.email);
        return;
      }

      if (data.user) {
        // Verificar se o email foi confirmado
        if (!data.user.email_confirmed_at) {
          setLoginState('error');
          setErrorMessage("Email ainda não foi confirmado.");
          setSuggestedAction("Verifique sua caixa de entrada. Podemos reenviar o email de confirmação.");
          localStorage.setItem('pendingEmailConfirmation', values.email);
          
          // Sugerir navegação para confirmação após 3 segundos
          setTimeout(() => {
            navigate('/email-confirmation');
          }, 3000);
          return;
        }
        
        setLoginState('success');
        
        // Reset contador de tentativas em caso de sucesso
        setAttemptCount(0);
        
        toast.success("Acesso realizado com sucesso! 🎉", {
          description: "Bem-vindo(a) de volta ao Plenus",
          duration: 3000,
        });
        
        // Pequeno delay para mostrar feedback positivo
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      setLoginState('error');
      setErrorMessage("Erro no sistema.");
      setSuggestedAction("Tente novamente em alguns minutos. Se persistir, nos contate.");
    }
  }

  const getButtonText = () => {
    switch (loginState) {
      case 'checking': return "Verificando...";
      case 'authenticating': return "Entrando...";
      case 'success': return "Sucesso! ✓";
      default: return "Entrar";
    }
  };

  const getButtonVariant = () => {
    switch (loginState) {
      case 'success': return "default";
      case 'error': return "destructive";
      default: return "default";
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

        {/* Feedback Inteligente de Erro */}
        {errorMessage && (
          <Alert className={cn(
            "border-l-4",
            attemptCount >= 3 ? "border-red-500 bg-red-50" : "border-amber-500 bg-amber-50"
          )}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">{errorMessage}</p>
              {suggestedAction && (
                <p className="text-sm text-muted-foreground">{suggestedAction}</p>
              )}
              {attemptCount >= 2 && (
                <div className="flex flex-col gap-2 mt-3">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm underline font-medium text-primary hover:text-primary/80"
                  >
                    → Redefinir minha senha
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Ou entre em contato conosco se precisar de ajuda
                  </p>
                </div>
              )}
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
          variant={getButtonVariant()}
        >
          {getButtonText()}
        </Button>

        {/* Status de tentativas */}
        {attemptCount > 0 && loginState !== 'success' && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Tentativa {attemptCount} • {attemptCount >= 3 ? "Considere redefinir sua senha" : "Tente novamente"}
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
