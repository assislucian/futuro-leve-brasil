
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCinemaTour } from "@/hooks/useCinemaTour";
import { 
  Play, 
  Pause, 
  SkipForward, 
  ChevronLeft,
  Sparkles,
  Target,
  TrendingUp,
  DollarSign,
  Brain,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
  {
    id: "welcome",
    title: "Bem-vindo ao Plenus",
    subtitle: "Sua jornada para a plenitude financeira começa aqui",
    description: "Em apenas alguns minutos, você descobrirá como organizar suas finanças de forma inteligente e alcançar seus objetivos.",
    icon: Sparkles,
    target: ".financial-summary",
    gradient: "from-emerald-500 to-blue-500"
  },
  {
    id: "dashboard",
    title: "Visão 360° das suas finanças",
    subtitle: "Controle total em uma única tela",
    description: "Aqui você vê o resumo completo: entradas, saídas e saldo atual. Nossa IA analisa seus padrões e sugere melhorias automaticamente.",
    icon: Brain,
    target: ".financial-summary",
    gradient: "from-blue-500 to-purple-500"
  },
  {
    id: "insights",
    title: "Insights inteligentes personalizados",
    subtitle: "IA que trabalha para você 24/7",
    description: "Receba sugestões personalizadas baseadas nos seus hábitos financeiros. Identifique oportunidades de economia e otimização.",
    icon: Zap,
    target: ".smart-insights-card",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "goals",
    title: "Metas que você realmente alcança",
    subtitle: "Transforme sonhos em realidade",
    description: "Defina objetivos claros e acompanhe o progresso. Nosso sistema quebra grandes metas em passos alcançáveis.",
    icon: Target,
    target: ".goals-summary",
    gradient: "from-pink-500 to-orange-500"
  },
  {
    id: "growth",
    title: "Seu crescimento financeiro",
    subtitle: "Evolua continuamente",
    description: "Parabéns! Agora você tem todas as ferramentas para construir um futuro financeiro sólido. Comece adicionando sua primeira transação.",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500"
  }
];

export function CinemaTour() {
  const {
    isActive,
    currentStepIndex,
    isPaused,
    totalSteps,
    nextStep,
    previousStep,
    pauseResume,
    skipTour,
  } = useCinemaTour();

  if (!isActive) return null;

  const currentStep = tourSteps[currentStepIndex];
  const IconComponent = currentStep.icon;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {/* Overlay with spotlight effect */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
        {/* Spotlight effect on target element */}
        {currentStep.target && (
          <style>
            {`
              ${currentStep.target} {
                position: relative !important;
                z-index: 51 !important;
                box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.4) !important;
                border-radius: 12px !important;
                animation: tourPulse 2s ease-in-out infinite !important;
              }
              
              @keyframes tourPulse {
                0%, 100% { 
                  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.4);
                }
                50% { 
                  box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.6);
                }
              }
            `}
          </style>
        )}
      </div>

      {/* Tour Modal */}
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="fixed z-52 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
          {/* Header with gradient */}
          <div className={cn(
            "relative h-24 bg-gradient-to-r overflow-hidden",
            currentStep.gradient
          )}>
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0">
              <Progress value={progress} className="h-1 bg-white/20" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentStepIndex + 1} de {totalSteps}
                </Badge>
                <Badge className="bg-emerald-500 text-white text-xs">
                  ✨ Tour Guiado
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {currentStep.title}
                </h2>
                <p className="text-base font-medium text-emerald-600">
                  {currentStep.subtitle}
                </p>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                onClick={skipTour}
                className="text-slate-500 hover:text-slate-700"
                size="sm"
              >
                Pular Tour
              </Button>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={previousStep}
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                )}
                
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4"
                  size="sm"
                >
                  {currentStepIndex === totalSteps - 1 ? (
                    "Começar 🚀"
                  ) : (
                    <>
                      Próximo
                      <SkipForward className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Final step encouragement */}
            {currentStepIndex === totalSteps - 1 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                <div className="text-center text-sm text-emerald-800">
                  <p className="font-medium">🎉 Pronto para transformar suas finanças!</p>
                  <p>Comece adicionando sua primeira transação.</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
