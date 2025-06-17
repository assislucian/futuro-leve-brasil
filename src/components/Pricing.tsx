
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";

const Pricing = () => {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('pricing.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('pricing.subtitle')}
          </p>
        </div>
        <div className="mt-16 grid max-w-md mx-auto gap-8 md:max-w-4xl md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('pricing.free.title')}</CardTitle>
              <CardDescription>{t('pricing.free.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">{t('pricing.free.price')}<span className="text-lg font-normal text-muted-foreground">{t('pricing.free.price_period')}</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.free.feature_1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.free.feature_2')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.free.feature_3')}</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth">{t('pricing.free.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary shadow-2xl shadow-primary/20">
            <CardHeader>
              <CardTitle>{t('pricing.premium.title')}</CardTitle>
              <CardDescription>{t('pricing.premium.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">{t('pricing.premium.price')}<span className="text-lg font-normal text-muted-foreground">{t('pricing.premium.price_period')}</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.premium.feature_1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.premium.feature_2')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.premium.feature_3')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />{t('pricing.premium.feature_4')}</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/auth">{t('pricing.premium.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
