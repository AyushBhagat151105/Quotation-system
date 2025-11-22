"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <section className="py-28 px-4 bg-linear-to-r from-pink-600 via-purple-600 to-blue-500">
            <div className="max-w-6xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold text-white"
                >
                    Start creating beautiful quotations today
                </motion.h2>

                <p className="mt-4 text-white/90 max-w-2xl mx-auto">
                    Join hundreds of freelancers & agencies using modern quotation workflows to close deals faster.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="px-8 py-4 text-lg bg-black/90 text-white rounded-xl shadow-lg">Get Started — Free</Button>
                    <Button variant="outline" className="px-8 py-4 rounded-xl text-white border-white/30">Request Demo</Button>
                </div>
            </div>
        </section>
    );
}
