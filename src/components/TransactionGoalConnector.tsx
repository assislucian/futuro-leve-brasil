
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Target, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useGoals } from "@/hooks/useGoals";
import { useGoalContribution } from "@/hooks/useGoalContribution";
import { GoalSelector } from "@/components/goal/GoalSelector";
import { GoalPreview } from "@/components/goal/GoalPreview";
import { ContributionForm } from "@/components/goal/ContributionForm";

interface TransactionGoalConnectorProps {
  transactionAmount: number;
  transactionType: 'income' | 'expense';
  onConnect?: () => void;
}

export function TransactionGoalConnector({ 
  transactionAmount, 
  transactionType, 
  onConnect 
}: TransactionGoalConnectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [contributionAmount, setContributionAmount] = useState(transactionAmount);

  const { data: goals, isLoading } = useGoals();

  const contributeToGoal = useGoalContribution(() => {
    setOpen(false);
    onConnect?.();
  });

  const handleContribute = () => {
    if (!selectedGoalId || contributionAmount <= 0) {
      toast.error("Selecione uma meta e um valor válido");
      return;
    }

    contributeToGoal.mutate({
      goalId: selectedGoalId,
      amount: contributionAmount
    });
  };

  // Só mostrar para receitas ou quando houver metas ativas
  if (transactionType === 'expense') return null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const selectedGoal = goals?.find(g => g.id === selectedGoalId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 hover:shadow-sm"
        >
          <Target className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only font-medium">
            Acelerar Sonho
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0">
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              Acelerar um Sonho! ✨
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              Que tal usar esta receita para ficar mais perto de realizar seus sonhos? 
              Cada contribuição é um passo em direção ao que você mais deseja! 🚀
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="space-y-6 p-6">
          <GoalSelector 
            goals={goals || []}
            selectedGoalId={selectedGoalId}
            onGoalChange={setSelectedGoalId}
            isLoading={isLoading}
          />

          {selectedGoal && (
            <GoalPreview goal={selectedGoal} />
          )}

          <ContributionForm
            selectedGoal={selectedGoal}
            contributionAmount={contributionAmount}
            onAmountChange={setContributionAmount}
            maxAmount={transactionAmount}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={contributeToGoal.isPending}
            >
              Talvez depois
            </Button>
            <Button
              onClick={handleContribute}
              disabled={!selectedGoalId || contributionAmount <= 0 || contributeToGoal.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-emerald-200 transition-all duration-200"
            >
              {contributeToGoal.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Contribuindo...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Acelerar {formatCurrency(contributionAmount)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
