
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number;
}

interface ContributionFormProps {
  selectedGoal: Goal | undefined;
  contributionAmount: number;
  onAmountChange: (amount: number) => void;
  maxAmount: number;
}

export function ContributionForm({ 
  selectedGoal, 
  contributionAmount, 
  onAmountChange, 
  maxAmount 
}: ContributionFormProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const newProgress = selectedGoal ? 
    ((selectedGoal.current_amount + contributionAmount) / selectedGoal.target_amount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">
          Valor da contribuição
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
            R$
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={contributionAmount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="pl-10 h-12 border-2 hover:border-emerald-200 focus:border-emerald-300 transition-colors text-lg font-semibold"
            max={maxAmount}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Máximo: {formatCurrency(maxAmount)}
          </p>
          <div className="flex gap-1">
            {[0.1, 0.25, 0.5].map((percentage) => (
              <Button
                key={percentage}
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => onAmountChange(maxAmount * percentage)}
              >
                {(percentage * 100).toFixed(0)}%
              </Button>
            ))}
          </div>
        </div>
      </div>

      {selectedGoal && contributionAmount > 0 && (
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">
              Novo progresso
            </span>
          </div>
          <Progress value={newProgress} className="h-2 mb-2" />
          <p className="text-xs text-emerald-700">
            Você chegará a <strong>{newProgress.toFixed(0)}%</strong> da sua meta! 
            {newProgress >= 100 && " 🎉 Meta concluída!"}
          </p>
        </div>
      )}
    </div>
  );
}
