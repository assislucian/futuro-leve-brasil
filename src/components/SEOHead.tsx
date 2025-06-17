
import React from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonical
}) => {
  const { language, t } = useLanguage();

  // Default SEO values per language
  const seoDefaults = {
    pt: {
      title: 'Plenus - Transforme sua Relação com o Dinheiro',
      description: 'A plataforma de bem-estar financeiro que conecta cada centavo aos seus sonhos. Planeje, controle e conquiste seus objetivos financeiros.',
      keywords: ['finanças pessoais', 'planejamento financeiro', 'orçamento', 'metas financeiras', 'poupança', 'investimentos']
    },
    de: {
      title: 'Plenus - Transformieren Sie Ihre Beziehung zum Geld',
      description: 'Die finanzielle Wellness-Plattform, die jeden Cent mit Ihren Träumen verbindet. Planen, kontrollieren und erreichen Sie Ihre finanziellen Ziele.',
      keywords: ['persönliche finanzen', 'finanzplanung', 'budget', 'finanzziele', 'sparen', 'investitionen']
    }
  };

  const defaultSEO = seoDefaults[language];
  const finalTitle = title ? `${title} | Plenus` : defaultSEO.title;
  const finalDescription = description || defaultSEO.description;
  const finalKeywords = keywords.length > 0 ? keywords : defaultSEO.keywords;

  React.useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', finalDescription);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', finalKeywords.join(', '));

    // Update language
    let metaLang = document.querySelector('meta[name="language"]');
    if (!metaLang) {
      metaLang = document.createElement('meta');
      metaLang.setAttribute('name', 'language');
      document.head.appendChild(metaLang);
    }
    metaLang.setAttribute('content', language);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', finalTitle);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', finalDescription);

    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', language === 'pt' ? 'pt_BR' : 'de_DE');

    // Update canonical URL if provided
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }
  }, [finalTitle, finalDescription, finalKeywords, language, canonical]);

  return null; // This component doesn't render anything visible
};
