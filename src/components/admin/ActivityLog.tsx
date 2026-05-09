"use client";

import { useMemo } from "react";
import { 
  ShoppingBag, CheckCircle2, XCircle, Clock, 
  ArrowRight, User, Hash 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLogProps {
  orders: any[];
  onViewLogs?: () => void;
}

export function ActivityLog({ orders, onViewLogs }: ActivityLogProps) {
  // Generate activities from orders
  const activities = useMemo(() => {
    const items: any[] = [];

    orders.forEach(order => {
      // 1. New Order Activity
      items.push({
        id: `new-${order.id}`,
        type: "new",
        title: "New Order Placed",
        description: `${order.game_name} - ${order.package_label}`,
        orderId: order.id.substring(0, 8).toUpperCase(),
        time: new Date(order.created_at),
        user: order.profiles?.full_name || "Guest",
        status: order.status
      });

      // 2. Status Change Activity (Simulated from completed/failed state)
      if (order.status !== "pending") {
        items.push({
          id: `status-${order.id}`,
          type: order.status,
          title: order.status === "completed" ? "Order Completed" : "Order Failed",
          description: `Handled by system admin`,
          orderId: order.id.substring(0, 8).toUpperCase(),
          time: new Date(order.created_at), // Using created_at since we don't have updated_at in current schema
          user: order.profiles?.full_name || "Guest",
          status: order.status
        });
      }
    });

    // Sort by time descending
    return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 15);
  }, [orders]);

  const getIcon = (type: string) => {
    switch (type) {
      case "new": return <ShoppingBag className="w-4 h-4 text-primary-400" />;
      case "completed": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          Live Activity
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </h2>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          Recent Events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {activities.map((activity, i) => (
          <div key={activity.id} className="relative pl-8 group">
            {/* Timeline Line */}
            {i !== activities.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-white/5 group-hover:bg-primary-500/20 transition-colors" />
            )}
            
            {/* Timeline Dot */}
            <div className={cn(
              "absolute left-0 top-1 w-8 h-8 rounded-xl flex items-center justify-center z-10 border transition-all",
              activity.type === "new" ? "bg-primary-500/10 border-primary-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]" :
              activity.type === "completed" ? "bg-emerald-500/10 border-emerald-500/20" :
              "bg-red-500/10 border-red-500/20"
            )}>
              {getIcon(activity.type)}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">
                  {activity.title}
                </h3>
                <span className="text-[10px] text-gray-500 font-medium">
                  {formatRelativeTime(activity.time)}
                </span>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed">
                {activity.description}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-[10px] text-gray-400">{activity.user}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                  <Hash className="w-3 h-3 text-gray-500" />
                  <span className="text-[10px] text-gray-400">ID: {activity.orderId}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="py-20 text-center">
            <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity detected.</p>
          </div>
        )}
      </div>

      <button 
        onClick={onViewLogs}
        className="mt-6 w-full py-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
      >
        View System Logs
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
