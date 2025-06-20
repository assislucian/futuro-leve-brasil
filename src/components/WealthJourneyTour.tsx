
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
  const [isPositioned, setIsPositioned] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função inteligente para calcular posição do modal com base no elemento destacado
  const calculateOptimalPosition = useCallback(() => {
    if (!currentStep?.highlight || !isActive) {
      setModalPosition(null);
      setIsPositioned(true);
      return;
    }

    const highlightedElement = document.querySelector(currentStep.highlight);
    if (!highlightedElement) {
      setModalPosition(null);
      setIsPositioned(true);
      return;
    }

    const rect = highlightedElement.getBoundingClientRect();
    const modalWidth = Math.min(600, window.innerWidth - 32);
    const modalHeight = 500; // Altura estimada do modal
    const padding = 24;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top: number;
    let left: number;

    // Lógica inteligente de posicionamento para evitar sobreposição
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;

    // Prioridade: abaixo -> direita -> acima -> esquerda
    if (spaceBelow >= modalHeight + padding) {
      // Posicionar abaixo do elemento
      top = rect.bottom + padding;
      left = Math.max(16, Math.min(rect.left + (rect.width / 2) - (modalWidth / 2), viewportWidth - modalWidth - 16));
    } else if (spaceRight >= modalWidth + padding && rect.top + modalHeight <= viewportHeight) {
      // Posicionar à direita do elemento
      left = rect.right + padding;
      top = Math.max(16, Math.min(rect.top, viewportHeight - modalHeight - 16));
    } else if (spaceAbove >= modalHeight + padding) {
      // Posicionar acima do elemento
      top = rect.top - modalHeight - padding;
      left = Math.max(16, Math.min(rect.left + (rect.width / 2) - (modalWidth / 2), viewportWidth - modalWidth - 16));
    } else if (spaceLeft >= modalWidth + padding && rect.top + modalHeight <= viewportHeight) {
      // Posicionar à esquerda do elemento
      left = rect.left - modalWidth - padding;
      top = Math.max(16, Math.min(rect.top, viewportHeight - modalHeight - 16));
    } else {
      // Fallback: centro da tela
      top = Math.max(16, (viewportHeight - modalHeight) / 2);
      left = Math.max(16, (viewportWidth - modalWidth) / 2);
    }

    setModalPosition({ top, left });
    setIsPositioned(true);
  }, [currentStep?.highlight, isActive]);

  // Listener para scroll que reposiciona o modal
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      calculateOptimalPosition();
    }, 100); // Debounce para performance
  }, [calculateOptimalPosition]);

  // Effect para aplicar destaque e calcular posição
  useEffect(() => {
    if (!isActive) {
      // Cleanup quando não ativo
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
        highlightStylesRef.current = null;
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateOptimalPosition);
      setModalPosition(null);
      setIsPositioned(false);
      return;
    }

    // Remove estilos anteriores
    if (highlightStylesRef.current) {
      document.head.removeChild(highlightStylesRef.current);
      highlightStylesRef.current = null;
    }

    if (currentStep?.highlight) {
      // Aguarda o DOM estar pronto
      const timer = setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
          ${currentStep.highlight} {
            position: relative !important;
            z-index: 101 !important;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.7), 0 0 40px rgba(16, 185, 129, 0.5) !important;
            border-radius: 12px !important;
            animation: smoothPulse 3s ease-in-out infinite !important;
            transition: all 0.3s ease !important;
          }
          
          @keyframes smoothPulse {
            0%, 100% { 
              box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.7), 0 0 40px rgba(16, 185, 129, 0.5);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.9), 0 0 60px rgba(16, 185, 129, 0.7);
              transform: scale(1.01);
            }
          }
        `;
        document.head.appendChild(style);
        highlightStylesRef.current = style;

        // Calcula posição após aplicar destaque
        setTimeout(calculateOptimalPosition, 150);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // Se não há highlight, posiciona no centro
      setModalPosition(null);
      setIsPositioned(true);
    }

    // Adiciona listeners para scroll e resize
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateOptimalPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateOptimalPosition);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isActive, currentStepIndex, currentStep?.highlight, calculateOptimalPosition, handleScroll]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
        highlightStylesRef.current = null;
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Não renderiza se não estiver ativo ou posicionado
  if (!isActive || !currentStep || !isPositioned) {
    return null;
  }

  const IconComponent = currentStep.icon;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <>
      {/* Overlay suave que não interfere com elementos destacados */}
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]" />

      {/* Modal principal com posicionamento inteligente */}
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
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            background: 'white',
            border: 0,
            transform: 'none'
          } : {}}
          className={modalPosition ? "" : "fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl border-0 shadow-2xl p-0 overflow-hidden"}
        >
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

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progresso da Jornada</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-white/50" />
            </div>

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
