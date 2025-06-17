
import { BarChart3, Target, Wallet, TrendingUp, LogOut, Home, PlusCircle, Calculator, Sparkles, Zap } from "lucide-react";
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
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mainItems = [
  { 
    title: "Visão Geral", 
    url: "/dashboard", 
    icon: Home,
    description: "Seu centro de controle",
    gradient: "from-blue-500 to-blue-600"
  },
  { 
    title: "Metas", 
    url: "/goals", 
    icon: Target,
    description: "Seus sonhos em progresso",
    gradient: "from-emerald-500 to-emerald-600"
  },
  { 
    title: "Orçamentos", 
    url: "/budgets", 
    icon: Wallet,
    description: "Controle inteligente",
    gradient: "from-amber-500 to-amber-600"
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: TrendingUp,
    description: "Insights poderosos",
    gradient: "from-purple-500 to-purple-600",
    premium: true
  },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const isPremium = profile?.plan === 'premium';

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500 font-semibold shadow-sm" 
      : "text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200";

  const handleSignOut = async () => {
    console.log("AppSidebar: Fazendo logout");
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("AppSidebar: Erro ao fazer logout:", error);
    }
  };

  const userName = user?.user_metadata?.full_name || profile?.full_name || "Usuário";
  const userEmail = user?.email || "";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-72"} collapsible="icon">
      <SidebarHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {isPremium && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full border border-white dark:border-slate-900"></div>
            )}
          </div>
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Plenus
                </span>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-semibold px-2 py-0.5">
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Sua jornada financeira inteligente
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
            {!isCollapsed ? "Navegação Principal" : "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 rounded-xl transition-all duration-200 hover:scale-[1.02]">
                    <NavLink to={item.url} end className={getNavClass}>
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        currentPath === item.url 
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50` 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      )}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.title}</span>
                            {item.premium && !isPremium && (
                              <Zap className="h-3 w-3 text-amber-500" />
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

        {!isCollapsed && (
          <>
            <Separator className="my-6" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
                Ações Estratégicas
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 space-y-3">
                  {/* Nova Transação - Ação Principal */}
                  <AddTransactionDialog>
                    <Button 
                      size="sm" 
                      className="w-full h-11 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/50 transition-all duration-300 transform hover:scale-[1.02] font-semibold"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nova Transação
                    </Button>
                  </AddTransactionDialog>

                  {/* Ações Secundárias */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      asChild
                      size="sm" 
                      variant="outline"
                      className="h-10 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-950/30 transition-all duration-200 group"
                    >
                      <Link to="/goals">
                        <Target className="h-4 w-4 text-emerald-600 group-hover:text-emerald-700" />
                      </Link>
                    </Button>

                    <Button 
                      asChild
                      size="sm" 
                      variant="outline"
                      className="h-10 border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 dark:border-amber-800 dark:hover:bg-amber-950/30 transition-all duration-200 group"
                    >
                      <Link to="/budgets">
                        <Calculator className="h-4 w-4 text-amber-600 group-hover:text-amber-700" />
                      </Link>
                    </Button>
                  </div>

                  {/* Call to Action Premium */}
                  {!isPremium && (
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="text-center space-y-2">
                        <Sparkles className="h-5 w-5 text-purple-600 mx-auto" />
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                          Desbloqueie Insights de IA
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full h-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs font-semibold transition-all duration-200"
                        >
                          Upgrade Premium
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{userName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
