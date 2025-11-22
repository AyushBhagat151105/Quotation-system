"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const plans = [
    {
        id: "starter",
        name: "Starter",
        price: "Free",
        subtitle: "For freelancers trying us out",
        bullets: ["1 user", "10 quotations / month", "Email support"],
        highlight: false,
    },
    {
        id: "pro",
        name: "Pro",
        price: "₹499 / mo",
        subtitle: "Most popular",
        bullets: ["Unlimited quotations", "Client emails & tracking", "Dashboard & stats"],
        highlight: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "₹1,499 / mo",
        subtitle: "For teams & agencies",
        bullets: ["Team seats", "Priority support", "Advanced analytics"],
        highlight: false,
    },
];

export default function PricingSection() {
    return (
        <section className="py-24 px-4 bg-linear-to-b from-purple-900/30 to-black">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r
 from-yellow-400 via-pink-500 to-purple-500">
                    Pricing made simple
                </h2>
                <p className="mt-4 text-white/70 max-w-2xl mx-auto">
                    Simple, predictable pricing — scale when you’re ready. No surprise fees.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                        <Card
                            className={`relative overflow-hidden rounded-2xl
                ${p.highlight ? "scale-100 lg:scale-105 border-0 shadow-2xl" : "bg-white/5"}
                backdrop-blur-xl`}
                        >
                            {/* Gradient accent */}
                            {p.highlight && (
                                <div className="absolute inset-0 -z-10 bg-linear-to-br from-pink-600 to-yellow-400 opacity-10" />
                            )}

                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white">{p.name}</CardTitle>
                                        <p className="text-sm text-white/70 mt-1">{p.subtitle}</p>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-extrabold text-white">{p.price}</div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 pt-0">
                                <ul className="space-y-3 mb-6">
                                    {p.bullets.map((b, i) => (
                                        <li className="flex items-start gap-3 text-white/90" key={i}>
                                            <span className="p-1 rounded-md bg-white/5">
                                                <Check size={16} className="text-green-400" />
                                            </span>
                                            <span className="text-sm">{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full py-3 rounded-lg text-lg font-semibold
                    ${p.highlight ? "bg-linear-to-r from-pink-500 to-yellow-400 text-black" : "bg-white/5 text-white"}`}
                                >
                                    {p.highlight ? "Get Pro" : "Choose"}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <p className="mt-8 text-center text-white/60 text-sm max-w-3xl mx-auto">
                All plans include email support, secure API access and continuous updates. Cancel anytime.
            </p>
        </section>
    );
}
