
import { CircleDollarSign } from "lucide-react";

interface BudgetListEmptyProps {
  monthName: string;
}

export function BudgetListEmpty({ monthName }: BudgetListEmptyProps) {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <CircleDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Nenhum orçamento definido para {monthName}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Comece a organizar suas finanças criando seu primeiro orçamento.
      </p>
    </div>
  );
}
