
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/LoginForm";
import { SignUpForm } from "@/components/SignUpForm";
import { Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const AuthPage = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // ✅ TAREFA 3: Log de auditoria
    console.debug("🚀 Auth: Verificando auth", {
      hasUser: !!user,
      hasSession: !!session,
      sessionValid: session ? new Date(session.expires_at! * 1000) > new Date() : false,
      loading,
      from
    });

    // Só redireciona se tiver sessão válida E não estiver carregando
    if (!loading && user && session) {
      const sessionValid = new Date(session.expires_at! * 1000) > new Date();
      if (sessionValid) {
        console.debug("🚀 Auth: Redirecionando usuário autenticado para:", from);
        navigate(from, { replace: true });
      }
    }
  }, [user, session, loading, navigate, from]);

  // Mostra loading se ainda verificando ou se tem sessão válida
  const hasValidSession = user && session && new Date(session.expires_at! * 1000) > new Date();
  if (loading || hasValidSession) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">
          {loading ? "Verificando autenticação..." : "Redirecionando..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Plenus</h1>
          </Link>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo(a) de volta!</CardTitle>
                <CardDescription>
                  Acesse sua conta para continuar sua jornada financeira.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Crie sua conta</CardTitle>
                <CardDescription>
                  Comece a transformar sua relação com o dinheiro hoje mesmo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export { AuthPage as Auth };
export default AuthPage;
