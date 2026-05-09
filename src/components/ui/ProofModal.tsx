"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

interface ProofModalProps {
  receiptUrl: string | null;
  onClose: () => void;
}

export function ProofModal({ receiptUrl, onClose }: ProofModalProps) {
  if (!receiptUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl h-[85vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 shrink-0">
            <h3 className="text-lg font-bold text-white">Payment Proof</h3>
            <div className="flex items-center gap-2">
              <a 
                href={receiptUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 text-primary-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </a>
              <button
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 bg-black/20 p-4 overflow-hidden flex items-center justify-center">
            {/* We use an iframe so it can natively render PDFs and Images seamlessly */}
            <iframe 
              src={receiptUrl} 
              className="w-full h-full rounded-xl bg-white"
              title="Payment Proof"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
