
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "warning";
}

/**
 * Standardisierte Komponente für Fehlerzustände
 * Bietet eine konsistente Erfahrung für die Fehlerbehandlung
 */
export function ErrorState({
  title = "Etwas ist schiefgelaufen",
  description = "Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es später erneut.",
  onRetry,
  className,
  variant = "destructive"
}: ErrorStateProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-amber-200 bg-amber-50";
      case "destructive":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "warning":
        return "text-amber-600";
      case "destructive":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case "warning":
        return "text-amber-800";
      case "destructive":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  const getDescriptionColor = () => {
    switch (variant) {
      case "warning":
        return "text-amber-700";
      case "destructive":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Alert className={cn(getVariantStyles())}>
        <AlertTriangle className={cn("h-4 w-4", getIconColor())} />
        <AlertTitle className={getTitleColor()}>
          {title}
        </AlertTitle>
        <AlertDescription className={getDescriptionColor()}>
          {description}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <div className="flex justify-center">
          <Button 
            onClick={onRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
        </div>
      )}
    </div>
  );
}
