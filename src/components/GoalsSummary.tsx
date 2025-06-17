
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
              <CardTitle className="text-lg text-card-foreground">{t('goals.title')}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{t('goals.subtitle')}</CardDescription>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-md">
              <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950 rounded-md">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              {t('goals.your_dreams')}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {hasGoals ? t('goals.dreams_in_progress', { count }) : t('goals.subtitle')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasGoals ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
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
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(totalSaved)}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                  {t('goals.congratulations')}
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  {t('goals.building_future')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 py-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto">
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
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium">
          <Link to="/goals" className="flex items-center justify-center gap-2">
            {t('goals.view_my_goals')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalsSummary;
