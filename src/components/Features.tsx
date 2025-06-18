
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Shield, Brain, Heart, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-8 w-8 text-emerald-600" />,
    title: "Insights inteligentes sobre seus gastos",
    description: "Identifique padrões de consumo e descubra oportunidades de economia baseadas em seus próprios dados. Sem palpites, só análises reais.",
    impact: "Economia média: 15-20% da renda",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: <Target className="h-8 w-8 text-blue-600" />,
    title: "Metas que funcionam de verdade",
    description: "Crie objetivos realistas e acompanhe seu progresso. Seja para reserva de emergência, viagem ou casa própria, mantenha o foco no que importa.",
    impact: "Objetivos 40% mais rápidos",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
    title: "Controle completo do seu dinheiro",
    description: "Saiba exatamente onde cada real está sendo gasto. Categorização automática e relatórios claros para decisões financeiras inteligentes.",
    impact: "Controle total das finanças",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Orçamentos que você consegue seguir",
    description: "Crie orçamentos realistas baseados no seu histórico. Receba alertas antes de extrapolar e mantenha suas contas em dia.",
    impact: "Redução de 60% nos gastos extras",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <Heart className="h-8 w-8 text-red-500" />,
    title: "Feito para a realidade brasileira",
    description: "Entendemos 13º salário, férias, FGTS e a nossa forma de lidar com dinheiro. Uma ferramenta brasileira para brasileiros.",
    impact: "100% adaptado ao Brasil",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <Shield className="h-8 w-8 text-slate-600" />,
    title: "Segurança e privacidade totais",
    description: "Seus dados são criptografados e protegidos. Nunca compartilhamos informações pessoais. Sua privacidade é nossa prioridade.",
    impact: "Proteção bancária dos dados",
    color: "from-slate-500 to-slate-600"
  },
];

const Features = () => {
  return (
    <section id="resultados" className="py-20 sm:py-32 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-slate-200">
            <TrendingUp className="h-4 w-4" />
            Comprovado por usuários reais
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-slate-900">
            Como o Plenus <span className="text-emerald-700">realmente</span> funciona
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Não prometemos milagres. Oferecemos <strong className="text-slate-800">ferramentas comprovadas</strong> 
            que ajudam você a ter controle real sobre suas finanças.
          </p>
        </div>
        
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg bg-white"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors duration-300 w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 text-center">
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-full text-sm font-medium">
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                  {feature.impact}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Dados realistas */}
        <div className="mt-20 bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">
              Resultados baseados em estudos reais:
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-700 mb-2">15-20%</div>
                <div className="text-sm text-emerald-800 font-medium mb-1">Da renda economizada</div>
                <div className="text-xs text-emerald-600">Média de quem controla gastos</div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="text-3xl font-bold text-blue-700 mb-2">40%</div>
                <div className="text-sm text-blue-800 font-medium mb-1">Mais rápido para objetivos</div>
                <div className="text-xs text-blue-600">Com planejamento estruturado</div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="text-3xl font-bold text-purple-700 mb-2">3 meses</div>
                <div className="text-sm text-purple-800 font-medium mb-1">Para criar hábitos</div>
                <div className="text-xs text-purple-600">Tempo médio de adaptação</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-lg font-medium text-slate-800 mb-2">
                🎯 O segredo não é ganhar mais, é gastar melhor
              </p>
              <p className="text-sm text-slate-600">
                Baseado em estudos de comportamento financeiro e feedback de nossos usuários
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
