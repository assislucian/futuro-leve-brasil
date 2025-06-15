
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const GoalsSummary = () => {
  const { user } = useAuth();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['goalsSummary', user?.id],
    queryFn: async () => {
      if (!user) return { count: 0 };
      // Usando 'count' para otimizar a query e não trazer todos os dados
      const { count, error } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error("Erro ao buscar resumo de metas:", error);
        return { count: 0 };
      }
      return { count: count ?? 0 };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  const goalCount = summary?.count || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Seus Sonhos</CardTitle>
            <CardDescription>
              {goalCount > 0 ? `Você está trabalhando em ${goalCount} meta${goalCount > 1 ? 's' : ''}.` : "Transforme seus sonhos em metas."}
            </CardDescription>
          </div>
          <Target className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <Link to="/goals" className="w-full">
          <Button className="w-full">
            Ver Minhas Metas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default GoalsSummary;
