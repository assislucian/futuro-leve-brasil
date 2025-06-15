
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4 md:px-6">
      <div className="grid w-full items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-start text-left space-y-6 animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Onde seu dinheiro e seus{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              sonhos
            </span>{" "}
            se encontram.
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Chega de ansiedade financeira. Com Plenus, você ganha clareza para
            controlar seu dinheiro e um plano real para conquistar seus maiores
            objetivos. Simples, visual e feito para você.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/auth">
                Começar minha jornada
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/#features">Descobrir como funciona</a>
            </Button>
          </div>
        </div>
        <div className="hidden md:flex justify-center items-center animate-fade-in [animation-delay:200ms]">
          <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
            <img 
              src="https://images.unsplash.com/photo-1554224155-8d04421cd6e2?q=80&w=2070&auto=format&fit=crop" 
              alt="Casal sorrindo enquanto planeja suas finanças no computador"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
