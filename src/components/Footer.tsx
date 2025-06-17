
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">{t('footer.terms')}</Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">{t('footer.privacy')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
