import { motion } from "motion/react";
import { FileText, Send, Check } from "lucide-react";

const steps = [
    { icon: FileText, title: "Create Quotation", text: "Add items, pricing, validity & notes." },
    { icon: Send, title: "Send to Client", text: "One click email delivery with smart tracking." },
    { icon: Check, title: "Get Approval", text: "Clients can approve/reject with comments." },
];

export default function WorkflowSection() {
    return (
        <section className="py-24 bg-linear-to-b from-black to-purple-900/20">
            <h2 className="text-center text-white text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-center text-white/70 max-w-2xl mx-auto mb-14">
                Your quotation process made simple, smooth, and delightful.
            </p>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                {steps.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20 mb-6">
                            <s.icon size={28} className="text-white" />
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                        <p className="text-white/70 text-sm">{s.text}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
