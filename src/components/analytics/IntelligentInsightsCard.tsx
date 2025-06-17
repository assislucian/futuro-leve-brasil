
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntelligentInsights, IntelligentInsight } from "@/hooks/useIntelligentInsights";
import { AlertTriangle, TrendingUp, Brain, Target, Heart, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const getInsightIcon = (type: IntelligentInsight['type']) => {
  switch (type) {
    case 'money_leak':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'savings_opportunity':
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'behavior_pattern':
      return <Brain className="h-5 w-5 text-blue-500" />;
    case 'goal_acceleration':
      return <Target className="h-5 w-5 text-purple-500" />;
    case 'financial_health':
      return <Heart className="h-5 w-5 text-pink-500" />;
    default:
      return <Zap className="h-5 w-5 text-amber-500" />;
  }
};

const getUrgencyStyles = (urgency: IntelligentInsight['urgency']) => {
  switch (urgency) {
    case 'high':
      return {
        badge: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        border: 'border-l-red-400 bg-gradient-to-r from-red-50/50 dark:from-red-950/50 to-transparent'
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        border: 'border-l-amber-400 bg-gradient-to-r from-amber-50/50 dark:from-amber-950/50 to-transparent'
      };
    case 'low':
      return {
        badge: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        border: 'border-l-blue-400 bg-gradient-to-r from-blue-50/50 dark:from-blue-950/50 to-transparent'
      };
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 0
  }).format(value);
};

export function IntelligentInsightsCard() {
  const { data: insights, isLoading, error } = useIntelligentInsights();

  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm bg-card">
        <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-pink-50 dark:to-pink-950/50 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            💡 Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 p-4 rounded-lg border">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !insights || insights.length === 0) {
    return (
      <Card className="border border-border shadow-sm bg-card">
        <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-pink-50 dark:to-pink-950/50 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            💡 Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-6">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Nossa IA está analisando seus padrões financeiros...
            </p>
            <p className="text-xs text-muted-foreground">
              Adicione mais transações para receber insights valiosos!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar apenas os 3 insights mais importantes
  const topInsights = insights.slice(0, 3);

  return (
    <Card className="border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card">
      <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-pink-50 dark:to-pink-950/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          💡 Insights Inteligentes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          🎯 Oportunidades para acelerar seus sonhos financeiros
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {topInsights.map((insight, index) => {
          const styles = getUrgencyStyles(insight.urgency);
          return (
            <div
              key={insight.id}
              className={`relative p-4 rounded-lg border border-l-4 transition-all duration-200 hover:shadow-md ${styles.border}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-grow min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-tight text-card-foreground">
                      {insight.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`${styles.badge} text-xs px-2 py-1 flex-shrink-0 font-medium`}
                    >
                      {insight.category}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {insight.impact > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                        Potencial de economia: {formatCurrency(insight.impact)} por ano
                      </span>
                    </div>
                  )}
                  
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      💡 Ação recomendada: {insight.actionable}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Indicador visual de urgência */}
              {index === 0 && insight.urgency === 'high' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
        
        {insights.length > 3 && (
          <div className="text-center pt-3 border-t border-border">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-card-foreground">
              <Brain className="h-4 w-4 mr-2" />
              Ver todos os insights ({insights.length})
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
