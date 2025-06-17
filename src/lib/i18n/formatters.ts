
import type { Language } from '@/types/language';

export const createFormatters = (language: Language) => {
  const formatCurrency = (amount: number): string => {
    if (language === 'de') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatNumber = (number: number): string => {
    if (language === 'de') {
      return new Intl.NumberFormat('de-DE').format(number);
    }
    return new Intl.NumberFormat('pt-BR').format(number);
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    
    if (language === 'de') {
      return dateObj.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return {
    formatCurrency,
    formatNumber,
    formatDate,
  };
};
