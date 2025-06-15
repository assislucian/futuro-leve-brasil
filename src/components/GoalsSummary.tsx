
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const GoalsSummary = () => {
  const { user } = useAuth();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['goalsSummary', user?.id],
    queryFn: async () => {
      if (!user) return { count: 0, totalSaved: 0 };
      
      const { data, error } = await supabase
        .from('goals')
        .select('current_amount')
        .eq('user_id', user.id);

      if (error) {
        console.error("Erro ao buscar resumo de metas:", error);
        return { count: 0, totalSaved: 0 };
      }

      const totalSaved = data.reduce((acc, goal) => acc + goal.current_amount, 0);
      return { count: data.length, totalSaved };
    },
    enabled: !!user,
  });

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
