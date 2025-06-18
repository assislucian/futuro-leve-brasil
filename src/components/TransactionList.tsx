
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, MoreHorizontal, Edit, Trash2, TrendingUp, TrendingDown, Target, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { DeleteTransactionAlert } from "./DeleteTransactionAlert";
import { TransactionBadge } from "./ui/transaction-badge";
import { TransactionGoalConnector } from "./TransactionGoalConnector";
import { AddTransactionDialog } from "./AddTransactionDialog";

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              📊 Transações Recentes
            </CardTitle>
            <CardDescription>
              Aqui estão as últimas movimentações da sua conta.
            </CardDescription>
          </div>
          <AddTransactionDialog>
            <Button 
              size="sm" 
              className="h-8 gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
          </AddTransactionDialog>
        </div>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {transaction.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground md:inline">
                          {new Date(transaction.transaction_date + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <TransactionBadge type={transaction.type} category={transaction.category} />
                  </TableCell>
                  <TableCell className={`text-right font-bold text-lg ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Botão de conectar à meta otimizado (apenas para receitas) */}
                      {transaction.type === 'income' && (
                        <TransactionGoalConnector
                          transactionAmount={transaction.amount}
                          transactionType={transaction.type}
                        />
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border">
                           <EditTransactionDialog transaction={transaction}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                           </EditTransactionDialog>
                          <DropdownMenuSeparator />
                          <DeleteTransactionAlert transactionId={transaction.id}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DeleteTransactionAlert>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-slate-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-800">Comece sua Jornada Financeira!</h3>
              <p className="text-slate-600 max-w-md leading-relaxed">
                Ainda não há transações registradas. Que tal adicionar sua primeira receita ou despesa?
                <br/>
                <span className="font-medium text-emerald-600">Cada passo conta para seus sonhos! ✨</span>
              </p>
            </div>
            <AddTransactionDialog>
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-emerald-200 transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Transação
              </Button>
            </AddTransactionDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;
