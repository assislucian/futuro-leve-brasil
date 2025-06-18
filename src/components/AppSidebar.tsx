
import { Target, Wallet, TrendingUp, LogOut, Home, Zap } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const mainItems = [
  { 
    title: "Visão Geral", 
    url: "/dashboard", 
    icon: Home,
    description: "Seu painel principal"
  },
  { 
    title: "Metas", 
    url: "/goals", 
    icon: Target,
    description: "Objetivos e sonhos"
  },
  { 
    title: "Orçamentos", 
    url: "/budgets", 
    icon: Wallet,
    description: "Controle de gastos"
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: TrendingUp,
    description: "Relatórios avançados",
    premium: true
  },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const isPremium = profile?.plan === 'premium';

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500 font-medium" 
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const userName = user?.user_metadata?.full_name || profile?.full_name || "Usuário";
  const userEmail = user?.email || "";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Sidebar 
      className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : isMobile ? "w-72" : "w-64"}
      `} 
      collapsible="icon"
    >
      {/* Header estável */}
      <SidebarHeader className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex-shrink-0">
            P
          </div>
          {!isCollapsed && (
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground truncate">
                  Plenus
                </span>
                {isPremium && (
                  <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5 flex-shrink-0">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Sua jornada financeira
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Content sem tremida */}
      <SidebarContent className="px-2 sm:px-3 py-4 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 mb-2">
            {!isCollapsed ? "Menu Principal" : "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 sm:h-11 rounded-lg transition-colors duration-200 contain-layout">
                    <NavLink to={item.url} end className={getNavClass}>
                      <div className="p-2 rounded-md flex-shrink-0">
                        <item.icon className="h-4 w-4" />
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{item.title}</span>
                            {item.premium && !isPremium && (
                              <Zap className="h-3 w-3 text-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Premium Upgrade estável */}
        {!isCollapsed && !isPremium && (
          <>
            <Separator className="my-4" />
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="px-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border">
                    <div className="text-center space-y-2">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Desbloqueie Recursos Premium
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-xs transition-colors duration-200"
                      >
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer estável */}
      <SidebarFooter className="p-3 sm:p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-emerald-500 text-white text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
