
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number;
}

interface GoalSelectorProps {
  goals: Goal[];
  selectedGoalId: string;
  onGoalChange: (goalId: string) => void;
  isLoading: boolean;
}

export function GoalSelector({ goals, selectedGoalId, onGoalChange, isLoading }: GoalSelectorProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="goal-select" className="text-sm font-semibold text-slate-700">
        Escolha seu sonho
      </Label>
      <Select value={selectedGoalId} onValueChange={onGoalChange}>
        <SelectTrigger id="goal-select" className="h-12 border-2 hover:border-emerald-200 transition-colors">
          <SelectValue placeholder="Selecione uma meta para acelerar" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              <div className="flex items-center gap-2">
                <div className="animate-pulse w-4 h-4 bg-slate-200 rounded"></div>
                Carregando suas metas...
              </div>
            </SelectItem>
          ) : goals?.length === 0 ? (
            <SelectItem value="none" disabled>
              <div className="flex flex-col items-center py-4 text-center">
                <Target className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-slate-600">Nenhuma meta ativa</span>
                <span className="text-xs text-slate-400">Crie uma meta primeiro!</span>
              </div>
            </SelectItem>
          ) : (
            goals?.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const remaining = goal.target_amount - goal.current_amount;
              return (
                <SelectItem key={goal.id} value={goal.id}>
                  <div className="flex items-center justify-between w-full py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{goal.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={progress} className="w-20 h-1.5" />
                        <span className="text-xs font-medium text-emerald-600">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Faltam {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
