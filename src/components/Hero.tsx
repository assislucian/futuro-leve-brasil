
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Heart, Star, Users, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background com gradiente otimizado */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-blue-50/40 to-white"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh]">
          
          {/* Conteúdo Principal - Mobile First */}
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 animate-in fade-in-50 duration-700 text-center lg:text-left">
            
            {/* Badge de Credibilidade - Compacto no Mobile */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-700 shadow-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">100% Seguro</span>
              <span className="sm:hidden">Seguro</span>
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              <span className="hidden sm:inline">Gratuito para começar</span>
              <span className="sm:hidden">Grátis</span>
            </div>
            
            {/* Título Principal - Responsivo */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                Transforme seus{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                    sonhos
                  </span>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-full opacity-30 -z-10"></div>
                </span>{" "}
                em realidade financeira
              </h1>
              
              {/* Subtítulo Responsivo */}
              <p className="text-base sm:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O Plenus conecta suas finanças aos seus maiores objetivos de vida. 
                Tenha <strong className="text-slate-800">clareza total</strong>, um <strong className="text-slate-800">plano inteligente</strong> e a tranquilidade para viver 
                o presente enquanto constrói o futuro dos seus sonhos.
              </p>
            </div>
            
            {/* Prova Social - Mobile Otimizada */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 py-2 sm:py-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1 sm:-space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-white shadow-sm"></div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-slate-600 font-medium">+1.000 pessoas</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs sm:text-sm text-slate-600 font-medium ml-1">4.9/5</span>
              </div>
            </div>
            
            {/* CTAs Mobile-First */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto group w-full sm:w-auto"
                >
                  <Link to="/auth">
                    Começar Grátis Agora
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto transition-all duration-300 w-full sm:w-auto"
                >
                  <a href="/#como-funciona">Ver Como Funciona</a>
                </Button>
              </div>
              
              {/* Benefícios Rápidos - Grid Responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-slate-600">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  <span>Sem taxas ocultas</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-slate-600">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  <span>Feito para brasileiros</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-slate-600">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  <span>Resultados reais</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Principal - Mobile Otimizado */}
          <div className="order-1 lg:order-2 relative animate-in fade-in-50 duration-700 [animation-delay:300ms]">
            <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:max-w-none">
              
              {/* Imagem Principal - Aspect Ratio Responsivo */}
              <div className="relative aspect-[4/5] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-emerald-900/15 sm:shadow-emerald-900/20 border border-white/50">
                <img 
                  src="https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Família brasileira feliz, representando a tranquilidade financeira que o Plenus proporciona"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
              </div>
              
              {/* Cards Flutuantes - Mobile Responsive */}
              <div className="absolute -right-3 sm:-right-6 top-8 sm:top-12 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg sm:shadow-xl shadow-emerald-900/10 border border-white/50 animate-in slide-in-from-right-5 duration-700 [animation-delay:600ms] w-32 sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-emerald-500"></div>
                    <div className="absolute inset-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-emerald-500 animate-ping opacity-30"></div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Meta: Casa Própria</p>
                    <p className="text-sm font-bold text-slate-900">68% concluída</p>
                    <div className="w-12 sm:w-16 bg-slate-200 rounded-full h-1.5 mt-1">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-3 sm:-left-6 bottom-12 sm:bottom-16 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg sm:shadow-xl shadow-blue-900/10 border border-white/50 animate-in slide-in-from-left-5 duration-700 [animation-delay:900ms] w-32 sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-blue-500"></div>
                    <div className="absolute inset-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-blue-500 animate-ping opacity-30"></div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Economia este mês</p>
                    <p className="text-sm font-bold text-emerald-600">+R$ 1.347</p>
                    <p className="text-xs text-slate-400">+12% vs anterior</p>
                  </div>
                </div>
              </div>
              
              {/* Card de Conquista - Mobile Compacto */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md sm:shadow-lg animate-in scale-in-50 duration-700 [animation-delay:1200ms]">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                  <span className="text-xs font-bold">Meta Alcançada!</span>
                </div>
              </div>
              
              {/* Elementos Decorativos - Proporcionais */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-200 to-emerald-200 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
