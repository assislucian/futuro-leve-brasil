import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";

const FinancialSummary = () => {
  const { data: summary, isLoading, error } = useFinancialSummaryData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
     return (
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Resumo</AlertTitle>
          <AlertDescription>
            Não foi possível calcular seu resumo financeiro. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { totalIncome, totalExpense, balance } = summary || { totalIncome: 0, totalExpense: 0, balance: 0 };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">Total de entradas registradas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
          <ArrowDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-500">{formatCurrency(totalExpense)}</div>
          <p className="text-xs text-muted-foreground">Total de saídas registradas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <p className="text-xs text-muted-foreground">Seu balanço financeiro atual</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
