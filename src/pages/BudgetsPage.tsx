
import React from "react";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";
import { BudgetList } from "@/components/BudgetList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const BudgetsPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Orçamentos</h1>
          <p className="text-muted-foreground">
            Defina seus limites de gastos e acompanhe sua saúde financeira.
          </p>
        </div>
        <AddBudgetDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </AddBudgetDialog>
      </div>

      <BudgetList />
    </div>
  );
};

export default BudgetsPage;
