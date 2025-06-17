
import { CircleDollarSign } from "lucide-react";

interface BudgetListEmptyProps {
  monthName: string;
}

export function BudgetListEmpty({ monthName }: BudgetListEmptyProps) {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <CircleDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Kein Budget für {monthName} definiert</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Beginnen Sie mit der Organisation Ihrer Finanzen, indem Sie Ihr erstes Budget erstellen.
      </p>
    </div>
  );
}
