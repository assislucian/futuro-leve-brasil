
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useBudgetsSummary } from "@/hooks/useBudgetsSummary";
import { useLanguage } from "@/contexts/LanguageProvider";

/**
 * Componente para o resumo de orçamentos
 * Mostra o progresso geral dos orçamentos do usuário
 */
const BudgetsSummary = () => {
  const { data, isLoading, error, refetch } = useBudgetsSummary();
  const { t, formatCurrency } = useLanguage();

  const { totalBudgeted = 0, totalSpent = 0 } = data || {};
  const progress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const remaining = totalBudgeted - totalSpent;
  const hasBudgets = totalBudgeted > 0;

  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm bg-card">
        <CardHeader className="space-y-3">
          <LoadingState variant="card" count={1} />
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-border shadow-sm bg-card">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg text-card-foreground">{t('budgets.title')}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{t('budgets.subtitle')}</CardDescription>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <ErrorState
            title={t('common.error')}
            description={t('common.error')}
            onRetry={refetch}
            variant="destructive"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950 rounded-md">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              {t('budgets.title')}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {t('budgets.subtitle')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasBudgets ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">{t('budgets.total_expenses')}</span>
                <span className={`text-xl font-semibold ${remaining < 0 ? 'text-destructive' : 'text-card-foreground'}`}>
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="space-y-2">
                <Progress 
                  value={Math.min(progress, 100)} 
                  className={`h-2 ${progress > 100 ? 'bg-red-200 dark:bg-red-950' : ''}`}
                />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">
                    {t('budgets.of')} {formatCurrency(totalBudgeted)}
                  </span>
                  <span className={`text-sm font-medium ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remaining >= 0 
                      ? formatCurrency(remaining)
                      : `${formatCurrency(Math.abs(remaining))} ${t('budgets.exceeded')}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 py-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('budgets.subtitle')}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium">
          <Link to="/budgets" className="flex items-center justify-center gap-2">
            {t('budgets.manage')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetsSummary;
