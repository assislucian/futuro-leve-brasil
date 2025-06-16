
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
            <Card className="overflow-hidden border-0 shadow-sm bg-white/80">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-7 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <Skeleton className="h-7 w-7 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-12 w-full rounded-xl" />
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
            return <Badge className="bg-red-50 text-red-700 border-red-200/50 font-medium">🚨 Urgente</Badge>;
        }
        if (nextAction.title.includes('economia') || nextAction.title.includes('sobra')) {
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/50 font-medium">💰 Oportunidade</Badge>;
        }
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200/50 font-medium">💡 Sugestão</Badge>;
    };

    return (
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50/60 to-indigo-50/40">
            <CardHeader className="pb-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                        <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                           <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-sm">
                             <Lightbulb className="h-5 w-5 text-blue-600" />
                           </div>
                           Próxima Ação Inteligente
                        </CardTitle>
                        <CardDescription className="text-base text-slate-600 leading-relaxed">
                          Nossa IA identificou uma oportunidade para você! 🚀
                        </CardDescription>
                    </div>
                    {getPriorityBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-start gap-5">
                    <div className="bg-white/90 p-4 rounded-2xl shadow-sm border border-slate-100/50 backdrop-blur-sm">
                       <IconComponent className="h-7 w-7 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="text-lg font-semibold text-slate-900 leading-tight">{nextAction.title}</h4>
                        <p className="text-base text-slate-600 leading-relaxed">{nextAction.description}</p>
                    </div>
                </div>
                
                <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-200/50 transition-all duration-300 text-base font-medium rounded-xl">
                    <Link to={nextAction.link} className="flex items-center justify-center gap-3">
                        <Plus className="h-5 w-5" />
                        {nextAction.cta}
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
