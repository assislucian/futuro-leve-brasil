
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 py-24 px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight">Política de Privacidade</h1>
        <div className="prose prose-lg mt-8 max-w-none text-muted-foreground dark:prose-invert">
          <p>Última atualização: 15 de junho de 2025</p>
          <p>
            Sua privacidade é importante para nós. É política do Plenus respeitar sua privacidade em relação a qualquer informação sua que possamos coletar em nosso aplicativo.
          </p>
          <h2 className="text-2xl font-semibold">1. Informações que coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, insere dados financeiros ou se comunica conosco. Isso pode incluir seu nome, endereço de e-mail e os dados financeiros que você opta por registrar.
          </p>
          <h2 className="text-2xl font-semibold">2. Como usamos as informações</h2>
          <p>
            Usamos as informações que coletamos para operar, manter e fornecer os recursos e a funcionalidade do Serviço, para analisar como o Serviço é usado, diagnosticar problemas técnicos ou de serviço, manter a segurança e personalizar o conteúdo.
          </p>
          <h2 className="text-2xl font-semibold">3. Segurança</h2>
           <p>
            A segurança de seus dados é fundamental. Empregamos medidas de segurança padrão da indústria para proteger as informações sob nosso controle contra perda, uso indevido e alteração.
          </p>
          <p className="mt-12 text-center font-semibold">
            Esta é uma versão de placeholder da Política de Privacidade. Por favor, consulte um profissional legal para criar sua própria política.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
