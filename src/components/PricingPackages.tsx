"use client";

import { motion } from "framer-motion";
import { Gem, Star } from "lucide-react";

const packages = [
  {
    id: 1,
    amount: "100",
    bonus: "+10",
    price: "$0.99",
    currency: "Diamonds",
    popular: false,
    color: "from-blue-500/20 to-transparent",
    border: "border-white/10 hover:border-blue-500/50",
    shadow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
  },
  {
    id: 2,
    amount: "310",
    bonus: "+31",
    price: "$2.99",
    currency: "Diamonds",
    popular: false,
    color: "from-blue-500/20 to-transparent",
    border: "border-white/10 hover:border-blue-500/50",
    shadow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
  },
  {
    id: 3,
    amount: "520",
    bonus: "+52",
    price: "$4.99",
    currency: "Diamonds",
    popular: true,
    color: "from-primary-500/30 to-secondary-500/10",
    border: "border-primary-500 shadow-[0_0_20px_rgba(14,165,233,0.3)]",
    shadow: "hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
  },
  {
    id: 4,
    amount: "1060",
    bonus: "+106",
    price: "$9.99",
    currency: "Diamonds",
    popular: false,
    color: "from-purple-500/20 to-transparent",
    border: "border-white/10 hover:border-purple-500/50",
    shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
  },
  {
    id: 5,
    amount: "2180",
    bonus: "+218",
    price: "$19.99",
    currency: "Diamonds",
    popular: false,
    color: "from-purple-500/20 to-transparent",
    border: "border-white/10 hover:border-purple-500/50",
    shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
  },
  {
    id: 6,
    amount: "5600",
    bonus: "+560",
    price: "$49.99",
    currency: "Diamonds",
    popular: false,
    color: "from-yellow-500/20 to-transparent",
    border: "border-white/10 hover:border-yellow-500/50",
    shadow: "hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
  }
];

export default function PricingPackages() {
  return (
    <section id="offers" className="py-24 relative">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Featured <span className="text-gradient">Packages</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Get the best value for your money. Fast and secure top-ups for your favorite games.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                className={`relative bg-[#18181b] rounded-2xl border ${pkg.border} ${pkg.shadow} transition-all duration-300 overflow-hidden h-full flex flex-col group`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-primary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" /> Popular
                    </div>
                  </div>
                )}
                
                <div className={`p-6 bg-gradient-to-br ${pkg.color} flex-1 flex flex-col items-center text-center`}>
                  <Gem className={`w-12 h-12 mb-4 ${pkg.popular ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'} transition-colors`} />
                  
                  <div className="flex items-end justify-center gap-1 mb-1">
                    <span className="text-3xl font-black text-white">{pkg.amount}</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-center mb-4">
                    Bonus {pkg.bonus}
                  </span>
                  
                  <div className="mt-auto pt-6 w-full">
                    <div className="text-2xl font-bold text-white mb-4">{pkg.price}</div>
                    <button className={`w-full py-2.5 rounded-lg font-bold transition-all ${
                      pkg.popular 
                        ? 'bg-gradient-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] hover:scale-105' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
