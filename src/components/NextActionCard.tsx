
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
            <Card className="border border-slate-200/60 shadow-sm bg-white">
                <CardHeader className="pb-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full rounded-lg" />
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
            return <Badge className="bg-red-50 text-red-700 border-red-200 font-medium text-xs">Urgente</Badge>;
        }
        if (nextAction.title.includes('economia') || nextAction.title.includes('sobra')) {
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs">Oportunidade</Badge>;
        }
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs">Sugestão</Badge>;
    };

    return (
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardHeader className="pb-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                           <div className="p-2 bg-blue-50 rounded-lg">
                             <Lightbulb className="h-4 w-4 text-blue-600" />
                           </div>
                           Próxima Ação
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          Recomendação personalizada para você
                        </CardDescription>
                    </div>
                    {getPriorityBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <IconComponent className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-base font-medium text-slate-900 leading-tight">{nextAction.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{nextAction.description}</p>
                    </div>
                </div>
                
                <Button asChild className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow transition-all duration-200 text-sm font-medium rounded-lg">
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
