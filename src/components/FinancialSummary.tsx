
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";

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
      <div className="p-5">
        <LoadingState variant="dashboard" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
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
      color: "green"
    },
    {
      title: "Despesa Total",
      value: totalExpense,
      icon: ArrowDown,
      description: "Total de saídas registradas",
      color: "red"
    },
    {
      title: "Saldo Atual",
      value: balance,
      icon: DollarSign,
      description: "Seu balanço financeiro atual",
      color: balance >= 0 ? "gray" : "red"
    }
  ];

  const getCardStyles = (color: string) => {
    const styles = {
      green: {
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        valueColor: "text-green-700"
      },
      red: {
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
        valueColor: "text-red-700"
      },
      gray: {
        iconBg: "bg-gray-50",
        iconColor: "text-gray-600",
        valueColor: "text-gray-900"
      }
    };
    return styles[color as keyof typeof styles] || styles.gray;
  };

  return (
    <div className="p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const styles = getCardStyles(card.color);
          const Icon = card.icon;
          
          return (
            <Card 
              key={index}
              className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-1.5 ${styles.iconBg} rounded-md`}>
                  <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className={`text-xl font-semibold ${styles.valueColor}`}>
                  {formatCurrency(card.value)}
                </div>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialSummary;
