
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CircleDollarSign, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditBudgetDialog } from "./EditBudgetDialog";
import { DeleteBudgetAlert } from "./DeleteBudgetAlert";

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

async function fetchMonthlyExpenses(userId: string, year: number, month: number) {
  if (!userId) return [];
  
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear = year + 1;
  }
  
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  const { data, error } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("transaction_date", startDate)
    .lt("transaction_date", endDate);

  if (error) {
    throw new Error(`Erro ao buscar despesas: ${error.message}`);
  }
  return data;
}

export function BudgetList() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: budgets, isPending: isBudgetsPending, error: budgetsError } = useQuery({
    queryKey: ["budgets", user?.id, currentYear, currentMonth],
    queryFn: () => fetchBudgets(user!.id, currentYear, currentMonth),
    enabled: !!user,
  });

  const { data: expenses, isPending: isExpensesPending, error: expensesError } = useQuery({
    queryKey: ["monthlyExpenses", user?.id, currentYear, currentMonth],
    queryFn: () => fetchMonthlyExpenses(user!.id, currentYear, currentMonth),
    enabled: !!user,
  });

  const spentByCategory = useMemo(() => {
    if (!expenses) return {};
    return expenses.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);
  
  const isLoading = isBudgetsPending || isExpensesPending;
  const error = budgetsError || expensesError;

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]"><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead className="w-[35%]"><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead className="w-[20%] text-right"><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead className="w-[20%] text-right"><Skeleton className="h-5 w-full" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-full" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

  const budgetsWithSpending = budgets.map(budget => {
    const spent = spentByCategory[budget.category] || 0;
    const remaining = budget.amount - spent;
    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { ...budget, spent, remaining, progress };
  });

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
              <TableHead className="w-[25%]">Categoria</TableHead>
              <TableHead className="w-[35%]">Progresso</TableHead>
              <TableHead className="w-[20%] text-right">Gasto</TableHead>
              <TableHead className="w-[15%] text-right">Restante</TableHead>
              <TableHead className="w-[5%] text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetsWithSpending.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Progress value={budget.progress} className="flex-1" />
                    <span className="text-sm text-muted-foreground">{Math.round(budget.progress)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</TableCell>
                <TableCell className={`text-right font-medium ${budget.remaining < 0 ? 'text-destructive' : ''}`}>
                  {formatCurrency(budget.remaining)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditBudgetDialog budget={budget}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                      </EditBudgetDialog>
                      <DeleteBudgetAlert budgetId={budget.id} category={budget.category}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                           <Trash2 className="mr-2 h-4 w-4" />
                           <span>Excluir</span>
                        </DropdownMenuItem>
                      </DeleteBudgetAlert>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
