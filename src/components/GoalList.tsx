
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Target, PlusCircle, MoreVertical, Pencil, Trash2, History, TrendingUp, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AddContributionDialog } from "./AddContributionDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditGoalDialog } from "./EditGoalDialog";
import { DeleteGoalDialog } from "./DeleteGoalDialog";
import { ContributionHistoryDialog } from "./ContributionHistoryDialog";

const GoalList = () => {
  const { user } = useAuth();

  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate + 'T00:00:00');
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Suas Metas</AlertTitle>
        <AlertDescription>
          Não foi possível buscar suas metas financeiras. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white py-24 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
          <Target className="h-10 w-10 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">Comece a Sonhar Grande!</h3>
          <p className="text-slate-600 max-w-md leading-relaxed">
            Você ainda não tem nenhuma meta. Que tal criar a primeira? 
            <br/>
            <span className="font-medium text-emerald-600">Dê um propósito para o seu dinheiro</span> e veja seus sonhos se tornarem realidade. ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
        const isCompleted = progress >= 100;
        const remaining = goal.target_amount - goal.current_amount;
        const daysRemaining = goal.target_date ? getDaysRemaining(goal.target_date) : null;
        
        return (
          <Card key={goal.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight text-slate-800 mb-2">
                    {goal.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <CardDescription className="flex items-center gap-1.5 text-slate-600">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Meta: {formatCurrency(goal.target_amount)}
                    </CardDescription>
                    {goal.target_date && (
                      <CardDescription className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="h-3.5 w-3.5" />
                        até {formatDate(goal.target_date)}
                        {daysRemaining !== null && (
                          <Badge 
                            variant="outline" 
                            className={`ml-1 text-xs ${
                              daysRemaining < 30 ? 'text-red-600 border-red-200' : 
                              daysRemaining < 90 ? 'text-amber-600 border-amber-200' :
                              'text-blue-600 border-blue-200'
                            }`}
                          >
                            {daysRemaining > 0 ? `${daysRemaining}d` : 'Vencida'}
                          </Badge>
                        )}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {isCompleted && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium">
                      🎉 Concluída!
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-slate-100">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <EditGoalDialog goal={goal}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar Meta</span>
                        </DropdownMenuItem>
                      </EditGoalDialog>
                      <ContributionHistoryDialog goalId={goal.id} goalName={goal.name}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <History className="mr-2 h-4 w-4" />
                          <span>Histórico</span>
                        </DropdownMenuItem>
                      </ContributionHistoryDialog>
                      <DeleteGoalDialog goalId={goal.id}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Apagar Meta</span>
                        </DropdownMenuItem>
                      </DeleteGoalDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow space-y-4">
              <div className="space-y-3">
                <Progress 
                  value={progress} 
                  className="h-3"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-slate-500 ml-1">
                      de {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`font-semibold ${
                      progress >= 100 ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                      progress >= 75 ? 'text-blue-700 border-blue-200 bg-blue-50' :
                      progress >= 50 ? 'text-amber-700 border-amber-200 bg-amber-50' :
                      'text-slate-700 border-slate-200 bg-slate-50'
                    }`}
                  >
                    {progress.toFixed(0)}%
                  </Badge>
                </div>
                
                {!isCompleted && (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-xs text-slate-600">
                      <span className="font-medium text-slate-700">Faltam:</span> {formatCurrency(remaining)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <AddContributionDialog goalId={goal.id} goalName={goal.name}>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors" 
                  disabled={isCompleted}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isCompleted ? 'Meta Concluída!' : 'Adicionar Progresso'}
                </Button>
              </AddContributionDialog>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalList;
