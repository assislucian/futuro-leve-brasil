
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
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
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Trial Banner - mais sutil */}
          {(hasTrialAccess || isTrialing) && (
            <div className="mb-6">
              <TrialBanner variant={trialDaysLeft <= 2 ? "urgent" : "dashboard"} />
            </div>
          )}

          {/* Header simplificado */}
          <header className="flex items-start justify-between flex-wrap gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  {getGreeting()}, {firstName}! {getGreetingEmoji()}
                </h1>
                <Badge className={isTrialing ? "bg-gradient-to-r from-yellow-100 to-amber-50 text-amber-900 border border-amber-200 font-semibold" : "bg-gradient-to-r from-teal-100 to-teal-50 text-teal-800 border border-teal-200 font-medium"}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isTrialing ? `Premium Trial (${trialDaysLeft}d)` : "Gratuito"}
                </Badge>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">
                {isTrialing 
                  ? `✨ Aproveitando todas as funcionalidades Premium! ${trialDaysLeft <= 2 ? 'Últimos dias para decidir!' : ''}` 
                  : "Acompanhe seus progressos e continue construindo seus sonhos"
                }
              </p>
            </div>
            
            {/* Ações mais clean */}
            <div className="flex items-center gap-3 flex-wrap">
              <AddTransactionDialog>
                <Button className="bg-gradient-to-r from-teal-600 to-teal-500 text-white font-medium shadow-lg shadow-teal-500/25 border-0 h-10 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </AddTransactionDialog>

              <Button 
                asChild
                className="border-2 border-teal-200 bg-teal-50 text-teal-700 font-medium hover:bg-teal-100 hover:border-teal-300 h-10 px-4 rounded-xl transition-all duration-200"
              >
                <Link to="/goals">
                  <Target className="h-4 w-4 mr-2" />
                  Nova Meta
                </Link>
              </Button>

              <AddRecurringTransactionDialog>
                <Button className="border-2 border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 hover:border-blue-300 h-10 px-4 rounded-xl transition-all duration-200">
                  <Repeat className="h-4 w-4 mr-2" />
                  Recorrente
                </Button>
              </AddRecurringTransactionDialog>

              <AddInstallmentPlanDialog>
                <Button className="border-2 border-purple-200 bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 hover:border-purple-300 h-10 px-4 rounded-xl transition-all duration-200">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Parcelas
                </Button>
              </AddInstallmentPlanDialog>

              <Button 
                asChild
                className="border-2 border-purple-200 bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 hover:border-purple-300 h-10 px-4 rounded-xl transition-all duration-200"
              >
                <Link to="/budgets">
                  <Calculator className="h-4 w-4 mr-2" />
                  Orçamento
                </Link>
              </Button>
            </div>
          </header>

          {/* Layout Principal mais clean */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="xl:col-span-2 space-y-8">
              {/* Resumo Financeiro */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg shadow-black/5">
                <FinancialSummary />
              </div>
              
              {/* Transações */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg shadow-black/5">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar */}
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
