
import React from 'react';
import { UserNav } from './UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { TrialBanner } from './TrialBanner';

const AppHeader = () => {
  return (
    <>
      <header className="sticky top-0 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 z-30 shadow-sm">
        <SidebarTrigger className="p-2 hover:bg-accent rounded-md transition-colors" />
        <div className="flex w-full items-center gap-3 md:ml-auto">
          <div className="ml-auto flex-1 sm:flex-initial">
            {/* Futuro campo de busca ou ações rápidas */}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      
      {/* Trial Banner posicionado logo abaixo do header */}
      <div className="sticky top-14 z-20">
        <TrialBanner />
      </div>
    </>
  );
};

export default AppHeader;
