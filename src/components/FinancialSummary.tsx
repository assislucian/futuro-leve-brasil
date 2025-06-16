
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
      <div className="p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-sm bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
              <ArrowUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-slate-600">Despesa Total</CardTitle>
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-slate-600">Saldo Atual</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="p-8">
        <Alert variant="destructive" className="border-0 bg-red-50/80">
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
    <div className="p-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-700">Receita Total</CardTitle>
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <ArrowUp className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-emerald-700">{formatCurrency(totalIncome)}</div>
            <p className="text-sm text-emerald-600/70 font-medium">Total de entradas registradas</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50/80 to-rose-100/40 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-700">Despesa Total</CardTitle>
            <div className="p-2.5 bg-rose-100 rounded-xl">
              <ArrowDown className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-rose-700">{formatCurrency(totalExpense)}</div>
            <p className="text-sm text-rose-600/70 font-medium">Total de saídas registradas</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/80 to-indigo-100/40 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-700">Saldo Atual</CardTitle>
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-sm text-blue-600/70 font-medium">Seu balanço financeiro atual</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialSummary;
