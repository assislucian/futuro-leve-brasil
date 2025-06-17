
import type { Language } from '@/types/language';
import { heroTranslations } from './hero';
import { authTranslations } from './auth';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { featuresTranslations } from './features';
import { commonTranslations } from './common';
import { goalsTranslations } from './goals';
import { remainingTranslations } from './remaining';

// Function to merge multiple translation objects
export function mergeTranslations(translations: Record<Language, Record<string, string>>[]) {
  const result: Record<Language, Record<string, string>> = {
    pt: {},
    de: {}
  };
  
  for (const translation of translations) {
    for (const lang of Object.keys(translation) as Language[]) {
      result[lang] = {
        ...result[lang],
        ...translation[lang]
      };
    }
  }
  
  return result;
}

// Combine all translations into a single object
export const allTranslations = mergeTranslations([
  heroTranslations,
  authTranslations,
  navigationTranslations,
  dashboardTranslations,
  featuresTranslations,
  commonTranslations,
  goalsTranslations,
  remainingTranslations
]);
