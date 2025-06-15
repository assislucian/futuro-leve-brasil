
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { useNextAction } from "@/hooks/useNextAction";
import { ArrowRight, Lightbulb, CircleDollarSign, Star, AlertTriangle, Target, Sparkles } from "lucide-react";

const iconMap = {
  CircleDollarSign,
  Star,
  AlertTriangle,
  Target,
  Sparkles,
};

export function NextActionCard() {
    const { nextAction, isLoading } = useNextAction();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        );
    }
    
    if (!nextAction) {
        return null;
    }

    const IconComponent = iconMap[nextAction.icon as keyof typeof iconMap] || Lightbulb;

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg text-primary flex items-center gap-2">
                           <Lightbulb className="h-5 w-5" />
                           Próxima Ação Inteligente
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                       <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold">{nextAction.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{nextAction.description}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link to={nextAction.link}>
                        {nextAction.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
