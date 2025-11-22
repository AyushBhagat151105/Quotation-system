import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-28 pb-32 h-screen">
            {/* Background Gradient Orbs */}
            <div className="absolute top-0 left-0 w-[600px] h-screen bg-linear-to-r from-purple-600 to-pink-500 blur-[180px] opacity-40 rounded-full" />
            <div className="absolute bottom-0 right-0 w-[600px] h-screen bg-linear-to-r from-blue-500 to-cyan-400 blur-[180px] opacity-30 rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-3xl mx-auto text-center relative z-10"
            >
                <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-br from-purple-400 to-pink-500">
                    Quotation Management
                </h1>

                <p className="mt-6 text-lg text-white/80">
                    Create, send, track, approve & manage quotations — beautifully & efficiently.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Button className="px-6 py-5 text-lg bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-pink-500/30 hover:opacity-90">
                        Get Started <ArrowRight className="ml-2" size={18} />
                    </Button>

                    <Button variant="outline" className="px-6 py-5 text-lg border-white/30 text-white hover:bg-white/10">
                        Live Demo
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
