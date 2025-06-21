
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWealthJourneyTour } from "@/hooks/useWealthJourneyTour";
import { BookOpen, Sparkles, Play, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Trigger para reativar a Jornada Plenus
 * Aparece discretamente no dashboard para usuários que completaram o tour
 */
export function WealthJourneyTrigger() {
  const { restartTour, isActive } = useWealthJourneyTour();
  const [isHovered, setIsHovered] = useState(false);

  // Se o tour está ativo, não mostra o trigger
  if (isActive) {
    return null;
  }

  const handleClick = () => {
    console.log('🎯 Clique no botão Jornada Plenus detectado');
    restartTour();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variant="outline"
            size="sm"
            className={cn(
              "group relative overflow-hidden transition-all duration-300",
              "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
              "shadow-sm hover:shadow-lg hover:shadow-emerald-100",
              "transform hover:scale-105 active:scale-95"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <BookOpen className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  isHovered ? "text-emerald-600" : "text-emerald-500"
                )} />
                <Sparkles className={cn(
                  "absolute -top-1 -right-1 h-3 w-3 transition-all duration-300",
                  isHovered ? "text-emerald-600 animate-spin" : "text-emerald-500 animate-pulse"
                )} />
              </div>
              <span className={cn(
                "font-medium transition-colors duration-300",
                isHovered ? "text-emerald-800" : "text-emerald-700"
              )}>
                Jornada Plenus
              </span>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs transition-all duration-300",
                  isHovered 
                    ? "bg-emerald-200 text-emerald-800 scale-110" 
                    : "bg-emerald-100 text-emerald-700"
                )}
              >
                <Star className="h-3 w-3 mr-1" />
                Educativo
              </Badge>
            </div>
            
            {/* Efeito de brilho no hover - Mais Intenso */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent",
              "transform transition-transform duration-700 ease-out",
              isHovered 
                ? "translate-x-[100%]" 
                : "translate-x-[-100%]"
            )} />
            
            {/* Pulse de fundo para chamar atenção */}
            <div className={cn(
              "absolute inset-0 bg-emerald-50/50 rounded-md",
              "animate-pulse opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300"
            )} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-emerald-50 border-emerald-200">
          <div className="text-center space-y-1">
            <p className="font-medium text-emerald-800">🚀 Reveja nossa jornada educativa</p>
            <p className="text-xs text-emerald-600">Aprenda a dominar suas finanças!</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
