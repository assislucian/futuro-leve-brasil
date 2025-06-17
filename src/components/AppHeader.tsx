
import React from 'react';
import { UserNav } from './UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { TrialBanner } from './TrialBanner';
import { Button } from '@/components/ui/button';
import { Search, Bell, HelpCircle } from 'lucide-react';

const AppHeader = () => {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 z-30 shadow-sm">
        <SidebarTrigger className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105" />
        
        <div className="flex w-full items-center gap-4 md:ml-auto">
          {/* Central de Busca Futura */}
          <div className="ml-auto flex-1 sm:flex-initial max-w-md hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="search" 
                placeholder="Buscar transações, metas..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                disabled
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notificações (futuro) */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent rounded-lg transition-all duration-200 relative"
              disabled
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full opacity-75"></span>
            </Button>
            
            {/* Ajuda */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent rounded-lg transition-all duration-200"
              disabled
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      
      {/* Trial Banner posicionado logo abaixo do header */}
      <div className="sticky top-16 z-20">
        <TrialBanner />
      </div>
    </>
  );
};

export default AppHeader;
