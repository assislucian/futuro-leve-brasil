
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Lightbulb, Target, TrendingUp, Shield, Zap, Brain, Heart } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-8 w-8 text-emerald-600" />,
    title: "IA que encontra seus vazamentos",
    description: "Nossa inteligência artificial analisa seus gastos e identifica exatamente onde você está perdendo dinheiro. Recupere até R$ 2.000/mês que nem sabia que estava sumindo.",
    impact: "Economia média: R$ 12.000/ano",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: <Target className="h-8 w-8 text-blue-600" />,
    title: "Transforme sonhos em conquistas reais",
    description: "Não é só sobre planilhas. É sobre acelerar sua casa própria, sua viagem dos sonhos e sua aposentadoria. Veja seus objetivos saindo do papel.",
    impact: "Metas 3x mais rápidas",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
    title: "Multiplique seu dinheiro sem riscos",
    description: "Receba estratégias personalizadas para fazer seu dinheiro render mais. Sem jargões complicados, só resultados que você pode aplicar hoje mesmo.",
    impact: "Rendimento 40% maior",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Zap className="h-8 w-8 text-amber-600" />,
    title: "Controle total em tempo real",
    description: "Saiba na hora se um gasto vai atrapalhar seus planos. Receba alertas inteligentes antes de comprometer seu futuro financeiro.",
    impact: "Zero surpresas no cartão",
    color: "from-amber-500 to-amber-600"
  },
  {
    icon: <Heart className="h-8 w-8 text-red-500" />,
    title: "Feito especialmente para brasileiros",
    description: "Entendemos a realidade brasileira: salário no final do mês, 13º, férias, FGTS. Nossa tecnologia se adapta à sua vida real, não ao contrário.",
    impact: "100% brasileiro, 100% eficaz",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Segurança bancária + suporte humano",
    description: "Seus dados protegidos com criptografia bancária. E quando precisar de ajuda, fale com gente de verdade que entende de dinheiro e sonhos brasileiros.",
    impact: "Segurança total, suporte real",
    color: "from-green-500 to-green-600"
  },
];

const Features = () => {
  return (
    <section id="resultados" className="py-20 sm:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="h-4 w-4" />
            Resultados comprovados por +2.847 brasileiros
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Por que o Plenus <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">funciona de verdade</span>?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Não somos apenas mais uma ferramenta financeira. Somos o <strong className="text-slate-800">sistema completo</strong> 
            que transforma brasileiros endividados em <strong className="text-emerald-700">brasileiros prósperos</strong>.
          </p>
        </div>
        
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`group relative overflow-hidden border-2 hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${feature.color} hover:shadow-current/20`}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90 group-hover:from-white/90 group-hover:to-white/80 transition-all duration-300"></div>
              
              <CardHeader className="relative text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-2xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative space-y-4 text-center">
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {feature.description}
                </p>
                
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                  <Zap className="h-3 w-3" />
                  {feature.impact}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Social Proof Section */}
        <div className="mt-20 bg-white rounded-3xl border-2 border-emerald-200 p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">
              Veja o que nossos usuários estão conquistando:
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600 mb-2">R$ 18.347</div>
                <div className="text-sm text-emerald-800 font-semibold mb-1">Economia média em 6 meses</div>
                <div className="text-xs text-emerald-700">Maria S., Enfermeira - SP</div>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">6 meses</div>
                <div className="text-sm text-blue-800 font-semibold mb-1">Mais cedo realizou o sonho</div>
                <div className="text-xs text-blue-700">João M., Professor - RJ</div>
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">189%</div>
                <div className="text-sm text-purple-800 font-semibold mb-1">Aumento na poupança mensal</div>
                <div className="text-xs text-purple-700">Ana C., Dentista - MG</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
              <p className="text-lg font-semibold text-amber-900 mb-2">
                🏆 Resultado médio dos nossos usuários Premium:
              </p>
              <p className="text-2xl font-bold text-amber-800">
                R$ 12.000+ economizados no primeiro ano
              </p>
              <p className="text-sm text-amber-700 mt-2">
                Isso é 600x o valor do plano anual! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
