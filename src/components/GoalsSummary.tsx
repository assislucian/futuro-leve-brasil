
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoals } from "@/hooks/useGoals";
import { GoalItem } from "./GoalItem";
import { Skeleton } from "@/components/ui/skeleton";
import { AddGoalDialog } from "./AddGoalDialog";

export function GoalsSummary() {
  const { data: goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <Card data-tour="goals">
        <CardHeader>
          <CardTitle>Suas Metas</CardTitle>
          <CardDescription>Acompanhe seus objetivos financeiros</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-tour="goals">
      <CardHeader>
        <CardTitle>Suas Metas</CardTitle>
        <CardDescription>Acompanhe seus objetivos financeiros</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">Nenhuma meta cadastrada ainda.</p>
          </div>
        )}
        <AddGoalDialog />
      </CardContent>
    </Card>
  );
}
