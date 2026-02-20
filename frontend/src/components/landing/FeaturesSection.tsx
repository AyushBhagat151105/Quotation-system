import { motion } from "motion/react";
import { CheckCircle, Mail, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Send Beautiful Quotations",
    text: "Share stunning quotation pages instantly with clients via email.",
  },
  {
    icon: BarChart3,
    title: "Track Client Responses",
    text: "Know exactly when quotations are viewed, approved, or rejected.",
  },
  {
    icon: Shield,
    title: "Secure & Encrypted",
    text: "Fully JWT-secured APIs with role-based access and encrypted transport.",
  },
  {
    icon: CheckCircle,
    title: "Powerful Dashboard",
    text: "View stats, track performance, and manage everything at scale.",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Everything you need to manage quotations
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Powerful features that help you create, track, and close deals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <f.icon size={24} />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
