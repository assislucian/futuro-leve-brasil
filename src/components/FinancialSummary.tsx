
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
  const isHealthy = savingsRate >= 20;
  const needsAttention = savingsRate < 10 && totalIncome > 0;

  const getHealthStatus = () => {
    if (needsAttention) {
      return {
        icon: AlertTriangle,
        text: "Atenção Necessária",
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
        borderColor: "border-amber-200 dark:border-amber-800"
      };
    }
    if (isHealthy) {
      return {
        icon: CheckCircle,
        text: "Saúde Financeira Excelente",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
        borderColor: "border-emerald-200 dark:border-emerald-800"
      };
    }
    return {
      icon: TrendingUp,
      text: "Progredindo Bem",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    };
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

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
      description: `${savingsRate.toFixed(1)}% de economia`,
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
      {/* Status de Saúde Financeira */}
      {totalIncome > 0 && (
        <div className={cn(
          "p-4 rounded-lg border transition-all",
          healthStatus.bgColor,
          healthStatus.borderColor
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("p-2 rounded-lg", healthStatus.bgColor)}>
              <HealthIcon className={cn("h-4 w-4", healthStatus.color)} />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-medium", healthStatus.color)}>
                {healthStatus.text}
              </h3>
              <p className="text-sm text-muted-foreground">
                Taxa de economia: {savingsRate.toFixed(1)}% • Meta: 20%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da Meta</span>
              <span className="font-medium">{Math.min(savingsRate, 100).toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(savingsRate, 100)} className="h-2" />
          </div>
        </div>
      )}

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

      {/* Insight Discreto */}
      {totalIncome > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border">
          <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insight Rápido
          </h4>
          {needsAttention ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>Oportunidade:</strong> Reduzindo pequenos gastos, você pode acelerar suas metas significativamente.
            </p>
          ) : isHealthy ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>Parabéns!</strong> Você está no caminho certo para realizar seus sonhos.
            </p>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>Progresso:</strong> Com pequenos ajustes, você pode otimizar ainda mais sua economia.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
