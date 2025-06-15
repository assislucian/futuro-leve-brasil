
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

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
              <CardDescription>Para organizar o presente e planejar o futuro.</CardDescription>
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
          <Card className="border-primary shadow-2xl shadow-primary/20">
            <CardHeader>
              <CardTitle>Plenus Premium</CardTitle>
              <CardDescription>Para quem busca a maestria financeira e pessoal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">R$19,90<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Tudo do plano Gratuito</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Metas e orçamentos ilimitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Insights e relatórios avançados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Suporte prioritário</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/auth">Assinar Premium</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
