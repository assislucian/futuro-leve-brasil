
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
import { LoadingState } from "@/components/ui/loading-state";
import { Badge } from "@/components/ui/badge";
import { OnboardingTour } from "@/components/OnboardingTour";

/**
 * Componente principal do Dashboard
 * Otimizado para navegação suave sem tremida
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { data: hasTransactions, isLoading: isLoadingHasTransactions } = useHasTransactions();
  
  const firstName = user?.user_metadata.full_name?.split(' ')[0] || 'pessoa';
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Bom dia";
    if (currentHour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getGreetingEmoji = () => {
    if (currentHour < 12) return "🌅";
    if (currentHour < 18) return "☀️";
    return "🌙";
  };

  if (isLoadingHasTransactions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-clean py-6 max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-2">
              <div className="h-8 w-72 bg-muted rounded animate-pulse" />
              <div className="h-4 w-80 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-32 bg-muted rounded animate-pulse" />
              <div className="h-9 w-32 bg-muted rounded animate-pulse" />
              <div className="h-9 w-36 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <LoadingState variant="dashboard" />
        </div>
      </div>
    );
  }

  if (!hasTransactions) {
    return (
      <>
        <OnboardingTour />
        <WelcomeGuide />
      </>
    );
  }

  return (
    <>
      <OnboardingTour />
      <GoalCompletionCelebration />
      <div className="min-h-screen bg-background">
        <div className="container-clean py-6 max-w-7xl">
          {/* Header otimizado sem tremida */}
          <header className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                  {getGreeting()}, {firstName}! {getGreetingEmoji()}
                </h1>
                <Badge 
                  variant="secondary" 
                  className="bg-secondary text-secondary-foreground border border-border font-medium px-2 py-1 text-xs flex-shrink-0"
                >
                  Gratuito
                </Badge>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Acompanhe seus progressos e continue construindo seus sonhos
              </p>
            </div>
            
            <nav className="flex items-center gap-2 flex-wrap flex-shrink-0" role="navigation" aria-label="Ações rápidas">
              <AddRecurringTransactionDialog />
              <AddInstallmentPlanDialog />
              <AddTransactionDialog />
            </nav>
          </header>

          {/* Layout Principal com grid estável */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="xl:col-span-2 space-y-6">
              {/* Resumo Financeiro */}
              <div className="card-modern">
                <FinancialSummary />
              </div>
              
              {/* Transações */}
              <div className="card-modern">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                <SmartInsightsCard />
                <NextActionCard />
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

export default Dashboard;
