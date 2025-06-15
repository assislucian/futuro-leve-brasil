
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="container mx-auto flex min-h-screen flex-col items-center justify-center text-center px-4 md:px-6">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          Transforme sua relação com o{" "}
          <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
            dinheiro
          </span>
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          Plenus é a plataforma de bem-estar financeiro que conecta suas finanças aos seus sonhos. Tenha clareza, propósito e alcance a plenitude.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Comece sua jornada (Grátis)
          </Button>
          <Button size="lg" variant="outline">
            Conheça os planos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
