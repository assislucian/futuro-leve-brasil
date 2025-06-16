
import React from 'react';
import { UserNav } from './UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';

const AppHeader = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-6 md:px-8 z-30 shadow-sm">
       <SidebarTrigger className="p-2 hover:bg-slate-100 rounded-lg transition-colors" />
      <div className="flex w-full items-center gap-4 md:ml-auto">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Futuro campo de busca ou ações rápidas */}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
