
import React from "react";
import FinancialSummary from "@/components/FinancialSummary";
import TransactionList from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { useAuth } from "@/hooks/useAuth";
import GoalsSummary from "@/components/GoalsSummary";
import BudgetsSummary from "@/components/BudgetsSummary";

const DashboardPage = () => {
  const { user } = useAuth();
  
  const firstName = user?.user_metadata.full_name?.split(' ')[0] || 'pessoa';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Bem-vindo(a) de volta ao controle da sua vida financeira.</p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <FinancialSummary />
        </div>
        <div className="lg:col-span-1 grid gap-4">
            <GoalsSummary />
            <BudgetsSummary />
        </div>
      </div>
      
      <TransactionList />
    </div>
  );
};

export default DashboardPage;
