
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useWealthJourneyTour } from "@/hooks/useWealthJourneyTour";
import { 
  ArrowRight, 
  ArrowLeft,
  X,
  Sparkles,
  Target,
  TrendingUp,
  DollarSign,
  PieChart,
  Shield,
  Lightbulb,
  Heart,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
  {
    id: "welcome",
    title: "Bem-vindo ao Plenus",
    subtitle: "Sua jornada para a plenitude financeira começa aqui",
    description: "O Plenus foi criado especialmente para brasileiros que querem transformar sua relação com o dinheiro. Vamos te mostrar como sair do caos financeiro e alcançar seus sonhos, passo a passo.",
    actionText: "Começar minha transformação",
    icon: Sparkles,
    tip: "💡 Este tour é no seu ritmo. Pause quando quiser, volte se precisar. O importante é você entender cada funcionalidade."
  },
  {
    id: "dashboard-overview",
    title: "Seu painel de controle financeiro",
    subtitle: "Visão completa da sua vida financeira",
    description: "Aqui você vê um resumo completo: quanto tem, quanto gasta, e como está progredindo. É o seu centro de comando financeiro, sempre atualizado em tempo real.",
    actionText: "Entendi, vamos continuar",
    icon: TrendingUp,
    highlight: ".financial-summary",
    tip: "📊 Todos os números aqui se atualizam automaticamente conforme você adiciona transações e metas."
  },
  {
    id: "smart-insights",
    title: "Insights inteligentes",
    subtitle: "IA que trabalha para seus objetivos",
    description: "Nossa inteligência artificial analisa seus padrões financeiros e oferece sugestões personalizadas. Ela identifica oportunidades de economia e te ajuda a otimizar seus gastos.",
    actionText: "Adorei essa funcionalidade",
    icon: Lightbulb,
    highlight: ".smart-insights-card",
    tip: "🤖 Quanto mais você usa o Plenus, mais inteligentes ficam as sugestões!"
  },
  {
    id: "transactions",
    title: "Controle total dos seus gastos",
    subtitle: "Cada centavo rastreado e categorizado",
    description: "Adicione suas receitas e despesas facilmente. O sistema categoriza automaticamente e conecta cada gasto aos seus objetivos. Assim você sempre sabe para onde seu dinheiro está indo.",
    actionText: "Quero aprender a adicionar",
    icon: DollarSign,
    tip: "💳 Dica: Comece adicionando suas transações dos últimos 30 dias para ter uma visão mais precisa."
  },
  {
    id: "goals-power",
    title: "Transforme sonhos em conquistas",
    subtitle: "Sistema científico de metas financeiras",
    description: "Casa própria, viagem dos sonhos, aposentadoria... Crie metas específicas e veja exatamente quanto economizar por mês. O Plenus calcula tudo automaticamente e mostra seu progresso visual.",
    actionText: "Vou criar minha primeira meta",
    icon: Target,
    highlight: ".goals-summary",
    tip: "🎯 Metas específicas têm 10x mais chance de serem alcançadas que objetivos vagos!"
  },
  {
    id: "budgets-control",
    title: "Orçamentos que funcionam",
    subtitle: "Controle inteligente sem sufoco",
    description: "Crie orçamentos realistas por categoria. O sistema te avisa quando você está próximo do limite e sugere ajustes inteligentes. Sem stress, com foco no que realmente importa.",
    actionText: "Quero organizar meu orçamento",
    icon: PieChart,
    tip: "📋 Comece com categorias básicas: alimentação, transporte e lazer. Você pode refinar depois."
  },
  {
    id: "emergency-fund",
    title: "Sua reserva de emergência",
    subtitle: "Segurança e tranquilidade garantidas",
    description: "Uma das bases da saúde financeira é ter uma reserva para imprevistos. O Plenus te ajuda a calcular o valor ideal e criar um plano para formar sua reserva gradualmente.",
    actionText: "Vou criar minha reserva",
    icon: Shield,
    tip: "🛡️ Meta inicial: 3 meses de gastos essenciais. Depois amplie para 6 meses quando possível."
  },
  {
    id: "your-journey",
    title: "Sua jornada financeira começa agora",
    subtitle: "Você tem tudo para conquistar seus objetivos",
    description: "Parabéns! Agora você conhece todas as ferramentas do Plenus. Lembre-se: transformação financeira é uma jornada, não um destino. Estamos aqui para te apoiar em cada passo.",
    actionText: "Começar minha jornada",
    icon: Heart,
    tip: "🌟 Dica de ouro: Use o Plenus por 21 dias seguidos. É tempo suficiente para criar o hábito e ver os primeiros resultados!"
  }
];

export function WealthJourneyTour() {
  const {
    isActive,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    goToStep,
  } = useWealthJourneyTour();

  const currentStep = tourSteps[currentStepIndex];
  const [modalPosition, setModalPosition] = useState<{top: number, left: number} | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const highlightStylesRef = useRef<HTMLStyleElement | null>(null);

  // Memoized position calculation to prevent loops
  const calculatePosition = useCallback(() => {
    if (!currentStep?.highlight) {
      setModalPosition(null);
      return;
    }

    const el = document.querySelector(currentStep.highlight);
    if (!el) {
      setModalPosition(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const modalWidth = 600;
    const modalHeight = 400;
    const padding = 24;

    let top = rect.bottom + padding;
    let left = rect.left + (rect.width / 2) - (modalWidth / 2);

    // Ajustes para não sair da tela
    if (top + modalHeight > window.innerHeight) {
      top = Math.max(16, rect.top - modalHeight - padding);
    }
    if (left < 16) left = 16;
    if (left + modalWidth > window.innerWidth) {
      left = window.innerWidth - modalWidth - 16;
    }
    if (top < 16) top = window.innerHeight / 2 - modalHeight / 2;

    setModalPosition({ top, left });
  }, [currentStep?.highlight]);

  // Effect for highlighting elements
  useEffect(() => {
    if (!isActive) return;

    // Remove previous styles
    if (highlightStylesRef.current) {
      document.head.removeChild(highlightStylesRef.current);
      highlightStylesRef.current = null;
    }

    if (currentStep?.highlight) {
      // Create new styles
      const style = document.createElement('style');
      style.textContent = `
        ${currentStep.highlight} {
          position: relative !important;
          z-index: 101 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4) !important;
          border-radius: 12px !important;
          animation: gentlePulse 3s ease-in-out infinite !important;
        }
        
        @keyframes gentlePulse {
          0%, 100% { 
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);
          }
          50% { 
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6);
          }
        }
      `;
      document.head.appendChild(style);
      highlightStylesRef.current = style;

      // Calculate position with a small delay to ensure element is highlighted
      setTimeout(calculatePosition, 100);
    }

    return () => {
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
        highlightStylesRef.current = null;
      }
    };
  }, [isActive, currentStepIndex, calculatePosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
        highlightStylesRef.current = null;
      }
    };
  }, []);

  if (!isActive || !currentStep) {
    return null;
  }

  const IconComponent = currentStep.icon;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <>
      {/* Overlay suave */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />

      {/* Modal principal */}
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          ref={modalRef}
          style={modalPosition ? {
            position: 'fixed',
            top: modalPosition.top,
            left: modalPosition.left,
            width: Math.min(600, window.innerWidth - 32),
            maxWidth: '95vw',
            zIndex: 102,
            margin: 0,
            borderRadius: 16,
            padding: 0,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            background: 'white',
            border: 0
          } : {}}
          className={modalPosition ? "shadow-2xl p-0 overflow-hidden" : "fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl border-0 shadow-2xl p-0 overflow-hidden"}
        >
          {/* Header com progresso visual */}
          <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <Badge className="bg-emerald-500 text-white text-xs mb-1">
                    Jornada Plenus
                  </Badge>
                  <div className="text-sm text-emerald-700 font-medium">
                    Passo {currentStepIndex + 1} de {totalSteps}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Barra de progresso visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progresso da Jornada</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-white/50" />
            </div>

            {/* Navegação por pontos */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentStepIndex 
                      ? "bg-emerald-500 scale-125" 
                      : index < currentStepIndex 
                        ? "bg-emerald-300" 
                        : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {currentStep.title}
                </h2>
                <p className="text-lg font-medium text-emerald-600">
                  {currentStep.subtitle}
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed max-w-lg mx-auto text-base">
                {currentStep.description}
              </p>
            </div>

            {/* Dica especial */}
            {currentStep.tip && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p>{currentStep.tip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Controles de navegação */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    onClick={previousStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  onClick={skipTour}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Pular Tour
                </Button>
              </div>

              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 flex items-center gap-2"
              >
                {currentStep.actionText}
                {!isLastStep ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Mensagem especial no último passo */}
            {isLastStep && (
              <div className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                <div className="text-center space-y-3">
                  <Heart className="h-8 w-8 text-emerald-600 mx-auto" />
                  <div>
                    <h3 className="font-bold text-emerald-800 mb-2">
                      🎉 Parabéns! Você completou a Jornada Plenus
                    </h3>
                    <p className="text-emerald-700 text-sm">
                      Agora você tem todo o conhecimento para transformar sua vida financeira. 
                      Que tal começar adicionando sua primeira meta ou transação?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
