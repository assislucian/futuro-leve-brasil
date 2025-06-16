import React, { useState } from "react";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";
import { BudgetList } from "@/components/BudgetList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Lock, Sparkles } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetSummary } from "@/components/BudgetSummary";
import { BudgetSummaryLoading } from "@/components/BudgetSummaryLoading";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PremiumFeatureLock = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="mt-4">Desbloqueie o Poder dos Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A criação de orçamentos é um recurso exclusivo do plano Premium. Tenha controle total sobre seus gastos, receba alertas inteligentes e acelere a conquista dos seus sonhos.
          </p>
          <Button className="mt-6 w-full" disabled>
            <Lock className="mr-2 h-4 w-4" />
            Fazer Upgrade para Premium
          </Button>
        </CardContent>
      </Card>
  </div>
);

const BudgetsPageContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { budgetsWithSpending, isLoading, error, hasBudgets, summary } = useBudgets(year, month);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Orçamentos</h1>
          <p className="text-muted-foreground">
            Defina seus limites de gastos e acompanhe sua saúde financeira.
          </p>
        </div>
        <AddBudgetDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </AddBudgetDialog>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="lg:col-span-1 flex flex-col gap-8">
          {isLoading ? <BudgetSummaryLoading /> : <BudgetSummary summary={summary} />}
        </aside>
        <div className="lg:col-span-2">
          <BudgetList 
            budgetsWithSpending={budgetsWithSpending}
            isLoading={isLoading}
            error={error}
            hasBudgets={hasBudgets}
            monthName={capitalizedMonthName}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
      </div>
    </>
  )
}

const BudgetsPage = () => {
  const { profile, loading, isTrialing } = useAuth();
  
  if (loading) {
    return (
       <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
            <aside className="lg:col-span-1 flex flex-col gap-8">
              <BudgetSummaryLoading />
            </aside>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </div>
    );
  }

  const hasAccess = profile?.plan === 'premium' || isTrialing;

  return (
    <div className="flex flex-col gap-8 h-full">
      {hasAccess ? <BudgetsPageContent /> : <PremiumFeatureLock />}
    </div>
  );
};

export { BudgetsPage };
export default BudgetsPage;
