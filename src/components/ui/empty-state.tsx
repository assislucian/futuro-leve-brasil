
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Componente padronizado para estados vazios
 * Oferece uma experiência consistente quando não há dados para exibir
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white py-16 text-center",
      className
    )}>
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-gray-500" />
      </div>
      
      <div className="space-y-3 max-w-md">
        <h3 className="text-xl font-semibold tracking-tight text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-6 bg-gray-900 hover:bg-gray-800 text-white"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
