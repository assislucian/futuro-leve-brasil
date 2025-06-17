
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Goal {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number;
}

interface GoalPreviewProps {
  goal: Goal;
}

export function GoalPreview({ goal }: GoalPreviewProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Progresso atual</span>
        <Badge variant="outline" className="text-emerald-700 border-emerald-200">
          {((goal.current_amount / goal.target_amount) * 100).toFixed(0)}%
        </Badge>
      </div>
      <Progress 
        value={(goal.current_amount / goal.target_amount) * 100} 
        className="h-2"
      />
      <div className="flex justify-between text-xs text-slate-600">
        <span>{formatCurrency(goal.current_amount)}</span>
        <span>{formatCurrency(goal.target_amount)}</span>
      </div>
    </div>
  );
}
