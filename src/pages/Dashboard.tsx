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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
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
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-80 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Trial Banner */}
          <div className="mb-6">
            <TrialBanner />
          </div>

          {/* Header */}
          <header className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                  {getGreeting()}, {firstName}! {getGreetingEmoji()}
                </h1>
                <Badge 
                  variant={planBadge.variant}
                  className="bg-secondary text-secondary-foreground border border-border font-medium px-2 py-1 text-xs"
                >
                  {planBadge.text}
                </Badge>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Acompanhe seus progressos e continue construindo seus sonhos
              </p>
            </div>
            
            {/* Ações Rápidas Funcionais */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Nova Transação - Dialog Funcional */}
              <AddTransactionDialog>
                <Button 
                  size="sm" 
                  className="h-9 gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm transition-all duration-200"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Nova Transação</span>
                </Button>
              </AddTransactionDialog>

              {/* Nova Meta - Link para Página de Metas */}
              <Button 
                asChild
                size="sm" 
                variant="outline"
                className="h-9 gap-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
              >
                <Link to="/goals">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span className="hidden sm:inline">Nova Meta</span>
                </Link>
              </Button>

              {/* Transação Recorrente - Dialog Funcional */}
              <AddRecurringTransactionDialog />

              {/* Parcelamento - Dialog Funcional */}
              <AddInstallmentPlanDialog />

              {/* Novo Orçamento - Link para Página de Orçamentos */}
              <Button 
                asChild
                size="sm" 
                variant="outline"
                className="h-9 gap-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
              >
                <Link to="/budgets">
                  <Calculator className="h-4 w-4 text-orange-600" />
                  <span className="hidden sm:inline">Orçamento</span>
                </Link>
              </Button>
            </div>
          </header>

          {/* Layout Principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Coluna Principal (2/3 da tela) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Resumo Financeiro */}
              <div className="bg-card rounded-lg border border-border shadow-sm">
                <FinancialSummary />
              </div>
              
              {/* Transações */}
              <div className="bg-card rounded-lg border border-border shadow-sm">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar (1/3 da tela) */}
            <div className="xl:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 sidebar-cards">
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
