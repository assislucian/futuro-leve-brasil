
import React from 'react';
import { UserNav } from './UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { TrialBanner } from './TrialBanner';
import { Button } from '@/components/ui/button';
import { Search, Bell } from 'lucide-react';

const AppHeader = () => {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 z-30">
        <SidebarTrigger className="p-2 hover:bg-accent rounded-md transition-colors" />
        
        <div className="flex w-full items-center gap-4 md:ml-auto">
          {/* Busca Simples */}
          <div className="ml-auto flex-1 sm:flex-initial max-w-md hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="search" 
                placeholder="Buscar transações, metas..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                disabled
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notificações Discretas */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent"
              disabled
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      
      <div className="sticky top-16 z-20">
        <TrialBanner />
      </div>
    </>
  );
};

export default AppHeader;
