import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";


const TermsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 py-24 px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight">Termos de Serviço</h1>
        <div className="prose prose-lg mt-8 max-w-none text-muted-foreground dark:prose-invert">
          <p>Última atualização: 15 de junho de 2025</p>
          <p>
            Bem-vindo ao Plenus! Ao criar uma conta e utilizar nossa plataforma ("Serviço"), você concorda com estes Termos de Serviço ("Termos"). Por favor, leia-os com atenção.
          </p>
          <h2 className="text-2xl font-semibold">1. Uso do Serviço</h2>
          <p>
            Você concorda em usar o Plenus apenas para fins lícitos e de acordo com estes Termos. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta. Você deve nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.
          </p>
          <h2 className="text-2xl font-semibold">2. Nossos Planos</h2>
          <p>
            Oferecemos um plano gratuito e um plano pago ("Premium"). As funcionalidades de cada plano estão descritas em nossa página de Preços. As assinaturas do plano Premium são cobradas de forma recorrente (mensal ou anual) e podem ser canceladas a qualquer momento através das configurações da sua conta.
          </p>
          <h2 className="text-2xl font-semibold">3. Propriedade Intelectual</h2>
           <p>
            O Serviço e todo o seu conteúdo, incluindo, mas não se limitando a, software, design, texto e gráficos, são propriedade exclusiva da Plenus e protegidos por leis de direitos autorais e propriedade intelectual.
          </p>
          <h2 className="text-2xl font-semibold">4. Isenção de Responsabilidade</h2>
           <p>
            O Plenus é uma ferramenta de planejamento e educação financeira. Não fornecemos aconselhamento financeiro, de investimento, legal ou fiscal. As informações e insights gerados pela plataforma são para fins informativos e não devem ser considerados como uma recomendação profissional. As decisões financeiras são de sua exclusiva responsabilidade.
          </p>
          <h2 className="text-2xl font-semibold">5. Rescisão</h2>
           <p>
            Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento, por qualquer motivo, incluindo a violação destes Termos, sem aviso prévio.
          </p>

          <Alert variant="destructive" className="mt-12">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aviso Legal Importante</AlertTitle>
            <AlertDescription>
              Este documento é um modelo e não constitui aconselhamento jurídico. O Plenus foi desenvolvido por uma Inteligência Artificial e este texto é uma sugestão. Recomendamos fortemente que você consulte um profissional da área jurídica para elaborar Termos de Serviço completos e adequados às especificidades do seu negócio e à legislação vigente.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export { TermsPage };
export default TermsPage;
