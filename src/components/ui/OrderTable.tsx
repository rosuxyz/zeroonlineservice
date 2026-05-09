"use client";

import { useState } from "react";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";
import { ReceiptModal } from "./ReceiptModal";
import { ProofModal } from "./ProofModal";
import { updateOrderStatus } from "@/lib/actions/admin";
import { useAuthStore } from "@/lib/store";

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25",
  Failed: "bg-red-500/10 text-red-400 border border-red-500/25",
};

interface OrderTableProps {
  orders: any[];
  showUser?: boolean;
  editable?: boolean;
}

export function OrderTable({ orders, showUser = false, editable = false }: OrderTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const { profile } = useAuthStore();

  const canEdit = editable && profile?.role === "admin";

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 glass-card rounded-2xl border border-white/5">
        <p className="text-sm">No orders found.</p>
      </div>
    );
  }

  return (
    /* Outer wrapper prevents page overflow on small screens */
    <div className="w-full overflow-hidden rounded-2xl border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px]" role="table">
          <thead>
            <tr className="bg-white/[0.04] text-gray-400 uppercase text-[10px] sm:text-xs tracking-wider">
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Order ID</th>
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Game</th>
              {showUser && <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Customer</th>}
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Package</th>
              {showUser && <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Player ID</th>}
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Amount</th>
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Payment</th>
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Invoice</th>
              {showUser && <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Proof</th>}
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Status</th>
              <th scope="col" className="text-left px-4 sm:px-5 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 sm:px-5 py-3.5 font-mono text-primary-400 font-medium whitespace-nowrap">
                  #{order.id.includes('-') ? order.id.split('-')[0].toUpperCase() : order.id.substring(0,8).toUpperCase()}
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-white font-medium whitespace-nowrap">
                  {order.game_name}
                </td>
                {showUser && (
                  <td className="px-4 sm:px-5 py-3.5 text-gray-300 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold">{order.profiles?.full_name || "Guest"}</span>
                      <span className="text-[10px] text-gray-500">{order.profiles?.email || ""}</span>
                    </div>
                  </td>
                )}
                <td className="px-4 sm:px-5 py-3.5 text-gray-300 whitespace-nowrap">
                  {order.package_label}
                </td>
                {showUser && (
                  <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                    {order.player_id}
                  </td>
                )}
                <td className="px-4 sm:px-5 py-3.5 text-emerald-400 font-bold whitespace-nowrap">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-300 whitespace-nowrap capitalize">
                  {order.payment_method}
                </td>
                <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                  <button 
                    onClick={() => setSelectedReceipt(order.id)}
                    className="text-xs font-semibold text-primary-400 hover:text-primary-300 hover:underline"
                  >
                    View Bill
                  </button>
                </td>
                {showUser && (
                  <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                    {order.receipt_url ? (
                      <button 
                        onClick={() => setSelectedProof(order.receipt_url)}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                      >
                        View Proof
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                )}
                <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                  {canEdit ? (
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value as "pending" | "completed" | "failed";
                        try {
                          await updateOrderStatus(order.id, newStatus);
                        } catch (err) {
                          alert("Failed to update status");
                        }
                      }}
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold capitalize bg-[#0a0a0c] border focus:outline-none cursor-pointer",
                        statusStyles[order.status.charAt(0).toUpperCase() + order.status.slice(1)] || statusStyles.Pending
                      )}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold capitalize",
                        statusStyles[order.status.charAt(0).toUpperCase() + order.status.slice(1)] || statusStyles.Pending
                      )}
                    >
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-gray-500 text-[11px] whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Receipt Modal */}
      <ReceiptModal 
        orderId={selectedReceipt} 
        onClose={() => setSelectedReceipt(null)} 
      />
      
      {/* Proof Modal */}
      <ProofModal 
        receiptUrl={selectedProof} 
        onClose={() => setSelectedProof(null)} 
      />
    </div>
  );
}
