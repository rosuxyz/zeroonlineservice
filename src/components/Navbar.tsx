"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/games" },
  { name: "Top Up", href: "/games" },
  { name: "Orders", href: "/orders" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuthStore();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // Set initial scroll state
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "glass py-3 shadow-[0_2px_30px_rgba(0,0,0,0.5)]" : "bg-transparent py-5"
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="Zero topuphub home"
          >
            <Gamepad2 className="w-7 h-7 text-primary-500" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight text-white">
              Zero<span className="text-primary-500">topuphub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors relative group py-1",
                    isActive ? "text-primary-400" : "text-gray-300 hover:text-white"
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-0.5 bg-primary-500 transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 hover:bg-white/5 rounded-full pl-1 pr-3 py-1 transition-colors border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white uppercase">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {profile?.full_name?.split(" ")[0] || "User"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-primary text-white px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.35)] hover:scale-105 active:scale-95 transition-transform"
                >
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[68px] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-[68px] right-0 h-[calc(100dvh-68px)] w-72 max-w-[85vw] bg-[#0a0a0d]/95 backdrop-blur-xl border-l border-white/10 p-6 md:hidden flex flex-col gap-6 overflow-y-auto"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all",
                        isActive
                          ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-auto">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-3 bg-white/5 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white uppercase">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-medium text-white">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors text-center py-3 px-4 rounded-xl border border-red-500/20 hover:bg-red-500/10"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-base font-semibold text-gray-300 hover:text-white transition-colors text-center py-2 px-4 rounded-xl hover:bg-white/5"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-gradient-primary text-white px-5 py-3 rounded-full font-bold w-full text-center text-sm"
                    >
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
