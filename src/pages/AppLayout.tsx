
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { Sparkles } from "lucide-react";

const AppLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AppLayout: Verificando autenticação - usuário:", !!user, "carregando:", loading);
    
    // Só redireciona se não estiver carregando E não tiver usuário
    if (!loading && !user) {
      console.log("AppLayout: Usuário não autenticado, redirecionando para auth");
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    console.log("AppLayout: Mostrando carregamento");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Carregando sua jornada financeira...</p>
      </div>
    );
  }

  // Se não tem usuário, mostra loading enquanto redireciona
  if (!user) {
    console.log("AppLayout: Sem usuário, redirecionando...");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Redirecionando para login...</p>
      </div>
    );
  }

  console.log("AppLayout: Renderizando layout da aplicação");
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
