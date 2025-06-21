
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Target, Calendar } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  celebrated_at?: string;
}

interface GoalItemProps {
  goal: Goal;
}

export function GoalItem({ goal }: GoalItemProps) {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const isCompleted = progress >= 100;
  const remaining = goal.target_amount - goal.current_amount;

  return (
    <div className="p-4 border rounded-lg space-y-3 bg-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-sm">{goal.name}</h4>
        </div>
        {isCompleted && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Concluída
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
          </span>
          {!isCompleted && (
            <span className="text-muted-foreground">
              Falta {formatCurrency(remaining)}
            </span>
          )}
        </div>
      </div>

      {goal.target_date && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Meta: {new Date(goal.target_date).toLocaleDateString('pt-BR')}</span>
        </div>
      )}
    </div>
  );
}
