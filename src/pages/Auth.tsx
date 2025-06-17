
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/LoginForm";
import { SignUpForm } from "@/components/SignUpForm";
import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 plenus-bg-gradient">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-xl shadow-teal-500/25">
          <Sparkles className="h-8 w-8 animate-pulse text-white" />
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen plenus-bg-gradient p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-xl shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-all duration-300">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold plenus-text-gradient">Plenus</h1>
                <span className="text-sm text-muted-foreground">Sua jornada financeira</span>
              </div>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="plenus-card shadow-2xl border-white/20">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-teal-50 border border-teal-100">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Bem-vindo(a) de volta! 👋</CardTitle>
                    <CardDescription>
                      Acesse sua conta para continuar sua jornada financeira.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoginForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Crie sua conta ✨</CardTitle>
                    <CardDescription>
                      <span className="font-semibold text-teal-700">🎯 Teste Premium por 7 dias grátis!</span><br />
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

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link to="/terms" className="text-teal-600 hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/privacy" className="text-teal-600 hover:underline">
                Política de Privacidade
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>🔒 100% Seguro</span>
              <span>•</span>
              <span>🇧🇷 Feito para brasileiros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AuthPage as Auth };
export default AuthPage;
