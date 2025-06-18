
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Heart, Star, Users, CheckCircle, Zap, Target } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background otimizado para conversão */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-blue-50/60 to-white"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[75vh] sm:min-h-[80vh]">
          
          {/* Conteúdo Principal - Focado em resultados e urgência */}
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Badge de Urgência e Credibilidade */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-amber-800 shadow-md animate-pulse">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-amber-600" />
              <span>🔥 +2.847 brasileiros já economizaram R$ 12.000+ este ano!</span>
            </div>
            
            {/* Título Principal - Foco na DOR e SOLUÇÃO */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Pare de{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                    perder dinheiro
                  </span>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-red-200 rounded-full opacity-40 -z-10"></div>
                </span>{" "}
                sem saber para onde vai
              </h1>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 leading-tight">
                Transforme o <span className="text-emerald-600 font-bold">caos financeiro</span> em um{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  plano milionário
                </span>
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong className="text-slate-800">87% dos brasileiros</strong> não sabem para onde vai 30% do seu dinheiro. 
                O Plenus mostra <strong className="text-emerald-700">exatamente onde está o vazamento</strong> e como recuperar 
                <strong className="text-emerald-700"> até R$ 24.000 por ano</strong> que você está perdendo.
              </p>
            </div>
            
            {/* Prova Social Brasileira Forte */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-lg">
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1 sm:-space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img 
                        key={i} 
                        src={`https://images.pexels.com/photos/${i === 1 ? '1239291' : i === 2 ? '1222271' : i === 3 ? '1130626' : i === 4 ? '1043471' : '1559486'}/pexels-photo-${i === 1 ? '1239291' : i === 2 ? '1222271' : i === 3 ? '1130626' : i === 4 ? '1043471' : '1559486'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`}
                        alt={`Usuário brasileiro ${i}`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-semibold">+2.847 brasileiros</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm sm:text-base text-slate-700 font-semibold ml-1">4.9/5</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600 italic text-center lg:text-left">
                💬 "Descobri que gastava R$ 847/mês sem saber! Em 6 meses já consegui minha reserva de emergência." 
                <span className="font-semibold text-slate-800">- Maria S., São Paulo</span>
              </p>
            </div>
            
            {/* CTAs Otimizados para Conversão */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 h-auto group w-full sm:w-auto transform hover:scale-105"
                >
                  <Link to="/auth" className="flex items-center justify-center">
                    <Target className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Descobrir Meus Vazamentos GRÁTIS
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 text-emerald-700 hover:text-emerald-800 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 h-auto transition-all duration-300 w-full sm:w-auto"
                >
                  <a href="#resultados" className="flex items-center justify-center">
                    <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Ver Resultados Reais
                  </a>
                </Button>
              </div>
              
              {/* Benefícios Urgentes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-3">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium">Resultado em 7 dias</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2">
                  <Shield className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium">100% Seguro & Brasileiro</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium">Suporte em português</span>
                </div>
              </div>

              {/* Urgência Sutil */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 sm:p-4 text-center lg:text-left">
                <p className="text-sm sm:text-base text-amber-800 font-semibold">
                  ⚡ <span className="text-amber-900">Última semana de dezembro:</span> Descubra quanto você perdeu em 2024 
                  e comece 2025 no controle total! 
                  <span className="block sm:inline mt-1 sm:mt-0 sm:ml-2 text-amber-700">
                    Só hoje: Análise completa GRATUITA! 🎁
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Visual Principal - Brasileiro e Aspiracional */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              
              {/* Imagem Principal - Família Brasileira de Sucesso */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/20 border-4 border-white">
                <img 
                  src="https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Família brasileira próspera e feliz que alcançou estabilidade financeira com o Plenus"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Cards de Resultado - Mais Agressivos */}
              <div className="absolute -right-4 sm:-right-6 top-6 sm:top-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-white w-40 sm:w-48 transform rotate-3">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold">R$ 18.347</div>
                  <div className="text-xs sm:text-sm opacity-90">Recuperado em 6 meses!</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-semibold">+287% mais economia</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-4 sm:-left-6 bottom-12 sm:bottom-16 bg-white rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-emerald-200 w-44 sm:w-52 transform -rotate-2">
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-medium">Meta: Casa Própria</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600">89% ✅</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Faltam só R$ 12.800!</div>
                </div>
              </div>
              
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl p-2 sm:p-3 shadow-lg transform rotate-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                  <span className="text-xs sm:text-sm font-bold whitespace-nowrap">Sonho Realizado!</span>
                </div>
              </div>
              
              {/* Elementos de Riqueza e Sucesso */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full opacity-30 blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-30 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
