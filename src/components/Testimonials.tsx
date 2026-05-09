"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Alex 'Shadow' Chen",
    role: "Pro Valorant Player",
    content: "TopUp Hub is my go-to for Valorant Points. The instant delivery is actually instant, never had to wait more than 10 seconds. Highly recommended!",
    rating: 5,
    avatar: "A"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Mobile Legends Streamer",
    content: "I've been using this site for all my giveaways. The prices are unbeatable and the customer service helped me out immediately when I made a mistake.",
    rating: 5,
    avatar: "S"
  },
  {
    id: 3,
    name: "Marcus Rossi",
    role: "Casual Gamer",
    content: "Clean UI, super easy to use, and I love the dark gaming theme. Makes buying game credits feel premium. Safe and secure every time.",
    rating: 5,
    avatar: "M"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 relative">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Trusted by <span className="text-gradient">Gamers</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Don't just take our word for it. Here's what our community has to say about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="glass-card p-8 rounded-2xl h-full flex flex-col relative group">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 transform group-hover:scale-110 group-hover:text-primary-500/10 transition-all duration-300" />
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-8 flex-1 italic relative z-10">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-primary-400">{testimonial.role}</p>
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
