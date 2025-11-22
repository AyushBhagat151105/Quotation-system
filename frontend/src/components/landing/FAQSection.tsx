"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    <section className="py-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently asked questions</h2>
        <p className="text-white/70 mt-3">Answers to common questions about how the system works.</p>
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="mb-4 bg-white/3 rounded-xl">
              <AccordionTrigger className="px-6 py-4 text-left text-white font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-white/70">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
