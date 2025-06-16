
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
            <Card className="h-full flex flex-col border border-gray-200 shadow-sm bg-white">
                <CardHeader className="space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-start space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
      return (
        <Card className="h-full flex flex-col border border-gray-200 shadow-sm bg-white">
          <CardHeader className="space-y-3">
             <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-gray-900">Seus Orçamentos</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Resumo do seu plano de gastos.</CardDescription>
                </div>
                <div className="p-2 bg-blue-50 rounded-md">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <Alert variant="destructive" className="w-full border border-red-200 bg-red-50">
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
        <Card className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-gray-900">Seus Orçamentos</CardTitle>
                    <CardDescription className="text-sm text-gray-600">Resumo do seu plano de gastos.</CardDescription>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-md">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-start">
                {hasBudgets ? (
                    <div className="w-full space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-sm font-medium text-gray-600">Gasto Total</span>
                            <span className={`text-xl font-semibold ${remaining < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {formatCurrency(totalSpent)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <Progress value={Math.min(progress, 100)} className="h-2" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-gray-500">de {formatCurrency(totalBudgeted)}</span>
                                <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                  {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
                                </span>
                            </div>
                          </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Defina limites de gastos para ganhar clareza sobre suas finanças.
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-4">
                 <Button asChild className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium">
                    <Link to="/budgets" className="flex items-center justify-center gap-2">
                        Gerenciar Orçamentos
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default BudgetsSummary;
