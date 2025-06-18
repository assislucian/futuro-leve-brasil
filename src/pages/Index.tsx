
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import { Sparkles } from "lucide-react";
import { Faq } from "@/components/Faq";

const Index = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ TAREFA 3: Log de auditoria
    console.debug("🚀 Index: Verificando auth", { 
      hasUser: !!user, 
      hasSession: !!session,
      sessionValid: session ? new Date(session.expires_at! * 1000) > new Date() : false,
      loading 
    });
    
    // Só redireciona se tiver sessão válida E não estiver carregando
    if (!loading && user && session) {
      const sessionValid = new Date(session.expires_at! * 1000) > new Date();
      if (sessionValid) {
        console.debug("🚀 Index: Redirecionando usuário autenticado para dashboard");
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, session, loading, navigate]);

  // Mostra loading apenas quando ainda está verificando autenticação
  if (loading) {
    console.debug("🚀 Index: Mostrando tela de carregamento");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Carregando sua jornada financeira...</p>
      </div>
    );
  }

  // Se usuário está autenticado com sessão válida, mostra loading enquanto redireciona
  const hasValidSession = user && session && new Date(session.expires_at! * 1000) > new Date();
  if (hasValidSession) {
    console.debug("🚀 Index: Usuário autenticado, redirecionando...");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
      </div>
    );
  }

  // Usuário não autenticado - mostra landing page
  console.debug("🚀 Index: Mostrando landing page para usuário não autenticado");
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
};

export { Index };
export default Index;
