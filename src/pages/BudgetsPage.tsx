
import React, { useState } from "react";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";
import { BudgetList } from "@/components/BudgetList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetSummary } from "@/components/BudgetSummary";
import { BudgetSummaryLoading } from "@/components/BudgetSummaryLoading";

const BudgetsPage = () => {
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
    <div className="flex flex-col gap-8">
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
    </div>
  );
};

export default BudgetsPage;
