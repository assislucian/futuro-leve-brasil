
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight, AlertCircle } from "lucide-react";
import { useBudgetsSummary } from "@/hooks/useBudgetsSummary";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const formatCurrency = (amount: number) => {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

const BudgetsSummary = () => {
    const { data, isLoading, error } = useBudgetsSummary();

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

    if (error) {
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
          <CardContent className="flex-grow flex items-center justify-center">
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar</AlertTitle>
              <AlertDescription>
                Não foi possível buscar o resumo dos seus orçamentos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
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
