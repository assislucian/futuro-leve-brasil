
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

  const getGreetingEmoji = () => {
    if (currentHour < 12) return "🌅";
    if (currentHour < 18) return "☀️";
    return "🌙";
  };

  if (isLoadingHasTransactions) {
    return (
      <div className="flex flex-col gap-8 min-h-screen bg-slate-50/30 p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4 space-y-5">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
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
      <div className="flex flex-col gap-8 min-h-screen bg-slate-50/30 p-6 md:p-8">
        {/* Header mais limpo e profissional */}
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
                {getGreeting()}, {firstName}! {getGreetingEmoji()}
              </h1>
              <Badge 
                variant="secondary" 
                className="bg-slate-100 text-slate-600 border-slate-200 font-medium px-3 py-1 text-sm"
              >
                Versão Gratuita
              </Badge>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Acompanhe seus progressos financeiros e continue construindo seus sonhos
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </div>
        </div>

        {/* Layout com grid mais limpo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <FinancialSummary />
            </div>
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <TransactionList />
            </div>
          </div>
          
          {/* Sidebar mais limpa */}
          <div className="lg:col-span-4 space-y-5">
            <SmartInsightsCard />
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
