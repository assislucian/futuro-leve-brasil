
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrialBannerProps {
  variant?: "dashboard" | "feature" | "urgent";
  className?: string;
}

export const TrialBanner = ({ variant = "dashboard", className = "" }: TrialBannerProps) => {
  const { isTrialing, trialDaysLeft, isTrialExpired, hasTrialAccess, profile } = useAuth();

  // Não mostrar para usuários Premium
  if (profile?.plan === 'premium') return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "urgent":
        return {
          container: "border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          icon: <Zap className="h-5 w-5 text-amber-600" />,
          badge: "plenus-badge-amber"
        };
      case "feature":
        return {
          container: "border-purple-500/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
          icon: <Star className="h-5 w-5 text-purple-600" />,
          badge: "plenus-badge-purple"
        };
      default:
        return {
          container: "border-primary/50 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20",
          icon: <Sparkles className="h-5 w-5 text-primary" />,
          badge: "plenus-badge-teal"
        };
    }
  };

  const styles = getVariantStyles();

  if (isTrialing && trialDaysLeft > 0) {
    return (
      <Alert className={`${styles.container} border plenus-hover-lift ${className}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {styles.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={styles.badge}>
                  <Clock className="h-3 w-3 mr-1" />
                  {trialDaysLeft} {trialDaysLeft === 1 ? 'dia restante' : 'dias restantes'}
                </Badge>
                <span className="font-semibold text-foreground">Trial Premium Ativo!</span>
              </div>
              <AlertDescription className="text-sm">
                {trialDaysLeft <= 2 ? (
                  <>🚀 <strong>Últimos dias!</strong> Aproveite metas ilimitadas, insights com IA e relatórios avançados. Não perca essa experiência completa!</>
                ) : (
                  <>✨ Você está testando <strong>todas as funcionalidades Premium</strong>! Crie metas ilimitadas, use orçamentos avançados e insights com IA.</>
                )}
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trialDaysLeft <= 2 && (
              <Button size="sm" className="plenus-btn-primary text-xs">
                🎯 Quero o Premium
              </Button>
            )}
          </div>
        </div>
      </Alert>
    );
  }

  if (isTrialExpired) {
    return (
      <Alert className={`border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border plenus-hover-lift ${className}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="plenus-badge-amber">Trial Finalizado</Badge>
                <span className="font-semibold text-foreground">Sentiu falta das funcionalidades Premium?</span>
              </div>
              <AlertDescription className="text-sm">
                💎 Continue criando <strong>metas ilimitadas</strong>, usando <strong>orçamentos avançados</strong> e recebendo <strong>insights inteligentes</strong> para acelerar seus sonhos!
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="plenus-btn-primary text-xs">
              🚀 Fazer Upgrade
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  return null;
};
