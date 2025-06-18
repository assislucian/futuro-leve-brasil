import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, CheckCircle, Target, Users, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh]">
          
          {/* Content - Premium hierarchy */}
          <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
            
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-3 rounded-full bg-white border border-slate-200/60 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border border-white"></div>
                ))}
              </div>
              <span>Mais de 2.500 brasileiros organizando suas finanças</span>
            </div>
            
            {/* Hero headline - Premium typography */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-slate-900">
                Transforme sua vida{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                    financeira
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-emerald-100 rounded-full -z-10"></div>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-600 leading-tight max-w-2xl mx-auto lg:mx-0">
                De caos financeiro para controle total em{" "}
                <span className="text-slate-900 font-semibold">30 dias</span>
              </p>
              
              <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O método comprovado que já ajudou milhares de brasileiros a economizarem 
                <strong className="text-emerald-700"> R$ 200-800 por mês</strong> sem cortar 
                o que realmente importa.
              </p>
            </div>
            
            {/* Results preview */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-700">15-20%</div>
                  <div className="text-sm text-slate-600 font-medium">Economia média</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">30 dias</div>
                  <div className="text-sm text-slate-600 font-medium">Para ver resultados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">4.8★</div>
                  <div className="text-sm text-slate-600 font-medium">Avaliação média</div>
                </div>
              </div>
            </div>
            
            {/* Premium CTAs */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto group border-0"
                >
                  <Link to="/auth" className="flex items-center justify-center">
                    <Target className="mr-3 h-6 w-6" />
                    Começar Transformação Gratuita
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 hover:text-slate-800 text-lg px-8 py-6 h-auto transition-all duration-300 bg-white"
                >
                  <a href="#como-funciona" className="flex items-center justify-center">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    Ver Demonstração
                  </a>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">100% gratuito para começar</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">Dados protegidos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">Suporte brasileiro</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative max-w-lg mx-auto">
              
              {/* Main image with premium treatment */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" 
                  alt="Casal jovem brasileiro sorrindo enquanto organiza suas finanças juntos"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating success cards - Premium design */}
              <div className="absolute -right-6 top-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-52 transform rotate-2 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-medium mb-1">💰 Economia este mês</div>
                  <div className="text-2xl font-bold text-emerald-700">+ R$ 847</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-slate-700">Controle total alcançado</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-6 bottom-16 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-56 transform -rotate-1 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-medium mb-2">🎯 Meta: Casa Própria</div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">R$ 68.400</span>
                    <span className="text-blue-700 font-bold">68%</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-3 shadow-lg transform rotate-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Organizado ✨</span>
                </div>
              </div>
              
              {/* Testimonial card */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-72 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                    alt="Ana Carolina"
                    className="w-10 h-10 rounded-full border-2 border-emerald-200"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Ana Carolina M.</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Em 3 meses economizei R$ 1.800 que nem sabia que estava gastando. Agora tenho minha reserva!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
