
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Target, Brain, Sparkles, Zap } from "lucide-react";
import { useExpenseAnalytics, useCategoryBreakdown, useMonthlyTrends } from "@/hooks/useExpenseAnalytics";
import { ExpenseClassificationChart } from "@/components/analytics/ExpenseClassificationChart";
import { PlanningStatusChart } from "@/components/analytics/PlanningStatusChart";
import { MonthlyTrendsChart } from "@/components/analytics/MonthlyTrendsChart";
import { CategoryBreakdownTable } from "@/components/analytics/CategoryBreakdownTable";
import { AdvancedInsightsCard } from "@/components/insights/AdvancedInsightsCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AnalyticsPage = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useExpenseAnalytics(selectedYear, selectedMonth);
  const { data: categoryBreakdown, isLoading: categoryLoading } = useCategoryBreakdown(selectedYear, selectedMonth);
  const { data: monthlyTrends, isLoading: trendsLoading } = useMonthlyTrends(selectedYear);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  if (analyticsError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Erro ao carregar dados de analytics. Tente novamente mais tarde ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Header Premium com Contexto Motivacional */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      🧠 Analytics Inteligente
                    </h1>
                    <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                      <Zap className="h-3 w-3 mr-1" />
                      Powered by IA
                    </Badge>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  Nossa IA transformou seus dados em <span className="font-semibold text-purple-600">oportunidades de crescimento</span> personalizadas. 
                  Cada insight é uma porta para acelerar seus sonhos! 🚀
                </p>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-40 h-11 border-2 hover:border-primary/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border shadow-xl">
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32 h-11 border-2 hover:border-primary/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border shadow-xl">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Insights de IA - Destaque Principal */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-2xl blur opacity-20"></div>
          <div className="relative">
            <AdvancedInsightsCard />
          </div>
        </div>

        {/* Cards de Resumo com Visual Aprimorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50 shadow-lg">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))
          ) : analytics && (
            <>
              <Card className="hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-muted/20 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Total de Gastos
                  </CardTitle>
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg group-hover:scale-110 transition-transform">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(analytics.totalExpenses)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-red-50/20 dark:to-red-950/10 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Gastos Fixos
                  </CardTitle>
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {formatCurrency(analytics.fixed)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {analytics.fixedPercentage.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">do total</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-emerald-50/20 dark:to-emerald-950/10 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Gastos Variáveis
                  </CardTitle>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(analytics.variable)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                      {analytics.variablePercentage.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">controláveis</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-amber-50/20 dark:to-amber-950/10 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Não Planejados
                  </CardTitle>
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {formatCurrency(analytics.unplanned)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                      {analytics.unplannedPercentage.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">oportunidade</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Gráficos com Contexto Melhorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {analyticsLoading ? (
            <>
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </>
          ) : analytics && (
            <>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
                <ExpenseClassificationChart fixed={analytics.fixed} variable={analytics.variable} />
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
                <PlanningStatusChart planned={analytics.planned} unplanned={analytics.unplanned} />
              </div>
            </>
          )}
        </div>

        {/* Tendências Mensais */}
        {trendsLoading ? (
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : monthlyTrends && (
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <MonthlyTrendsChart data={monthlyTrends} />
          </div>
        )}

        {/* Tabela de Categorias */}
        {categoryLoading ? (
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : categoryBreakdown && categoryBreakdown.length > 0 && (
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <CategoryBreakdownTable data={categoryBreakdown} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
