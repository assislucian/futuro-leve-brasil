
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
import { PlusCircle, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { data: hasTransactions, isLoading: isLoadingHasTransactions } = useHasTransactions();
  
  const firstName = user?.user_metadata.full_name?.split(' ')[0] || 'pessoa';
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Bom dia";
    if (currentHour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getPlanBadge = () => {
    if (profile?.plan === 'premium') {
      return { text: 'Premium', variant: 'default' as const, className: 'bg-emerald-500 text-white' };
    }
    return { text: 'Gratuito', variant: 'secondary' as const, className: 'bg-slate-100 text-slate-600' };
  };

  const planBadge = getPlanBadge();

  if (isLoadingHasTransactions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Simplificado */}
          <header className="flex items-start justify-between mb-8 bg-card rounded-lg border p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  {getGreeting()}, {firstName}!
                </h1>
                <Badge className={cn("text-xs font-medium", planBadge.className)}>
                  {planBadge.text}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Acompanhe seus progressos e continue construindo seus objetivos
              </p>
            </div>
            
            {/* Ações Centralizadas */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-medium text-muted-foreground uppercase">
                Ações Rápidas
              </div>
              <div className="flex items-center gap-2">
                <AddTransactionDialog>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Transação
                  </Button>
                </AddTransactionDialog>

                <Button asChild size="sm" variant="outline">
                  <Link to="/goals">
                    <Target className="h-4 w-4 mr-2" />
                    Nova Meta
                  </Link>
                </Button>

                <Button asChild size="sm" variant="outline">
                  <Link to="/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Insights
                  </Link>
                </Button>
              </div>
              
              {/* Ações Secundárias */}
              <div className="flex gap-2">
                <AddRecurringTransactionDialog />
                <AddInstallmentPlanDialog />
              </div>
            </div>
          </header>

          {/* Layout Principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="xl:col-span-2 space-y-6">
              {/* Resumo Financeiro */}
              <div className="bg-card rounded-lg border">
                <FinancialSummary />
              </div>
              
              {/* Transações */}
              <div className="bg-card rounded-lg border">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <SmartInsightsCard />
              <NextActionCard />
              <GoalsSummary />
              <BudgetsSummary />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardPage as Dashboard };
export default DashboardPage;
