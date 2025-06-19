
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWealthJourneyTour } from "@/hooks/useWealthJourneyTour";
import { BookOpen, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Trigger para reativar a Jornada Plenus
 * Aparece discretamente no dashboard para usuários que completaram o tour
 */
export function WealthJourneyTrigger() {
  const { restartTour, isActive } = useWealthJourneyTour();

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
            variant="outline"
            size="sm"
            className="group relative overflow-hidden border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-emerald-500 animate-pulse" />
              </div>
              <span className="text-emerald-700 font-medium">Jornada Plenus</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                Educativo
              </Badge>
            </div>
            
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reveja nossa jornada educativa do Plenus</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
