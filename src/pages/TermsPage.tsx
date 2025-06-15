
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 py-24 px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight">Termos de Serviço</h1>
        <div className="prose prose-lg mt-8 max-w-none text-muted-foreground dark:prose-invert">
          <p>Última atualização: 15 de junho de 2025</p>
          <p>
            Bem-vindo ao Plenus! Estes termos de serviço ("Termos") descrevem as regras e regulamentos para o uso do nosso aplicativo e serviços. Ao acessar ou usar nosso Serviço, você concorda em cumprir estes Termos.
          </p>
          <h2 className="text-2xl font-semibold">1. Contas de Usuário</h2>
          <p>
            Ao criar uma conta conosco, você deve nos fornecer informações precisas, completas e atuais em todos os momentos. A falha em fazer isso constitui uma violação dos Termos, que pode resultar na rescisão imediata da sua conta em nosso Serviço. Você é responsável por proteger a senha que usa para acessar o Serviço e por quaisquer atividades ou ações sob sua senha.
          </p>
          <h2 className="text-2xl font-semibold">2. Propriedade Intelectual</h2>
          <p>
            O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do Plenus e de seus licenciadores.
          </p>
          <h2 className="text-2xl font-semibold">3. Rescisão</h2>
           <p>
            Podemos rescindir ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos.
          </p>
          <p className="mt-12 text-center font-semibold">
            Esta é uma versão de placeholder dos Termos de Serviço. Por favor, consulte um profissional legal para criar seus próprios termos.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
