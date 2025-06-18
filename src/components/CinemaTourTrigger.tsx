
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCinemaTour } from "@/hooks/useCinemaTour";
import { Play, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Trigger para reativar o Tour Guiado
 * Aparece discretamente no dashboard para usuários que completaram o tour
 */
export function CinemaTourTrigger() {
  const { restartTour, isActive } = useCinemaTour();

  // Se o tour está ativo, não mostra o trigger
  if (isActive) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={restartTour}
            variant="outline"
            size="sm"
            className="group relative overflow-hidden border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Tour</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                Guiado
              </Badge>
            </div>
            
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reveja o tour guiado da plataforma</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
