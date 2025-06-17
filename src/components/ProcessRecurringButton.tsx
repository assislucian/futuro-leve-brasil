
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useProcessRecurringTransactions } from "@/hooks/useRecurringTransactions";

export function ProcessRecurringButton() {
  const processRecurring = useProcessRecurringTransactions();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => processRecurring.mutate()}
      disabled={processRecurring.isPending}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${processRecurring.isPending ? 'animate-spin' : ''}`} />
      {processRecurring.isPending ? 'Processando...' : 'Processar Recorrências'}
    </Button>
  );
}
