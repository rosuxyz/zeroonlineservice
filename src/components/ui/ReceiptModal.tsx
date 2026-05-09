"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Download, CheckCircle2, Loader2 } from "lucide-react";
import { getOrderById } from "@/lib/actions/orders";

interface ReceiptModalProps {
  orderId: string | null;
  onClose: () => void;
}

export function ReceiptModal({ orderId, onClose }: ReceiptModalProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderById(orderId).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    } else {
      setOrder(null);
    }
  }, [orderId]);

  if (!orderId) return null;

  const shortId = order?.id?.includes("-")
    ? order.id.split("-")[0].toUpperCase()
    : order?.id?.substring(0, 8).toUpperCase();

  const date = order
    ? new Date(order.created_at).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0 print:block">
        {/* Backdrop (hidden on print) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm print:hidden"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none z-10 flex flex-col max-h-full"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Generating Invoice...</p>
            </div>
          ) : !order ? (
            <div className="flex flex-col items-center justify-center py-24">
              <p className="text-red-500 font-medium">Failed to load invoice.</p>
              <button onClick={onClose} className="mt-4 text-primary-500 font-bold hover:underline">Close</button>
            </div>
          ) : (
            <>
              {/* Close button (hidden on print) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors print:hidden z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="bg-gray-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:bg-white print:text-gray-900 print:border-b print:border-gray-200 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Gem className="w-6 h-6 text-primary-500 print:text-gray-900" />
                    <span className="text-xl font-black tracking-tight">
                      TopUp<span className="text-primary-500 print:text-gray-900">Hub</span>
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs print:text-gray-500">Official Payment Receipt</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-0.5 print:text-gray-500">
                    Receipt No.
                  </p>
                  <p className="text-lg font-mono font-bold tracking-tight">#{shortId}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto">
                {/* Status Banner */}
                {order.status === "completed" && (
                  <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 p-2.5 rounded-lg mb-6 border border-emerald-100 print:border-none print:bg-transparent print:p-0 print:justify-start">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider">Payment Successful</span>
                  </div>
                )}

                {/* Customer & Order Info */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Billed To
                    </h3>
                    <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{order.customer_email}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Order Details
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-900 text-right">{date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target Account</span>
                        <span className="font-mono font-medium text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                          {order.player_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 font-bold text-gray-400 uppercase tracking-wider">Description</th>
                        <th className="pb-2 font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-4">
                          <p className="font-bold text-gray-900 text-sm">{order.game_name}</p>
                          <p className="text-gray-500 mt-0.5">{order.package_label}</p>
                          {order.server_region && (
                            <p className="text-gray-400 text-[10px] mt-0.5">Region: {order.server_region}</p>
                          )}
                        </td>
                        <td className="py-4 text-right font-medium text-gray-900 text-sm">
                          ${(order.amount + (order.discount || 0)).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="w-full sm:w-1/2 ml-auto space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${(order.amount + (order.discount || 0)).toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount {order.promo_code ? `(${order.promo_code})` : ""}</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-gray-900 border-t border-gray-200 pt-3 mt-1">
                    <span>Total Paid</span>
                    <span>${order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer (hidden on print) */}
              <div className="bg-gray-50 p-4 border-t border-gray-200 print:hidden flex justify-end gap-3 shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
