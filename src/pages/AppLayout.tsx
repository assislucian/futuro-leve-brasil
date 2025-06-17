
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { Sparkles } from "lucide-react";
import { IncomeConfirmationToast } from "@/components/IncomeConfirmationToast";
import { 
  SidebarInset, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";
import { UserNav } from "@/components/UserNav";
import { TrialBanner } from "@/components/TrialBanner";

const getPageTitle = () => {
  const path = window.location.pathname;
  switch (path) {
    case '/dashboard':
      return 'Dashboard';
    case '/budgets':
      return 'Orçamentos';
    case '/goals':
      return 'Metas';
    case '/analytics':
      return 'Análises';
    case '/settings':
      return 'Configurações';
    default:
      return 'Dashboard';
  }
};

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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Plenus
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto px-4">
              <UserNav />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <TrialBanner />
            <Outlet />
          </div>
        </SidebarInset>
      </div>
      <IncomeConfirmationToast />
    </SidebarProvider>
  );
};

export default AppLayout;
