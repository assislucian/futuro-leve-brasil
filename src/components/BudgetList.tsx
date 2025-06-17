
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BudgetListLoading } from "./BudgetListLoading";
import { BudgetListEmpty } from "./BudgetListEmpty";
import { BudgetTable } from "./BudgetTable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BudgetWithSpending } from "@/hooks/useBudgets";

interface BudgetListProps {
  budgetsWithSpending: BudgetWithSpending[];
  isLoading: boolean;
  error: Error | null;
  hasBudgets: boolean;
  monthName: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function BudgetList({ 
  budgetsWithSpending, 
  isLoading, 
  error, 
  hasBudgets, 
  monthName,
  onPreviousMonth,
  onNextMonth,
}: BudgetListProps) {

  if (isLoading) {
    return <BudgetListLoading />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
            <CardTitle>Fehler beim Laden der Budgets</CardTitle>
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
                <CardTitle>Detailansicht</CardTitle>
                <CardDescription>
                  Ihre Budgets für {monthName}.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={onPreviousMonth} aria-label="Vorheriger Monat">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-base font-semibold w-40 text-center">{monthName}</span>
                <Button variant="outline" size="icon" onClick={onNextMonth} aria-label="Nächster Monat">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasBudgets ? (
            <BudgetTable budgets={budgetsWithSpending} />
        ) : (
            <BudgetListEmpty monthName={monthName} />
        )}
      </CardContent>
    </Card>
  );
}
