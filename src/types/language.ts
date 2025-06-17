
export type Language = 'pt' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  formatNumber: (number: number) => string;
  formatRelativeTime: (date: Date | string) => string;
  plural: (count: number, key: string) => string;
  isRTL: boolean;
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}
