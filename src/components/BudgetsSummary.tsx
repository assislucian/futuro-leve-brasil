import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const formatCurrency = (amount: number) => {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

const BudgetsSummary = () => {
    const { user } = useAuth();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const { data, isLoading } = useQuery({
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

    const { totalBudgeted = 0, totalSpent = 0 } = data || {};
    const progress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    const remaining = totalBudgeted - totalSpent;
    const hasBudgets = totalBudgeted > 0;

    if (isLoading) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-start">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Seus Orçamentos</CardTitle>
                    <CardDescription>Resumo do seu plano de gastos.</CardDescription>
                  </div>
                  <Target className="h-6 w-6 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-start">
                {hasBudgets ? (
                    <div className="w-full space-y-4">
                        <div>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm text-muted-foreground">Gasto Total</span>
                            <span className={`text-lg font-bold ${remaining < 0 ? 'text-destructive' : ''}`}>{formatCurrency(totalSpent)}</span>
                          </div>
                          <Progress value={progress} />
                          <div className="flex justify-between items-baseline mt-1">
                              <span className="text-xs text-muted-foreground">de {formatCurrency(totalBudgeted)}</span>
                              <span className={`text-xs font-medium ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
                              </span>
                          </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Defina limites de gastos para ganhar clareza sobre suas finanças.
                    </p>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link to="/budgets">
                        Gerenciar Orçamentos
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default BudgetsSummary;
