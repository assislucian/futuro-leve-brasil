import React from "react";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import GoalList from "@/components/GoalList";
import { useAuth } from "@/hooks/useAuth";
import { useGoalsSummary } from "@/hooks/useGoalsSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GoalsPage = () => {
  const { profile, loading: authLoading, isTrialing } = useAuth();
  const { data: goalsSummary, isLoading: goalsLoading } = useGoalsSummary();

  const isLoading = authLoading || goalsLoading;
  const goalCount = goalsSummary?.count || 0;
  const limitReached = profile?.plan === 'free' && !isTrialing && goalCount >= 2;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Metas Financeiras 🎯</h1>
          <p className="text-muted-foreground">
            Conecte seu dinheiro aos seus sonhos. Acompanhe seu progresso aqui.
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-10 w-44" />
        ) : (
          <div className="flex items-center gap-4">
            {limitReached && (
                <Alert variant="default" className="border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500 bg-amber-500/5 dark:bg-amber-500/10 p-3 rounded-lg max-w-xs">
                  <Rocket className="h-4 w-4" />
                  <AlertTitle className="font-semibold text-sm mb-1">Acelere seus Sonhos!</AlertTitle>
                  <AlertDescription className="text-xs">
                    O plano gratuito permite 2 metas. <Link to="/#pricing" className="font-bold underline hover:text-amber-500">Faça upgrade</Link> para metas ilimitadas.
                  </AlertDescription>
                </Alert>
            )}
            <AddGoalDialog disabled={limitReached} />
          </div>
        )}
      </div>

      <GoalList />
    </div>
  );
};

export { GoalsPage };
export default GoalsPage;
