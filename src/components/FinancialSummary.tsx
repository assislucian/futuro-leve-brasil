
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
      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
              <ArrowUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="space-y-1">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Despesa Total</CardTitle>
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="space-y-1">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Saldo Atual</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="space-y-1">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="p-5">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
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
    <div className="p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
            <div className="p-1.5 bg-green-50 rounded-md">
              <ArrowUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-semibold text-green-700">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-gray-500">Total de entradas registradas</p>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesa Total</CardTitle>
            <div className="p-1.5 bg-red-50 rounded-md">
              <ArrowDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-semibold text-red-700">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-gray-500">Total de saídas registradas</p>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Atual</CardTitle>
            <div className="p-1.5 bg-gray-50 rounded-md">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={`text-xl font-semibold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-gray-500">Seu balanço financeiro atual</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialSummary;
