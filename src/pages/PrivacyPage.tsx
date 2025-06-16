
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 py-24 px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight">Política de Privacidade</h1>
        <div className="prose prose-lg mt-8 max-w-none text-muted-foreground dark:prose-invert">
          <p>Última atualização: 15 de junho de 2025</p>
          <p>
            A sua privacidade é crucial para nós da Plenus. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) do Brasil.
          </p>
          <h2 className="text-2xl font-semibold">1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente ao criar sua conta, como nome completo e endereço de e-mail. Também coletamos os dados financeiros que você insere na plataforma (receitas, despesas, metas) para viabilizar as funcionalidades do serviço. Não coletamos dados sensíveis sem seu consentimento explícito.
          </p>
          <h2 className="text-2xl font-semibold">2. Como Usamos Suas Informações</h2>
          <p>
            Utilizamos suas informações para:
            <ul className="list-disc pl-6">
              <li>Operar e manter a plataforma Plenus.</li>
              <li>Personalizar sua experiência e fornecer insights financeiros.</li>
              <li>Comunicar-nos com você sobre sua conta e atualizações do serviço.</li>
              <li>Analisar o uso da plataforma para melhorias contínuas.</li>
              <li>Garantir a segurança da sua conta e dos seus dados.</li>
            </ul>
          </p>
          <h2 className="text-2xl font-semibold">3. Compartilhamento de Informações</h2>
          <p>
            Nós não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. Suas informações só serão compartilhadas em circunstâncias estritamente necessárias, como por ordem judicial ou para viabilizar serviços essenciais (ex: processadores de pagamento), sempre com o máximo de transparência e segurança.
          </p>
          <h2 className="text-2xl font-semibold">4. Segurança dos Dados</h2>
           <p>
            A segurança dos seus dados é nosso compromisso inabalável. Utilizamos criptografia de ponta-a-ponta, controle de acesso rigoroso (incluindo Row Level Security no Supabase) e as melhores práticas de segurança da indústria para proteger suas informações contra acesso, alteração ou destruição não autorizados.
          </p>
           <h2 className="text-2xl font-semibold">5. Seus Direitos como Titular dos Dados</h2>
           <p>
            De acordo com a LGPD, você tem o direito de acessar, corrigir, anonimizar, bloquear ou eliminar seus dados pessoais. Você pode gerenciar a maioria das suas informações diretamente nas configurações da sua conta ou entrando em contato conosco.
          </p>

          <Alert variant="destructive" className="mt-12">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aviso Legal Importante</AlertTitle>
            <AlertDescription>
              Este documento é um modelo e não constitui aconselhamento jurídico. O Plenus foi desenvolvido por uma Inteligência Artificial e este texto é uma sugestão. Recomendamos fortemente que você consulte um profissional da área jurídica para elaborar uma Política de Privacidade completa e adequada às especificidades do seu negócio e à legislação vigente.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
