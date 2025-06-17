
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BudgetListItem } from "./BudgetListItem";
import { BudgetWithSpending } from "@/hooks/useBudgets";

interface BudgetTableProps {
  budgets: BudgetWithSpending[];
}

export function BudgetTable({ budgets }: BudgetTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">Kategorie</TableHead>
          <TableHead className="w-[35%]">Fortschritt</TableHead>
          <TableHead className="w-[20%] text-right">Ausgegeben</TableHead>
          <TableHead className="w-[15%] text-right">Verbleibt</TableHead>
          <TableHead className="w-[5%] text-right">
            <span className="sr-only">Aktionen</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => (
          <BudgetListItem key={budget.id} budget={budget} />
        ))}
      </TableBody>
    </Table>
  );
}
