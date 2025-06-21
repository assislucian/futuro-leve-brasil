
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
  placement: 'top' | 'bottom' | 'left' | 'right';
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
  const scrollIntoViewTimeoutRef = useRef<NodeJS.Timeout>();

  // Função para rolar suavemente até o elemento destacado
  const scrollToHighlightedElement = useCallback(() => {
    if (!step.highlight) return;

    const element = document.querySelector(step.highlight);
    if (!element) return;

    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Se o elemento não está visível ou está muito próximo das bordas
    if (elementRect.top < 100 || elementRect.bottom > viewportHeight - 100) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [step.highlight]);

  // Calcula posição inteligente do tooltip
  const calculatePosition = useCallback(() => {
    if (!step.highlight || !tooltipRef.current) {
      setPosition(null);
      return;
    }

    const highlightedElement = document.querySelector(step.highlight);
    if (!highlightedElement) {
      setPosition(null);
      return;
    }

    const rect = highlightedElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16;

    let top: number;
    let left: number;
    let placement: TooltipPosition['placement'] = 'bottom';

    // Lógica inteligente: sempre posicionar onde há mais espaço
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    // Prioridade: lado com mais espaço que não sobreponha
    if (spaceBelow >= 200 && spaceBelow >= spaceAbove) {
      // Posicionar abaixo
      placement = 'bottom';
      top = rect.bottom + padding;
      left = Math.max(padding, Math.min(
        rect.left + (rect.width - 320) / 2,
        viewportWidth - 320 - padding
      ));
    } else if (spaceAbove >= 200) {
      // Posicionar acima
      placement = 'top';
      top = rect.top - 200 - padding;
      left = Math.max(padding, Math.min(
        rect.left + (rect.width - 320) / 2,
        viewportWidth - 320 - padding
      ));
    } else if (spaceRight >= 350) {
      // Posicionar à direita
      placement = 'right';
      left = rect.right + padding;
      top = Math.max(padding, Math.min(
        rect.top + (rect.height - 200) / 2,
        viewportHeight - 200 - padding
      ));
    } else if (spaceLeft >= 350) {
      // Posicionar à esquerda
      placement = 'left';
      left = rect.left - 320 - padding;
      top = Math.max(padding, Math.min(
        rect.top + (rect.height - 200) / 2,
        viewportHeight - 200 - padding
      ));
    } else {
      // Fallback: canto superior direito sem sobrepor
      placement = 'top';
      top = Math.max(padding, rect.top - 220);
      left = Math.min(viewportWidth - 320 - padding, rect.right - 320);
    }

    setPosition({ top, left, placement });
  }, [step.highlight]);

  // Scroll automático e cálculo de posição
  useEffect(() => {
    if (!step.highlight) return;

    // Limpa timeout anterior
    if (scrollIntoViewTimeoutRef.current) {
      clearTimeout(scrollIntoViewTimeoutRef.current);
    }

    // Primeiro rola para o elemento
    scrollToHighlightedElement();

    // Depois calcula posição com delay para scroll completar
    scrollIntoViewTimeoutRef.current = setTimeout(() => {
      calculatePosition();
    }, 600); // Tempo para scroll suave completar

    // Recalcula posição no scroll e resize
    const handleReposition = () => {
      clearTimeout(scrollIntoViewTimeoutRef.current!);
      scrollIntoViewTimeoutRef.current = setTimeout(calculatePosition, 100);
    };

    window.addEventListener('scroll', handleReposition, { passive: true });
    window.addEventListener('resize', handleReposition, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleReposition);
      window.removeEventListener('resize', handleReposition);
      if (scrollIntoViewTimeoutRef.current) {
        clearTimeout(scrollIntoViewTimeoutRef.current);
      }
    };
  }, [step.highlight, calculatePosition, scrollToHighlightedElement]);

  if (!position) return null;

  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === totalSteps - 1;
  const IconComponent = step.icon;

  return (
    <div
      ref={tooltipRef}
      className={cn(
        "fixed z-[102] w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-96" : "max-h-48"
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Header Compacto */}
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

        {/* Descrição sempre visível mas compacta */}
        <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
          {step.description}
        </p>

        {/* Botão para expandir detalhes */}
        {step.tip && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full h-6 text-xs text-amber-600 hover:text-amber-700 p-0 justify-center"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            {isExpanded ? 'Ocultar dica' : 'Ver dica útil'}
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isExpanded && "rotate-180")} />
          </Button>
        )}

        {/* Dica expandível */}
        {step.tip && isExpanded && (
          <div className="mt-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">{step.tip}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
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
