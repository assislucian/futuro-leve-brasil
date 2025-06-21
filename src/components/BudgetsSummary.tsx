import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useBudgetsSummary } from "@/hooks/useBudgetsSummary";

const formatCurrency = (amount: number) => {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

/**
 * Componente de resumo dos orçamentos
 * Exibe o progresso geral dos orçamentos do usuário
 */
export function BudgetsSummary() {
  const { data, isLoading, error, refetch } = useBudgetsSummary();

  const { totalBudgeted = 0, totalSpent = 0 } = data || {};
  const progress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const remaining = totalBudgeted - totalSpent;
  const hasBudgets = totalBudgeted > 0;

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col border border-border shadow-sm bg-card">
        <CardHeader className="space-y-3">
          <LoadingState variant="card" count={1} />
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col border border-border shadow-sm bg-card">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg text-card-foreground">Seus Orçamentos</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Resumo do seu plano de gastos.</CardDescription>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <ErrorState
            title="Erro ao Carregar"
            description="Não foi possível buscar o resumo dos seus orçamentos."
            onRetry={refetch}
            variant="destructive"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-tour="budgets" className="h-full flex flex-col border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-card-foreground">Seus Orçamentos</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Resumo do seu plano de gastos.</CardDescription>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-center items-start">
        {hasBudgets ? (
          <div className="w-full space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">Gasto Total</span>
                <span className={`text-xl font-semibold ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-card-foreground'}`}>
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">de {formatCurrency(totalBudgeted)}</span>
                  <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                    {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Defina limites de gastos para ganhar clareza sobre suas finanças.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button asChild className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium">
          <Link to="/budgets" className="flex items-center justify-center gap-2">
            Gerenciar Orçamentos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BudgetsSummary;
