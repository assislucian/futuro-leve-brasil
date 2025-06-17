
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Um plano para cada jornada</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece de graça e evolua quando estiver pronto. Sem pressão.
          </p>
        </div>
        <div className="mt-16 grid max-w-md mx-auto gap-8 md:max-w-4xl md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gratuito</CardTitle>
              <CardDescription>O primeiro passo para sua tranquilidade financeira. Comece a organizar suas contas e planejar seus sonhos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">R$0<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Controle de despesas e receitas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Criação de até 2 metas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Dashboard simplificado</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth">Começar Agora</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                7 dias grátis
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>Plenus Premium</CardTitle>
              <CardDescription>Para acelerar suas conquistas e ter a paz de espírito que você merece.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">R$19,90<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  🎉 Teste grátis por 7 dias! Cancele quando quiser.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Tudo do plano Gratuito</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Metas e orçamentos ilimitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Insights e relatórios com IA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Suporte prioritário</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90" asChild>
                <Link to="/auth">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Começar Trial Grátis
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
