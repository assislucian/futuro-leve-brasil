
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { useNextAction } from "@/hooks/useNextAction";
import { ArrowRight, Lightbulb, CircleDollarSign, Star, AlertTriangle, Target, Sparkles, Rocket, Plus } from "lucide-react";
import { Badge } from "./ui/badge";

const iconMap = {
  CircleDollarSign,
  Star,
  AlertTriangle,
  Target,
  Sparkles,
  Rocket,
};

export function NextActionCard() {
    const { nextAction, isLoading } = useNextAction();

    if (isLoading) {
        return (
            <Card className="border border-border shadow-sm bg-card">
                <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full rounded-md" />
                </CardContent>
            </Card>
        );
    }
    
    if (!nextAction) {
        return null;
    }

    const IconComponent = iconMap[nextAction.icon as keyof typeof iconMap] || Lightbulb;

    const getPriorityBadge = () => {
        if (nextAction.title.includes('Achtung') || nextAction.title.includes('überschritten')) {
            return <Badge className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 font-medium text-xs">Dringend</Badge>;
        }
        if (nextAction.title.includes('Ersparnis') || nextAction.title.includes('Überschuss')) {
            return <Badge className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 font-medium text-xs">Chance</Badge>;
        }
        return <Badge className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-medium text-xs">Vorschlag</Badge>;
    };

    return (
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1">
                        <CardTitle className="text-base text-card-foreground flex items-center gap-2">
                           <div className="p-1.5 bg-blue-50 dark:bg-blue-950 rounded-md">
                             <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                           </div>
                           Nächste Aktion
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Personalisierte Empfehlung
                        </CardDescription>
                    </div>
                    {getPriorityBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                    <div className="bg-muted p-2 rounded-md border border-border">
                       <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-medium text-card-foreground leading-tight">{nextAction.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{nextAction.description}</p>
                    </div>
                </div>
                
                <Button asChild className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-200 text-sm font-medium rounded-md">
                    <Link to={nextAction.link} className="flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        {nextAction.cta}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
