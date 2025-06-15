
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleDollarSign } from "lucide-react";

const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number') return '';
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

async function fetchBudgets(userId: string, year: number, month: number) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("year", year)
    .eq("month", month)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function BudgetList() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: budgets, isLoading, error } = useQuery({
    queryKey: ["budgets", user?.id, currentYear, currentMonth],
    queryFn: () => fetchBudgets(user!.id, currentYear, currentMonth),
    enabled: !!user,
  });

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
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
  
  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <CircleDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum orçamento definido para {monthName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece a organizar suas finanças criando seu primeiro orçamento.
          </p>
      </div>
    );
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Orçado</TableHead>
              {/* Adicionaremos 'Gasto' e 'Restante' em uma próxima etapa */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(budget.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
