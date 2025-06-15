
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Star, Wallet, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals', label: 'Minhas Metas', icon: Star },
  { href: '/budgets', label: 'Orçamentos', icon: Wallet },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();

  return (
    <Sidebar className="border-r transition-all duration-300 ease-in-out" collapsedWidth={80}>
      <SidebarContent>
        <SidebarHeader className="h-16 flex items-center justify-center">
            <Link to="/dashboard" className="flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-primary" />
                {!collapsed && <span className="text-xl font-bold">Plenus</span>}
            </Link>
        </SidebarHeader>

        <SidebarMenu className="flex-1 px-4 py-2 space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <NavLink to={item.href} className="w-full" end>
                    {({ isActive }) => (
                        <Button
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn("w-full justify-start gap-3", collapsed && "w-12 h-12 justify-center p-0")}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                        </Button>
                    )}
                </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
