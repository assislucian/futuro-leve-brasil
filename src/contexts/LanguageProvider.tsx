
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, LanguageContextType } from '@/types/language';
import { translations } from '@/lib/i18n/translations';
import { createFormatters } from '@/lib/i18n/formatters';
import { detectBrowserLanguage, createRelativeTimeFormatter, createPluralizer } from '@/lib/i18n/utils';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('plenus-language');
    if (saved) return saved as Language;
    
    // Auto-detect browser language on first visit
    return detectBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem('plenus-language', language);
    // Set HTML lang attribute for accessibility and SEO
    document.documentElement.lang = language;
    
    // Set direction attribute (always LTR for pt and de)
    document.documentElement.dir = 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langTranslations = translations[language];
    let text = langTranslations[key as keyof typeof langTranslations];
    
    // Fallback to Portuguese if translation not found
    if (!text && language !== 'pt') {
      text = translations.pt[key as keyof typeof translations.pt];
    }
    
    // Final fallback to key itself
    if (!text) {
      console.warn(`Translation missing for key: ${key}`);
      text = key;
    }
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  const formatters = createFormatters(language);
  const formatRelativeTime = createRelativeTimeFormatter(language, t);
  const plural = createPluralizer(t);

  // Always false for current supported languages (pt and de)
  const isRTL = false;

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      ...formatters,
      formatRelativeTime,
      plural,
      isRTL
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
