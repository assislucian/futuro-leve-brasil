
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Componente do resumo financeiro aprimorado
 * Exibe as principais métricas financeiras com insights acionáveis
 */
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
          description="Não foi possível calcular seu resumo financeiro. Tente novamente mais tarde."
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

  // Cálculos inteligentes para insights
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
  const expenseRatio = totalIncome > 0 ? ((totalExpense / totalIncome) * 100) : 0;
  const isHealthy = savingsRate >= 20;
  const needsAttention = savingsRate < 10 && totalIncome > 0;

  const getHealthStatus = () => {
    if (needsAttention) {
      return {
        icon: AlertTriangle,
        text: "Atenção Necessária",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800"
      };
    }
    if (isHealthy) {
      return {
        icon: CheckCircle,
        text: "Saúde Financeira Excelente",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
        borderColor: "border-emerald-200 dark:border-emerald-800"
      };
    }
    return {
      icon: TrendingUp,
      text: "Progredindo Bem",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    };
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  const cards = [
    {
      title: "💰 Receita Total",
      value: totalIncome,
      icon: ArrowUp,
      description: "Entradas registradas",
      color: "emerald",
      trend: totalIncome > 0 ? "positive" : "neutral",
      bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20"
    },
    {
      title: "💸 Despesa Total", 
      value: totalExpense,
      icon: ArrowDown,
      description: "Saídas registradas",
      color: "red",
      trend: totalExpense > totalIncome ? "negative" : "neutral",
      bgGradient: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20"
    },
    {
      title: "📊 Saldo Atual",
      value: balance,
      icon: DollarSign,
      description: `${savingsRate.toFixed(1)}% de economia`,
      color: balance >= 0 ? "blue" : "red",
      trend: balance >= 0 ? "positive" : "negative",
      bgGradient: balance >= 0 
        ? "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
        : "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20"
    }
  ];

  const getCardStyles = (color: string, trend: string) => {
    const baseStyles = {
      emerald: {
        iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        valueColor: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800"
      },
      red: {
        iconBg: "bg-red-100 dark:bg-red-900/50",
        iconColor: "text-red-600 dark:text-red-400",
        valueColor: "text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-800"
      },
      blue: {
        iconBg: "bg-blue-100 dark:bg-blue-900/50",
        iconColor: "text-blue-600 dark:text-blue-400",
        valueColor: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800"
      }
    };
    return baseStyles[color as keyof typeof baseStyles] || baseStyles.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Status de Saúde Financeira */}
      {totalIncome > 0 && (
        <div className={cn(
          "p-4 rounded-xl border-2 transition-all duration-300",
          healthStatus.bgColor,
          healthStatus.borderColor
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("p-2 rounded-lg", healthStatus.bgColor)}>
              <HealthIcon className={cn("h-5 w-5", healthStatus.color)} />
            </div>
            <div className="flex-1">
              <h3 className={cn("font-semibold", healthStatus.color)}>
                {healthStatus.text}
              </h3>
              <p className="text-sm text-muted-foreground">
                Taxa de economia: {savingsRate.toFixed(1)}% • Meta recomendada: 20%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da Meta de Economia</span>
              <span className="font-semibold">{Math.min(savingsRate, 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(savingsRate, 100)} 
              className="h-2"
            />
          </div>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const styles = getCardStyles(card.color, card.trend);
          const Icon = card.icon;
          
          return (
            <Card 
              key={index}
              className={cn(
                "border-2 shadow-lg bg-gradient-to-br hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group",
                card.bgGradient,
                styles.border
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div className={cn("p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform", styles.iconBg)}>
                  <Icon className={cn("h-5 w-5", styles.iconColor)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={cn("text-2xl font-bold", styles.valueColor)}>
                  {formatCurrency(card.value)}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                  {card.trend === "positive" && (
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      ↗️ Positivo
                    </Badge>
                  )}
                  {card.trend === "negative" && (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                      ↘️ Atenção
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights Rápidos */}
      {totalIncome > 0 && (
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insight Rápido
          </h4>
          {needsAttention ? (
            <p className="text-sm text-purple-600 dark:text-purple-300">
              💡 <strong>Oportunidade:</strong> Suas despesas representam {expenseRatio.toFixed(1)}% da sua renda. 
              Reduzindo 10% dos gastos, você pode acelerar suas metas em meses!
            </p>
          ) : isHealthy ? (
            <p className="text-sm text-purple-600 dark:text-purple-300">
              🎉 <strong>Parabéns!</strong> Você está economizando {savingsRate.toFixed(1)}% da sua renda! 
              Continue assim e seus sonhos se tornarão realidade mais rapidamente.
            </p>
          ) : (
            <p className="text-sm text-purple-600 dark:text-purple-300">
              🚀 <strong>Progresso:</strong> Você já está no caminho certo! 
              Com pequenos ajustes, pode alcançar a meta de 20% de economia.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
