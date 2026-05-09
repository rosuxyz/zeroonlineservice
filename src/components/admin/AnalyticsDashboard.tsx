"use client";

import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, Package, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
  orders: any[];
}

const COLORS = ["#0ea5e9", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];

export function AnalyticsDashboard({ orders }: AnalyticsDashboardProps) {
  const [range, setRange] = useState(7);

  // 1. Calculate Daily Orders (Customisable range)
  const dailyData = useMemo(() => {
    const dates = [...Array(range)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const stats = dates.map(date => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: orders.filter(o => o.created_at.startsWith(date)).length,
      revenue: orders.filter(o => o.created_at.startsWith(date) && o.status === "completed")
        .reduce((sum, o) => sum + o.amount, 0)
    }));

    return stats;
  }, [orders, range]);

  // 2. Revenue by Game
  const gameData = useMemo(() => {
    const games: Record<string, number> = {};
    orders.filter(o => o.status === "completed").forEach(o => {
      games[o.game_name] = (games[o.game_name] || 0) + o.amount;
    });

    return Object.entries(games)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [orders]);

  // 3. Payment Method Distribution
  const paymentData = useMemo(() => {
    const methods: Record<string, number> = {};
    orders.forEach(o => {
      const m = o.payment_method?.toLowerCase() || "unknown";
      methods[m] = (methods[m] || 0) + 1;
    });

    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // 4. Top Selling Packages
  const topPackages = useMemo(() => {
    const pkgs: Record<string, { count: number; revenue: number; game: string }> = {};
    orders.filter(o => o.status === "completed").forEach(o => {
      const key = `${o.game_name} - ${o.package_label}`;
      if (!pkgs[key]) pkgs[key] = { count: 0, revenue: 0, game: o.game_name };
      pkgs[key].count++;
      pkgs[key].revenue += o.amount;
    });

    return Object.entries(pkgs)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: Daily Trends */}
      <section className="glass-card rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            {range}-Day Activity
          </h2>
          <div className="flex items-center gap-6">
            <select 
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary-500 transition-all cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-[10px] text-gray-400 uppercase font-bold">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-secondary-500/50" />
              <span className="text-[10px] text-gray-400 uppercase font-bold">Orders</span>
            </div>
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 11 }}
                width={30}
              />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="count" fill="rgba(168, 85, 247, 0.4)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Game */}
        <section className="glass-card rounded-2xl p-6 border border-white/8">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Revenue by Game
          </h2>
          <div className="h-[250px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gameData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gameData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                   formatter={(val: any) => [`$${Number(val).toFixed(2)}`, "Revenue"]}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  formatter={(val) => <span className="text-xs text-gray-400">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top Selling Packages */}
        <section className="glass-card rounded-2xl p-6 border border-white/8">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-secondary-400" />
            Top Selling Packages
          </h2>
          <div className="space-y-4">
            {topPackages.map((pkg, i) => (
              <div key={pkg.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{pkg.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-black">{pkg.game}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">${pkg.revenue.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500">{pkg.count} Sales</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <section className="glass-card rounded-2xl p-6 border border-white/8">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-400" />
            Payment Methods
          </h2>
          <div className="space-y-4">
            {paymentData.map((m, i) => {
              const totalOrders = orders.length || 1;
              const percent = (m.value / totalOrders) * 100;
              return (
                <div key={m.name} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-300 uppercase">{m.name}</span>
                    <span className="text-white">{m.value} Orders ({percent.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
