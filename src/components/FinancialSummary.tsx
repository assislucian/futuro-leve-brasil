import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente do resumo financeiro
 * Exibe as principais métricas financeiras do usuário
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-premium p-4">
              <Skeleton className="h-4 w-24 bg-slate-200 mb-2" />
              <Skeleton className="h-8 w-32 bg-slate-100 mb-1" />
              <Skeleton className="h-3 w-full bg-slate-100" />
            </div>
          ))}
        </div>
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

  const cards = [
    {
      title: "Receita Total",
      value: totalIncome,
      icon: ArrowUp,
      description: "Total de entradas registradas",
      color: "success"
    },
    {
      title: "Despesa Total",
      value: totalExpense,
      icon: ArrowDown,
      description: "Total de saídas registradas",
      color: "expense"
    },
    {
      title: "Saldo Atual",
      value: balance,
      icon: DollarSign,
      description: "Seu balanço financeiro atual",
      color: balance >= 0 ? "neutral" : "expense"
    }
  ];

  const getCardStyles = (color: string) => {
    const styles = {
      success: {
        iconClass: "icon-success",
        valueColor: "text-success-premium",
        cardClass: "card-premium hover-premium"
      },
      expense: {
        iconClass: "icon-expense",
        valueColor: "text-expense-premium",
        cardClass: "card-premium hover-premium"
      },
      neutral: {
        iconClass: "icon-neutral",
        valueColor: "text-heading-premium",
        cardClass: "card-premium hover-premium"
      }
    };
    return styles[color as keyof typeof styles] || styles.neutral;
  };

  return (
    <div className="p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const styles = getCardStyles(card.color);
          const Icon = card.icon;
          
          return (
            <div key={index} className={styles.cardClass}>
              <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                <h3 className="text-sm font-semibold text-muted-premium tracking-tight">
                  {card.title}
                </h3>
                <div className={styles.iconClass}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${styles.valueColor}`}>
                  {formatCurrency(card.value)}
                </div>
                <p className="text-xs text-muted-premium">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialSummary;
