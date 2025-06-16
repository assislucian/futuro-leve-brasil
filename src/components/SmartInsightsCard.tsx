
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useSmartInsights, SmartInsight } from "@/hooks/useSmartInsights";
import { AlertCircle, TrendingUp, Target, Sparkles } from "lucide-react";

const getInsightIcon = (type: SmartInsight['type']) => {
  switch (type) {
    case 'goal_opportunity':
      return <TrendingUp className="h-5 w-5 text-emerald-600" />;
    case 'budget_alert':
      return <AlertCircle className="h-5 w-5 text-amber-600" />;
    case 'smart_suggestion':
      return <Sparkles className="h-5 w-5 text-blue-600" />;
    case 'celebration':
      return <Target className="h-5 w-5 text-purple-600" />;
    default:
      return <Sparkles className="h-5 w-5 text-primary" />;
  }
};

const getPriorityColor = (priority: SmartInsight['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function SmartInsightsCard() {
  const { data: insights, isLoading, error } = useSmartInsights();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Insights Inteligentes
          </CardTitle>
          <CardDescription>
            Analisando suas finanças...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Insights Inteligentes
          </CardTitle>
          <CardDescription>
            {error ? 'Erro ao carregar insights' : 'Continue usando o Plenus para receber insights personalizados!'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Mostrar apenas os 3 insights mais importantes
  const topInsights = insights.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Insights Inteligentes
        </CardTitle>
        <CardDescription>
          Descobrimos oportunidades para acelerar seus sonhos!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topInsights.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm leading-tight">{insight.title}</h4>
                <Badge 
                  variant="outline" 
                  className={`${getPriorityColor(insight.priority)} text-xs px-2 py-0.5 flex-shrink-0`}
                >
                  {insight.priority === 'high' ? 'Urgente' : insight.priority === 'medium' ? 'Importante' : 'Sugestão'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {insight.description}
              </p>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                <Link to={insight.actionPath}>
                  {insight.actionLabel}
                </Link>
              </Button>
            </div>
          </div>
        ))}
        
        {insights.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/insights">
                Ver todos os insights ({insights.length})
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
