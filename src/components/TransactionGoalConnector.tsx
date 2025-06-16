
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Plus } from "lucide-react";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [contributionAmount, setContributionAmount] = useState(transactionAmount);

  const { data: goals, isLoading } = useQuery({
    queryKey: ['activeGoals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .filter('current_amount', 'lt', 'target_amount')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && open,
  });

  const contributeToGoal = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('goal_contributions')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          amount: amount,
          contribution_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Contribuição adicionada com sucesso! 🎯');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['activeGoals'] });
      queryClient.invalidateQueries({ queryKey: ['smartInsights'] });
      setOpen(false);
      onConnect?.();
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar contribuição: ${error.message}`);
    },
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
        >
          <Target className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">
            Contribuir para Meta
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            Acelerar um Sonho
          </DialogTitle>
          <DialogDescription>
            Que tal usar parte desta receita para acelerar uma das suas metas?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="goal-select">Escolha uma meta</Label>
            <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
              <SelectTrigger id="goal-select">
                <SelectValue placeholder="Selecione uma meta" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : goals?.length === 0 ? (
                  <SelectItem value="none" disabled>Nenhuma meta ativa</SelectItem>
                ) : (
                  goals?.map((goal) => {
                    const progress = (goal.current_amount / goal.target_amount) * 100;
                    const remaining = goal.target_amount - goal.current_amount;
                    return (
                      <SelectItem key={goal.id} value={goal.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {progress.toFixed(0)}% • Faltam {formatCurrency(remaining)}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Valor da contribuição</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(Number(e.target.value))}
                className="pl-8"
                max={transactionAmount}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor máximo: {formatCurrency(transactionAmount)}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleContribute}
              disabled={!selectedGoalId || contributionAmount <= 0 || contributeToGoal.isPending}
              className="flex-1"
            >
              {contributeToGoal.isPending ? (
                "Contribuindo..."
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Contribuir {formatCurrency(contributionAmount)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
