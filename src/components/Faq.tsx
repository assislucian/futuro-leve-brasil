
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "O Plenus é seguro?",
    answer: "Sim! A segurança é nossa prioridade máxima. Todos os seus dados são criptografados e armazenados com as melhores práticas de segurança do mercado. Nunca compartilhamos suas informações sem sua permissão.",
  },
  {
    question: "Preciso conectar minha conta bancária?",
    answer: "Não. Atualmente, o Plenus funciona com a inserção manual de suas receitas e despesas. Isso lhe dá total controle e privacidade sobre suas informações financeiras.",
  },
  {
    question: "Como o plano Premium me ajuda a alcançar meus sonhos mais rápido?",
    answer: "O plano Premium oferece ferramentas avançadas como metas e orçamentos ilimitados, além de relatórios e insights gerados por Inteligência Artificial. Isso te dá uma visão mais clara e recomendações personalizadas para otimizar suas finanças e acelerar suas conquistas.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Com certeza. Você pode cancelar sua assinatura Premium a qualquer momento, sem burocracia. Você continuará com acesso aos recursos Premium até o final do período pago.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Dúvidas Frequentes</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Respostas para as perguntas mais comuns que recebemos.
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left text-lg font-semibold">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
