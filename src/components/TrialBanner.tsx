
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TrialBanner = () => {
  const { isTrialing, trialDaysLeft, profile } = useAuth();

  console.log("TrialBanner: Debug", {
    isTrialing,
    trialDaysLeft,
    plan: profile?.plan,
    trialEndsAt: profile?.trial_ends_at
  });

  // Não mostrar banner se não estiver em trial ou se já for premium
  if (!isTrialing || profile?.plan === 'premium') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-amber-200/50 dark:border-amber-800/30">
      <div className="container mx-auto px-4 py-2 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Acesso Premium Ativo
              </span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700 text-xs">
                Trial
              </Badge>
            </div>
            <span className="text-xs text-amber-700 dark:text-amber-300 hidden sm:inline">
              {trialDaysLeft} dias restantes
            </span>
          </div>
          
          <Button 
            asChild
            size="sm" 
            variant="outline"
            className="h-7 text-xs border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-200 transition-colors"
          >
            <Link to="/#pricing" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Continuar Premium</span>
              <span className="sm:hidden">Upgrade</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
