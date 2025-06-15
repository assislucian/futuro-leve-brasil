import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";

const TransactionList = () => {
  const { data: transactions, isLoading, error } = useRecentTransactions();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            Buscando suas últimas movimentações...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Transações</AlertTitle>
        <AlertDescription>
          Não foi possível buscar suas transações. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>
          Aqui estão as últimas movimentações da sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground md:inline">
                      {new Date(transaction.transaction_date + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Nenhuma transação encontrada</h3>
            <p className="text-muted-foreground">Parece que você ainda não adicionou nenhuma transação. <br/> Comece registrando uma nova receita ou despesa!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;
