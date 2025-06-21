
import React, { useEffect, useRef } from "react";
import { useWealthJourneyTour } from "@/hooks/useWealthJourneyTour";
import { WealthJourneyTooltip } from "./WealthJourneyTooltip";
import { 
  Sparkles,
  Target,
  TrendingUp,
  DollarSign,
  PieChart,
  Shield,
  Lightbulb,
  Heart
} from "lucide-react";

const tourSteps = [
  {
    id: "welcome",
    title: "Bem-vindo ao Plenus",
    subtitle: "Sua jornada para a plenitude financeira começa aqui",
    description: "O Plenus foi criado especialmente para brasileiros que querem transformar sua relação com o dinheiro. Vamos te mostrar como sair do caos financeiro e alcançar seus sonhos, passo a passo.",
    actionText: "Começar minha transformação",
    icon: Sparkles,
    tip: "💡 Este tour é no seu ritmo. Pause quando quiser, volte se precisar. O importante é você entender cada funcionalidade."
  },
  {
    id: "dashboard-overview",
    title: "Seu painel de controle financeiro",
    subtitle: "Visão completa da sua vida financeira",
    description: "Aqui você vê um resumo completo: quanto tem, quanto gasta, e como está progredindo. É o seu centro de comando financeiro, sempre atualizado em tempo real.",
    actionText: "Entendi, vamos continuar",
    icon: TrendingUp,
    highlight: ".financial-summary",
    tip: "📊 Todos os números aqui se atualizam automaticamente conforme você adiciona transações e metas."
  },
  {
    id: "smart-insights",
    title: "Insights inteligentes",
    subtitle: "IA que trabalha para seus objetivos",
    description: "Nossa inteligência artificial analisa seus padrões financeiros e oferece sugestões personalizadas. Ela identifica oportunidades de economia e te ajuda a otimizar seus gastos.",
    actionText: "Adorei essa funcionalidade",
    icon: Lightbulb,
    highlight: ".smart-insights-card",
    tip: "🤖 Quanto mais você usa o Plenus, mais inteligentes ficam as sugestões!"
  },
  {
    id: "transactions",
    title: "Controle total dos seus gastos",
    subtitle: "Cada centavo rastreado e categorizado",
    description: "Adicione suas receitas e despesas facilmente. O sistema categoriza automaticamente e conecta cada gasto aos seus objetivos. Assim você sempre sabe para onde seu dinheiro está indo.",
    actionText: "Quero aprender a adicionar",
    icon: DollarSign,
    tip: "💳 Dica: Comece adicionando suas transações dos últimos 30 dias para ter uma visão mais precisa."
  },
  {
    id: "goals-power",
    title: "Transforme sonhos em conquistas",
    subtitle: "Sistema científico de metas financeiras",
    description: "Casa própria, viagem dos sonhos, aposentadoria... Crie metas específicas e veja exatamente quanto economizar por mês. O Plenus calcula tudo automaticamente e mostra seu progresso visual.",
    actionText: "Vou criar minha primeira meta",
    icon: Target,
    highlight: ".goals-summary",
    tip: "🎯 Metas específicas têm 10x mais chance de serem alcançadas que objetivos vagos!"
  },
  {
    id: "budgets-control",
    title: "Orçamentos que funcionam",
    subtitle: "Controle inteligente sem sufoco",
    description: "Crie orçamentos realistas por categoria. O sistema te avisa quando você está próximo do limite e sugere ajustes inteligentes. Sem stress, com foco no que realmente importa.",
    actionText: "Quero organizar meu orçamento",
    icon: PieChart,
    tip: "📋 Comece com categorias básicas: alimentação, transporte e lazer. Você pode refinar depois."
  },
  {
    id: "emergency-fund",
    title: "Sua reserva de emergência",
    subtitle: "Segurança e tranquilidade garantidas",
    description: "Uma das bases da saúde financeira é ter uma reserva para imprevistos. O Plenus te ajuda a calcular o valor ideal e criar um plano para formar sua reserva gradualmente.",
    actionText: "Vou criar minha reserva",
    icon: Shield,
    tip: "🛡️ Meta inicial: 3 meses de gastos essenciais. Depois amplie para 6 meses quando possível."
  },
  {
    id: "your-journey",
    title: "Sua jornada financeira começa agora",
    subtitle: "Você tem tudo para conquistar seus objetivos",
    description: "Parabéns! Agora você conhece todas as ferramentas do Plenus. Lembre-se: transformação financeira é uma jornada, não um destino. Estamos aqui para te apoiar em cada passo.",
    actionText: "Começar minha jornada",
    icon: Heart,
    tip: "🌟 Dica de ouro: Use o Plenus por 21 dias seguidos. É tempo suficiente para criar o hábito e ver os primeiros resultados!"
  }
];

export function WealthJourneyTour() {
  const {
    isActive,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    goToStep,
  } = useWealthJourneyTour();

  const highlightStylesRef = useRef<HTMLStyleElement | null>(null);

  // Effect para aplicar destaque visual
  useEffect(() => {
    if (!isActive) {
      // Cleanup quando não ativo
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
        highlightStylesRef.current = null;
      }
      return;
    }

    const currentStep = tourSteps[currentStepIndex];
    
    // Remove estilos anteriores
    if (highlightStylesRef.current) {
      document.head.removeChild(highlightStylesRef.current);
      highlightStylesRef.current = null;
    }

    if (currentStep?.highlight) {
      const timer = setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
          ${currentStep.highlight} {
            position: relative !important;
            z-index: 101 !important;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6) !important;
            border-radius: 12px !important;
            animation: gentlePulse 3s ease-in-out infinite !important;
            transition: all 0.3s ease !important;
          }
          
          @keyframes gentlePulse {
            0%, 100% { 
              box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 0 8px rgba(16, 185, 129, 1), 0 0 60px rgba(16, 185, 129, 0.8);
              transform: scale(1.005);
            }
          }
        `;
        document.head.appendChild(style);
        highlightStylesRef.current = style;
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStepIndex]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (highlightStylesRef.current) {
        document.head.removeChild(highlightStylesRef.current);
        highlightStylesRef.current = null;
      }
    };
  }, []);

  if (!isActive) return null;

  const currentStep = tourSteps[currentStepIndex];
  if (!currentStep) return null;

  return (
    <>
      {/* Overlay suave */}
      <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[1px]" />

      {/* Tooltip inteligente */}
      <WealthJourneyTooltip
        step={currentStep}
        currentIndex={currentStepIndex}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrevious={previousStep}
        onSkip={skipTour}
        onGoToStep={goToStep}
      />
    </>
  );
}
