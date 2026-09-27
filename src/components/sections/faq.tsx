import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/content/faq";

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">
          Perguntas frequentes
        </h2>

        <Accordion type="single" collapsible className="mt-12">
          {faq.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
