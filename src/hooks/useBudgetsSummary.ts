
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useBudgetsSummary() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return useQuery({
      queryKey: ['budgetsSummary', user?.id, currentYear, currentMonth],
      queryFn: async () => {
          if (!user) return { totalBudgeted: 0, totalSpent: 0 };

          // Fetch budgets for the current month
          const { data: budgets, error: budgetsError } = await supabase
              .from("budgets")
              .select("amount, category")
              .eq("user_id", user.id)
              .eq("year", currentYear)
              .eq("month", currentMonth);
          
          if (budgetsError) throw new Error(budgetsError.message);

          const totalBudgeted = budgets.reduce((acc, budget) => acc + budget.amount, 0);

          // Fetch expenses for the current month
          let nextMonth = currentMonth + 1;
          let nextYear = currentYear;
          if (nextMonth > 12) {
              nextMonth = 1;
              nextYear = currentYear + 1;
          }
          const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
          const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

          const { data: expenses, error: expensesError } = await supabase
              .from("transactions")
              .select("amount")
              .eq("user_id", user.id)
              .eq("type", "expense")
              .gte("transaction_date", startDate)
              .lt("transaction_date", endDate);
          
          if (expensesError) throw new Error(expensesError.message);

          const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);

          return { totalBudgeted, totalSpent };
      },
      enabled: !!user,
  });
}
