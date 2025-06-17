
import React from "react";
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
    return <LoadingState variant="dashboard" count={3} />;
  }

  if (error) {
    return (
      <ErrorState
        title={t('common.error')}
        description={t('common.error')}
        onRetry={refetch}
        variant="destructive"
      />
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
    <div className="space-y-4">
      <h4 className="text-base font-bold text-card-foreground">
        {t('financial.summary_title')}
      </h4>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const styles = getCardStyles(card.color);
          const Icon = card.icon;
          
          return (
            <div 
              key={index}
              className="p-4 border border-border rounded-lg bg-card shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </h5>
                <div className={`p-1.5 ${styles.iconBg} rounded-md`}>
                  <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-xl font-semibold ${styles.valueColor}`}>
                  {formatCurrency(card.value)}
                </div>
                <p className="text-xs text-muted-foreground">
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
