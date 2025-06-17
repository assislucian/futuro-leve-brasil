
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
import { AdvancedInsightsCard } from "@/components/insights/AdvancedInsightsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Target, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

  const getGreetingEmoji = () => {
    if (currentHour < 12) return "🌅";
    if (currentHour < 18) return "☀️";
    return "🌙";
  };

  const getMotivationalMessage = () => {
    if (currentHour < 12) return "Comece o dia construindo seus sonhos!";
    if (currentHour < 18) return "Continue firme na jornada dos seus objetivos!";
    return "Reflita sobre seus progressos e planeje o amanhã!";
  };

  const getPlanBadge = () => {
    if (profile?.plan === 'premium') {
      return { text: '✨ Premium', variant: 'default' as const, color: 'bg-gradient-to-r from-amber-500 to-yellow-600' };
    }
    return { text: '🆓 Gratuito', variant: 'secondary' as const, color: 'bg-gradient-to-r from-gray-500 to-gray-600' };
  };

  const planBadge = getPlanBadge();

  if (isLoadingHasTransactions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="space-y-3">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-5 w-96" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Aprimorado */}
          <header className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between flex-wrap gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      {getGreeting()}, {firstName}! {getGreetingEmoji()}
                    </h1>
                    <Badge 
                      className={cn(
                        "text-white font-semibold px-3 py-1.5 text-sm shadow-lg",
                        planBadge.color
                      )}
                    >
                      {planBadge.text}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {getMotivationalMessage()}
                    </p>
                    <p className="text-sm text-muted-foreground/80 max-w-2xl">
                      Cada decisão financeira de hoje constrói o futuro que você sonha. Vamos acelerar seus objetivos juntos! 🚀
                    </p>
                  </div>
                </div>
                
                {/* Central de Ações Estratégicas */}
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">
                    Ações Rápidas
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <AddTransactionDialog>
                      <Button 
                        size="lg" 
                        className="h-12 gap-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 transition-all duration-300 transform hover:scale-105"
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span className="font-semibold">Nova Transação</span>
                      </Button>
                    </AddTransactionDialog>

                    <Button 
                      asChild
                      size="lg" 
                      variant="outline"
                      className="h-12 gap-3 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-950/30 transition-all duration-300 group"
                    >
                      <Link to="/goals">
                        <Target className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Nova Meta</span>
                      </Link>
                    </Button>

                    <Button 
                      asChild
                      size="lg" 
                      variant="outline"
                      className="h-12 gap-3 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-800 dark:hover:bg-purple-950/30 transition-all duration-300 group"
                    >
                      <Link to="/analytics">
                        <TrendingUp className="h-5 w-5 text-purple-600 group-hover:text-purple-700" />
                        <span className="font-semibold text-purple-700 dark:text-purple-300">Ver Insights</span>
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Ações Secundárias */}
                  <div className="flex items-center gap-2 justify-center">
                    <AddRecurringTransactionDialog />
                    <AddInstallmentPlanDialog />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Layout Principal Otimizado */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Coluna Principal (2/3 da tela) */}
            <div className="xl:col-span-2 space-y-8">
              {/* Insights de IA Premium - Destaque Máximo */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-2xl blur opacity-20"></div>
                <div className="relative">
                  <AdvancedInsightsCard />
                </div>
              </div>
              
              {/* Resumo Financeiro Aprimorado */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-purple-950/20 p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-card-foreground">Resumo Financeiro Inteligente</h2>
                  </div>
                </div>
                <FinancialSummary />
              </div>
              
              {/* Transações com Melhor Contexto */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20 p-4 border-b border-border/50">
                  <h2 className="text-xl font-bold text-card-foreground">Histórico & Tendências</h2>
                  <p className="text-sm text-muted-foreground mt-1">Acompanhe cada movimento em direção aos seus sonhos</p>
                </div>
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar Estratégica (1/3 da tela) */}
            <div className="xl:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 sidebar-cards">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-1 shadow-lg">
                  <div className="bg-card rounded-xl">
                    <NextActionCard />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl p-1 shadow-lg">
                  <div className="bg-card rounded-xl">
                    <GoalsSummary />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-1 shadow-lg">
                  <div className="bg-card rounded-xl">
                    <BudgetsSummary />
                  </div>
                </div>
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
