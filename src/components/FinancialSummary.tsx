
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";

/**
 * Komponente für die Finanzübersicht
 * Zeigt die wichtigsten Finanzkennzahlen des Benutzers an
 */
const FinancialSummary = () => {
  const { data: summary, isLoading, error, refetch } = useFinancialSummaryData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
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
          title="Fehler beim Laden der Übersicht"
          description="Ihre Finanzübersicht konnte nicht berechnet werden. Versuchen Sie es später erneut."
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
      title: "Gesamteinkommen",
      value: totalIncome,
      icon: ArrowUp,
      description: "Summe aller registrierten Einnahmen",
      color: "green"
    },
    {
      title: "Gesamtausgaben",
      value: totalExpense,
      icon: ArrowDown,
      description: "Summe aller registrierten Ausgaben",
      color: "red"
    },
    {
      title: "Aktueller Saldo",
      value: balance,
      icon: DollarSign,
      description: "Ihr aktueller Finanzstatus",
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
