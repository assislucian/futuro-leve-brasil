
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { useNextAction } from "@/hooks/useNextAction";
import { ArrowRight, Lightbulb, CircleDollarSign, Star, AlertTriangle, Target, Sparkles, Rocket, Plus, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { AddTransactionDialog } from "./AddTransactionDialog";

const iconMap = {
  CircleDollarSign,
  Star,
  AlertTriangle,
  Target,
  Sparkles,
  Rocket,
  TrendingUp,
};

export function NextActionCard() {
    const { nextAction, isLoading } = useNextAction();

    if (isLoading) {
        return (
            <Card className="plenus-card">
                <CardHeader className="pb-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-3/4 rounded-lg" />
                            <Skeleton className="h-4 w-1/2 rounded-lg" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                </CardContent>
            </Card>
        );
    }
    
    if (!nextAction) {
        return null;
    }

    const IconComponent = iconMap[nextAction.icon as keyof typeof iconMap] || Lightbulb;

    const getPriorityBadge = () => {
        if (nextAction.title.includes('Atenção') || nextAction.title.includes('ultrapassou')) {
            return <Badge className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 font-medium text-xs rounded-full">Urgente</Badge>;
        }
        if (nextAction.title.includes('economia') || nextAction.title.includes('sobra')) {
            return <Badge className="plenus-badge-green">Oportunidade</Badge>;
        }
        return <Badge className="plenus-badge-blue">Sugestão</Badge>;
    };

    // Renderizar ações específicas baseadas no tipo de sugestão
    const renderActionButton = () => {
        // Se a ação é sobre adicionar transação, usar o dialog
        if (nextAction.cta.toLowerCase().includes('adicionar') && nextAction.cta.toLowerCase().includes('transação')) {
            return (
                <AddTransactionDialog>
                    <Button className="plenus-btn-primary w-full h-10 rounded-xl plenus-transition">
                        <Plus className="h-4 w-4 mr-2" />
                        {nextAction.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </AddTransactionDialog>
            );
        }

        // Para outras ações, usar link normal
        return (
            <Button asChild className="plenus-btn-primary w-full h-10 rounded-xl plenus-transition">
                <Link to={nextAction.link} className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {nextAction.cta}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
        );
    };

    return (
        <Card className="plenus-card plenus-hover-lift plenus-transition">
            <CardHeader className="pb-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                        <CardTitle className="text-lg text-card-foreground flex items-center gap-3">
                           <div className="plenus-icon-container plenus-icon-blue">
                             <Lightbulb className="h-5 w-5" />
                           </div>
                           Próxima Ação
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Recomendação personalizada
                        </CardDescription>
                    </div>
                    {getPriorityBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="plenus-icon-container plenus-icon-teal flex-shrink-0">
                       <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="text-base font-semibold text-card-foreground leading-tight">{nextAction.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{nextAction.description}</p>
                    </div>
                </div>
                
                {renderActionButton()}
            </CardContent>
        </Card>
    );
}
