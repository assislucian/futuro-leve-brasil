
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
      <div className="flex flex-col gap-10 min-h-screen bg-gradient-to-br from-slate-50/70 via-white to-blue-50/40 p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-5 w-[480px]" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-52" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-[600px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
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
      <div className="flex flex-col gap-10 min-h-screen bg-gradient-to-br from-slate-50/70 via-white to-blue-50/40 p-6 md:p-8">
        {/* Header Premium com melhor hierarquia */}
        <div className="flex items-start justify-between flex-wrap gap-8">
          <div className="space-y-5">
            <div className="flex items-center gap-5 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                {getGreeting()}, {firstName}! {getGreetingEmoji()}
              </h1>
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-emerald-50 to-blue-50 text-slate-700 border-emerald-200/50 font-medium px-4 py-2 shadow-sm text-sm"
              >
                ✨ Versão Gratuita
              </Badge>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl font-light">
              Aqui está um resumo da sua jornada financeira hoje. Continue construindo seus sonhos! 🚀
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </div>
        </div>

        {/* Layout Premium com grid otimizado */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna principal - 2/3 da tela */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 p-1">
              <FinancialSummary />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 p-1">
              <TransactionList />
            </div>
          </div>
          
          {/* Sidebar - 1/3 da tela com cards bem espaçados */}
          <div className="lg:col-span-4 space-y-7">
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
