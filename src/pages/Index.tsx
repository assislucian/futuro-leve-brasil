
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index: Verificando estado de auth - usuário:", !!user, "carregando:", loading);
    
    // Só redireciona se não estiver carregando E tiver usuário autenticado
    if (!loading && user) {
      console.log("Index: Redirecionando usuário autenticado para dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mostra loading apenas quando ainda está verificando autenticação
  if (loading) {
    console.log("Index: Mostrando tela de carregamento");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Carregando sua jornada financeira...</p>
      </div>
    );
  }

  // Se usuário está autenticado, mostra loading enquanto redireciona
  if (user) {
    console.log("Index: Usuário autenticado, redirecionando...");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
      </div>
    );
  }

  // Usuário não autenticado - mostra landing page
  console.log("Index: Mostrando landing page para usuário não autenticado");
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
