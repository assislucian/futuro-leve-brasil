
import React from "react";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import GoalList from "@/components/GoalList";
import { useAuth } from "@/hooks/useAuth";
import { useGoalsSummary } from "@/hooks/useGoalsSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrialBanner } from "@/components/TrialBanner";

const GoalsPage = () => {
  const { profile, loading: authLoading, hasTrialAccess, isTrialExpired, trialDaysLeft } = useAuth();
  const { data: goalsSummary, isLoading: goalsLoading } = useGoalsSummary();

  const isLoading = authLoading || goalsLoading;
  const goalCount = goalsSummary?.count || 0;
  const limitReached = !hasTrialAccess && goalCount >= 2;

  return (
    <div className="flex flex-col gap-8">
      {/* Trial Banner nas Metas */}
      {(hasTrialAccess || isTrialExpired) && (
        <TrialBanner 
          variant={isTrialExpired ? "urgent" : trialDaysLeft <= 2 ? "urgent" : "feature"} 
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Metas Financeiras 🎯</h1>
          <p className="text-muted-foreground">
            {hasTrialAccess 
              ? "✨ Crie metas ilimitadas e acelere seus sonhos! Conecte seu dinheiro aos seus objetivos."
              : "Conecte seu dinheiro aos seus sonhos. Acompanhe seu progresso aqui."
            }
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-10 w-44" />
        ) : (
          <div className="flex items-center gap-4">
            {limitReached && isTrialExpired && (
                <Alert variant="default" className="border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-xl max-w-sm plenus-hover-lift">
                  <Sparkles className="h-5 w-5" />
                  <AlertTitle className="font-semibold text-base mb-2">Sentiu Falta das Metas Ilimitadas?</AlertTitle>
                  <AlertDescription className="text-sm">
                    Durante o trial, você pôde criar quantas metas quisesse. <strong>Continue acelerando seus sonhos</strong> com metas ilimitadas no Premium!
                    <Button size="sm" className="mt-3 w-full plenus-btn-primary text-xs">
                      🚀 Quero Metas Ilimitadas
                    </Button>
                  </AlertDescription>
                </Alert>
            )}
            {limitReached && !isTrialExpired && (
                <Alert variant="default" className="border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500 bg-amber-500/5 dark:bg-amber-500/10 p-3 rounded-lg max-w-xs">
                  <Rocket className="h-4 w-4" />
                  <AlertTitle className="font-semibold text-sm mb-1">Acelere seus Sonhos!</AlertTitle>
                  <AlertDescription className="text-xs">
                    O plano gratuito permite 2 metas. <Link to="/#pricing" className="font-bold underline hover:text-amber-500">Faça upgrade</Link> para metas ilimitadas.
                  </AlertDescription>
                </Alert>
            )}
            <AddGoalDialog disabled={limitReached} />
          </div>
        )}
      </div>

      <GoalList />
    </div>
  );
};

export { GoalsPage };
export default GoalsPage;
