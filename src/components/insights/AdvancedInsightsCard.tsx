
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdvancedInsights, AdvancedInsight } from "@/hooks/useAdvancedInsights";
import { 
  Rocket, AlertTriangle, TrendingUp, Target, Zap, Sparkles, 
  ArrowRight, Clock, TrendingDown, Brain, Heart, Star,
  DollarSign, Calendar, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const getInsightIcon = (type: AdvancedInsight['type']) => {
  switch (type) {
    case 'dream_accelerator':
      return <Rocket className="h-5 w-5" />;
    case 'money_leak':
      return <AlertTriangle className="h-5 w-5" />;
    case 'behavior_optimization':
      return <Brain className="h-5 w-5" />;
    case 'goal_milestone':
      return <Target className="h-5 w-5" />;
    case 'smart_automation':
      return <Zap className="h-5 w-5" />;
    case 'lifestyle_upgrade':
      return <Star className="h-5 w-5" />;
    default:
      return <Sparkles className="h-5 w-5" />;
  }
};

const getPriorityStyles = (priority: AdvancedInsight['priority']) => {
  switch (priority) {
    case 'critical':
      return {
        badge: 'bg-red-500 text-white border-red-600 animate-pulse',
        border: 'border-l-red-500 bg-gradient-to-r from-red-50 dark:from-red-950/30 to-transparent',
        glow: 'shadow-red-200 dark:shadow-red-900/50'
      };
    case 'high':
      return {
        badge: 'bg-amber-500 text-white border-amber-600',
        border: 'border-l-amber-500 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-transparent',
        glow: 'shadow-amber-200 dark:shadow-amber-900/50'
      };
    case 'medium':
      return {
        badge: 'bg-blue-500 text-white border-blue-600',
        border: 'border-l-blue-500 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent',
        glow: 'shadow-blue-200 dark:shadow-blue-900/50'
      };
    case 'low':
      return {
        badge: 'bg-green-500 text-white border-green-600',
        border: 'border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent',
        glow: 'shadow-green-200 dark:shadow-green-900/50'
      };
  }
};

const getMoodEmoji = (mood: AdvancedInsight['emotional']['mood']) => {
  switch (mood) {
    case 'celebration': return '🎉';
    case 'warning': return '⚠️';
    case 'opportunity': return '💡';
    case 'motivation': return '🚀';
    default: return '✨';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 0
  }).format(value);
};

export function AdvancedInsightsCard() {
  const { data: insights, isLoading, error } = useAdvancedInsights();

  if (isLoading) {
    return (
      <Card className="border border-border shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            🧠 Insights de IA Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border bg-muted/50">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !insights || insights.length === 0) {
    return (
      <Card className="border border-border shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            🧠 Insights de IA Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nossa IA está aprendendo sobre você...</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Continue usando o Plenus por alguns dias para receber insights personalizados que vão acelerar seus sonhos financeiros!
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Análise em progresso...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar os 3 insights mais importantes
  const topInsights = insights.slice(0, 3);

  return (
    <Card className="border border-border shadow-xl bg-gradient-to-br from-card to-muted/20 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          🧠 Insights de IA Premium
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          🎯 Nossa IA analisou seus dados e descobriu oportunidades incríveis para acelerar seus sonhos!
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {topInsights.map((insight, index) => {
          const styles = getPriorityStyles(insight.priority);
          const moodEmoji = getMoodEmoji(insight.emotional.mood);
          
          return (
            <div
              key={insight.id}
              className={cn(
                "relative p-5 rounded-xl border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                styles.border,
                styles.glow,
                "bg-card/80 backdrop-blur-sm"
              )}
            >
              {/* Indicador de urgência */}
              {insight.action.urgent && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
              )}
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={cn(
                    "p-2 rounded-lg shadow-sm",
                    insight.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    insight.priority === 'high' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                    insight.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  )}>
                    {getInsightIcon(insight.type)}
                  </div>
                </div>
                
                <div className="flex-grow min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-base leading-tight text-card-foreground">
                      {insight.title}
                    </h4>
                    <Badge className={cn("text-xs font-bold px-2 py-1 flex-shrink-0", styles.badge)}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {/* Impact Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {insight.impact.financial > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                            Impacto Financeiro
                          </span>
                        </div>
                        <p className="text-sm font-bold text-green-800 dark:text-green-200">
                          {formatCurrency(insight.impact.financial)} {insight.impact.timeline}
                        </p>
                      </div>
                    )}
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Confiança da IA
                        </span>
                      </div>
                      <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                        {insight.impact.confidence}% de certeza
                      </p>
                    </div>
                  </div>
                  
                  {/* Emotional Message */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                      <span className="text-base">{moodEmoji}</span>
                      {insight.emotional.message}
                    </p>
                  </div>
                  
                  {/* Goal Connection */}
                  {insight.goalConnection && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                          Conectado à Meta
                        </span>
                      </div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                        "{insight.goalConnection.goalName}"
                        {insight.goalConnection.accelerationMonths > 0 && 
                          ` - Acelere em ${insight.goalConnection.accelerationMonths} meses!`
                        }
                      </p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      asChild
                      size="sm" 
                      className={cn(
                        "h-9 text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105",
                        insight.action.urgent 
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                          : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                      )}
                    >
                      <Link to={insight.action.path} className="flex items-center gap-2">
                        {insight.action.urgent && <Zap className="h-4 w-4" />}
                        {insight.action.primary}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    {insight.action.secondary && (
                      <Button 
                        asChild
                        variant="outline" 
                        size="sm" 
                        className="h-9 text-sm border-border hover:bg-muted"
                      >
                        <Link to={insight.action.path}>
                          {insight.action.secondary}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {insights.length > 3 && (
          <div className="text-center pt-4 border-t border-border">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-card-foreground">
              <Link to="/analytics" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Ver todos os {insights.length} insights</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
