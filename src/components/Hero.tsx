
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4 md:px-6 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl -z-10"></div>
      
      <div className="flex w-full flex-col items-center gap-16 md:flex-row">
        <div className="order-2 flex flex-col items-start space-y-8 text-left animate-in fade-in-50 duration-500 md:order-1 md:w-1/2">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              <Shield className="mr-2 h-4 w-4" />
              100% Seguro e Gratuito para começar
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Transforme seus{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                sonhos
              </span>{" "}
              em realidade financeira
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              O Plenus conecta suas finanças aos seus maiores objetivos de vida. 
              Tenha clareza total, um plano inteligente e a tranquilidade para viver 
              o presente enquanto constrói o futuro dos seus sonhos.
            </p>
          </div>
          
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-200">
                <Link to="/auth">
                  Começar Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-slate-300 hover:bg-slate-50">
                <a href="/#como-funciona">Como Funciona</a>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>Sem taxas ocultas</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-500" />
                <span>Feito para brasileiros</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-1 flex w-full items-center justify-center animate-in fade-in-50 duration-500 [animation-delay:200ms] md:order-2 md:w-1/2">
          <div className="relative w-full max-w-lg">
            <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-emerald-100/50 bg-white">
              <img 
                src="https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Família brasileira feliz, representando a tranquilidade financeira que o Plenus proporciona"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -right-4 top-8 rounded-2xl bg-white p-4 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-xs text-slate-500">Meta: Casa Própria</p>
                  <p className="text-sm font-bold text-slate-900">65% concluída</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -left-4 bottom-8 rounded-2xl bg-white p-4 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-xs text-slate-500">Economia este mês</p>
                  <p className="text-sm font-bold text-emerald-600">+R$ 1.247</p>
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
