
import React from "react";
import FinancialSummary from "@/components/FinancialSummary";
import TransactionList from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { AddRecurringTransactionDialog } from "@/components/AddRecurringTransactionDialog";
import { AddInstallmentPlanDialog } from "@/components/AddInstallmentPlanDialog";
import { useAuth } from "@/hooks/useAuth";
import GoalsSummary from "@/components/GoalsSummary";
import BudgetsSummary from "@/components/BudgetsSummary";
import { NextActionCard } from "@/components/NextActionCard";
import { GoalCompletionCelebration } from "@/components/GoalCompletionCelebration";
import { useHasTransactions } from "@/hooks/useHasTransactions";
import { WelcomeGuide } from "@/components/WelcomeGuide";
import { SmartInsightsCard } from "@/components/SmartInsightsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageProvider";
import { SEOHead } from "@/components/SEOHead";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: hasTransactions, isLoading: isLoadingHasTransactions } = useHasTransactions();
  const { t } = useLanguage();
  
  const firstName = user?.user_metadata.full_name?.split(' ')[0] || (t('dashboard.greeting.morning').includes('Guten') ? 'Person' : 'pessoa');
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return t('dashboard.greeting.morning');
    if (currentHour < 18) return t('dashboard.greeting.afternoon');
    return t('dashboard.greeting.evening');
  };

  const getGreetingEmoji = () => {
    if (currentHour < 12) return "🌅";
    if (currentHour < 18) return "☀️";
    return "🌙";
  };

  if (isLoadingHasTransactions) {
    return (
      <>
        <SEOHead 
          title={t('nav.dashboard')}
          description={t('dashboard.subtitle')}
        />
        <div className="flex flex-col gap-6 min-h-screen bg-background p-4 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-56 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!hasTransactions) {
    return (
      <>
        <SEOHead 
          title={t('nav.dashboard')}
          description={t('dashboard.subtitle')}
        />
        <WelcomeGuide />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title={t('nav.dashboard')}
        description={t('dashboard.subtitle')}
      />
      <GoalCompletionCelebration />
      <div className="flex flex-col gap-6 min-h-screen bg-background p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                {getGreeting()}, {firstName}! {getGreetingEmoji()}
              </h1>
              <Badge 
                variant="secondary" 
                className="bg-secondary text-secondary-foreground border border-border font-medium px-2 py-1 text-xs"
              >
                {t('dashboard.plan.free')}
              </Badge>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              {t('dashboard.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </div>
        </div>

        {/* Layout otimizado com melhor distribuição do espaço */}
        <div className="grid grid-cols-1 gap-6">
          {/* Resumo financeiro - width completo */}
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <FinancialSummary />
          </div>
          
          {/* Grid principal com proporções melhoradas */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Coluna principal - Transações (60% do espaço) */}
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-card rounded-lg border border-border shadow-sm h-fit">
                <TransactionList />
              </div>
            </div>
            
            {/* Coluna lateral - Insights e resumos (40% do espaço) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Cards de insights */}
              <div className="space-y-4">
                <SmartInsightsCard />
                <NextActionCard />
              </div>
              
              {/* Grid 2x1 para Goals e Budgets em telas grandes, stack em mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                <GoalsSummary />
                <BudgetsSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardPage as Dashboard };
export default DashboardPage;
