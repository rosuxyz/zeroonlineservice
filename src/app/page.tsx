import { Navbar } from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import GamesGrid from "@/components/home/GamesGrid";
import PricingPackages from "@/components/home/PricingPackages";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary-500/30 selection:text-white">
      <Navbar />
      
      <Hero />
      
      <GamesGrid />
      
      <PricingPackages />
      
      <Features />
      
      <Testimonials />
      
      <CtaBanner />
      
      <Footer />
    </main>
  );
}
