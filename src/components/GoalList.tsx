
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Target, PlusCircle, MoreVertical, Pencil, Trash2, History } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/3" />
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
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
        <Target className="h-16 w-16 text-muted-foreground" />
        <h3 className="text-2xl font-semibold tracking-tight">Comece a Sonhar Grande!</h3>
        <p className="text-muted-foreground">Você ainda não tem nenhuma meta. Que tal criar a primeira? <br/> Dê um propósito para o seu dinheiro e veja seus sonhos se tornarem realidade.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
        const isCompleted = progress >= 100;
        return (
          <Card key={goal.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg pr-2">{goal.name}</CardTitle>
                  <CardDescription>
                    Alvo: {formatCurrency(goal.target_amount)}
                    {goal.target_date && ` até ${new Date(goal.target_date + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && <Badge variant="default" className="bg-emerald-500">Concluída!</Badge>}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              <div className="space-y-2">
                <Progress value={progress} />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.current_amount)}
                  </span>
                  <span className="font-medium">{progress.toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <AddContributionDialog goalId={goal.id} goalName={goal.name}>
                <Button variant="outline" className="w-full" disabled={isCompleted}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Progresso
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
