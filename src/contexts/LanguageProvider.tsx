import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'de';

interface LanguageContextType {
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

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Função para detectar idioma do navegador
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'pt';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('pt')) return 'pt';
  
  // Fallback para português (mercado principal)
  return 'pt';
};

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
    'auth.email_placeholder': 'seu@email.com',
    'auth.password': 'Senha',
    'auth.password_placeholder': 'Sua senha',
    'auth.forgot_password': 'Esqueceu a senha?',
    'auth.forgot_password.title': 'Esqueceu a senha?',
    'auth.forgot_password.subtitle': 'Sem problema. Digite seu e-mail e enviaremos um link para criar uma nova senha.',
    'auth.forgot_password.success': 'Se o e-mail estiver correto, enviamos um link para redefinir sua senha.',
    'auth.forgot_password.sending': 'Enviando...',
    'auth.forgot_password.remembered': 'Lembrou da senha?',
    'auth.reset_link': 'Enviar Link de Redefinição',
    'auth.back_to_login': 'Voltar ao Login',
    
    // Auth Login Messages
    'auth.login.many_attempts': 'Muitas tentativas incorretas. Verifique suas credenciais ou redefina sua senha.',
    'auth.login.invalid_credentials': 'Email ou senha incorretos. Verifique e tente novamente.',
    'auth.login.email_not_confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'auth.login.too_many_requests': 'Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.',
    'auth.login.user_not_found': 'Conta não encontrada. Verifique o email ou crie uma nova conta.',
    'auth.login.rate_limit': 'Limite de tentativas excedido. Aguarde alguns minutos.',
    'auth.login.generic_error': 'Erro no login. Tente novamente em alguns minutos.',
    'auth.login.system_error': 'Erro no sistema. Tente novamente em alguns minutos.',
    'auth.login.success': 'Login realizado com sucesso! Bem-vindo(a) de volta.',
    'auth.login.logging_in': 'Entrando...',
    'auth.login.help_text': 'Problemas para acessar? Tente',
    'auth.login.reset_password': 'redefinir sua senha',
    'auth.login.contact_support': 'ou entre em contato conosco se precisar de ajuda.',
    
    // Auth Signup
    'auth.signup.full_name': 'Nome Completo',
    'auth.signup.full_name_placeholder': 'Digite seu nome completo',
    'auth.signup.password_placeholder': 'Crie uma senha forte',
    'auth.signup.confirm_password': 'Confirmar Senha',
    'auth.signup.confirm_password_placeholder': 'Digite a senha novamente',
    'auth.signup.passwords_no_match': 'As senhas não coincidem',
    'auth.signup.terms_text': 'Eu li e aceito os',
    'auth.signup.terms': 'Termos de Serviço',
    'auth.signup.and': 'e a',
    'auth.signup.privacy': 'Política de Privacidade',
    'auth.signup.security_title': '100% Seguro:',
    'auth.signup.security_text': 'Seus dados são criptografados com protocolo TLS 1.3 e protegidos por autenticação multifator. Nunca compartilhamos informações pessoais com terceiros.',
    'auth.signup.creating': 'Criando conta...',
    'auth.signup.create_account': 'Criar Conta Gratuita',
    'auth.signup.free_trial_text': 'Ao criar sua conta, você terá acesso a 7 dias gratuitos de todas as funcionalidades Premium.',
    
    // Auth Update Password
    'auth.update_password.title': 'Criar Nova Senha',
    'auth.update_password.subtitle': 'Digite sua nova senha para proteger sua conta.',
    'auth.update_password.new_password': 'Nova Senha',
    'auth.update_password.password_placeholder': 'Mínimo 6 caracteres',
    'auth.update_password.confirm_password': 'Confirmar Senha',
    'auth.update_password.confirm_placeholder': 'Digite a senha novamente',
    'auth.update_password.updating': 'Atualizando...',
    'auth.update_password.update': 'Atualizar Senha',
    'auth.update_password.success': 'Senha atualizada com sucesso!',
    'auth.update_password.invalid_link': 'Link inválido ou expirado',
    
    // Validation
    'validation.required': 'Este campo é obrigatório',
    'validation.email.invalid': 'Por favor, insira um email válido',
    'validation.password.min': 'A senha deve ter pelo menos {min} caracteres',
    'validation.password.mismatch': 'As senhas não coincidem',
    'validation.number.min': 'O valor deve ser pelo menos {min}',
    'validation.number.max': 'O valor deve ser no máximo {max}',
    
    // Time relative
    'time.now': 'agora',
    'time.minute_ago': 'há um minuto',
    'time.minutes_ago': 'há {count} minutos',
    'time.hour_ago': 'há uma hora',
    'time.hours_ago': 'há {count} horas',
    'time.day_ago': 'há um dia',
    'time.days_ago': 'há {count} dias',
    'time.week_ago': 'há uma semana',
    'time.weeks_ago': 'há {count} semanas',
    'time.month_ago': 'há um mês',
    'time.months_ago': 'há {count} meses',
    'time.year_ago': 'há um ano',
    'time.years_ago': 'há {count} anos',
    
    // Plurals
    'item.count': '{count} item',
    'items.count': '{count} itens',
    'goal.count': '{count} meta',
    'goals.count': '{count} metas',
    'transaction.count': '{count} transação',
    'transactions.count': '{count} transações',
    
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
    'auth.email_placeholder': 'ihre@email.com',
    'auth.password': 'Passwort',
    'auth.password_placeholder': 'Ihr Passwort',
    'auth.forgot_password': 'Passwort vergessen?',
    'auth.forgot_password.title': 'Passwort vergessen?',
    'auth.forgot_password.subtitle': 'Kein Problem. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Erstellen eines neuen Passworts.',
    'auth.forgot_password.success': 'Wenn die E-Mail korrekt ist, haben wir einen Link zum Zurücksetzen Ihres Passworts gesendet.',
    'auth.forgot_password.sending': 'Wird gesendet...',
    'auth.forgot_password.remembered': 'Passwort wieder eingefallen?',
    'auth.reset_link': 'Zurücksetzungslink senden',
    'auth.back_to_login': 'Zurück zur Anmeldung',
    
    // Auth Login Messages
    'auth.login.many_attempts': 'Zu viele falsche Versuche. Überprüfen Sie Ihre Anmeldedaten oder setzen Sie Ihr Passwort zurück.',
    'auth.login.invalid_credentials': 'E-Mail oder Passwort falsch. Überprüfen Sie und versuchen Sie es erneut.',
    'auth.login.email_not_confirmed': 'E-Mail nicht bestätigt. Überprüfen Sie Ihren Posteingang.',
    'auth.login.too_many_requests': 'Zu viele Versuche. Warten Sie 5 Minuten, bevor Sie es erneut versuchen.',
    'auth.login.user_not_found': 'Konto nicht gefunden. Überprüfen Sie die E-Mail oder erstellen Sie ein neues Konto.',
    'auth.login.rate_limit': 'Versuchslimit überschritten. Warten Sie einige Minuten.',
    'auth.login.generic_error': 'Anmeldefehler. Versuchen Sie es in einigen Minuten erneut.',
    'auth.login.system_error': 'Systemfehler. Versuchen Sie es in einigen Minuten erneut.',
    'auth.login.success': 'Anmeldung erfolgreich! Willkommen zurück.',
    'auth.login.logging_in': 'Anmelden...',
    'auth.login.help_text': 'Probleme beim Zugriff? Versuchen Sie',
    'auth.login.reset_password': 'Ihr Passwort zurückzusetzen',
    'auth.login.contact_support': 'oder kontaktieren Sie uns, wenn Sie Hilfe benötigen.',
    
    // Auth Signup
    'auth.signup.full_name': 'Vollständiger Name',
    'auth.signup.full_name_placeholder': 'Geben Sie Ihren vollständigen Namen ein',
    'auth.signup.password_placeholder': 'Erstellen Sie ein starkes Passwort',
    'auth.signup.confirm_password': 'Passwort bestätigen',
    'auth.signup.confirm_password_placeholder': 'Passwort erneut eingeben',
    'auth.signup.passwords_no_match': 'Die Passwörter stimmen nicht überein',
    'auth.signup.terms_text': 'Ich habe gelesen und akzeptiere die',
    'auth.signup.terms': 'Nutzungsbedingungen',
    'auth.signup.and': 'und die',
    'auth.signup.privacy': 'Datenschutzrichtlinie',
    'auth.signup.security_title': '100% Sicher:',
    'auth.signup.security_text': 'Ihre Daten sind mit TLS 1.3-Protokoll verschlüsselt und durch Multi-Faktor-Authentifizierung geschützt. Wir teilen niemals persönliche Informationen mit Dritten.',
    'auth.signup.creating': 'Konto wird erstellt...',
    'auth.signup.create_account': 'Kostenloses Konto erstellen',
    'auth.signup.free_trial_text': 'Durch die Erstellung Ihres Kontos erhalten Sie 7 Tage kostenlosen Zugang zu allen Premium-Funktionen.',
    
    // Auth Update Password
    'auth.update_password.title': 'Neues Passwort erstellen',
    'auth.update_password.subtitle': 'Geben Sie Ihr neues Passwort ein, um Ihr Konto zu sichern.',
    'auth.update_password.new_password': 'Neues Passwort',
    'auth.update_password.password_placeholder': 'Mindestens 6 Zeichen',
    'auth.update_password.confirm_password': 'Passwort bestätigen',
    'auth.update_password.confirm_placeholder': 'Passwort erneut eingeben',
    'auth.update_password.updating': 'Wird aktualisiert...',
    'auth.update_password.update': 'Passwort aktualisieren',
    'auth.update_password.success': 'Passwort erfolgreich aktualisiert!',
    'auth.update_password.invalid_link': 'Ungültiger oder abgelaufener Link',
    
    // Validation
    'validation.required': 'Dieses Feld ist erforderlich',
    'validation.email.invalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'validation.password.min': 'Das Passwort muss mindestens {min} Zeichen lang sein',
    'validation.password.mismatch': 'Die Passwörter stimmen nicht überein',
    'validation.number.min': 'Der Wert muss mindestens {min} sein',
    'validation.number.max': 'Der Wert darf höchstens {max} sein',
    
    // Time relative
    'time.now': 'jetzt',
    'time.minute_ago': 'vor einer Minute',
    'time.minutes_ago': 'vor {count} Minuten',
    'time.hour_ago': 'vor einer Stunde',
    'time.hours_ago': 'vor {count} Stunden',
    'time.day_ago': 'vor einem Tag',
    'time.days_ago': 'vor {count} Tagen',
    'time.week_ago': 'vor einer Woche',
    'time.weeks_ago': 'vor {count} Wochen',
    'time.month_ago': 'vor einem Monat',
    'time.months_ago': 'vor {count} Monaten',
    'time.year_ago': 'vor einem Jahr',
    'time.years_ago': 'vor {count} Jahren',
    
    // Plurals
    'item.count': '{count} Element',
    'items.count': '{count} Elemente',
    'goal.count': '{count} Ziel',
    'goals.count': '{count} Ziele',
    'transaction.count': '{count} Transaktion',
    'transactions.count': '{count} Transaktionen',
    
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

  const formatRelativeTime = (date: Date | string): string => {
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

  const plural = (count: number, key: string): string => {
    // Simple pluralization logic
    const singularKey = `${key}.count`;
    const pluralKey = `${key}s.count`;
    
    if (count === 1) {
      return t(singularKey, { count });
    }
    return t(pluralKey, { count });
  };

  // Always false for current supported languages (pt and de)
  const isRTL = false;

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      formatCurrency, 
      formatDate, 
      formatNumber,
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
