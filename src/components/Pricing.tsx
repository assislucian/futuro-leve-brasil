
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, X, Target, TrendingUp, Shield, Star, Sparkles, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section id="precos" className="py-24 sm:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Escolha sua <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">transformação</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comece descobrindo onde seu dinheiro realmente vai. 
            <strong className="text-slate-800"> Sem compromisso, sem cartão de crédito.</strong>
          </p>
        </div>

        <div className="grid max-w-6xl mx-auto gap-8 lg:gap-12 md:grid-cols-2">
          
          {/* Plano Gratuito - Discovery */}
          <Card className="relative border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 bg-white shadow-lg">
            <div className="absolute top-6 right-6">
              <Badge variant="outline" className="text-slate-600 border-slate-300 bg-white">
                Descoberta
              </Badge>
            </div>
            <CardHeader className="pb-8 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-900">Plenus Discover</CardTitle>
                  <CardDescription className="text-base text-slate-600 mt-1">
                    <strong>Descubra</strong> onde seu dinheiro está indo
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  R$0
                </div>
                <span className="text-lg text-slate-500">para sempre</span>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-lg mb-4">✅ O que você descobre:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Controle completo de receitas e despesas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Até 3 metas financeiras</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Relatórios mensais básicos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Categorização automática inteligente</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-medium text-center">
                  ⚡ <strong>Perfeito para:</strong> Descobrir seus padrões de gasto e começar a se organizar
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button className="w-full h-12 text-base font-semibold" variant="outline" asChild>
                <Link to="/auth">
                  <Target className="mr-2 h-5 w-5" />
                  Começar Descoberta Gratuita
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Premium - Transformation */}
          <Card className="relative border-4 border-emerald-500 shadow-2xl bg-gradient-to-b from-white via-emerald-50/30 to-white transform hover:scale-105 transition-all duration-500">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0 px-8 py-3 text-base font-bold shadow-lg">
                🏆 MAIS ESCOLHIDO
              </Badge>
            </div>
            
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-lg"></div>

            <CardHeader className="pt-12 pb-8 relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent font-bold">
                    Plenus Premium
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 mt-1">
                    <strong className="text-slate-800">Transforme</strong> sua vida financeira completamente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 relative">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl text-slate-500 line-through">R$ 39,90</span>
                  <Badge className="bg-red-500 text-white">50% OFF</Badge>
                </div>
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                  R$19,90
                </div>
                <span className="text-lg text-slate-500">/mês</span>
                <div className="text-base text-emerald-700 font-bold mt-2 bg-emerald-50 rounded-full px-4 py-1 inline-block border border-emerald-200">
                  ✨ 14 dias grátis para testar
                </div>
              </div>

              {/* ROI Highlight */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-6 text-center">
                <div className="text-sm text-emerald-800 font-bold mb-2">
                  💰 RETORNO COMPROVADO:
                </div>
                <div className="text-2xl font-bold text-emerald-900 mb-1">
                  Usuários economizam R$ 200-800/mês
                </div>
                <div className="text-sm text-emerald-700 font-semibold">
                  O plano se paga mais de 10x!
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-lg mb-4">
                  🚀 Tudo do Discover + Superpoderes:
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Metas e orçamentos ilimitados</div>
                      <div className="text-sm text-slate-600">Organize todos os seus sonhos financeiros</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">IA financeira personalizada</div>
                      <div className="text-sm text-slate-600">Insights que mostram onde economizar mais</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Relatórios avançados e projeções</div>
                      <div className="text-sm text-slate-600">Veja seu futuro financeiro com clareza</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Suporte prioritário brasileiro</div>
                      <div className="text-sm text-slate-600">Resposta em até 4 horas por WhatsApp</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-blue-800 text-lg">GARANTIA ABSOLUTA</span>
                </div>
                <p className="text-blue-700 font-medium">
                  30 dias para testar. Não ficou satisfeito? <strong>Devolvemos 100%</strong> sem perguntas.
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl text-lg py-6 h-auto font-bold transform hover:scale-105 transition-all duration-300 border-0" asChild>
                <Link to="/auth">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Começar Transformação Agora
                  <TrendingUp className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Social proof section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-8 w-8 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-xl sm:text-2xl text-slate-700 mb-6 italic font-medium leading-relaxed">
                "Em 5 meses consegui minha reserva de emergência de R$ 12.000. 
                Descobri que gastava R$ 400/mês em coisas que nem percebia. 
                Agora estou no caminho da casa própria!"
              </blockquote>
              <div className="flex items-center justify-center gap-6">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt="Carolina Santos"
                  className="w-16 h-16 rounded-full border-4 border-emerald-200 shadow-lg"
                />
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-lg">Carolina Santos</div>
                  <div className="text-slate-600">Arquiteta, Belo Horizonte</div>
                  <div className="text-sm text-emerald-700 font-semibold">✅ Usuária Premium há 8 meses</div>
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
