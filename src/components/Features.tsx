
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Lightbulb, Target } from "lucide-react";

const features = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Transforme sonhos em planos",
    description: "Crie metas para sua viagem, sua casa ou sua segurança. Nós te ajudamos a chegar lá, passo a passo.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Entenda seu dinheiro, sem planilhas",
    description: "Veja para onde vai cada real com um painel simples e visual. Chega de se sentir perdido(a) no fim do mês.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Decisões inteligentes, sem estresse",
    description: "Receba dicas claras para fazer seu dinheiro render mais e alcançar seus objetivos mais rápido.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Finanças com alma. Resultados reais.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Descubra as ferramentas que vão revolucionar sua vida financeira.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader>{feature.icon}</CardHeader>
              <CardContent className="space-y-2">
                <CardTitle>{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
