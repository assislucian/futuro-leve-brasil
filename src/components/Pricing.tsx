
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Um plano para cada jornada</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            🎯 <strong>Teste Premium por 7 dias grátis!</strong> Experimente tudo sem limitações.
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
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
              <Clock className="h-3 w-3 inline mr-1" />
              7 DIAS GRÁTIS
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Plenus Premium</CardTitle>
                <Badge className="plenus-badge-gold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
              <CardDescription>
                🚀 <strong>Teste TUDO por 7 dias!</strong> Para acelerar suas conquistas e ter a paz de espírito que você merece.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">R$19,90<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold text-sm">Teste Premium Completo por 7 Dias</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  ✨ Experimente metas ilimitadas, orçamentos avançados e insights com IA
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Tudo do plano Gratuito</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /><strong>Metas e orçamentos ilimitados</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /><strong>Insights e relatórios com IA</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Suporte prioritário</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full plenus-btn-primary" asChild>
                <Link to="/auth">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Testar Premium 7 Dias Grátis
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💎 <strong>Sem compromisso!</strong> Cancele a qualquer momento durante o período de teste.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
