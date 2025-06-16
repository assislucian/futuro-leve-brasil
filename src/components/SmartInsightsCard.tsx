
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
      return <TrendingUp className="h-4 w-4 text-emerald-600" />;
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
        badge: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
        card: 'border-l-4 border-l-red-400 bg-gradient-to-r from-red-50/50 to-transparent'
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        card: 'border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50/50 to-transparent'
      };
    case 'low':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        card: 'border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent'
      };
    default:
      return {
        badge: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
        card: 'border-l-4 border-l-slate-400 bg-gradient-to-r from-slate-50/50 to-transparent'
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            Insights Inteligentes
          </CardTitle>
          <CardDescription>
            Nossa IA está analisando suas finanças...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3 p-3 rounded-lg border bg-slate-50/50">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !insights || insights.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
            Insights Inteligentes
          </CardTitle>
          <CardDescription>
            {error ? 'Erro ao carregar insights' : 'Continue usando o Plenus para receber insights personalizados sobre suas finanças!'}
          </CardDescription>
        </CardHeader>
        {!error && (
          <CardContent className="p-4">
            <div className="text-center py-6">
              <Brain className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-4">
                Nossa IA está aprendendo sobre seus hábitos financeiros.
              </p>
              <p className="text-xs text-slate-500">
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
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-purple-100 rounded-full">
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          Insights Inteligentes
        </CardTitle>
        <CardDescription className="text-slate-600">
          🚀 Nossa IA descobriu oportunidades para acelerar seus sonhos!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {topInsights.map((insight, index) => {
          const styles = getPriorityStyles(insight.priority);
          return (
            <div
              key={insight.id}
              className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${styles.card}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1.5 bg-white rounded-full shadow-sm">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-grow min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-tight text-slate-800">
                      {insight.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`${styles.badge} text-xs px-2 py-0.5 flex-shrink-0 font-medium`}
                    >
                      {getPriorityLabel(insight.priority)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <Button 
                    asChild 
                    size="sm" 
                    className="h-8 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-200"
                  >
                    <Link to={insight.actionPath} className="flex items-center gap-1.5">
                      {insight.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Efeito visual sutil de prioridade */}
              {index === 0 && insight.priority === 'high' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
        
        {insights.length > 3 && (
          <div className="text-center pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-800">
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
