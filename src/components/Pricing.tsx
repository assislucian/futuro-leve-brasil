
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, X, Target, TrendingUp, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            Escolha seu plano
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Comece gratuitamente e evolua conforme suas necessidades. 
            <strong className="text-slate-800"> Sem compromisso, sem pegadinhas.</strong>
          </p>
        </div>

        <div className="grid max-w-5xl mx-auto gap-6 lg:gap-8 md:grid-cols-2">
          
          {/* Plano Gratuito */}
          <Card className="relative border-2 border-slate-200 hover:border-slate-300 transition-all duration-300">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="text-slate-600 border-slate-300">
                Gratuito
              </Badge>
            </div>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-slate-900">Plano Gratuito</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Perfeito para <strong>começar a organizar</strong> suas finanças e criar o hábito de controle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900">
                R$0
                <span className="text-lg font-normal text-slate-500">/sempre</span>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 mb-3">✅ O que você tem:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">Controle de receitas e despesas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">Até 3 metas financeiras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">Relatórios básicos mensais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">Categorização automática</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-sm text-slate-700 text-center">
                  💡 <strong>Ideal para:</strong> Quem está começando a se organizar financeiramente
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth">
                  <Target className="mr-2 h-4 w-4" />
                  Começar Gratuitamente
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Premium */}
          <Card className="relative border-4 border-emerald-600 shadow-xl bg-gradient-to-b from-white to-emerald-50/30 transform hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white border-0 px-6 py-2 text-sm font-bold shadow-lg">
                RECOMENDADO
              </Badge>
            </div>

            <CardHeader className="pt-8 pb-6">
              <CardTitle className="text-3xl text-emerald-700">
                Plenus Premium
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Para quem quer <strong className="text-slate-800">acelerar resultados</strong> e ter 
                controle total das finanças com insights inteligentes.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-emerald-700">
                  R$19,90
                </div>
                <span className="text-lg font-normal text-slate-500">/mês</span>
                <div className="text-sm text-emerald-700 font-medium mt-1">
                  7 dias grátis para testar
                </div>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                <div className="text-sm text-emerald-800 font-bold mb-1">
                  💰 ECONOMIA REAL:
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  Usuários economizam em média R$ 300-500/mês
                </div>
                <div className="text-sm text-emerald-700">
                  O plano se paga sozinho!
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 mb-3">
                  Tudo do Gratuito + Poderes Premium:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-2 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-800">Metas e orçamentos ilimitados</div>
                      <div className="text-xs text-slate-600">Organize todos os seus objetivos</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-800">Insights inteligentes</div>
                      <div className="text-xs text-slate-600">Descubra onde economizar mais</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-800">Relatórios avançados</div>
                      <div className="text-xs text-slate-600">Análises detalhadas e projeções</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-800">Suporte prioritário</div>
                      <div className="text-xs text-slate-600">Resposta em até 24h por email</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-blue-800">GARANTIA DE 30 DIAS</span>
                </div>
                <p className="text-sm text-blue-700">
                  Não ficou satisfeito? Devolvemos 100% do seu dinheiro.
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg text-lg py-6 transform hover:scale-105 transition-all duration-300" asChild>
                <Link to="/auth">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Começar Trial Gratuito
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Depoimento realista */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-lg text-slate-700 mb-4 italic">
                "Em 4 meses consegui economizar R$ 1.800 que não sabia que estava gastando desnecessariamente. 
                Agora estou mais perto da minha reserva de emergência."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt="Ana Carolina"
                  className="w-12 h-12 rounded-full border-2 border-slate-200"
                />
                <div className="text-left">
                  <div className="font-medium text-slate-800">Ana Carolina M.</div>
                  <div className="text-sm text-slate-600">Professora, São Paulo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
