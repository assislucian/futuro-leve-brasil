
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
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: hasTransactions, isLoading: isLoadingHasTransactions } = useHasTransactions();
  
  const firstName = user?.user_metadata.full_name?.split(' ')[0] || 'pessoa';
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Bom dia";
    if (currentHour < 18) return "Boa tarde";
    return "Boa noite";
  };

  if (isLoadingHasTransactions) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-80" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasTransactions) {
    return <WelcomeGuide />;
  }

  return (
    <>
      <GoalCompletionCelebration />
      <div className="flex flex-col gap-8">
        {/* Header mais humanizado */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {getGreeting()}, {firstName}! 👋
              </h1>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                Versão Gratuita
              </div>
            </div>
            <p className="text-lg text-slate-600">
              Aqui está um resumo da sua jornada financeira hoje. Continue construindo seus sonhos! 🚀
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </div>
        </div>

        {/* Layout otimizado para clareza */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal - informações essenciais */}
          <div className="lg:col-span-2 space-y-8">
            <FinancialSummary />
            <TransactionList />
          </div>
          
          {/* Sidebar - ações e insights */}
          <div className="lg:col-span-1 space-y-6">
            <NextActionCard />
            <GoalsSummary />
            <BudgetsSummary />
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardPage as Dashboard };
export default DashboardPage;
