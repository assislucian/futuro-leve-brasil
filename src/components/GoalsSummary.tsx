
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
      <Card className="flex flex-col h-full overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
        <CardFooter className="p-3">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4 text-amber-500" />
                Seus Sonhos
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Acompanhe a evolução das suas metas.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-3">
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Erro ao Carregar</AlertTitle>
            <AlertDescription className="text-xs">
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
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 bg-amber-100 rounded-full">
                <Target className="h-3.5 w-3.5 text-amber-600" />
              </div>
              Seus Sonhos
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              {goalCount > 0 
                ? `${goalCount} sonho${goalCount > 1 ? 's' : ''} em andamento` 
                : "Transforme seus sonhos em realidade"
              }
            </CardDescription>
          </div>
          {goalCount > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-xs px-2 py-0.5">
              {goalCount} ativa{goalCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-center p-3">
        {goalCount > 0 ? (
          <div className="space-y-3">
            <div className="text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                Total já guardado
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {formatCurrency(totalSaved)}
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-800">Parabéns!</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Você está construindo seu futuro! Cada real economizado é um passo mais perto dos seus sonhos. 🚀
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-800 text-sm">Comece a Sonhar!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dê um propósito para o seu dinheiro e veja seus sonhos se tornarem realidade.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 bg-slate-50/50">
        <Link to="/goals" className="w-full">
          <Button className="w-full h-9 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-amber-200 transition-all duration-200 text-sm">
            {goalCount > 0 ? 'Ver Minhas Metas' : 'Criar Primeira Meta'}
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GoalsSummary;
