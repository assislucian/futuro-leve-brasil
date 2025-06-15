
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Lightbulb, Target } from "lucide-react";

const features = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Metas com Propósito",
    description: "Crie metas financeiras que vão além dos números e se conectam com seus verdadeiros sonhos e paixões.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Clareza Financeira Total",
    description: "Visualize suas receitas, despesas e investimentos em um painel intuitivo e fácil de entender.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Inteligência para Decisões",
    description: "Receba insights e dicas personalizadas para otimizar seus gastos e acelerar o alcance dos seus objetivos.",
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
