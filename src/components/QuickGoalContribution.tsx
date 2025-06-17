
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuickGoalContributionProps {
  amount: number;
  onContribute: (goalId: string, amount: number) => void;
}

export function QuickGoalContribution({ amount, onContribute }: QuickGoalContributionProps) {
  const { user } = useAuth();
  const [selectedPercentage, setSelectedPercentage] = useState<number>(10);

  const { data: nextGoal, isLoading } = useQuery({
    queryKey: ['nextActiveGoal', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log("QuickGoalContribution: Buscando próxima meta ativa para usuário:", user.id);
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("QuickGoalContribution: Erro ao buscar metas:", error);
        return null;
      }

      console.log("QuickGoalContribution: Metas encontradas:", data);

      // Filtrar apenas metas não concluídas e pegar a primeira
      const activeGoal = data?.find(goal => goal.current_amount < goal.target_amount);
      console.log("QuickGoalContribution: Meta ativa selecionada:", activeGoal);

      return activeGoal || null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading || !nextGoal) return null;

  const contributionAmount = (amount * selectedPercentage) / 100;
  const newProgress = ((nextGoal.current_amount + contributionAmount) / nextGoal.target_amount) * 100;
  const remaining = nextGoal.target_amount - nextGoal.current_amount;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-4 border border-emerald-200 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-emerald-100 rounded-full">
          <Sparkles className="h-4 w-4 text-emerald-600" />
        </div>
        <h4 className="font-semibold text-emerald-800">🚀 Acelere seu Sonho Agora!</h4>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Meta: {nextGoal.name}</span>
          <Badge variant="outline" className="text-emerald-700 border-emerald-200">
            {((nextGoal.current_amount / nextGoal.target_amount) * 100).toFixed(0)}%
          </Badge>
        </div>
        
        <Progress value={(nextGoal.current_amount / nextGoal.target_amount) * 100} className="h-2" />
        
        <div className="flex justify-between text-xs text-slate-600">
          <span>{formatCurrency(nextGoal.current_amount)}</span>
          <span>Faltam: {formatCurrency(remaining)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Contribuir:</span>
          <div className="flex gap-1">
            {[10, 25, 50].map((percentage) => (
              <Button
                key={percentage}
                variant={selectedPercentage === percentage ? "default" : "outline"}
                size="sm"
                className={`h-7 px-2 text-xs ${
                  selectedPercentage === percentage 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'hover:bg-emerald-50 hover:border-emerald-200'
                }`}
                onClick={() => setSelectedPercentage(percentage)}
              >
                {percentage}%
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              {selectedPercentage}% = {formatCurrency(contributionAmount)}
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <Progress value={newProgress} className="h-2 mb-2" />
          <p className="text-xs text-emerald-700">
            Novo progresso: <strong>{newProgress.toFixed(0)}%</strong>
            {newProgress >= 100 && " 🎉 Meta concluída!"}
          </p>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          💡 <strong>Dica:</strong> Contribuir regularmente é o segredo para realizar seus sonhos mais rápido!
        </p>
      </div>
    </div>
  );
}
