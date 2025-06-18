import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles, X, Crown, Zap, Target, TrendingUp, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-300 px-4 py-2">
            <Crown className="h-4 w-4 mr-1" />
            Planos que se pagam sozinhos
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Quanto você está <span className="text-red-600">perdendo</span> por não ter controle?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossos usuários <strong className="text-slate-800">recuperam em média R$ 12.000 no primeiro ano</strong>. 
            Escolha o plano que vai transformar sua vida financeira.
          </p>
        </div>

        <div className="grid max-w-6xl mx-auto gap-6 lg:gap-8 md:grid-cols-2">
          
          {/* Plano Gratuito - Reposicionado como "Descoberta" */}
          <Card className="relative border-2 border-slate-200 hover:border-slate-300 transition-all duration-300">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="text-slate-600 border-slate-300">
                Descoberta
              </Badge>
            </div>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Análise Gratuita</CardTitle>
              <CardDescription className="text-base">
                Descubra <strong>exatamente onde</strong> seu dinheiro está vazando. 
                Perfeito para <strong>identificar o problema</strong> antes de resolver.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">
                R$0
                <span className="text-lg font-normal text-muted-foreground">/sempre</span>
              </div>
              
              {/* O que VOCÊ CONSEGUE */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 mb-3">✅ O que você consegue:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Controle básico de entradas e saídas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Até 2 metas financeiras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Dashboard com resumo mensal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ver onde está perdendo dinheiro</span>
                  </li>
                </ul>
              </div>

              {/* O que VOCÊ NÃO CONSEGUE */}
              <div className="space-y-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">❌ O que você NÃO consegue (e perde dinheiro por isso):</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-sm text-red-700">Insights de IA para <strong>recuperar vazamentos</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-sm text-red-700">Orçamentos automáticos que <strong>previnem gastos</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-sm text-red-700">Metas ilimitadas para <strong>acelerar conquistas</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-sm text-red-700">Relatórios que mostram como <strong>economizar mais</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800 font-medium text-center">
                  ⚠️ <strong>Atenção:</strong> Só ver o problema não resolve. Para <strong>recuperar o dinheiro perdido</strong>, você precisa do Premium.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth">
                  <Target className="mr-2 h-4 w-4" />
                  Descobrir Meus Vazamentos
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Premium - Foco em ROI e Transformação */}
          <Card className="relative border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20 bg-gradient-to-b from-white to-emerald-50/30 transform hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 px-6 py-2 text-sm font-bold shadow-lg">
                <Crown className="h-4 w-4 mr-1" />
                MAIS ESCOLHIDO
              </Badge>
            </div>
            
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                7 dias GRÁTIS
              </Badge>
            </div>

            <CardHeader className="pt-8 pb-6">
              <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                Plenus Premium
              </CardTitle>
              <CardDescription className="text-base">
                <strong className="text-slate-800">A ferramenta que RECUPERA seu dinheiro perdido</strong> e acelera 
                suas conquistas. Usuários economizam <strong className="text-emerald-700">R$ 12.000+ no primeiro ano</strong>.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  R$19,90
                </div>
                <span className="text-lg font-normal text-muted-foreground">/mês</span>
                <div className="text-sm text-emerald-700 font-semibold mt-1">
                  Paga por si só em menos de 2 dias! 💰
                </div>
              </div>

              {/* ROI Calculation */}
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center">
                <div className="text-sm text-emerald-800 font-bold mb-2">
                  🧮 CÁLCULO DO RETORNO:
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  Investe R$19,90 → Economiza R$1.000+/mês
                </div>
                <div className="text-sm text-emerald-700">
                  <strong>ROI de 5.025%</strong> no primeiro mês!
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-bold text-center">
                  🎉 <strong>OFERTA ESPECIAL:</strong> Teste 7 dias GRÁTIS + Análise financeira completa + Plano personalizado!
                </p>
              </div>

              {/* Features Premium - Focado em RESULTADOS */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  Tudo do Gratuito + PODERES PREMIUM:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">IA que encontra vazamentos</div>
                      <div className="text-xs text-slate-600">Recupere R$ 500-2.000/mês que está perdendo</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Metas e orçamentos ilimitados</div>
                      <div className="text-xs text-slate-600">Acelere TODOS os seus sonhos simultaneamente</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Relatórios de otimização</div>
                      <div className="text-xs text-slate-600">Saiba exatamente como economizar mais a cada mês</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Suporte prioritário</div>
                      <div className="text-xs text-slate-600">Tire dúvidas direto com especialistas financeiros</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Garantia */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-blue-800">GARANTIA BLINDADA</span>
                </div>
                <p className="text-sm text-blue-700">
                  Se você não economizar <strong>pelo menos R$ 200</strong> no primeiro mês, 
                  devolvemos 100% do seu dinheiro!
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 text-lg py-6 transform hover:scale-105 transition-all duration-300" asChild>
                <Link to="/auth">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Começar Trial GRATUITO de 7 Dias
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Testimonial de Credibilidade */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl text-slate-700 mb-4 italic">
                "Em 3 meses com o Plenus Premium, consegui economizar R$ 4.200 que nem sabia que estava perdendo. 
                Agora estou 80% mais perto da minha casa própria! Vale cada centavo."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt="Ana Carolina"
                  className="w-12 h-12 rounded-full border-2 border-emerald-300"
                />
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Ana Carolina M.</div>
                  <div className="text-sm text-slate-600">Enfermeira, Rio de Janeiro</div>
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
