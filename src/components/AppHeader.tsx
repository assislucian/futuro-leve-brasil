
import React from 'react';
import { UserNav } from './UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';

const AppHeader = () => {
  return (
    <header className="sticky top-0 flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:px-6 z-30 shadow-sm">
       <SidebarTrigger className="p-2 hover:bg-muted rounded-md transition-colors" />
      <div className="flex w-full items-center gap-3 md:ml-auto">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Zukünftiges Suchfeld oder Schnellaktionen */}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
