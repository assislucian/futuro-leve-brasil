
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockTransactions = [
  { id: 1, description: "Salário", amount: 5000, type: "income", date: "2025-06-05", category: "Salário" },
  { id: 2, description: "Aluguel", amount: 1500, type: "expense", date: "2025-06-05", category: "Moradia" },
  { id: 3, description: "Supermercado", amount: 450.30, type: "expense", date: "2025-06-10", category: "Alimentação" },
  { id: 4, description: "Freelance", amount: 300.75, type: "income", date: "2025-06-12", category: "Extra" },
  { id: 5, description: "Conta de Luz", amount: 200, type: "expense", date: "2025-06-14", category: "Contas" },
];

const TransactionList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>
          Aqui estão as últimas movimentações da sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground md:inline">
                    {new Date(transaction.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default TransactionList;
