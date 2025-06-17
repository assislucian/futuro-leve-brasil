
import { Link } from "react-router-dom";
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
    return <LoadingState variant="card" count={1} />;
  }

  if (error) {
    return (
      <ErrorState
        title={t('common.error')}
        description={t('common.error')}
        onRetry={refetch}
        variant="destructive"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-card-foreground flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950 rounded-md">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            {t('budgets.title')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t('budgets.subtitle')}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {hasBudgets ? (
          <div className="space-y-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">{t('budgets.total_expenses')}</span>
                <span className={`text-lg font-semibold ${remaining < 0 ? 'text-destructive' : 'text-card-foreground'}`}>
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="space-y-2">
                <Progress 
                  value={Math.min(progress, 100)} 
                  className={`h-2 ${progress > 100 ? 'bg-red-200 dark:bg-red-950' : ''}`}
                />
                <div className="flex justify-between items-center">
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
            
            {/* Status visual */}
            <div className={`p-3 rounded-lg border ${
              remaining < 0 
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50' 
                : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50'
            }`}>
              <p className={`text-sm font-medium ${
                remaining < 0 
                  ? 'text-red-800 dark:text-red-200' 
                  : 'text-green-800 dark:text-green-200'
              }`}>
                {remaining < 0 ? '⚠️ Orçamento ultrapassado' : '✅ Dentro do orçamento'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 py-2 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-card-foreground">
                {t('budgets.title')}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('budgets.subtitle')}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Button asChild className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium">
        <Link to="/budgets" className="flex items-center justify-center gap-2">
          {t('budgets.manage')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default BudgetsSummary;
