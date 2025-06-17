
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageProvider";

export function Faq() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t('faq.question_1'),
      answer: t('faq.answer_1'),
    },
    {
      question: t('faq.question_2'),
      answer: t('faq.answer_2'),
    },
    {
      question: t('faq.question_3'),
      answer: t('faq.answer_3'),
    },
    {
      question: t('faq.question_4'),
      answer: t('faq.answer_4'),
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('faq.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('faq.subtitle')}
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
