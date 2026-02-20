import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqs = [
  {
    q: "How do clients approve quotations?",
    a: "Clients receive a secure link via email and can approve or reject. Their action is recorded with time, IP, and optional comment.",
  },
  {
    q: "Can I edit a rejected quotation and resend it?",
    a: "Yes — once a quotation is rejected, admins can update items, prices, and validity, then resend the updated quotation.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use JWT for authentication, secure storage, and encrypted transport. Only authorized admins access quotations.",
  },
  {
    q: "Do you have an API?",
    a: "Yes — a full OpenAPI spec is available for integrating Quotation Management into your workflow.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Frequently asked questions
          </h2>
          <p className="text-slate-400 mt-3">
            Answers to common questions about how the system works.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="mb-3 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-white font-medium hover:no-underline hover:text-emerald-400 transition-colors">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-slate-400 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
