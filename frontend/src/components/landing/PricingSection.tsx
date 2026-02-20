import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

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
        price: "₹499",
        period: "/ mo",
        subtitle: "Most popular",
        bullets: [
            "Unlimited quotations",
            "Client emails & tracking",
            "Dashboard & analytics",
        ],
        highlight: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "₹1,499",
        period: "/ mo",
        subtitle: "For teams & agencies",
        bullets: ["Team seats", "Priority support", "Advanced analytics"],
        highlight: false,
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-4 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            <div className="max-w-7xl mx-auto text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Simple, transparent pricing
                </h2>
                <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                    No surprise fees. Scale when you're ready.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        viewport={{ once: true }}
                    >
                        <Card
                            className={`relative rounded-xl h-full flex flex-col
                ${p.highlight
                                    ? "bg-slate-800 border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                                    : "bg-slate-800/50 border-slate-700/50"
                                }`}
                        >
                            {/* Popular badge */}
                            {p.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                                    Popular
                                </div>
                            )}

                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="text-lg font-semibold text-white">
                                    {p.name}
                                </CardTitle>
                                <p className="text-sm text-slate-500 mt-1">{p.subtitle}</p>
                                <div className="mt-4">
                                    <span className="text-3xl font-extrabold text-white">
                                        {p.price}
                                    </span>
                                    {p.period && (
                                        <span className="text-slate-500 text-sm ml-1">
                                            {p.period}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                                <ul className="space-y-3 mb-6 flex-1">
                                    {p.bullets.map((b, i) => (
                                        <li
                                            className="flex items-center gap-3 text-slate-300"
                                            key={i}
                                        >
                                            <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm">{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/register" className="w-full">
                                    <Button
                                        className={`w-full py-2.5 rounded-lg font-medium text-sm
                      ${p.highlight
                                                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                                : "bg-slate-700 hover:bg-slate-600 text-white"
                                            }`}
                                    >
                                        {p.highlight ? "Get Pro" : "Get Started"}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <p className="mt-10 text-center text-slate-500 text-sm max-w-3xl mx-auto">
                All plans include email support, secure API access, and continuous
                updates. Cancel anytime.
            </p>
        </section>
    );
}
