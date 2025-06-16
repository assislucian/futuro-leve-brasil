
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ArrowRight, X, Sparkles, DollarSign, Target, PieChart } from "lucide-react";

const stepIcons = {
  welcome: Sparkles,
  "add-transaction": DollarSign,
  "create-goal": Target,
  "create-budget": PieChart,
};

/**
 * Componente de tour de onboarding interativo
 * Guia o usuário pelos primeiros passos essenciais
 */
export function OnboardingTour() {
  const {
    isOnboardingActive,
    currentStep,
    currentStepIndex,
    progress,
    nextStep,
    skipOnboarding,
  } = useOnboarding();

  if (!isOnboardingActive || !currentStep) {
    return null;
  }

  const IconComponent = stepIcons[currentStep.id as keyof typeof stepIcons] || Sparkles;
  const isLastStep = currentStepIndex === 3;

  return (
    <Dialog open={!!isOnboardingActive} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
            <IconComponent className="h-8 w-8 text-emerald-600" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {currentStep.title}
              </DialogTitle>
              <Badge variant="secondary" className="text-xs">
                {currentStepIndex + 1} de 4
              </Badge>
            </div>
            
            <DialogDescription className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              {currentStep.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={skipOnboarding}
              className="flex-1 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Pular Tour
            </Button>
            
            <Button
              onClick={nextStep}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              {isLastStep ? "Finalizar" : "Próximo"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {currentStepIndex === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-emerald-800">
                <p className="font-medium mb-1">💡 Dica Especial</p>
                <p>Este tour demora apenas 2 minutos e vai te ajudar a conquistar seus sonhos financeiros mais rapidamente!</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
