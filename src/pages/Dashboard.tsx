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
import { PlusCircle, Target, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrialBanner } from "@/components/TrialBanner";

const DashboardPage = () => {
  const { user, isTrialing, profile } = useAuth();
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

  const getPlanBadge = () => {
    if (profile?.plan === 'premium') {
      return { text: 'Premium', variant: 'default' as const };
    }
    if (isTrialing) {
      return { text: 'Trial Premium', variant: 'secondary' as const };
    }
    return { text: 'Gratuito', variant: 'secondary' as const };
  };

  const planBadge = getPlanBadge();

  if (isLoadingHasTransactions) {
    return (
      <div className="min-h-screen bg-dashboard">
        <div className="container-premium py-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-72 bg-slate-200 rounded-lg" />
              <Skeleton className="h-4 w-80 bg-slate-100 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32 bg-slate-100 rounded-lg" />
              <Skeleton className="h-9 w-32 bg-slate-100 rounded-lg" />
              <Skeleton className="h-9 w-36 bg-slate-100 rounded-lg" />
            </div>
          </div>
          <div className="space-premium">
            <Skeleton className="h-40 w-full bg-slate-100 rounded-xl" />
            <Skeleton className="h-80 w-full bg-slate-100 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-premium">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full bg-slate-100 rounded-xl" />
              ))}
            </div>
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
      <div className="min-h-screen bg-dashboard">
        <div className="container-premium py-6">
          {/* Trial Banner */}
          <div className="mb-6">
            <TrialBanner />
          </div>

          {/* Header Premium */}
          <header className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 leading-tight">
                  {getGreeting()}, {firstName}! {getGreetingEmoji()}
                </h1>
                <Badge 
                  variant={planBadge.variant}
                  className={planBadge.variant === 'default' ? 'badge-premium' : 'badge-neutral'}
                >
                  {planBadge.text}
                </Badge>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Acompanhe seus progressos e continue construindo seus sonhos
              </p>
            </div>
            
            {/* Ações Rápidas Premium */}
            <div className="flex items-center gap-3 flex-wrap">
              <AddTransactionDialog>
                <Button 
                  size="sm" 
                  className="btn-primary-premium h-10 gap-2 px-4"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Nova Transação</span>
                </Button>
              </AddTransactionDialog>

              <Button 
                asChild
                size="sm" 
                className="btn-secondary-premium h-10 gap-2 px-4"
              >
                <Link to="/goals">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span className="hidden sm:inline">Nova Meta</span>
                </Link>
              </Button>

              <AddRecurringTransactionDialog />
              <AddInstallmentPlanDialog />

              <Button 
                asChild
                size="sm" 
                className="btn-secondary-premium h-10 gap-2 px-4"
              >
                <Link to="/budgets">
                  <Calculator className="h-4 w-4 text-emerald-600" />
                  <span className="hidden sm:inline">Orçamento</span>
                </Link>
              </Button>
            </div>
          </header>

          {/* Layout Principal Premium */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Coluna Principal (2/3 da tela) */}
            <div className="xl:col-span-2 space-premium">
              {/* Resumo Financeiro Premium */}
              <div className="card-premium">
                <FinancialSummary />
              </div>
              
              {/* Transações Premium */}
              <div className="card-premium">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar Premium (1/3 da tela) */}
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

export { DashboardPage as Dashboard };
export default DashboardPage;
