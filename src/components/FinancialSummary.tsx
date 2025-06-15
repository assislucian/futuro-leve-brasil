
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";

const FinancialSummary = () => {
  // Dados mockados. Em breve, conectaremos com dados reais do Supabase.
  const totalIncome = 5300.75;
  const totalExpense = 2150.30;
  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total (Mês)</CardTitle>
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">+20.1% do último mês</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesa Total (Mês)</CardTitle>
          <ArrowDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-500">{formatCurrency(totalExpense)}</div>
          <p className="text-xs text-muted-foreground">+18.3% do último mês</p>
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
