
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIncomeConfirmations, useConfirmIncome } from "@/hooks/useIncomeConfirmations";
import { DollarSign, CheckCircle, XCircle } from "lucide-react";

export function IncomeConfirmationToast() {
  const { data: confirmations, isLoading } = useIncomeConfirmations();
  const confirmIncome = useConfirmIncome();

  useEffect(() => {
    if (isLoading || !confirmations || confirmations.length === 0) return;

    // Mostrar toast para cada confirmação pendente
    confirmations.forEach((confirmation) => {
      const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      };

      toast.info(`💰 ${confirmation.description}`, {
        description: `${formatCurrency(confirmation.amount)} foi adicionado automaticamente. Confirma que recebeu?`,
        duration: 15000, // 15 segundos
        action: {
          label: "✅ Sim, recebi",
          onClick: () => confirmIncome.mutate({ 
            confirmationId: confirmation.id, 
            confirmed: true 
          }),
        },
        cancel: {
          label: "❌ Não recebi",
          onClick: () => confirmIncome.mutate({ 
            confirmationId: confirmation.id, 
            confirmed: false 
          }),
        },
        icon: <DollarSign className="h-4 w-4 text-green-600" />,
      });
    });
  }, [confirmations, isLoading, confirmIncome]);

  return null; // Componente não renderiza nada visualmente
}
