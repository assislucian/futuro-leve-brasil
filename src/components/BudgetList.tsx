
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetListLoading } from "./BudgetListLoading";
import { BudgetListEmpty } from "./BudgetListEmpty";
import { BudgetTable } from "./BudgetTable";

export function BudgetList() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { budgetsWithSpending, isLoading, error, hasBudgets } = useBudgets(currentYear, currentMonth);

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' });

  if (isLoading) {
    return <BudgetListLoading />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
            <CardTitle>Erro ao carregar orçamentos</CardTitle>
            <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (!hasBudgets) {
    return <BudgetListEmpty monthName={monthName} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos de {monthName}</CardTitle>
        <CardDescription>
          Seus limites de gastos definidos para o mês atual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BudgetTable budgets={budgetsWithSpending} />
      </CardContent>
    </Card>
  );
}
