
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useGoalsSummary } from "@/hooks/useGoalsSummary";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const GoalsSummary = () => {
  const { data: summary, isLoading, error } = useGoalsSummary();

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow">
          <Skeleton className="h-10 w-full" />
        </CardContent>
         <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
           <div className="flex items-start justify-between">
            <div>
              <CardTitle>Seus Sonhos</CardTitle>
              <CardDescription>
                Acompanhe a evolução das suas metas.
              </CardDescription>
            </div>
            <Star className="h-6 w-6 text-amber-400" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Seus Sonhos</CardTitle>
            <CardDescription>
              {goalCount > 0 ? `Você tem ${goalCount} meta${goalCount > 1 ? 's' : ''} ativas.` : "Transforme seus sonhos em metas."}
            </CardDescription>
          </div>
          <Star className="h-6 w-6 text-amber-400" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-start justify-center">
         {goalCount > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">Total já guardado para seus sonhos:</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalSaved)}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Dê um propósito para o seu dinheiro e veja seus sonhos se tornarem realidade.
            </p>
          )}
      </CardContent>
       <CardFooter>
        <Link to="/goals" className="w-full">
          <Button className="w-full">
            Ver Minhas Metas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GoalsSummary;
