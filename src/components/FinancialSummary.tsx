
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { useLanguage } from "@/contexts/LanguageProvider";

/**
 * Componente para o resumo financeiro
 * Mostra os principais indicadores financeiros do usuário
 */
const FinancialSummary = () => {
  const { data: summary, isLoading, error, refetch } = useFinancialSummaryData();
  const { t, formatCurrency } = useLanguage();

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
          title={t('common.error')}
          description={t('common.error')}
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
      title: t('financial.total_income'),
      value: totalIncome,
      icon: ArrowUp,
      description: t('financial.total_income.description'),
      color: "green"
    },
    {
      title: t('financial.total_expenses'),
      value: totalExpense,
      icon: ArrowDown,
      description: t('financial.total_expenses.description'),
      color: "red"
    },
    {
      title: t('financial.current_balance'),
      value: balance,
      icon: DollarSign,
      description: t('financial.current_balance.description'),
      color: balance >= 0 ? "gray" : "red"
    }
  ];

  const getCardStyles = (color: string) => {
    const styles = {
      green: {
        iconBg: "bg-green-50 dark:bg-green-950",
        iconColor: "text-green-600 dark:text-green-400",
        valueColor: "text-green-700 dark:text-green-300"
      },
      red: {
        iconBg: "bg-red-50 dark:bg-red-950",
        iconColor: "text-red-600 dark:text-red-400",
        valueColor: "text-red-700 dark:text-red-300"
      },
      gray: {
        iconBg: "bg-muted",
        iconColor: "text-muted-foreground",
        valueColor: "text-foreground"
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
              className="border border-border shadow-sm bg-card hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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
