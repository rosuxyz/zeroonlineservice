import { getOrderById } from "@/lib/actions/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Gem, Download, ArrowLeft, CheckCircle2 } from "lucide-react";

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const shortId = order.id.includes('-') ? order.id.split('-')[0].toUpperCase() : order.id.substring(0,8).toUpperCase();
  const date = new Date(order.created_at).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Nav (Hidden on print) */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden shadow-sm">
        <Link href="/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <button 
          id="print-button"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Print Receipt
        </button>
      </div>

      {/* Receipt Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 print:p-0 print:bg-white">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-gray-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:bg-white print:text-gray-900 print:border-b print:border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gem className="w-8 h-8 text-primary-500 print:text-gray-900" />
                <span className="text-2xl font-black tracking-tight">TopUp<span className="text-primary-500 print:text-gray-900">Hub</span></span>
              </div>
              <p className="text-gray-400 text-sm print:text-gray-500">Official Payment Receipt</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1 print:text-gray-500">Receipt No.</p>
              <p className="text-xl font-mono font-bold tracking-tight">#{shortId}</p>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {/* Status Banner */}
            {order.status === 'completed' && (
              <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-8 border border-emerald-100 print:border-none print:bg-transparent print:p-0 print:justify-start">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Payment Successful</span>
              </div>
            )}

            {/* Customer & Order Info */}
            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
                <p className="font-bold text-gray-900 text-lg">{order.customer_name}</p>
                <p className="text-gray-500 text-sm mt-0.5">{order.customer_email}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Details</h3>
                <div className="space-y-1.5 text-sm">
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
                    <span className="font-mono font-medium text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-xs">{order.player_id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-5">
                      <p className="font-bold text-gray-900 text-base">{order.game_name}</p>
                      <p className="text-gray-500 mt-1">{order.package_label}</p>
                      {order.server_region && <p className="text-gray-400 text-xs mt-0.5">Region: {order.server_region}</p>}
                    </td>
                    <td className="py-5 text-right font-medium text-gray-900 text-base">
                      ${(order.amount + (order.discount || 0)).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="w-full sm:w-1/2 ml-auto space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${(order.amount + (order.discount || 0)).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount {order.promo_code ? `(${order.promo_code})` : ''}</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-200 pt-4 mt-2">
                <span>Total Paid</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 sm:p-8 text-center border-t border-gray-100 print:bg-white print:border-none">
            <p className="text-sm text-gray-500 font-medium">Thank you for your business!</p>
            <p className="text-xs text-gray-400 mt-1">If you have any questions about this receipt, please contact support@topuphub.com</p>
          </div>

        </div>
      </div>
      
      {/* Script to handle print button in client */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('print-button')?.addEventListener('click', () => window.print());
      `}} />
    </div>
  );
}
