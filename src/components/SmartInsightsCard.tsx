
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Sparkles } from "lucide-react";

// Componente simplificado que agora redireciona para o Analytics com insights avançados
export function SmartInsightsCard() {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
      <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-blue-50 dark:to-blue-950/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Insights Inteligentes
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          🚀 Nossa IA descobriu oportunidades para acelerar seus sonhos!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-2">Insights Premium Disponíveis!</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Nossa IA analisou suas finanças e encontrou oportunidades incríveis para acelerar seus sonhos.
            </p>
            <Button asChild size="sm" className="w-full">
              <Link to="/analytics" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Ver Insights Completos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
