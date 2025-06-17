
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
      <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-4 md:p-6">
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
    );
  }

  if (!hasTransactions) {
    return <WelcomeGuide />;
  }

  return (
    <>
      <GoalCompletionCelebration />
      <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header mais limpo e profissional */}
        <div className="flex items-start justify-between flex-wrap gap-4">
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
          
          <div className="flex items-center gap-2 flex-wrap">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </div>
        </div>

        {/* Layout com grid mais limpo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Coluna principal */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <FinancialSummary />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <TransactionList />
            </div>
          </div>
          
          {/* Sidebar mais limpa */}
          <div className="lg:col-span-4 space-y-4">
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
