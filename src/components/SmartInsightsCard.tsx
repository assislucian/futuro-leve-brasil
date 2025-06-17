
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useSmartInsights, SmartInsight } from "@/hooks/useSmartInsights";
import { AlertCircle, TrendingUp, Target, Sparkles, ArrowRight, Brain } from "lucide-react";

const getInsightIcon = (type: SmartInsight['type']) => {
  switch (type) {
    case 'goal_opportunity':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'budget_alert':
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    case 'smart_suggestion':
      return <Brain className="h-4 w-4 text-blue-600" />;
    case 'celebration':
      return <Target className="h-4 w-4 text-purple-600" />;
    default:
      return <Sparkles className="h-4 w-4 text-primary" />;
  }
};

const getPriorityStyles = (priority: SmartInsight['priority']) => {
  switch (priority) {
    case 'high':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        card: 'border-l-4 border-l-red-400 bg-gradient-to-r from-red-50/30 to-transparent'
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        card: 'border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50/30 to-transparent'
      };
    case 'low':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        card: 'border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/30 to-transparent'
      };
    default:
      return {
        badge: 'bg-gray-50 text-gray-700 border-gray-200',
        card: 'border-l-4 border-l-gray-400 bg-gradient-to-r from-gray-50/30 to-transparent'
      };
  }
};

const getPriorityLabel = (priority: SmartInsight['priority']) => {
  switch (priority) {
    case 'high': return '🔥 Urgente';
    case 'medium': return '⚡ Importante';
    case 'low': return '💡 Dica';
    default: return 'Info';
  }
};

export function SmartInsightsCard() {
  const { data: insights, isLoading, error } = useSmartInsights();

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-purple-100 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            Insights Inteligentes
          </CardTitle>
          <CardDescription>
            Nossa IA está analisando suas finanças...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2 p-3 rounded-md border bg-gray-50/50">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !insights || insights.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-purple-100 rounded-full">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
            Insights Inteligentes
          </CardTitle>
          <CardDescription>
            {error ? 'Erro ao carregar insights' : 'Continue usando o Plenus para receber insights personalizados sobre suas finanças!'}
          </CardDescription>
        </CardHeader>
        {!error && (
          <CardContent className="p-3">
            <div className="text-center py-4">
              <Brain className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Nossa IA está aprendendo sobre seus hábitos financeiros.
              </p>
              <p className="text-xs text-gray-500">
                Adicione mais transações para receber insights personalizados!
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  // Mostrar apenas os 3 insights mais importantes
  const topInsights = insights.slice(0, 3);

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-purple-100 rounded-full">
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          Insights Inteligentes
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          🚀 Nossa IA descobriu oportunidades para acelerar seus sonhos!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-3">
        {topInsights.map((insight, index) => {
          const styles = getPriorityStyles(insight.priority);
          return (
            <div
              key={insight.id}
              className={`relative p-3 rounded-md border transition-all duration-200 hover:shadow-sm ${styles.card}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5 p-1 bg-white rounded-full shadow-sm">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-grow min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-tight text-gray-800">
                      {insight.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`${styles.badge} text-xs px-1.5 py-0.5 flex-shrink-0 font-medium`}
                    >
                      {getPriorityLabel(insight.priority)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <Button 
                    asChild 
                    size="sm" 
                    className="h-7 text-xs bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200"
                  >
                    <Link to={insight.actionPath} className="flex items-center gap-1">
                      {insight.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Efeito visual sutil de prioridade */}
              {index === 0 && insight.priority === 'high' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
        
        {insights.length > 3 && (
          <div className="text-center pt-2 border-t border-gray-100">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-800">
              <Link to="/insights" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Ver todos os insights ({insights.length})
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
