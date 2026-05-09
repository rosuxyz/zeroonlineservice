"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrderTable } from "@/components/ui/OrderTable";
import { StatsCard } from "@/components/ui/StatsCard";
import { useAuthStore } from "@/lib/store";
import { getUserOrders } from "@/lib/actions/orders";
import {
  LayoutDashboard, ShoppingBag, User, Settings, Gem,
  DollarSign, Package, ChevronRight, Menu, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { href: "/orders", label: "My Orders", icon: ShoppingBag, external: true },
  { href: "/games", label: "Browse Games", icon: Gem, external: true },
];

// Separate component to avoid JSX-in-array hydration issues
function StatsList({ totalSpent, orders }: { totalSpent: number, orders: any[] }) {
  const statsData = [
    {
      title: "Total Spent",
      value: typeof totalSpent === 'number' ? `$${totalSpent.toFixed(2)}` : '$0.00',
      icon: <DollarSign className="w-5 h-5" aria-hidden="true" />,
      change: "12%",
      positive: true,
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <Package className="w-5 h-5" aria-hidden="true" />,
      change: "3",
      positive: true,
    },
    {
      title: "Completed",
      value: orders.filter((o) => o.status === "completed").length,
      icon: <ShoppingBag className="w-5 h-5" aria-hidden="true" />,
      change: "2",
      positive: true,
    },
    {
      title: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      icon: <Gem className="w-5 h-5" aria-hidden="true" />,
      change: "1",
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsData.map((s, i) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <StatsCard
            title={s.title}
            value={s.value}
            icon={s.icon}
            change={s.change}
            positive={s.positive}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const totalSpent = profile?.total_spent || 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#0d0d10] border-r border-white/8 z-40 transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Dashboard navigation"
      >
        <div className="p-5 border-b border-white/8 shrink-0">
          <Link href="/" className="flex items-center gap-2" aria-label="Go to home">
            <Gem className="w-6 h-6 text-primary-500" aria-hidden="true" />
            <span className="text-lg font-bold text-white">
              TopUp<span className="text-primary-500">Hub</span>
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto" aria-label="Sidebar links">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.external ? false : activeTab === link.id;
            
            if (link.external) {
              return (
                <Link
                  key={link.label}
                  href={link.href!}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id!);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-primary-500/12 text-primary-400 border border-primary-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {link.label}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/8 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shrink-0"
              aria-hidden="true"
            >
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile?.full_name || "User"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-white/8 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/8 transition-colors"
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-none">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Welcome back, {profile?.full_name?.split(" ")[0] || "User"}!
              </p>
            </div>
          </div>
          <Link
            href="/games"
            className="flex items-center gap-1.5 text-primary-400 text-sm font-semibold hover:text-primary-300 transition-colors"
          >
            Top Up Now
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </header>

        <main className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 sm:gap-8">
              {/* Stats */}
              <StatsList totalSpent={totalSpent} orders={orders} />

              {/* Recent Orders */}
              <section aria-labelledby="orders-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="orders-heading" className="text-base sm:text-lg font-bold text-white">
                    Recent Orders
                  </h2>
                  <Link
                    href="/orders"
                    className="text-primary-400 text-sm font-semibold hover:text-primary-300 transition-colors hover:underline"
                  >
                    View All
                  </Link>
                </div>
                {loading ? (
                  <div className="py-10 text-center text-primary-500 text-sm">Loading orders...</div>
                ) : (
                  <OrderTable orders={orders.slice(0, 5)} showUser />
                )}
              </section>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Profile Card */}
              <section aria-labelledby="profile-heading" className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8">
                <h2 id="profile-heading" className="text-base sm:text-lg font-bold text-white mb-5">
                  My Profile
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-[0_0_20px_rgba(14,165,233,0.35)] shrink-0"
                    aria-hidden="true"
                  >
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <dl className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {[
                      { label: "Name", value: profile?.full_name || "User" },
                      { label: "Email", value: user?.email || "" },
                      {
                        label: "Member Since",
                        value: new Date(profile?.created_at || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                      },
                      { label: "Role", value: profile?.role || "user", badge: true },
                    ].map((item) => (
                      <div key={item.label}>
                        <dt className="text-xs text-gray-500 mb-1">{item.label}</dt>
                        {item.badge ? (
                          <span className="inline-flex items-center text-xs font-bold px-2 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 capitalize">
                            {item.value}
                          </span>
                        ) : (
                          <dd className="text-sm sm:text-base text-white font-semibold break-all">
                            {item.value}
                          </dd>
                        )}
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 border border-white/8 text-center py-20">
              <Settings className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-white mb-2">Account Settings</h2>
              <p className="text-gray-400 text-sm">Settings and preferences will be available in a future update.</p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
