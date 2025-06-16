
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-hover:shadow-emerald-200 transition-all duration-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Plenus
            </h1>
            <span className="text-xs text-slate-500 -mt-1">Sua jornada financeira</span>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#como-funciona" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Como Funciona
          </a>
          <a href="/#precos" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Preços
          </a>
          <a href="/#depoimentos" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Depoimentos
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {loading ? (
            <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-100"></div>
          ) : user ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-200">
                <Link to="/auth">Começar Grátis</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
