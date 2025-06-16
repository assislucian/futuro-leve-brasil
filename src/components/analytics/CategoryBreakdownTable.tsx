
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBreakdown } from "@/hooks/useExpenseAnalytics";

interface CategoryBreakdownTableProps {
  data: CategoryBreakdown[];
}

export function CategoryBreakdownTable({ data }: CategoryBreakdownTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const getClassificationColor = (classification: string) => {
    return classification === 'fixed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getPlanningColor = (planning: string) => {
    return planning === 'planned' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Análise por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>% do Total</TableHead>
              <TableHead>Classificação</TableHead>
              <TableHead>Planejamento</TableHead>
              <TableHead className="text-right">Transações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((category) => (
              <TableRow key={category.category}>
                <TableCell className="font-medium">{category.category}</TableCell>
                <TableCell className="font-bold">{formatCurrency(category.amount)}</TableCell>
                <TableCell>{category.percentage.toFixed(1)}%</TableCell>
                <TableCell>
                  <Badge className={getClassificationColor(category.classification)}>
                    {category.classification === 'fixed' ? 'Fixo' : 'Variável'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPlanningColor(category.planning_status)}>
                    {category.planning_status === 'planned' ? 'Planejado' : 'Não Planejado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{category.transactionCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
