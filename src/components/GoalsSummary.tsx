
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ArrowRight, AlertCircle, Target, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useGoalsSummary } from "@/hooks/useGoalsSummary";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const GoalsSummary = () => {
  const { data: summary, isLoading, error } = useGoalsSummary();

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full overflow-hidden border border-border bg-card">
        <CardHeader className="bg-gradient-to-br from-amber-50 dark:from-amber-950/50 to-orange-50 dark:to-orange-950/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col h-full border border-border bg-card">
        <CardHeader className="bg-gradient-to-br from-amber-50 dark:from-amber-950/50 to-orange-50 dark:to-orange-950/50 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Star className="h-5 w-5 text-amber-500" />
                Seus Sonhos
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                Acompanhe a evolução das suas metas.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-4">
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar</AlertTitle>
            <AlertDescription>
              Não foi possível buscar o resumo das suas metas.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const goalCount = summary?.count || 0;
  const totalSaved = summary?.totalSaved || 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-border bg-card">
      <CardHeader className="bg-gradient-to-br from-amber-50 dark:from-amber-950/50 via-orange-50 dark:via-orange-950/50 to-rose-50 dark:to-rose-950/50 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Seus Sonhos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {goalCount > 0 
                ? `${goalCount} sonho${goalCount > 1 ? 's' : ''} em andamento` 
                : "Transforme seus sonhos em realidade"
              }
            </CardDescription>
          </div>
          {goalCount > 0 && (
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
              {goalCount} ativa{goalCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-center p-6">
        {goalCount > 0 ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Total já guardado para seus sonhos
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {formatCurrency(totalSaved)}
              </div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Parabéns!</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Você está construindo seu futuro financeiro! Cada real economizado é um passo mais perto dos seus sonhos. 🚀
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 dark:from-amber-900 to-orange-100 dark:to-orange-900 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-card-foreground">Comece a Sonhar!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dê um propósito para o seu dinheiro e veja seus sonhos se tornarem realidade.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 bg-muted/50">
        <Link to="/goals" className="w-full">
          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-amber-200 transition-all duration-200">
            {goalCount > 0 ? 'Ver Minhas Metas' : 'Criar Primeira Meta'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GoalsSummary;
