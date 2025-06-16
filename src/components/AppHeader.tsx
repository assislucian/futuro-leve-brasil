
import React from 'react';
import { UserNav } from './UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';

const AppHeader = () => {
  return (
    <header className="sticky top-0 flex h-20 items-center gap-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm px-6 md:px-8 z-30 shadow-sm">
       <SidebarTrigger className="p-2 hover:bg-slate-100/80 rounded-xl transition-colors" />
      <div className="flex w-full items-center gap-6 md:ml-auto md:gap-4 lg:gap-6">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Futuro campo de busca ou ações rápidas */}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
