
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useEmergencyFundCalculator } from "@/hooks/useEmergencyFundCalculator";
import { useCreateEmergencyFundGoal } from "@/hooks/useCreateEmergencyFundGoal";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const GoalsSummary = () => {
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: emergencyData, isLoading: emergencyLoading } = useEmergencyFundCalculator();
  const createEmergencyGoal = useCreateEmergencyFundGoal();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Calcular recomendação inteligente
  const getSmartRecommendation = () => {
    if (!emergencyData || !goals) return null;

    const { 
      hasEmergencyFund, 
      missingAmount, 
      monthlyEssentialExpenses,
      monthsOfSecurity,
      recommendedAmount 
    } = emergencyData;

    // 1ª Prioridade: Criar reserva de emergência se não existe
    if (!hasEmergencyFund && monthlyEssentialExpenses > 0) {
      const hasEmergencyGoal = goals.some(goal => 
        goal.name.toLowerCase().includes('emergência') || 
        goal.name.toLowerCase().includes('reserva')
      );

      if (!hasEmergencyGoal) {
        return {
          type: "create_emergency",
          title: "🚨 Prioridade: Crie sua Reserva",
          description: `Baseado nos seus gastos de ${formatCurrency(monthlyEssentialExpenses)}/mês, você precisa de ${formatCurrency(recommendedAmount)} para ${Math.ceil(recommendedAmount / monthlyEssentialExpenses)} meses de segurança.`,
          action: "Criar Automaticamente",
          priority: "high"
        };
      }
    }

    // 2ª Prioridade: Completar reserva existente
    if (!hasEmergencyFund && monthsOfSecurity > 0) {
      return {
        type: "complete_emergency",
        title: "💪 Continue sua Reserva",
        description: `Você tem ${monthsOfSecurity.toFixed(1)} meses de segurança. Faltam ${formatCurrency(missingAmount)} para completar.`,
        action: "Contribuir Agora",
        priority: "medium"
      };
    }

    // 3ª Prioridade: Acelerar outras metas
    if (hasEmergencyFund && goals.length > 0) {
      const activeGoals = goals.filter(goal => goal.current_amount < goal.target_amount);
      if (activeGoals.length > 0) {
        const nearestGoal = activeGoals.sort((a, b) => {
          const progressA = (a.current_amount / a.target_amount) * 100;
          const progressB = (b.current_amount / b.target_amount) * 100;
          return progressB - progressA;
        })[0];

        const progress = (nearestGoal.current_amount / nearestGoal.target_amount) * 100;
        
        return {
          type: "accelerate",
          title: "🚀 Acelere seu Sonho",
          description: `"${nearestGoal.name}" está ${progress.toFixed(0)}% completa!`,
          action: "Contribuir",
          priority: "low"
        };
      }
    }

    return null;
  };

  const smartRecommendation = getSmartRecommendation();

  if (goalsLoading || emergencyLoading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-600" />
            Seus Sonhos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              {smartRecommendation?.type === "create_emergency" ? 
                <Shield className="h-6 w-6 text-orange-600" /> :
                <Target className="h-6 w-6 text-emerald-600" />
              }
            </div>
            
            {smartRecommendation?.type === "create_emergency" ? (
              <div className="space-y-2">
                <Badge variant="destructive" className="mb-2">
                  Ação Urgente
                </Badge>
                <h4 className="font-medium text-sm text-slate-900">
                  {smartRecommendation.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {smartRecommendation.description}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-900">
                  Comece Definindo um Sonho
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conecte seu dinheiro a um objetivo. Sonhos claros geram economia automática.
                </p>
              </div>
            )}
          </div>

          {smartRecommendation?.type === "create_emergency" ? (
            <Button 
              onClick={() => emergencyData && createEmergencyGoal.mutate({
                targetAmount: emergencyData.recommendedAmount,
                monthsOfSecurity: Math.ceil(emergencyData.recommendedAmount / emergencyData.monthlyEssentialExpenses),
                monthlyExpenses: emergencyData.monthlyEssentialExpenses
              })}
              disabled={createEmergencyGoal.isPending}
              size="sm" 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Shield className="h-4 w-4 mr-2" />
              {createEmergencyGoal.isPending ? "Criando..." : "Criar Reserva de Emergência"}
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Link to="/goals">
                <Target className="h-4 w-4 mr-2" />
                Criar Primeira Meta
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const activeGoals = goals.filter(goal => goal.current_amount < goal.target_amount);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-600" />
          Seus Sonhos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-emerald-600">{goals.length}</p>
            <p className="text-xs text-muted-foreground">
              {goals.length === 1 ? "sonho" : "sonhos"} criados
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-emerald-600">{activeGoals.length}</p>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </div>
        </div>

        {/* Total Guardado */}
        <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
          <p className="text-xs text-emerald-700 font-medium mb-1">
            Total já guardado para seus sonhos
          </p>
          <p className="text-lg font-bold text-emerald-800">
            {formatCurrency(totalSaved)}
          </p>
        </div>

        {/* Recomendação Inteligente baseada em análise real */}
        {smartRecommendation && (
          <div className={cn(
            "p-3 rounded-lg border text-center space-y-2",
            smartRecommendation.priority === "high" && "bg-red-50 border-red-200",
            smartRecommendation.priority === "medium" && "bg-yellow-50 border-yellow-200",
            smartRecommendation.priority === "low" && "bg-blue-50 border-blue-200"
          )}>
            <div className="flex items-center justify-center gap-2">
              {smartRecommendation.priority === "high" && <AlertCircle className="h-4 w-4 text-red-600" />}
              {smartRecommendation.priority === "medium" && <TrendingUp className="h-4 w-4 text-yellow-600" />}
              {smartRecommendation.priority === "low" && <CheckCircle className="h-4 w-4 text-blue-600" />}
              <p className="text-xs font-medium text-slate-700">
                {smartRecommendation.title}
              </p>
            </div>
            <p className="text-xs text-slate-600">
              {smartRecommendation.description}
            </p>
          </div>
        )}

        {/* Status da Reserva de Emergência */}
        {emergencyData && (
          <div className="text-center space-y-2">
            <p className="text-xs font-medium text-slate-700">
              {emergencyData.hasEmergencyFund ? "✅ Reserva Completa!" : "🛡️ Segurança Financeira"}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {emergencyData.hasEmergencyFund 
                ? `Você tem ${emergencyData.monthsOfSecurity.toFixed(1)} meses de segurança. Agora pode focar em seus outros sonhos! 🚀`
                : `Você tem ${emergencyData.monthsOfSecurity.toFixed(1)} meses de segurança. Continue construindo sua tranquilidade financeira.`
              }
            </p>
          </div>
        )}

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/goals">
            <Target className="h-4 w-4 mr-2" />
            Ver Minhas Metas
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalsSummary;
