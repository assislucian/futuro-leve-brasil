
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, TrendingUp } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useGoalsSummary } from "@/hooks/useGoalsSummary";
import { useLanguage } from "@/contexts/LanguageProvider";

/**
 * Componente para o resumo das metas
 * Mostra o progresso geral das metas do usuário
 */
const GoalsSummary = () => {
  const { data, isLoading, error, refetch } = useGoalsSummary();
  const { t, formatCurrency } = useLanguage();

  const { count = 0, totalSaved = 0 } = data || {};
  const hasGoals = count > 0;

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
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950 rounded-md">
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            {t('goals.your_dreams')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {hasGoals ? t('goals.dreams_in_progress', { count }) : t('goals.subtitle')}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {hasGoals ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t('goals.active_goals', { count })}
                </span>
              </div>
              <span className="text-lg font-semibold text-card-foreground">
                {count}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('goals.total_saved')}
              </p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(totalSaved)}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-3 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
              <div className="space-y-1">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                  {t('goals.congratulations')}
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  {t('goals.building_future')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 py-2 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-card-foreground">
                {t('goals.congratulations')}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('goals.building_future')}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Button asChild className="w-full h-9 bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium">
        <Link to="/goals" className="flex items-center justify-center gap-2">
          {t('goals.view_my_goals')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default GoalsSummary;
