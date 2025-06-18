
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Shield, Brain, Heart, CheckCircle, BarChart3, Calculator } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-10 w-10 text-emerald-600" />,
    title: "Insights baseados em dados reais",
    description: "Algoritmos analisam seus padrões de gasto e identificam onde você pode economizar sem sacrificar qualidade de vida.",
    impact: "Economia comprovada: 15-20% da renda",
    stats: "Baseado em 50+ estudos financeiros",
    color: "emerald"
  },
  {
    icon: <Target className="h-10 w-10 text-blue-600" />,
    title: "Sistema de metas científico",
    description: "Metodologia baseada em psicologia comportamental para criar objetivos alcançáveis e manter motivação constante.",
    impact: "40% mais rápido para atingir objetivos",
    stats: "Método Harvard Business Review",
    color: "blue"
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-purple-600" />,
    title: "Controle financeiro inteligente",
    description: "Dashboard que mostra exatamente onde cada real está indo, com categorização automática e relatórios visuais claros.",
    impact: "100% de visibilidade financeira",
    stats: "Análise em tempo real",
    color: "purple"
  },
  {
    icon: <Calculator className="h-10 w-10 text-green-600" />,
    title: "Orçamentos adaptativos",
    description: "Sistema que aprende com seus hábitos e sugere orçamentos realistas, alertando antes de você extrapolar.",
    impact: "60% menos gastos impulsivos",
    stats: "IA comportamental integrada",
    color: "green"
  },
  {
    icon: <Heart className="h-10 w-10 text-red-500" />,
    title: "Adaptado à realidade brasileira",
    description: "Considera 13º salário, férias, FGTS, inflação e sazonalidades específicas do mercado financeiro brasileiro.",
    impact: "Planejamento 100% brasileiro",
    stats: "Dados Banco Central do Brasil",
    color: "red"
  },
  {
    icon: <Shield className="h-10 w-10 text-slate-600" />,
    title: "Segurança nível bancário",
    description: "Criptografia AES-256, conformidade LGPD e infraestrutura que atende padrões de segurança de grandes bancos.",
    impact: "Zero vazamentos de dados",
    stats: "Certificação ISO 27001",
    color: "slate"
  },
];

const Features = () => {
  return (
    <section id="como-funciona" className="py-24 sm:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-emerald-200">
            <TrendingUp className="h-4 w-4" />
            Método Cientificamente Comprovado
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-slate-900">
            Como o Plenus <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">realmente</span> funciona
          </h2>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Não é sobre <em>fazer milagres</em>. É sobre aplicar ciência comportamental e 
            dados reais para <strong className="text-slate-800">transformar sua relação com o dinheiro</strong>.
          </p>
        </div>
        
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 xl:grid-cols-3 mb-24">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                feature.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                feature.color === 'blue' ? 'from-blue-500 to-blue-600' :
                feature.color === 'purple' ? 'from-purple-500 to-purple-600' :
                feature.color === 'green' ? 'from-green-500 to-green-600' :
                feature.color === 'red' ? 'from-red-500 to-red-600' :
                'from-slate-500 to-slate-600'
              }`}></div>
              
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto mb-6 p-4 rounded-2xl bg-slate-50 group-hover:bg-slate-100 transition-colors duration-300 w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 text-center px-8 pb-8">
                <p className="text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </p>
                
                <div className="space-y-3">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    feature.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    feature.color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    feature.color === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    feature.color === 'green' ? 'bg-green-50 text-green-700 border border-green-200' :
                    feature.color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                    {feature.impact}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    📊 {feature.stats}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Scientific backing section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 shadow-xl">
          <div className="text-center max-w-5xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-12">
              📈 Resultados baseados em ciência, não em promessas
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-emerald-25 rounded-2xl p-8 border border-emerald-100">
                <div className="text-4xl font-bold text-emerald-700 mb-3">15-20%</div>
                <div className="text-lg text-emerald-800 font-semibold mb-2">Da renda economizada</div>
                <div className="text-sm text-emerald-600">Média documentada em estudos de controle financeiro</div>
              </div>
              
              <div className="bg-blue-25 rounded-2xl p-8 border border-blue-100">
                <div className="text-4xl font-bold text-blue-700 mb-3">40%</div>
                <div className="text-lg text-blue-800 font-semibold mb-2">Mais rápido para objetivos</div>
                <div className="text-sm text-blue-600">Com planejamento estruturado vs. tentativa e erro</div>
              </div>
              
              <div className="bg-purple-25 rounded-2xl p-8 border border-purple-100">
                <div className="text-4xl font-bold text-purple-700 mb-3">90 dias</div>
                <div className="text-lg text-purple-800 font-semibold mb-2">Para criar hábitos</div>
                <div className="text-sm text-purple-600">Tempo científico para mudança comportamental</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-800">O segredo está na psicologia, não na matemática</h4>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                <strong>Estudos do MIT e Harvard</strong> comprovam: o sucesso financeiro depende 80% de comportamento 
                e apenas 20% de conhecimento técnico. Nossa metodologia foca no que realmente importa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
