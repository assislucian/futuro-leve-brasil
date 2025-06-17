
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
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
      
      console.log("TransactionGoalConnector: Buscando metas ativas para usuário:", user.id);
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("TransactionGoalConnector: Erro ao buscar metas:", error);
        throw error;
      }

      console.log("TransactionGoalConnector: Metas encontradas:", data);

      // Filtrar apenas metas não concluídas (current_amount < target_amount)
      const activeBucketGoals = data?.filter(goal => goal.current_amount < goal.target_amount) || [];
      console.log("TransactionGoalConnector: Metas ativas filtradas:", activeBucketGoals);

      return activeBucketGoals;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const contributeToGoal = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      if (!user) throw new Error("Usuário não autenticado");

      console.log("TransactionGoalConnector: Adicionando contribuição:", { goalId, amount });

      const { error } = await supabase
        .from('goal_contributions')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          amount: amount,
          contribution_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error("TransactionGoalConnector: Erro ao adicionar contribuição:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('🎯 Contribuição adicionada! Você está mais perto do seu sonho!', {
        description: 'Cada passo conta na sua jornada financeira. Continue assim! 🚀',
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['activeGoals'] });
      queryClient.invalidateQueries({ queryKey: ['smartInsights'] });
      queryClient.invalidateQueries({ queryKey: ['goalsSummary'] });
      setOpen(false);
      onConnect?.();
    },
    onError: (error) => {
      console.error("TransactionGoalConnector: Erro na mutation:", error);
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

  const selectedGoal = goals?.find(g => g.id === selectedGoalId);
  const newProgress = selectedGoal ? 
    ((selectedGoal.current_amount + contributionAmount) / selectedGoal.target_amount) * 100 : 0;

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
          <div className="space-y-3">
            <Label htmlFor="goal-select" className="text-sm font-semibold text-slate-700">
              Escolha seu sonho
            </Label>
            <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
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

          {selectedGoal && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Progresso atual</span>
                <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                  {((selectedGoal.current_amount / selectedGoal.target_amount) * 100).toFixed(0)}%
                </Badge>
              </div>
              <Progress 
                value={(selectedGoal.current_amount / selectedGoal.target_amount) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>{formatCurrency(selectedGoal.current_amount)}</span>
                <span>{formatCurrency(selectedGoal.target_amount)}</span>
              </div>
            </div>
          )}

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
                onChange={(e) => setContributionAmount(Number(e.target.value))}
                className="pl-10 h-12 border-2 hover:border-emerald-200 focus:border-emerald-300 transition-colors text-lg font-semibold"
                max={transactionAmount}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">
                Máximo: {formatCurrency(transactionAmount)}
              </p>
              <div className="flex gap-1">
                {[0.1, 0.25, 0.5].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setContributionAmount(transactionAmount * percentage)}
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
