
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
        <div className="min-h-screen bg-background p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
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
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 space-y-6">
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
            <div className="col-span-8 space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
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
      <div className="min-h-screen bg-background p-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
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

        {/* CSS Grid Layout de 12 colunas */}
        <div className="grid grid-cols-12 gap-6">
          {/* Cards laterais - 4 colunas (span 1-4) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="w-full p-6 bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <SmartInsightsCard />
            </div>
            <div className="w-full p-6 bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <NextActionCard />
            </div>
            <div className="w-full p-6 bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <GoalsSummary />
            </div>
            <div className="w-full p-6 bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <BudgetsSummary />
            </div>
          </div>
          
          {/* Feed de transações centralizado - 8 colunas (span 5-12) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Resumo financeiro - width completo */}
            <div className="w-full p-6 bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <FinancialSummary />
            </div>
            
            {/* Lista de transações */}
            <div className="w-full p-6 bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
              <TransactionList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardPage as Dashboard };
export default DashboardPage;
