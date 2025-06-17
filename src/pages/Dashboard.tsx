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
import { PlusCircle, Target, Calculator, Sparkles, Repeat, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrialBanner } from "@/components/TrialBanner";

const DashboardPage = () => {
  const { user, isTrialing, trialDaysLeft, hasTrialAccess } = useAuth();
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
      <div className="min-h-screen plenus-bg-gradient">
        <div className="plenus-container py-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-72 rounded-xl" />
              <Skeleton className="h-4 w-80 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
          <div className="plenus-spacing-lg">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 plenus-gap-lg">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
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
      <div className="min-h-screen plenus-bg-gradient">
        <div className="plenus-container py-6">
          {/* Trial Banner Estratégico */}
          <div className="mb-6">
            <TrialBanner variant={trialDaysLeft <= 2 ? "urgent" : "dashboard"} />
          </div>

          {/* Header com estilo Plenus */}
          <header className="flex items-start justify-between flex-wrap gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-semibold plenus-text-gradient leading-tight">
                  {getGreeting()}, {firstName}! {getGreetingEmoji()}
                </h1>
                <Badge className={isTrialing ? "plenus-badge-gold" : "plenus-badge-teal"}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isTrialing ? `Premium Trial (${trialDaysLeft}d)` : "Gratuito"}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {isTrialing 
                  ? `✨ Aproveitando todas as funcionalidades Premium! ${trialDaysLeft <= 2 ? 'Últimos dias para decidir!' : ''}` 
                  : "Acompanhe seus progressos e continue construindo seus sonhos"
                }
              </p>
            </div>
            
            {/* Ações Rápidas com estilo Plenus - CORRIGIDAS */}
            <div className="flex items-center plenus-gap flex-wrap">
              {/* Nova Transação - Botão Principal */}
              <AddTransactionDialog>
                <Button className="plenus-btn-primary h-10 px-6 rounded-xl plenus-hover-lift">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nova Transação</span>
                </Button>
              </AddTransactionDialog>

              {/* Nova Meta */}
              <Button 
                asChild
                className="plenus-btn-outline-teal h-10 px-4 rounded-xl plenus-hover-lift"
              >
                <Link to="/goals">
                  <Target className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nova Meta</span>
                </Link>
              </Button>

              {/* Transação Recorrente - CORRIGIDO */}
              <AddRecurringTransactionDialog>
                <Button className="plenus-btn-outline-blue h-10 px-4 rounded-xl plenus-hover-lift">
                  <Repeat className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Recorrente</span>
                </Button>
              </AddRecurringTransactionDialog>

              {/* Parcelamento - CORRIGIDO */}
              <AddInstallmentPlanDialog>
                <Button className="plenus-btn-outline-purple h-10 px-4 rounded-xl plenus-hover-lift">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Parcelas</span>
                </Button>
              </AddInstallmentPlanDialog>

              {/* Novo Orçamento */}
              <Button 
                asChild
                className="plenus-btn-outline-purple h-10 px-4 rounded-xl plenus-hover-lift"
              >
                <Link to="/budgets">
                  <Calculator className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Orçamento</span>
                </Link>
              </Button>
            </div>
          </header>

          {/* Layout Principal com espaçamento Plenus */}
          <div className="grid grid-cols-1 xl:grid-cols-3 plenus-gap-lg">
            {/* Coluna Principal (2/3 da tela) */}
            <div className="xl:col-span-2 plenus-spacing-lg">
              {/* Resumo Financeiro */}
              <div className="plenus-card-highlighted">
                <FinancialSummary />
              </div>
              
              {/* Transações */}
              <div className="plenus-card">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar (1/3 da tela) */}
            <div className="xl:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 plenus-gap-lg sidebar-cards">
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
