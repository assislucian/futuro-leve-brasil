
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Componente simplificado que agora redireciona para o Analytics com insights avançados
export function SmartInsightsCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card smart-insights-card">
      <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-blue-50 dark:to-blue-950/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Insights Inteligentes
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            IA
          </Badge>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          🚀 Nossa IA descobriu oportunidades para acelerar seus sonhos!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="relative mb-3">
              <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto animate-pulse" />
              <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-bounce" />
            </div>
            
            <h3 className="font-semibold text-sm mb-2 text-purple-800 dark:text-purple-200">
              Insights Premium Disponíveis!
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Nossa IA analisou suas finanças e encontrou <strong className="text-purple-600">oportunidades incríveis</strong> para acelerar seus sonhos e otimizar seus investimentos.
            </p>
            
            {/* Lista de benefícios */}
            <div className="space-y-2 mb-4 text-left">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span>Análise de padrões de gastos</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Brain className="h-3 w-3 text-purple-500" />
                <span>Sugestões personalizadas de economia</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Sparkles className="h-3 w-3 text-blue-500" />
                <span>Projeções inteligentes de metas</span>
              </div>
            </div>
            
            <Button 
              asChild 
              size="sm" 
              className={cn(
                "w-full transition-all duration-300 transform",
                "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600",
                "shadow-md hover:shadow-lg hover:scale-105 active:scale-95",
                isHovered && "animate-pulse"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link to="/analytics" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Ver Insights Completos
                <ArrowRight className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isHovered && "translate-x-1"
                )} />
              </Link>
            </Button>
          </div>
          
          {/* Indicador de novidade */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-600 font-medium">Novos insights disponíveis</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
