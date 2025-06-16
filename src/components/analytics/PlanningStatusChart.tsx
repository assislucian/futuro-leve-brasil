
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanningStatusChartProps {
  planned: number;
  unplanned: number;
}

export function PlanningStatusChart({ planned, unplanned }: PlanningStatusChartProps) {
  const data = [
    { name: 'Gastos Planejados', value: planned, color: '#10b981' },
    { name: 'Gastos Não Planejados', value: unplanned, color: '#f59e0b' }
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
            {((data.value / (planned + unplanned)) * 100).toFixed(1)}%
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
          🎯 Status de Planejamento
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
          <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">Planejados</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(planned)}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium">Não Planejados</span>
            </div>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(unplanned)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
