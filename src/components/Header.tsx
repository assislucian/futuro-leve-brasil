
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";

const Header = () => {
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Plenus</h1>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Funcionalidades</a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Preços</a>
        </nav>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <UserNav />
          ) : (
            <Button asChild variant="ghost">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
