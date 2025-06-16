
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Plenus</h1>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Funcionalidades</a>
          <a href="/#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Preços</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {loading ? (
            <div className="h-9 w-32 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Criar Conta</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
