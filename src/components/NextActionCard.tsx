
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowRight, Target, DollarSign, PiggyBank, AlertTriangle, Shield } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { useEmergencyFundCalculator } from "@/hooks/useEmergencyFundCalculator";
import { useCreateEmergencyFundGoal } from "@/hooks/useCreateEmergencyFundGoal";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type ActionPriority = "critical" | "high" | "medium" | "low";

interface SmartAction {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionPath?: string;
  onAction?: () => void;
  priority: ActionPriority;
  impact: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function NextActionCard() {
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: financialData, isLoading: financialLoading } = useFinancialSummaryData();
  const { data: emergencyData, isLoading: emergencyLoading } = useEmergencyFundCalculator();
  const createEmergencyGoal = useCreateEmergencyFundGoal();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Lógica inteligente baseada em dados reais
  const calculateSmartActions = (): SmartAction[] => {
    if (!financialData || !emergencyData || goalsLoading || financialLoading || emergencyLoading) return [];

    const actions: SmartAction[] = [];
    const { balance } = financialData;
    const { 
      hasEmergencyFund, 
      missingAmount, 
      monthlyEssentialExpenses,
      monthsOfSecurity,
      riskProfile,
      recommendedAmount 
    } = emergencyData;

    // 1. CRÍTICO: Fluxo de caixa negativo
    if (balance < 0) {
      actions.push({
        id: "negative-cashflow",
        title: "🚨 Urgente: Controle seus Gastos",
        description: `Você está gastando ${formatCurrency(Math.abs(balance))} a mais que ganha. Isso precisa ser resolvido primeiro.`,
        actionText: "Criar Orçamento de Emergência",
        actionPath: "/budgets",
        priority: "critical",
        impact: "Evita endividamento",
        icon: AlertTriangle
      });
    }

    // 2. ALTA PRIORIDADE: Reserva de emergência (com lógica inteligente)
    if (!hasEmergencyFund && balance >= 0 && monthlyEssentialExpenses > 0) {
      const hasExistingEmergencyGoal = goals?.some(goal => 
        goal.name.toLowerCase().includes('emergência') || 
        goal.name.toLowerCase().includes('reserva')
      );

      if (!hasExistingEmergencyGoal) {
        actions.push({
          id: "create-emergency-fund",
          title: "🛡️ Prioridade: Reserva de Emergência",
          description: `Baseado nos seus gastos essenciais de ${formatCurrency(monthlyEssentialExpenses)}/mês, você precisa de ${formatCurrency(missingAmount)} para ${Math.ceil(recommendedAmount / monthlyEssentialExpenses)} meses de segurança.`,
          actionText: "Criar Meta Automaticamente",
          onAction: () => {
            createEmergencyGoal.mutate({
              targetAmount: recommendedAmount,
              monthsOfSecurity: Math.ceil(recommendedAmount / monthlyEssentialExpenses),
              monthlyExpenses: monthlyEssentialExpenses
            });
          },
          priority: "high",
          impact: "Segurança financeira",
          icon: Shield
        });
      } else {
        // Se já tem meta, sugerir contribuição
        actions.push({
          id: "contribute-emergency",
          title: "💪 Continue Sua Reserva",
          description: `Você tem ${monthsOfSecurity.toFixed(1)} meses de segurança. Meta: ${Math.ceil(recommendedAmount / monthlyEssentialExpenses)} meses.`,
          actionText: "Contribuir para Emergência",
          actionPath: "/goals",
          priority: "high",
          impact: "Aumenta segurança",
          icon: PiggyBank
        });
      }
    }

    // 3. MÉDIO: Otimizar taxa de poupança
    if (hasEmergencyFund && financialData.totalIncome > 0) {
      const savingsRate = (balance / financialData.totalIncome) * 100;
      const idealRate = riskProfile === 'conservative' ? 15 : riskProfile === 'moderate' ? 20 : 25;

      if (savingsRate < idealRate) {
        actions.push({
          id: "improve-savings-rate",
          title: "📈 Acelere Seus Objetivos",
          description: `Sua taxa de poupança é ${savingsRate.toFixed(1)}%. Para seu perfil ${riskProfile === 'conservative' ? 'conservador' : riskProfile === 'moderate' ? 'moderado' : 'arrojado'}, ideal seria ${idealRate}%.`,
          actionText: "Otimizar Orçamento",
          actionPath: "/budgets",
          priority: "medium",
          impact: "Acelera objetivos",
          icon: DollarSign
        });
      }
    }

    // 4. BAIXO: Acelerar meta mais próxima
    if (hasEmergencyFund && goals && goals.length > 0) {
      const activeGoals = goals.filter(goal => goal.current_amount < goal.target_amount);
      if (activeGoals.length > 0) {
        const nearestGoal = activeGoals.sort((a, b) => {
          const progressA = (a.current_amount / a.target_amount) * 100;
          const progressB = (b.current_amount / b.target_amount) * 100;
          return progressB - progressA;
        })[0];

        const progress = (nearestGoal.current_amount / nearestGoal.target_amount) * 100;
        
        if (progress >= 70) {
          actions.push({
            id: "accelerate-goal",
            title: "🎯 Finalize seu Sonho!",
            description: `"${nearestGoal.name}" está ${progress.toFixed(0)}% completa. Está quase lá!`,
            actionText: "Contribuir Agora",
            actionPath: "/goals",
            priority: "low",
            impact: "Realização de sonho",
            icon: Target
          });
        }
      }
    }

    // Ordenar por prioridade
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return actions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  };

  const smartActions = calculateSmartActions();
  const topAction = smartActions[0];

  const getPriorityColor = (priority: ActionPriority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: ActionPriority) => {
    switch (priority) {
      case "critical": return "CRÍTICO";
      case "high": return "ALTA";
      case "medium": return "MÉDIA";
      case "low": return "BAIXA";
      default: return "NORMAL";
    }
  };

  if (goalsLoading || financialLoading || emergencyLoading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-8 w-full bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topAction) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Próxima Ação Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Lightbulb className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-slate-900">
              Parabéns! Você está no controle!
            </h4>
            <p className="text-xs text-slate-600">
              Continue acompanhando seus progressos e mantenha os bons hábitos financeiros.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const Icon = topAction.icon;

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Próxima Ação Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Badge de Prioridade */}
        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs font-medium border", getPriorityColor(topAction.priority))}>
            {getPriorityText(topAction.priority)}
          </Badge>
          <span className="text-xs text-muted-foreground">{topAction.impact}</span>
        </div>

        {/* Ação Principal */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              topAction.priority === "critical" && "bg-red-100",
              topAction.priority === "high" && "bg-orange-100",
              topAction.priority === "medium" && "bg-blue-100",
              topAction.priority === "low" && "bg-green-100"
            )}>
              <Icon className={cn(
                "h-4 w-4",
                topAction.priority === "critical" && "text-red-600",
                topAction.priority === "high" && "text-orange-600",
                topAction.priority === "medium" && "text-blue-600",
                topAction.priority === "low" && "text-green-600"
              )} />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-medium text-sm text-slate-900 leading-tight">
                {topAction.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {topAction.description}
              </p>
            </div>
          </div>

          {topAction.onAction ? (
            <Button 
              onClick={topAction.onAction}
              disabled={createEmergencyGoal.isPending}
              size="sm" 
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              {createEmergencyGoal.isPending ? "Criando..." : topAction.actionText}
              {!createEmergencyGoal.isPending && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Link to={topAction.actionPath!}>
                {topAction.actionText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>

        {/* Informação Adicional */}
        {smartActions.length > 1 && (
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              + {smartActions.length - 1} {smartActions.length === 2 ? "ação" : "ações"} adicionais disponíveis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
