
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";

const BudgetsSummary = () => {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Orçamentos</CardTitle>
                        <CardDescription>Defina seus limites de gastos.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-start text-left">
                <p className="text-sm text-muted-foreground mb-4">
                    Diga para onde seu dinheiro deve ir e ganhe clareza sobre suas finanças.
                </p>
                <Button asChild className="w-full sm:w-auto">
                    <Link to="/budgets">
                        Gerenciar Orçamentos
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};

export default BudgetsSummary;
