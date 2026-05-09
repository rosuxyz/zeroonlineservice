"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, HeadphonesIcon, Tag } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Instant Delivery",
    description: "Your game credits are delivered to your account instantly after successful payment.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "group-hover:border-yellow-400/50"
  },
  {
    id: 2,
    title: "Secure Payments",
    description: "100% secure transactions with advanced encryption and fraud protection.",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "group-hover:border-emerald-400/50"
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to help you.",
    icon: HeadphonesIcon,
    color: "text-primary-400",
    bg: "bg-primary-400/10",
    border: "group-hover:border-primary-400/50"
  },
  {
    id: 4,
    title: "Best Prices",
    description: "We offer the most competitive prices and regular exciting discounts.",
    icon: Tag,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "group-hover:border-purple-400/50"
  }
];

export default function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0c]">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-gradient">Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`group glass-card p-8 rounded-2xl border border-white/5 transition-all duration-300 ${feature.border} h-full`}>
                  <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
