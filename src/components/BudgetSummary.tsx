
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number') return '€ 0,00';
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

interface BudgetSummaryProps {
  summary: {
    totalBudgeted: number;
    totalSpent: number;
    totalRemaining: number;
    overallProgress: number;
  };
}

export function BudgetSummary({ summary }: BudgetSummaryProps) {
  const { totalBudgeted, totalSpent, totalRemaining, overallProgress } = summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monatsübersicht</CardTitle>
        <CardDescription>Ihre Gesamtleistung.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Gesamtausgaben</span>
                <span className="text-2xl font-bold">{formatCurrency(totalSpent)}</span>
            </div>
            <Progress value={overallProgress} />
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budgetiert: {formatCurrency(totalBudgeted)}</span>
                <span className={`font-medium ${totalRemaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                Verbleibt: {formatCurrency(totalRemaining)}
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
