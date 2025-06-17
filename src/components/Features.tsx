
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Lightbulb, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: t('features.feature_1.title'),
      description: t('features.feature_1.description'),
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: t('features.feature_2.title'),
      description: t('features.feature_2.description'),
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: t('features.feature_3.title'),
      description: t('features.feature_3.description'),
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('features.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('features.subtitle')}
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
