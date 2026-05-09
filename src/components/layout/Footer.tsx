import { Gamepad2, MessageCircle, Share2, Video, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Gamepad2 className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold tracking-tighter text-white">
                Zero<span className="text-primary-500">topuphub</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The premier destination for instant game credits and top-ups. Fast, secure, and reliable digital marketplace for gamers worldwide.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-pink-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition-colors">
                <Video className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500 transition-colors">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">All Games</Link></li>
              <li><Link href="/orders" className="text-gray-400 hover:text-primary-400 transition-colors">Order History</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors">User Dashboard</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">Top Up Now</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-primary-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Top Games</h3>
            <ul className="space-y-4">
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">Free Fire Diamonds</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">PUBG Mobile UC</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">Mobile Legends</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">Valorant Points</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-primary-400 transition-colors">Genshin Impact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Secure Payments</h3>
            <p className="text-gray-400 mb-4">
              We guarantee 100% secure payments with SSL encryption.
            </p>
            <div className="flex items-center gap-2 mb-6">
               <ShieldCheck className="w-6 h-6 text-emerald-500" />
               <span className="text-emerald-500 font-medium text-sm">Secure Checkout</span>
            </div>
            {/* Dummy Payment Icons */}
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">VISA</div>
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">MC</div>
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">PP</div>
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">GPay</div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Zero topuphub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>English (US)</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
