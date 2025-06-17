
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Dashboard
    'dashboard.greeting.morning': 'Bom dia',
    'dashboard.greeting.afternoon': 'Boa tarde',
    'dashboard.greeting.evening': 'Boa noite',
    'dashboard.subtitle': 'Acompanhe seus progressos e continue construindo seus sonhos',
    'dashboard.plan.free': 'Gratuito',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.goals': 'Metas',
    'nav.budgets': 'Orçamentos',
    'nav.analytics': 'Análises',
    'nav.settings': 'Configurações',
    
    // Financial Summary
    'financial.summary.title': 'Resumo Financeiro',
    'financial.summary.total_balance': 'Saldo Total',
    'financial.summary.monthly_income': 'Receita Mensal',
    'financial.summary.monthly_expenses': 'Gastos Mensais',
    'financial.summary.savings': 'Poupança',
    
    // Transactions
    'transactions.title': 'Transações Recentes',
    'transactions.subtitle': 'Aqui estão as últimas movimentações da sua conta.',
    'transactions.add': 'Adicionar',
    'transactions.description': 'Descrição',
    'transactions.category': 'Categoria',
    'transactions.amount': 'Valor',
    'transactions.actions': 'Ações',
    'transactions.edit': 'Editar',
    'transactions.delete': 'Excluir',
    'transactions.empty.title': 'Comece sua Jornada Financeira!',
    'transactions.empty.subtitle': 'Ainda não há transações registradas. Que tal adicionar sua primeira receita ou despesa?\nCada passo conta para seus sonhos! ✨',
    'transactions.empty.button': 'Adicionar Primeira Transação',
    
    // Goals
    'goals.title': 'Suas Metas Financeiras 🎯',
    'goals.subtitle': 'Conecte seu dinheiro com seus sonhos. Acompanhe aqui seu progresso.',
    'goals.upgrade.title': 'Acelere Seus Sonhos!',
    'goals.upgrade.description': 'O plano gratuito permite 2 metas. Faça upgrade para metas ilimitadas.',
    'goals.upgrade.link': 'Fazer Upgrade',
    
    // Budgets
    'budgets.title': 'Meus Orçamentos',
    'budgets.subtitle': 'Defina seus limites de gastos e acompanhe sua saúde financeira.',
    'budgets.new': 'Novo Orçamento',
    'budgets.month_overview': 'Visão do Mês',
    'budgets.performance': 'Seu desempenho geral.',
    'budgets.total_expenses': 'Gastos Totais',
    'budgets.budgeted': 'Orçado',
    'budgets.remaining': 'Restante',
    'budgets.category': 'Categoria',
    'budgets.progress': 'Progresso',
    'budgets.spent': 'Gasto',
    'budgets.empty.title': 'Nenhum orçamento definido para {month}',
    'budgets.empty.subtitle': 'Comece a organizar suas finanças criando seu primeiro orçamento.',
    'budgets.premium.title': 'Desbloqueie o Poder dos Orçamentos',
    'budgets.premium.description': 'A criação de orçamentos é um recurso exclusivo do plano Premium. Tenha controle total sobre seus gastos, receba alertas inteligentes e acelere a conquista dos seus sonhos.',
    'budgets.premium.button': 'Fazer Upgrade para Premium',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.subtitle': 'Gerencie suas configurações de conta e perfil.',
    'settings.profile': 'Meu Perfil',
    'settings.appearance': 'Aparência',
    'settings.theme': 'Tema do App',
    'settings.danger': 'Zona de Perigo',
    'settings.danger.description': 'As ações abaixo são destrutivas e não podem ser desfeitas. Seja cuidadoso antes de prosseguir.',
    
    // Smart Insights
    'insights.title': 'Insights Inteligentes',
    'insights.subtitle': '🚀 Nossa IA descobriu oportunidades para acelerar seus sonhos!',
    'insights.learning': 'Nossa IA está aprendendo sobre seus hábitos financeiros.',
    'insights.learning.subtitle': 'Adicione mais transações para receber insights personalizados!',
    'insights.priority.urgent': '🔥 Urgente',
    'insights.priority.important': '⚡ Importante',
    'insights.priority.tip': '💡 Dica',
    'insights.view_all': 'Ver Todos os Insights ({count})',
    
    // Next Action
    'next_action.title': 'Próxima Ação',
    'next_action.subtitle': 'Recomendação personalizada',
    'next_action.priority.urgent': 'Urgente',
    'next_action.priority.opportunity': 'Oportunidade',
    'next_action.priority.suggestion': 'Sugestão',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Criar Conta',
    'auth.welcome_back': 'Bem-vindo de volta!',
    'auth.welcome_back.subtitle': 'Entre na sua conta para continuar sua jornada financeira.',
    'auth.create_account': 'Crie sua conta',
    'auth.create_account.subtitle': 'Comece hoje a transformar sua relação com o dinheiro.',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.forgot_password': 'Esqueceu a senha?',
    'auth.forgot_password.title': 'Esqueceu a senha?',
    'auth.forgot_password.subtitle': 'Sem problema. Digite seu e-mail e enviaremos um link para criar uma nova senha.',
    'auth.reset_link': 'Enviar Link de Redefinição',
    'auth.back_to_login': 'Voltar ao Login',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.add': 'Adicionar',
    'common.close': 'Fechar',
    'common.confirm': 'Confirmar',
    'common.previous': 'Anterior',
    'common.next': 'Próximo',
    
    // Analytics
    'analytics.title': '📊 Análise Financeira',
    'analytics.subtitle': 'Análise inteligente dos seus gastos e padrões financeiros',
    'analytics.total_expenses': 'Total de Gastos',
    'analytics.fixed_expenses': 'Gastos Fixos',
    'analytics.variable_expenses': 'Gastos Variáveis',
    'analytics.unplanned': 'Não Planejados',
    'analytics.period': 'No período selecionado',
    'analytics.of_total': 'do total',
  },
  de: {
    // Dashboard
    'dashboard.greeting.morning': 'Guten Morgen',
    'dashboard.greeting.afternoon': 'Guten Tag',
    'dashboard.greeting.evening': 'Guten Abend',
    'dashboard.subtitle': 'Verfolgen Sie Ihre Fortschritte und verwirklichen Sie weiterhin Ihre Träume',
    'dashboard.plan.free': 'Kostenlos',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.goals': 'Ziele',
    'nav.budgets': 'Budgets',
    'nav.analytics': 'Analysen',
    'nav.settings': 'Einstellungen',
    
    // Financial Summary
    'financial.summary.title': 'Finanzübersicht',
    'financial.summary.total_balance': 'Gesamtsaldo',
    'financial.summary.monthly_income': 'Monatliches Einkommen',
    'financial.summary.monthly_expenses': 'Monatliche Ausgaben',
    'financial.summary.savings': 'Ersparnisse',
    
    // Transactions
    'transactions.title': 'Aktuelle Transaktionen',
    'transactions.subtitle': 'Hier sind Ihre letzten Kontobewegungen.',
    'transactions.add': 'Hinzufügen',
    'transactions.description': 'Beschreibung',
    'transactions.category': 'Kategorie',
    'transactions.amount': 'Betrag',
    'transactions.actions': 'Aktionen',
    'transactions.edit': 'Bearbeiten',
    'transactions.delete': 'Löschen',
    'transactions.empty.title': 'Beginnen Sie Ihre Finanzreise!',
    'transactions.empty.subtitle': 'Es sind noch keine Transaktionen registriert. Wie wäre es mit Ihrer ersten Einnahme oder Ausgabe?\nJeder Schritt zählt für Ihre Träume! ✨',
    'transactions.empty.button': 'Erste Transaktion hinzufügen',
    
    // Goals
    'goals.title': 'Ihre Finanzziele 🎯',
    'goals.subtitle': 'Verbinden Sie Ihr Geld mit Ihren Träumen. Verfolgen Sie hier Ihren Fortschritt.',
    'goals.upgrade.title': 'Beschleunigen Sie Ihre Träume!',
    'goals.upgrade.description': 'Der kostenlose Plan erlaubt 2 Ziele. Upgraden Sie für unbegrenzte Ziele.',
    'goals.upgrade.link': 'Upgrade',
    
    // Budgets
    'budgets.title': 'Meine Budgets',
    'budgets.subtitle': 'Definieren Sie Ihre Ausgabengrenzen und überwachen Sie Ihre finanzielle Gesundheit.',
    'budgets.new': 'Neues Budget',
    'budgets.month_overview': 'Monatsübersicht',
    'budgets.performance': 'Ihre Gesamtleistung.',
    'budgets.total_expenses': 'Gesamtausgaben',
    'budgets.budgeted': 'Budgetiert',
    'budgets.remaining': 'Verbleibt',
    'budgets.category': 'Kategorie',
    'budgets.progress': 'Fortschritt',
    'budgets.spent': 'Ausgegeben',
    'budgets.empty.title': 'Kein Budget für {month} definiert',
    'budgets.empty.subtitle': 'Beginnen Sie mit der Organisation Ihrer Finanzen, indem Sie Ihr erstes Budget erstellen.',
    'budgets.premium.title': 'Entfesseln Sie die Macht der Budgets',
    'budgets.premium.description': 'Die Budgeterstellung ist eine exklusive Funktion des Premium-Plans. Haben Sie vollständige Kontrolle über Ihre Ausgaben, erhalten Sie intelligente Warnungen und beschleunigen Sie die Verwirklichung Ihrer Träume.',
    'budgets.premium.button': 'Auf Premium upgraden',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.subtitle': 'Verwalten Sie Ihre Kontoeinstellungen und Ihr Profil.',
    'settings.profile': 'Mein Profil',
    'settings.appearance': 'Erscheinungsbild',
    'settings.theme': 'App-Design',
    'settings.danger': 'Gefahrenbereich',
    'settings.danger.description': 'Die unten stehenden Aktionen sind destruktiv und können nicht rückgängig gemacht werden. Bitte seien Sie vorsichtig, bevor Sie fortfahren.',
    
    // Smart Insights
    'insights.title': 'Intelligente Einblicke',
    'insights.subtitle': '🚀 Unsere KI hat Möglichkeiten entdeckt, Ihre Träume zu beschleunigen!',
    'insights.learning': 'Unsere KI lernt über Ihre Finanzgewohnheiten.',
    'insights.learning.subtitle': 'Fügen Sie mehr Transaktionen hinzu, um personalisierte Einblicke zu erhalten!',
    'insights.priority.urgent': '🔥 Dringend',
    'insights.priority.important': '⚡ Wichtig',
    'insights.priority.tip': '💡 Tipp',
    'insights.view_all': 'Alle Einblicke anzeigen ({count})',
    
    // Next Action
    'next_action.title': 'Nächste Aktion',
    'next_action.subtitle': 'Personalisierte Empfehlung',
    'next_action.priority.urgent': 'Dringend',
    'next_action.priority.opportunity': 'Chance',
    'next_action.priority.suggestion': 'Vorschlag',
    
    // Auth
    'auth.login': 'Anmelden',
    'auth.signup': 'Konto erstellen',
    'auth.welcome_back': 'Willkommen zurück!',
    'auth.welcome_back.subtitle': 'Melden Sie sich in Ihrem Konto an, um Ihre Finanzreise fortzusetzen.',
    'auth.create_account': 'Erstellen Sie Ihr Konto',
    'auth.create_account.subtitle': 'Beginnen Sie noch heute damit, Ihre Beziehung zum Geld zu transformieren.',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.forgot_password': 'Passwort vergessen?',
    'auth.forgot_password.title': 'Passwort vergessen?',
    'auth.forgot_password.subtitle': 'Kein Problem. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Erstellen eines neuen Passworts.',
    'auth.reset_link': 'Zurücksetzungslink senden',
    'auth.back_to_login': 'Zurück zur Anmeldung',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.success': 'Erfolgreich',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.add': 'Hinzufügen',
    'common.close': 'Schließen',
    'common.confirm': 'Bestätigen',
    'common.previous': 'Vorherige',
    'common.next': 'Nächste',
    
    // Analytics
    'analytics.title': '📊 Finanz-Analytics',
    'analytics.subtitle': 'Intelligente Analyse Ihrer Ausgaben und finanziellen Muster',
    'analytics.total_expenses': 'Gesamtausgaben',
    'analytics.fixed_expenses': 'Fixkosten',
    'analytics.variable_expenses': 'Variable Ausgaben',
    'analytics.unplanned': 'Ungeplant',
    'analytics.period': 'Im ausgewählten Zeitraum',
    'analytics.of_total': 'der Gesamtsumme',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('plenus-language');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('plenus-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  };

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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency, formatDate }}>
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
