
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

  if (isLoadingHasTransactions) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Olá, {firstName}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Bem-vindo(a) de volta ao controle da sua vida financeira.</p>
          </div>
          <div className="flex items-center gap-2">
            <AddRecurringTransactionDialog />
            <AddInstallmentPlanDialog />
            <AddTransactionDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FinancialSummary />
            <TransactionList />
          </div>
          
          <div className="lg:col-span-1 flex flex-col gap-6">
            <NextActionCard />
            <BudgetsSummary />
            <GoalsSummary />
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardPage as Dashboard };
export default DashboardPage;
