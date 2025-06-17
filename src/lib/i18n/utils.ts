
import type { Language } from '@/types/language';

export const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'pt';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('pt')) return 'pt';
  
  // Fallback para português (mercado principal)
  return 'pt';
};

export const createRelativeTimeFormatter = (language: Language, t: (key: string, params?: Record<string, string | number>) => string) => {
  return (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) return t('time.now');
    if (diffInMinutes === 1) return t('time.minute_ago');
    if (diffInMinutes < 60) return t('time.minutes_ago', { count: diffInMinutes });
    if (diffInHours === 1) return t('time.hour_ago');
    if (diffInHours < 24) return t('time.hours_ago', { count: diffInHours });
    if (diffInDays === 1) return t('time.day_ago');
    if (diffInWeeks < 1) return t('time.days_ago', { count: diffInDays });
    if (diffInWeeks === 1) return t('time.week_ago');
    if (diffInMonths < 1) return t('time.weeks_ago', { count: diffInWeeks });
    if (diffInMonths === 1) return t('time.month_ago');
    if (diffInYears < 1) return t('time.months_ago', { count: diffInMonths });
    if (diffInYears === 1) return t('time.year_ago');
    return t('time.years_ago', { count: diffInYears });
  };
};

export const createPluralizer = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return (count: number, key: string): string => {
    // Simple pluralization logic
    const singularKey = `${key}.count`;
    const pluralKey = `${key}s.count`;
    
    if (count === 1) {
      return t(singularKey, { count });
    }
    return t(pluralKey, { count });
  };
};
