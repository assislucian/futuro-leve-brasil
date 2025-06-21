
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
import { DemoDataPopulator } from "@/components/DemoDataPopulator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Target, TrendingUp, MoreVertical, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WealthJourneyTour } from "@/components/WealthJourneyTour";
import { WealthJourneyTrigger } from "@/components/WealthJourneyTrigger";

const DashboardPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
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

  // Aguardar tanto auth quanto transações
  if (authLoading || isLoadingHasTransactions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="space-y-2 sm:space-y-3">
              <Skeleton className="h-6 sm:h-8 w-56 sm:w-72" />
              <Skeleton className="h-3 sm:h-4 w-72 sm:w-96" />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
              <Skeleton className="h-8 sm:h-10 w-28 sm:w-40" />
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-32 sm:h-40 w-full" />
            <Skeleton className="h-64 sm:h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasTransactions) {
    return (
      <>
        <WealthJourneyTour />
        <WelcomeGuide />
      </>
    );
  }

  const planBadge = getPlanBadge();

  return (
    <>
      <WealthJourneyTour />
      <GoalCompletionCelebration />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
          {/* Header Otimizado para Performance Mobile */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8 bg-card rounded-lg border p-4 sm:p-6 will-change-auto">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground leading-tight will-change-auto">
                  {getGreeting()}, {firstName}!
                </h1>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-medium px-2 py-1 rounded-full w-fit flex-shrink-0", planBadge.className)}>
                    {planBadge.text}
                  </span>
                  <WealthJourneyTrigger />
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Acompanhe seus progressos e continue construindo seus objetivos
              </p>
            </div>
            
            {/* Ações Mobile-First - Performance Otimizada */}
            <div className="flex flex-col gap-3 sm:min-w-0">
              {/* Mobile: Botão Principal + Menu - Layout Fixo */}
              <div className="flex items-center gap-2 sm:hidden">
                <AddTransactionDialog>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 will-change-transform">
                    <PlusCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Nova Transação</span>
                  </Button>
                </AddTransactionDialog>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="px-3 flex-shrink-0 will-change-transform">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/goals" className="flex items-center">
                        <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                        Nova Meta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/analytics" className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                        Ver Insights
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop: Todas as ações visíveis - Layout Otimizado */}
              <div className="hidden sm:block">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Ações Rápidas
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <AddTransactionDialog>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white will-change-transform">
                      <PlusCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      Nova Transação
                    </Button>
                  </AddTransactionDialog>

                  <Button asChild size="sm" variant="outline" className="will-change-transform">
                    <Link to="/goals">
                      <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                      Nova Meta
                    </Link>
                  </Button>

                  <Button asChild size="sm" variant="outline" className="will-change-transform">
                    <Link to="/analytics">
                      <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                      Insights
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Ações Secundárias - Layout Consistente */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <AddRecurringTransactionDialog />
                <AddInstallmentPlanDialog />
                {/* Botão inteligente para dados demo - só aparece quando há dados demo */}
                <DemoDataPopulator />
              </div>
            </div>
          </header>

          {/* Layout Principal Responsivo - Otimizado */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Coluna Principal - Performance Otimizada */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Resumo Financeiro */}
              <div className="bg-card rounded-lg border will-change-auto financial-summary">
                <FinancialSummary />
              </div>
              
              {/* Transações */}
              <div className="bg-card rounded-lg border will-change-auto">
                <TransactionList />
              </div>
            </div>
            
            {/* Sidebar - Grid Otimizado para Performance */}
            <div className="xl:col-span-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-6" style={{
                alignItems: 'start'
              }}>
                <div className="will-change-auto smart-insights-card"><SmartInsightsCard /></div>
                <div className="will-change-auto"><NextActionCard /></div>
                <div className="will-change-auto goals-summary"><GoalsSummary /></div>
                <div className="will-change-auto"><BudgetsSummary /></div>
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
