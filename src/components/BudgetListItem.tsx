
import { TableCell, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditBudgetDialog } from "./EditBudgetDialog";
import { DeleteBudgetAlert } from "./DeleteBudgetAlert";
import { BudgetWithSpending } from "@/hooks/useBudgets";
import { TransactionBadge } from "./ui/transaction-badge";

const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number') return '';
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

interface BudgetListItemProps {
  budget: BudgetWithSpending;
}

export function BudgetListItem({ budget }: BudgetListItemProps) {
  return (
    <TableRow key={budget.id} className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium">
        <TransactionBadge type="expense" category={budget.category} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <Progress 
            value={budget.progress} 
            className={`flex-1 h-3 ${budget.progress > 100 ? '[&>div]:bg-destructive' : ''}`}
          />
          <span className={`text-sm font-medium ${budget.progress > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {Math.round(budget.progress)}%
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="text-sm">
          <span className="font-medium">{formatCurrency(budget.spent)}</span>
          <span className="text-muted-foreground"> / {formatCurrency(budget.amount)}</span>
        </div>
      </TableCell>
      <TableCell className={`text-right font-bold ${budget.remaining < 0 ? 'text-destructive' : 'text-emerald-600'}`}>
        {budget.remaining < 0 ? '⚠️ ' : '✅ '}
        {formatCurrency(Math.abs(budget.remaining))}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditBudgetDialog budget={budget}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
            </EditBudgetDialog>
            <DeleteBudgetAlert budgetId={budget.id} category={budget.category}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
              </DropdownMenuItem>
            </DeleteBudgetAlert>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
