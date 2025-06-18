
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    console.log("AppLayout: Mostrando carregamento");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse text-primary" />
        <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
          Carregando sua jornada financeira...
        </p>
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
      <div className="min-h-screen flex w-full will-change-transform">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header Mobile-First - Otimizado para Performance */}
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 will-change-auto">
            <div className="flex items-center gap-2 px-3 sm:px-4 flex-1 min-w-0">
              <SidebarTrigger className="-ml-1 will-change-transform" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              
              {/* Breadcrumb Responsivo - Layout Fixo */}
              <Breadcrumb className="flex-1 min-w-0">
                <BreadcrumbList>
                  {!isMobile && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/dashboard">
                          Plenus
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm sm:text-base font-medium truncate">
                      {getPageTitle()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            {/* User Navigation - Mobile Otimizado */}
            <div className="px-3 sm:px-4 flex-shrink-0">
              <UserNav />
            </div>
          </header>
          
          {/* Content Area - Mobile Spacing Otimizado */}
          <div className="flex flex-1 flex-col gap-3 sm:gap-4 p-3 sm:p-4 pt-0 will-change-auto">
            <TrialBanner />
            <div className="will-change-auto">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
      <IncomeConfirmationToast />
    </SidebarProvider>
  );
};

export default AppLayout;
