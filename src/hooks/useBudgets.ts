import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetWithSpending = Budget & {
  spent: number;
  remaining: number;
  progress: number;
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

export function useBudgets(year: number, month: number) {
  const { user } = useAuth();

  const { data: budgets, isPending: isBudgetsPending, error: budgetsError } = useQuery({
    queryKey: ["budgets", user?.id, year, month],
    queryFn: () => fetchBudgets(user!.id, year, month),
    enabled: !!user,
  });

  const { data: expenses, isPending: isExpensesPending, error: expensesError } = useQuery({
    queryKey: ["monthlyExpenses", user?.id, year, month],
    queryFn: () => fetchMonthlyExpenses(user!.id, year, month),
    enabled: !!user,
  });

  const spentByCategory = useMemo(() => {
    if (!expenses) return {};
    return expenses.reduce((acc, transaction) => {
      if (!transaction.category) return acc;
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const budgetsWithSpending = useMemo((): BudgetWithSpending[] => {
    if (!budgets) return [];
    return budgets.map(budget => {
      const spent = spentByCategory[budget.category] || 0;
      const remaining = budget.amount - spent;
      const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      return { ...budget, spent, remaining, progress };
    });
  }, [budgets, spentByCategory]);

  const summary = useMemo(() => {
    if (!budgetsWithSpending) {
      return { totalBudgeted: 0, totalSpent: 0, totalRemaining: 0, overallProgress: 0 };
    }
    const totalBudgeted = budgetsWithSpending.reduce((acc, b) => acc + b.amount, 0);
    const totalSpent = budgetsWithSpending.reduce((acc, b) => acc + b.spent, 0);
    const totalRemaining = totalBudgeted - totalSpent;
    const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      overallProgress,
    };
  }, [budgetsWithSpending]);

  const isLoading = isBudgetsPending || isExpensesPending;
  const error = budgetsError || expensesError;

  return { budgetsWithSpending, isLoading, error, hasBudgets: !!budgets && budgets.length > 0, summary };
}
