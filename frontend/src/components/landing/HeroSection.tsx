import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-20 pb-28 min-h-[90vh] flex items-center">
            {/* Background subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #10b981 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Gradient orbs - subtle emerald */}
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-teal-500/8 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <Sparkles size={14} />
                            Professional Quotation Management
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                            Create & manage
                            <span className="text-emerald-400"> quotations</span> effortlessly
                        </h1>

                        <p className="mt-5 text-lg text-slate-400 max-w-lg leading-relaxed">
                            Send beautiful quotation pages to clients, track responses in real-time,
                            and close deals faster with a streamlined workflow.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/register">
                                <Button className="px-6 py-5 text-base bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all">
                                    Get Started Free <ArrowRight className="ml-2" size={18} />
                                </Button>
                            </Link>

                            <a href="#how-it-works">
                                <Button
                                    variant="outline"
                                    className="px-6 py-5 text-base border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg"
                                >
                                    See How it Works
                                </Button>
                            </a>
                        </div>

                        {/* Social proof */}
                        <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span>500+ businesses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span>10K+ quotations sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span>99.9% uptime</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Dashboard mockup card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 hidden lg:block"
                    >
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
                            {/* Fake window header */}
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <div className="ml-3 flex-1 h-6 bg-slate-700/60 rounded-md" />
                            </div>

                            {/* Fake stats row */}
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {[
                                    { label: "Total", value: "247", color: "emerald" },
                                    { label: "Approved", value: "189", color: "emerald" },
                                    { label: "Pending", value: "34", color: "yellow" },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50"
                                    >
                                        <p className="text-xs text-slate-500">{stat.label}</p>
                                        <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Fake table */}
                            <div className="space-y-2">
                                {[
                                    { client: "Acme Corp", amount: "₹45,000", status: "Approved", statusColor: "text-emerald-400" },
                                    { client: "TechStart Inc", amount: "₹28,500", status: "Pending", statusColor: "text-yellow-400" },
                                    { client: "Design Studio", amount: "₹72,000", status: "Approved", statusColor: "text-emerald-400" },
                                    { client: "Cloud Nine", amount: "₹15,800", status: "Sent", statusColor: "text-blue-400" },
                                ].map((row) => (
                                    <div
                                        key={row.client}
                                        className="flex items-center justify-between px-3 py-2.5 bg-slate-900/40 rounded-lg text-sm"
                                    >
                                        <span className="text-slate-300">{row.client}</span>
                                        <span className="text-slate-400">{row.amount}</span>
                                        <span className={row.statusColor}>{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floating glow behind card */}
                        <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
