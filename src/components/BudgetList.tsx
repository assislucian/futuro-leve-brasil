
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetListLoading } from "./BudgetListLoading";
import { BudgetListEmpty } from "./BudgetListEmpty";
import { BudgetTable } from "./BudgetTable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BudgetList() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { budgetsWithSpending, isLoading, error, hasBudgets } = useBudgets(year, month);

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

  if (isLoading) {
    return <BudgetListLoading />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
            <CardTitle>Erro ao carregar orçamentos</CardTitle>
            <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>Visão Mensal</CardTitle>
                <CardDescription>
                  Navegue pelos seus orçamentos mês a mês.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth} aria-label="Mês anterior">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-base font-semibold w-40 text-center">{capitalizedMonthName}</span>
                <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Próximo mês">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasBudgets ? (
            <BudgetTable budgets={budgetsWithSpending} />
        ) : (
            <BudgetListEmpty monthName={capitalizedMonthName} />
        )}
      </CardContent>
    </Card>
  );
}
