
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TrialBanner = () => {
  const { isTrialing, trialDaysLeft, profile } = useAuth();

  // Não mostrar banner se não estiver em trial ou se já for premium
  if (!isTrialing || profile?.plan === 'premium') {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Acesso Premium Ativo!
                </h3>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200">
                  Trial
                </Badge>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Você tem <span className="font-semibold">{trialDaysLeft} dias restantes</span> para aproveitar todas as funcionalidades Premium gratuitamente.
              </p>
            </div>
          </div>
          <Button 
            asChild
            size="sm" 
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <Link to="/#pricing" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Continuar Premium
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
