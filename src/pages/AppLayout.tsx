
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { Sparkles } from "lucide-react";

const AppLayout = () => {
  const { user, loading } = useAuth();

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

  // Se não tem usuário, não renderiza nada (será tratado pela proteção de rota)
  if (!user) {
    console.log("AppLayout: Sem usuário autorizado");
    return null;
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
