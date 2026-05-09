"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderTable } from "@/components/ui/OrderTable";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getUserOrders } from "@/lib/actions/orders";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUSES: { value: "all" | OrderStatus; label: string; color: string }[] = [
  { value: "all", label: "All Orders", color: "" },
  { value: "Completed", label: "Completed", color: "text-emerald-400" },
  { value: "Pending", label: "Pending", color: "text-yellow-400" },
  { value: "Failed", label: "Failed", color: "text-red-400" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.game_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.id?.toLowerCase().includes(search.toLowerCase()) ||
        o.player_id?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, orders]);

  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    pending: orders.filter((o) => o.status === "pending").length,
    failed: orders.filter((o) => o.status === "failed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <SectionHeading
            badge="My Account"
            title="Order"
            highlight="History"
            subtitle="Track and manage all your top-up purchases"
            center={false}
          />

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: stats.total, color: "text-white" },
              { label: "Completed", value: stats.completed, color: "text-emerald-400" },
              { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              { label: "Failed", value: stats.failed, color: "text-red-400" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5 border border-white/5"
              >
                <p className="text-gray-400 text-sm mb-1">{s.label}</p>
                <p className={cn("text-3xl font-extrabold", s.color)}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by game, order ID, player ID..."
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                    statusFilter === s.value
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-[0_0_12px_rgba(14,165,233,0.3)]"
                      : "bg-white/5 text-gray-400 hover:text-white border-white/10 hover:bg-white/10"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-20 text-center text-primary-500">Loading orders...</div>
          ) : (
            <OrderTable orders={filtered} showUser />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
