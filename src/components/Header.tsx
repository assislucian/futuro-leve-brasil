
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageProvider";

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Plenus</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {t('hero.tagline')}
          </span>
        </Link>
        
        <nav className="hidden items-center gap-6 md:flex">
          <a href="/#como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.how_it_works')}
          </a>
          <a href="/#precos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.pricing')}
          </a>
          <a href="/#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.faq')}
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">{t('auth.login')}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth">{t('hero.cta_primary')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
