
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  X,
  Lightbulb,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface WealthJourneyTooltipProps {
  step: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    actionText: string;
    icon: React.ComponentType<any>;
    tip?: string;
    highlight?: string;
  };
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onGoToStep: (index: number) => void;
}

export function WealthJourneyTooltip({
  step,
  currentIndex,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onGoToStep
}: WealthJourneyTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Função para calcular posição inteligente
  const calculatePosition = useCallback(() => {
    if (!tooltipRef.current) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 360;
    const tooltipHeight = isExpanded ? 300 : 200;

    // Para o primeiro step (welcome), centralizar na tela
    if (currentIndex === 0 || !step.highlight) {
      setPosition({
        top: (viewportHeight - tooltipHeight) / 2,
        left: (viewportWidth - tooltipWidth) / 2,
        placement: 'center'
      });
      return;
    }

    // Para outros steps, posicionar próximo ao elemento destacado
    const highlightedElement = document.querySelector(step.highlight);
    if (!highlightedElement) {
      // Fallback para centro se elemento não encontrado
      setPosition({
        top: (viewportHeight - tooltipHeight) / 2,
        left: (viewportWidth - tooltipWidth) / 2,
        placement: 'center'
      });
      return;
    }

    const rect = highlightedElement.getBoundingClientRect();
    const padding = 20;

    let top: number;
    let left: number;
    let placement: TooltipPosition['placement'] = 'bottom';

    // Lógica de posicionamento inteligente
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;

    if (spaceBelow >= tooltipHeight + padding) {
      // Posicionar abaixo
      placement = 'bottom';
      top = rect.bottom + padding;
      left = Math.max(padding, Math.min(
        rect.left + (rect.width - tooltipWidth) / 2,
        viewportWidth - tooltipWidth - padding
      ));
    } else if (spaceAbove >= tooltipHeight + padding) {
      // Posicionar acima
      placement = 'top';
      top = rect.top - tooltipHeight - padding;
      left = Math.max(padding, Math.min(
        rect.left + (rect.width - tooltipWidth) / 2,
        viewportWidth - tooltipWidth - padding
      ));
    } else if (spaceRight >= tooltipWidth + padding) {
      // Posicionar à direita
      placement = 'right';
      left = rect.right + padding;
      top = Math.max(padding, Math.min(
        rect.top + (rect.height - tooltipHeight) / 2,
        viewportHeight - tooltipHeight - padding
      ));
    } else if (spaceLeft >= tooltipWidth + padding) {
      // Posicionar à esquerda
      placement = 'left';
      left = rect.left - tooltipWidth - padding;
      top = Math.max(padding, Math.min(
        rect.top + (rect.height - tooltipHeight) / 2,
        viewportHeight - tooltipHeight - padding
      ));
    } else {
      // Fallback: posição fixa no canto superior direito
      placement = 'top';
      top = padding;
      left = viewportWidth - tooltipWidth - padding;
    }

    setPosition({ top, left, placement });
  }, [step.highlight, currentIndex, isExpanded]);

  // Recalcular posição quando necessário
  useEffect(() => {
    const timer = setTimeout(calculatePosition, 100);
    
    const handleResize = () => {
      clearTimeout(timer);
      setTimeout(calculatePosition, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [calculatePosition]);

  if (!position) return null;

  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === totalSteps - 1;
  const IconComponent = step.icon;

  return (
    <div
      ref={tooltipRef}
      className={cn(
        "fixed z-[1002] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300",
        isExpanded ? "w-96 max-h-80" : "w-80 max-h-52",
        position.placement === 'center' && "border-emerald-200 shadow-emerald-500/20"
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <IconComponent className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <Badge className="bg-emerald-500 text-white text-xs">
                Jornada Plenus
              </Badge>
              <div className="text-xs text-emerald-700 font-medium">
                {currentIndex + 1}/{totalSteps}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <Progress value={progressPercentage} className="h-1.5 bg-white/50" />
        
        {/* Navegação por pontos */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              onClick={() => onGoToStep(index)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-200",
                index === currentIndex 
                  ? "bg-emerald-500 scale-125" 
                  : index < currentIndex 
                    ? "bg-emerald-300" 
                    : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-4">
        <div className="space-y-2 mb-3">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">
            {step.title}
          </h3>
          <p className="text-xs text-emerald-600 font-medium">
            {step.subtitle}
          </p>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          {step.description}
        </p>

        {/* Dica expandível */}
        {step.tip && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full h-6 text-xs text-amber-600 hover:text-amber-700 p-0 justify-center mb-2"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              {isExpanded ? 'Ocultar dica' : 'Ver dica útil'}
              <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isExpanded && "rotate-180")} />
            </Button>

            {isExpanded && (
              <div className="mb-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">{step.tip}</p>
              </div>
            )}
          </>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-1">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                className="h-7 px-2 text-xs"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Anterior
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 h-7 px-2 text-xs"
            >
              Pular
            </Button>
          </div>

          <Button
            onClick={onNext}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-7 px-3 text-xs"
          >
            {isLastStep ? 'Finalizar' : 'Próximo'}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
