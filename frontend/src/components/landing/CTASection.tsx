import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function CTASection() {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Emerald gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-teal-900/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-extrabold text-white"
                >
                    Start creating professional quotations today
                </motion.h2>

                <p className="mt-5 text-slate-300 max-w-2xl mx-auto text-lg">
                    Join hundreds of freelancers & agencies using modern quotation
                    workflows to close deals faster.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register">
                        <Button className="px-8 py-5 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20">
                            Get Started — Free <ArrowRight className="ml-2" size={18} />
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button
                            variant="outline"
                            className="px-8 py-5 text-base rounded-xl text-white border-slate-600 hover:bg-slate-800"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
