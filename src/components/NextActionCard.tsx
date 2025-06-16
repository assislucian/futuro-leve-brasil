
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
            <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
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
            return <Badge className="bg-red-100 text-red-700 border-red-200">🚨 Urgente</Badge>;
        }
        if (nextAction.title.includes('economia') || nextAction.title.includes('sobra')) {
            return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">💰 Oportunidade</Badge>;
        }
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">💡 Sugestão</Badge>;
    };

    return (
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-slate-800 flex items-center gap-2 mb-2">
                           <div className="p-2 bg-blue-100 rounded-full">
                             <Lightbulb className="h-4 w-4 text-blue-600" />
                           </div>
                           Próxima Ação Inteligente
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          Nossa IA identificou uma oportunidade para você! 🚀
                        </CardDescription>
                    </div>
                    {getPriorityBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100">
                       <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 mb-1 leading-tight">{nextAction.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{nextAction.description}</p>
                    </div>
                </div>
                
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-200 transition-all duration-200">
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
