

import { motion } from "motion/react";
import { CheckCircle, Mail, BarChart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mail,
    title: "Send Beautiful Quotations",
    text: "Share stunning quotation pages instantly with clients.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart,
    title: "Track Client Responses",
    text: "Know exactly when quotations are viewed, approved or rejected.",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    icon: Shield,
    title: "Secure & Encrypted",
    text: "Fully JWT secured APIs with role-based access.",
    gradient: "from-orange-400 to-red-500",
  },
  {
    icon: CheckCircle,
    title: "Powerful Dashboard",
    text: "View stats, track performance & manage everything at scale.",
    gradient: "from-green-400 to-emerald-500",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 bg-black relative">
      <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-14">
        Powerful Features You’ll Love 💜
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition p-6 rounded-2xl h-full">
              <CardContent className="p-0">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center bg-linear-to-r ${f.gradient} text-white shadow-lg mb-4`}
                >
                  <f.icon size={28} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/70 text-sm">{f.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
