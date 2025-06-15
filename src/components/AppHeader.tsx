
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { UserNav } from './UserNav';

const AppHeader = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
       <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Plenus</h1>
        </Link>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Futuro campo de busca ou ações rápidas */}
        </div>
        <UserNav />
      </div>
    </header>
  );
};

export default AppHeader;
