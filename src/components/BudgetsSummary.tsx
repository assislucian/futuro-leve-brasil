
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
            <Card className="h-full flex flex-col border-0 shadow-sm bg-white/80">
                <CardHeader className="space-y-4">
                    <Skeleton className="h-7 w-1/3" />
                    <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-start space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-9 w-3/4" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
      return (
        <Card className="h-full flex flex-col border-0 shadow-sm bg-white/80">
          <CardHeader className="space-y-4">
             <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-slate-900">Seus Orçamentos</CardTitle>
                  <CardDescription className="text-base text-slate-600">Resumo do seu plano de gastos.</CardDescription>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <Alert variant="destructive" className="w-full border-0 bg-red-50/80">
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
        <Card className="h-full flex flex-col border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80">
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-slate-900">Seus Orçamentos</CardTitle>
                    <CardDescription className="text-base text-slate-600">Resumo do seu plano de gastos.</CardDescription>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-sm">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-start">
                {hasBudgets ? (
                    <div className="w-full space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-baseline">
                            <span className="text-sm font-medium text-slate-600">Gasto Total</span>
                            <span className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                              {formatCurrency(totalSpent)}
                            </span>
                          </div>
                          <div className="space-y-3">
                            <Progress value={Math.min(progress, 100)} className="h-3" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-slate-500">de {formatCurrency(totalBudgeted)}</span>
                                <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                  {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
                                </span>
                            </div>
                          </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-3">
                        <p className="text-base text-slate-600 leading-relaxed">
                            Defina limites de gastos para ganhar clareza sobre suas finanças.
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-6">
                 <Button asChild className="w-full h-12 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-slate-200/50 transition-all duration-300 rounded-xl font-medium">
                    <Link to="/budgets" className="flex items-center justify-center gap-3">
                        Gerenciar Orçamentos
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default BudgetsSummary;
