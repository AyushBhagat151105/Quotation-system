import { motion } from "motion/react";
import { FileText, Send, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: FileText,
        title: "Create Quotation",
        text: "Add client info, items, pricing, validity dates, and notes.",
    },
    {
        icon: Send,
        title: "Send to Client",
        text: "One-click email delivery with a professional quotation page.",
    },
    {
        icon: CheckCircle,
        title: "Get Approval",
        text: "Clients approve or reject with comments — tracked in real time.",
    },
];

export default function WorkflowSection() {
    return (
        <section id="how-it-works" className="py-24 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        How it works
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto">
                        Your quotation process made simple, smooth, and delightful.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px border-t-2 border-dashed border-slate-700" />

                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            viewport={{ once: true }}
                            className="text-center relative"
                        >
                            {/* Step number circle */}
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 relative">
                                <s.icon size={28} className="text-emerald-400" />
                                {/* Step number badge */}
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                                    {i + 1}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{s.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
