
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";
import { 
  Wallet, 
  PiggyBank, 
  LineChart, 
  Banknote,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ComponentType<any>;
  color: string;
  loading: boolean;
}

function SummaryCard({ title, amount, icon: Icon, color, loading }: SummaryCardProps) {
  return (
    <Card className="shadow-sm border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {loading ? (
          <Skeleton className="h-4 w-10" />
        ) : (
          <Icon className="h-4 w-4 text-gray-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton className="h-6 w-24" /> : formatCurrency(amount)}
        </div>
        {loading ? (
          <p className="text-xs text-muted-foreground">Atualizando...</p>
        ) : (
          <p className="text-xs text-muted-foreground">Atualizado agora</p>
        )}
      </CardContent>
    </Card>
  );
}

function FinancialSummaryLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><Skeleton className="h-4 w-20" /></CardTitle>
            <Skeleton className="h-4 w-10" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><Skeleton className="h-6 w-24" /></div>
            <p className="text-xs text-muted-foreground"><Skeleton className="h-4 w-16" /></p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FinancialSummary() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return <FinancialSummaryLoading />;
  }

  const {
    balance = 0,
    totalIncome = 0,
    totalExpense = 0,
  } = data || {};

  const netSavings = totalIncome - totalExpense;

  return (
    <div data-tour="financial-summary" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Saldo Total"
        amount={balance}
        icon={Wallet}
        color="text-blue-500"
        loading={isLoading}
      />
      <SummaryCard
        title="Receita Total"
        amount={totalIncome}
        icon={Banknote}
        color="text-green-500"
        loading={isLoading}
      />
      <SummaryCard
        title="Despesa Total"
        amount={totalExpense}
        icon={LineChart}
        color="text-red-500"
        loading={isLoading}
      />
      <SummaryCard
        title="Economias Líquidas"
        amount={netSavings}
        icon={PiggyBank}
        color="text-yellow-500"
        loading={isLoading}
      />
    </div>
  );
}
