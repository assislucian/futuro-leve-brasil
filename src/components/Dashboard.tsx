
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
 * Ponto central da aplicação onde o usuário visualiza seu resumo financeiro
 * Agora inclui onboarding interativo para novos usuários
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
      <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <LoadingState variant="dashboard" />
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
      <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header otimizado com melhor hierarquia visual */}
        <header className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                {getGreeting()}, {firstName}! {getGreetingEmoji()}
              </h1>
              <Badge 
                variant="secondary" 
                className="bg-gray-100 text-gray-600 border-gray-200 font-medium px-2 py-1 text-xs"
              >
                Gratuito
              </Badge>
            </div>
            <p className="text-base text-gray-600 leading-relaxed max-w-xl">
              Acompanhe seus progressos e continue construindo seus sonhos
            </p>
          </div>
          
          <nav className="flex items-center gap-2 flex-wrap" role="navigation" aria-label="Ações rápidas">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </nav>
        </header>

        {/* Layout principal com grid responsivo otimizado */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Coluna principal - Resumo e transações */}
          <section className="lg:col-span-8 space-y-4" aria-label="Resumo financeiro e transações">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <FinancialSummary />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <TransactionList />
            </div>
          </section>
          
          {/* Sidebar - Insights e resumos */}
          <aside className="lg:col-span-4 space-y-4" aria-label="Insights e resumos">
            <SmartInsightsCard />
            <NextActionCard />
            <GoalsSummary />
            <BudgetsSummary />
          </aside>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
