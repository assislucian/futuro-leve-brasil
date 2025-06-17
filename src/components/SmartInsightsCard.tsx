
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
      return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case 'budget_alert':
      return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    case 'smart_suggestion':
      return <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case 'celebration':
      return <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    default:
      return <Sparkles className="h-4 w-4 text-primary" />;
  }
};

const getPriorityStyles = (priority: SmartInsight['priority']) => {
  switch (priority) {
    case 'high':
      return {
        badge: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        card: 'border-l-4 border-l-red-400 bg-gradient-to-r from-red-50/30 dark:from-red-950/30 to-transparent'
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        card: 'border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50/30 dark:from-amber-950/30 to-transparent'
      };
    case 'low':
      return {
        badge: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        card: 'border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/30 dark:from-blue-950/30 to-transparent'
      };
    default:
      return {
        badge: 'bg-muted text-muted-foreground border-border',
        card: 'border-l-4 border-l-border bg-gradient-to-r from-muted/30 to-transparent'
      };
  }
};

const getPriorityLabel = (priority: SmartInsight['priority']) => {
  switch (priority) {
    case 'high': return '🔥 Dringend';
    case 'medium': return '⚡ Wichtig';
    case 'low': return '💡 Tipp';
    default: return 'Info';
  }
};

export function SmartInsightsCard() {
  const { data: insights, isLoading, error } = useSmartInsights();

  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm bg-card">
        <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-blue-50 dark:to-blue-950/50 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Intelligente Einblicke
          </CardTitle>
          <CardDescription>
            Unsere KI analysiert Ihre Finanzen...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2 p-3 rounded-md border bg-muted/50">
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
      <Card className="border border-border shadow-sm bg-card">
        <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-blue-50 dark:to-blue-950/50 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Intelligente Einblicke
          </CardTitle>
          <CardDescription>
            {error ? 'Fehler beim Laden der Einblicke' : 'Nutzen Sie Plenus weiter, um personalisierte Einblicke über Ihre Finanzen zu erhalten!'}
          </CardDescription>
        </CardHeader>
        {!error && (
          <CardContent className="p-3">
            <div className="text-center py-4">
              <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Unsere KI lernt über Ihre Finanzgewohnheiten.
              </p>
              <p className="text-xs text-muted-foreground">
                Fügen Sie mehr Transaktionen hinzu, um personalisierte Einblicke zu erhalten!
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  // Nur die 3 wichtigsten Einblicke anzeigen
  const topInsights = insights.slice(0, 3);

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
      <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-blue-50 dark:to-blue-950/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Intelligente Einblicke
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          🚀 Unsere KI hat Möglichkeiten entdeckt, Ihre Träume zu beschleunigen!
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
                <div className="flex-shrink-0 mt-0.5 p-1 bg-card rounded-full shadow-sm border border-border">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-grow min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-tight text-card-foreground">
                      {insight.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`${styles.badge} text-xs px-1.5 py-0.5 flex-shrink-0 font-medium`}
                    >
                      {getPriorityLabel(insight.priority)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <Button 
                    asChild 
                    size="sm" 
                    className="h-7 text-xs bg-card border border-border text-card-foreground hover:bg-muted hover:border-border shadow-sm transition-all duration-200"
                  >
                    <Link to={insight.actionPath} className="flex items-center gap-1">
                      {insight.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Subtiler visueller Prioritätseffekt */}
              {index === 0 && insight.priority === 'high' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
        
        {insights.length > 3 && (
          <div className="text-center pt-2 border-t border-border">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-card-foreground">
              <Link to="/insights" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Alle Einblicke anzeigen ({insights.length})
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
