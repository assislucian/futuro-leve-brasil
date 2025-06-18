
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Heart, Star, Users, CheckCircle, Target } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background mais sóbrio */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[75vh] sm:min-h-[80vh]">
          
          {/* Conteúdo Principal - Mais realista */}
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Badge mais sóbrio */}
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-slate-600" />
              <span>Controle financeiro que funciona de verdade</span>
            </div>
            
            {/* Título Principal - Focado na realidade */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900">
                Organize suas finanças e{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    realize seus sonhos
                  </span>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-2 bg-emerald-200 rounded-full opacity-60 -z-10"></div>
                </span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-700 leading-tight">
                Transforme o <span className="text-slate-900 font-semibold">caos financeiro</span> em um{" "}
                <span className="text-emerald-700 font-semibold">plano organizado</span>
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong className="text-slate-800">Estudos mostram</strong> que pessoas que controlam suas finanças 
                conseguem <strong className="text-emerald-700">economizar 15-20% da renda</strong> e alcançar objetivos 
                <strong className="text-emerald-700"> 40% mais rápido</strong>.
              </p>
            </div>
            
            {/* Prova Social mais realista */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
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
                  <span className="text-sm sm:text-base text-slate-700 font-medium">+1.200 usuários</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm sm:text-base text-slate-700 font-medium ml-1">4.8/5</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600 italic text-center lg:text-left">
                "Em 3 meses consegui criar minha reserva de emergência. Simples e eficaz." 
                <span className="font-medium text-slate-800">- Maria S., São Paulo</span>
              </p>
            </div>
            
            {/* CTAs mais sóbrios */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 h-auto group w-full sm:w-auto"
                >
                  <Link to="/auth" className="flex items-center justify-center">
                    <Target className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-slate-800 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 h-auto transition-all duration-300 w-full sm:w-auto"
                >
                  <a href="#resultados" className="flex items-center justify-center">
                    <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Ver Como Funciona
                  </a>
                </Button>
              </div>
              
              {/* Benefícios mais realistas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-3">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-600 bg-white rounded-lg px-3 py-2 border border-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Gratuito para começar</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-600 bg-white rounded-lg px-3 py-2 border border-slate-200">
                  <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Dados seguros</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-600 bg-white rounded-lg px-3 py-2 border border-slate-200">
                  <Heart className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">Suporte brasileiro</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Principal */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              
              {/* Imagem Principal */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl border-4 border-white">
                <img 
                  src="https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Família brasileira próspera e feliz"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent"></div>
              </div>
              
              {/* Cards de Resultado mais realistas */}
              <div className="absolute -right-4 sm:-right-6 top-6 sm:top-8 bg-white text-slate-800 rounded-xl p-3 sm:p-4 shadow-lg border border-slate-200 w-40 sm:w-48 transform rotate-2">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-emerald-700">20%</div>
                  <div className="text-xs sm:text-sm text-slate-600">Economia mensal</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-medium text-slate-700">Controle total</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-4 sm:-left-6 bottom-12 sm:bottom-16 bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-slate-200 w-44 sm:w-52 transform -rotate-1">
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-medium">Meta: Reserva de Emergência</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-700">75% ✓</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">No caminho certo!</div>
                </div>
              </div>
              
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-emerald-600 text-white rounded-lg p-2 sm:p-3 shadow-md transform rotate-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Organizado!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
