
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { cn } from "@/lib/utils";

const FinancialSummary = () => {
  const { data: summary, isLoading, error, refetch } = useFinancialSummaryData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingState variant="dashboard" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Erro ao Carregar Resumo"
          description="Não foi possível calcular seu resumo financeiro."
          onRetry={refetch}
          variant="destructive"
        />
      </div>
    );
  }

  const { totalIncome, totalExpense, balance } = summary || { 
    totalIncome: 0, 
    totalExpense: 0, 
    balance: 0 
  };

  const cards = [
    {
      title: "Receita Total",
      value: totalIncome,
      icon: ArrowUp,
      description: "Entradas registradas",
      color: "emerald",
      trend: totalIncome > 0 ? "positive" : "neutral"
    },
    {
      title: "Despesa Total", 
      value: totalExpense,
      icon: ArrowDown,
      description: "Saídas registradas",
      color: "red",
      trend: totalExpense > totalIncome ? "negative" : "neutral"
    },
    {
      title: "Saldo Atual",
      value: balance,
      icon: DollarSign,
      description: "Resultado do período",
      color: balance >= 0 ? "blue" : "red",
      trend: balance >= 0 ? "positive" : "negative"
    }
  ];

  const getCardStyles = (color: string) => {
    const styles = {
      emerald: {
        iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
        iconColor: "text-emerald-600",
        valueColor: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800"
      },
      red: {
        iconBg: "bg-red-100 dark:bg-red-900/50",
        iconColor: "text-red-600",
        valueColor: "text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-800"
      },
      blue: {
        iconBg: "bg-blue-100 dark:bg-blue-900/50",
        iconColor: "text-blue-600",
        valueColor: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800"
      }
    };
    return styles[color as keyof typeof styles] || styles.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Métricas Simplificados */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const styles = getCardStyles(card.color);
          const Icon = card.icon;
          
          return (
            <Card 
              key={index}
              className={cn(
                "border hover:shadow-md transition-all duration-200 bg-card",
                styles.border
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", styles.iconBg)}>
                  <Icon className={cn("h-4 w-4", styles.iconColor)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={cn("text-2xl font-semibold", styles.valueColor)}>
                  {formatCurrency(card.value)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insight Discreto - apenas quando há dados relevantes */}
      {totalIncome > 0 && balance >= 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border">
          <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insight Rápido
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <strong>Progresso:</strong> Continue registrando suas transações para acompanhar melhor seus hábitos financeiros.
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
