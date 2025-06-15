
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { EditContributionDialog } from "./EditContributionDialog";
import { DeleteContributionDialog } from "./DeleteContributionDialog";

type Contribution = Tables<'goal_contributions'>;

interface ContributionHistoryDialogProps {
  goalId: string;
  goalName: string;
  children: React.ReactNode;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
};

const ContributionsList = ({ goalId }: { goalId: string }) => {
    const { user } = useAuth();
    const { data: contributions, isLoading, error } = useQuery<Contribution[]>({
        queryKey: ['contributions', goalId],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('goal_contributions')
                .select('*')
                .eq('goal_id', goalId)
                .order('contribution_date', { ascending: false });

            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!user,
    });

    if (isLoading) {
        return (
            <div className="space-y-4 pt-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao Carregar Histórico</AlertTitle>
                <AlertDescription>
                    Não foi possível buscar as contribuições. Tente novamente.
                </AlertDescription>
            </Alert>
        );
    }
    
    if (!contributions || contributions.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-8">Nenhuma contribuição registrada ainda.</p>
    }

    return (
        <div className="space-y-2">
            <ul className="divide-y divide-border -mx-6 px-6">
                {contributions.map((contribution) => (
                    <li key={contribution.id} className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium">{formatCurrency(contribution.amount)}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(contribution.contribution_date)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <EditContributionDialog contribution={contribution}>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </EditContributionDialog>
                            <DeleteContributionDialog contributionId={contribution.id} goalId={goalId}>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Apagar</span>
                                </Button>
                            </DeleteContributionDialog>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ContributionHistoryDialog({ goalId, goalName, children }: ContributionHistoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Histórico de Contribuições</DialogTitle>
          <DialogDescription>
            Veja e gerencie todos os aportes para sua meta "{goalName}".
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto -mx-2 pr-2">
            <ContributionsList goalId={goalId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
