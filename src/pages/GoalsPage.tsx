
import React from "react";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import GoalList from "@/components/GoalList";
import { useAuth } from "@/hooks/useAuth";
import { useGoalsSummary } from "@/hooks/useGoalsSummary";
import { Skeleton } from "@/components/ui/skeleton";

const GoalsPage = () => {
  const { profile, loading: authLoading } = useAuth();
  const { data: goalsSummary, isLoading: goalsLoading } = useGoalsSummary();

  const isLoading = authLoading || goalsLoading;
  const goalCount = goalsSummary?.count || 0;
  const isFreePlan = profile?.plan === 'free';
  const limitReached = isFreePlan && goalCount >= 2;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Metas Financeiras 🎯</h1>
          <p className="text-muted-foreground">
            Conecte seu dinheiro aos seus sonhos. Acompanhe seu progresso aqui.
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-10 w-44" />
        ) : (
          <AddGoalDialog disabled={limitReached} />
        )}
      </div>

      <GoalList />
    </div>
  );
};

export default GoalsPage;
