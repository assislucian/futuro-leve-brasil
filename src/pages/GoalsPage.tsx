
import React from "react";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import GoalList from "@/components/GoalList";

const GoalsPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Metas Financeiras 🎯</h1>
          <p className="text-muted-foreground">
            Conecte seu dinheiro aos seus sonhos. Acompanhe seu progresso aqui.
          </p>
        </div>
        <AddGoalDialog />
      </div>

      <GoalList />
    </div>
  );
};

export default GoalsPage;
