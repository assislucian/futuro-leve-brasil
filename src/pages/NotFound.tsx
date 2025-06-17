
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            {t('language.choose').includes('Sprache') ? 'Seite nicht gefunden' : 'Página não encontrada'}
          </h2>
          <p className="text-muted-foreground">
            {t('language.choose').includes('Sprache') 
              ? 'Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.'
              : 'A página que você está procurando não existe ou foi movida.'
            }
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('language.choose').includes('Sprache') ? 'Zurück' : 'Voltar'}
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              {t('language.choose').includes('Sprache') ? 'Zur Startseite' : 'Ir para Início'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
