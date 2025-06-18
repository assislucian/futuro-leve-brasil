
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCinemaTour } from "@/hooks/useCinemaTour";
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Sparkles,
  Target,
  TrendingUp,
  DollarSign,
  Brain,
  Crown,
  Heart,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
  {
    id: "welcome",
    title: "Bem-vindo à sua transformação financeira",
    subtitle: "Onde seus sonhos encontram a realidade",
    description: "Você está prestes a descobrir como milhares de brasileiros saíram do caos financeiro para a plenitude em apenas 30 dias.",
    icon: Sparkles,
    duration: 4000,
    bgGradient: "from-emerald-500/20 via-blue-500/20 to-purple-500/20",
    effects: ["particles", "glow"]
  },
  {
    id: "dashboard-power",
    title: "Seu centro de comando financeiro",
    subtitle: "Visão 360° do seu dinheiro",
    description: "Veja exatamente onde cada real está indo. Nossa IA analisa seus padrões e revela oportunidades escondidas de economia.",
    icon: Brain,
    duration: 3500,
    bgGradient: "from-blue-500/20 via-cyan-500/20 to-emerald-500/20",
    effects: ["pulse", "shimmer"],
    highlight: ".financial-summary"
  },
  {
    id: "smart-insights",
    title: "Inteligência que trabalha para você",
    subtitle: "IA financeira personalizada",
    description: "Enquanto você vive, nossa IA identifica padrões, sugere otimizações e acelera seus objetivos automaticamente.",
    icon: Zap,
    duration: 3500,
    bgGradient: "from-purple-500/20 via-pink-500/20 to-orange-500/20",
    effects: ["sparkle", "float"],
    highlight: ".smart-insights-card"
  },
  {
    id: "goals-dreams",
    title: "Transforme sonhos em conquistas",
    subtitle: "Sistema científico de metas",
    description: "Casa própria, viagem dos sonhos, independência financeira. Nosso método baseado em neurociência torna tudo alcançável.",
    icon: Target,
    duration: 4000,
    bgGradient: "from-emerald-500/20 via-teal-500/20 to-blue-500/20",
    effects: ["ripple", "glow"],
    highlight: ".goals-summary"
  },
  {
    id: "transaction-magic",
    title: "Controle sem esforço",
    subtitle: "Cada centavo rastreado inteligentemente",
    description: "Adicione transações em segundos. Nossa IA categoriza automaticamente e conecta cada gasto aos seus objetivos.",
    icon: DollarSign,
    duration: 3000,
    bgGradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    effects: ["slide", "bounce"]
  },
  {
    id: "premium-transformation",
    title: "Acelere sua jornada",
    subtitle: "Desbloqueie seu potencial máximo",
    description: "Usuários Premium alcançam seus objetivos 3x mais rápido. ROI comprovado de 1000% em economia mensal.",
    icon: Crown,
    duration: 4500,
    bgGradient: "from-amber-500/20 via-orange-500/20 to-red-500/20",
    effects: ["golden", "crown"]
  },
  {
    id: "your-journey",
    title: "Sua jornada começa agora",
    subtitle: "O futuro que você merece te espera",
    description: "Junte-se a mais de 10.000 brasileiros que já transformaram suas vidas financeiras. Seu primeiro passo para a liberdade financeira está a um clique de distância.",
    icon: Heart,
    duration: 5000,
    bgGradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
    effects: ["heartbeat", "celebration"]
  }
];

export function CinemaTour() {
  const {
    isActive,
    currentStepIndex,
    isPlaying,
    isMuted,
    progress,
    nextStep,
    previousStep,
    playPause,
    toggleMute,
    skipTour,
  } = useCinemaTour();

  const [showEffects, setShowEffects] = useState(true);

  const currentStep = tourSteps[currentStepIndex];

  if (!isActive || !currentStep) {
    return null;
  }

  const IconComponent = currentStep.icon;

  return (
    <>
      {/* Overlay com efeitos visuais */}
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm">
        {showEffects && (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br animate-pulse",
            currentStep.bgGradient
          )} />
        )}
        
        {/* Partículas animadas */}
        {showEffects && currentStep.effects?.includes("particles") && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Destaque do elemento atual */}
      {currentStep.highlight && (
        <style>
          {`
            ${currentStep.highlight} {
              position: relative !important;
              z-index: 101 !important;
              box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5), 0 0 50px rgba(16, 185, 129, 0.3) !important;
              border-radius: 12px !important;
              animation: tourHighlight 2s ease-in-out infinite !important;
            }
            
            @keyframes tourHighlight {
              0%, 100% { 
                box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5), 0 0 50px rgba(16, 185, 129, 0.3);
                transform: scale(1);
              }
              50% { 
                box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.7), 0 0 80px rgba(16, 185, 129, 0.5);
                transform: scale(1.02);
              }
            }
          `}
        </style>
      )}

      {/* Modal principal do tour */}
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
          {/* Header cinematográfico */}
          <div className="relative h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Controles de mídia */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={playPause}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>

            {/* Indicador de progresso */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentStepIndex + 1} de {tourSteps.length}
                </Badge>
                <Badge className="bg-emerald-500 text-white text-xs">
                  🎬 Cinema Tour
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {currentStep.title}
                </h2>
                <p className="text-lg font-medium text-emerald-600">
                  {currentStep.subtitle}
                </p>
              </div>

              <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
                {currentStep.description}
              </p>
            </div>

            {/* Barra de progresso visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Progresso do Tour</span>
                <span>{Math.round((currentStepIndex + 1) / tourSteps.length * 100)}%</span>
              </div>
              <Progress 
                value={(currentStepIndex + 1) / tourSteps.length * 100} 
                className="h-3"
              />
            </div>

            {/* Controles de navegação */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={skipTour}
                className="text-slate-600 hover:text-slate-800"
              >
                Pular Tour
              </Button>

              <div className="flex items-center gap-3">
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={previousStep}
                    size="sm"
                  >
                    Anterior
                  </Button>
                )}
                
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6"
                >
                  {currentStepIndex === tourSteps.length - 1 ? (
                    "Começar Jornada"
                  ) : (
                    <>
                      Próximo
                      <SkipForward className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Easter egg para engajamento */}
            {currentStepIndex === tourSteps.length - 1 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3 text-center">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <div className="text-sm text-emerald-800">
                    <p className="font-medium">🎉 Parabéns! Você completou o Cinema Tour</p>
                    <p>Agora você está pronto para transformar sua vida financeira!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
