
import { BarChart3, Target, Wallet, TrendingUp, LogOut, Home, PlusCircle, Calculator } from "lucide-react";
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

const mainItems = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Metas", url: "/goals", icon: Target },
  { title: "Orçamentos", url: "/budgets", icon: Wallet },
  { title: "Relatórios", url: "/analytics", icon: TrendingUp },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500 font-medium" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

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
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Plenus
              </span>
              <p className="text-xs text-slate-500 -mt-1">Controle Financeiro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3">
            {!isCollapsed ? "Navegação Principal" : "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <>
            <Separator className="my-4" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3">
                Ações Rápidas
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-2">
                  {/* Nova Transação */}
                  <AddTransactionDialog>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nova Transação
                    </Button>
                  </AddTransactionDialog>

                  {/* Nova Meta */}
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                    className="w-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                  >
                    <Link to="/goals">
                      <Target className="h-4 w-4 mr-2 text-emerald-600" />
                      Nova Meta
                    </Link>
                  </Button>

                  {/* Novo Orçamento */}
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                    className="w-full border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                  >
                    <Link to="/budgets">
                      <Calculator className="h-4 w-4 mr-2 text-orange-600" />
                      Orçamento
                    </Link>
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="mt-3 w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
