
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseClassificationChartProps {
  fixed: number;
  variable: number;
}

export function ExpenseClassificationChart({ fixed, variable }: ExpenseClassificationChartProps) {
  const data = [
    { name: 'Gastos Fixos', value: fixed, color: '#ef4444' },
    { name: 'Gastos Variáveis', value: variable, color: '#3b82f6' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">
            {((data.value / (fixed + variable)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Classificação de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Fixos</span>
            </div>
            <p className="text-lg font-bold text-red-600">{formatCurrency(fixed)}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Variáveis</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(variable)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
