"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";

// ────────────────────────────────────────────────────────────────────
// 🔧  CONFIGURATION – change only this number to your WhatsApp number
//     Format: country code + number, no spaces / dashes / "+" sign
//     Example: Nepal (+977) → "9779812345678"
// ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "9779829534853"; // ← Updated with user number
const WHATSAPP_MESSAGE = "Hello! I'm interested in a game top-up. Can you help me?";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide WhatsApp button on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Tooltip / speech bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-2xl max-w-[200px] text-center"
          >
            Chat with us on WhatsApp!
            {/* tail */}
            <span className="absolute -bottom-2 right-5 w-4 h-4 bg-white rotate-45 shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        id="whatsapp-float-btn"
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
        className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.55)] focus:outline-none focus:ring-4 focus:ring-green-400/50"
        style={{ background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)" }}
      >
        {/* Ping animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-30 animate-ping" />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-8 h-8 fill-white relative z-10"
        >
          <path d="M24 4C12.95 4 4 12.95 4 24c0 3.74 1.02 7.24 2.8 10.24L4 44l10.08-2.64A19.87 19.87 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm0 36c-3.3 0-6.4-.9-9.08-2.48l-.64-.38-6.6 1.73 1.76-6.43-.42-.66A15.94 15.94 0 0 1 8 24c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16zm8.77-11.87c-.48-.24-2.84-1.4-3.28-1.56-.44-.16-.76-.24-1.08.24-.32.48-1.24 1.56-1.52 1.88-.28.32-.56.36-1.04.12-.48-.24-2.04-.75-3.88-2.4-1.44-1.28-2.4-2.86-2.68-3.34-.28-.48-.03-.74.21-.98.22-.22.48-.56.72-.84.24-.28.32-.48.48-.8.16-.32.08-.6-.04-.84-.12-.24-1.08-2.6-1.48-3.56-.38-.92-.78-.8-1.08-.82-.28-.02-.6-.02-.92-.02-.32 0-.84.12-1.28.6-.44.48-1.68 1.64-1.68 4s1.72 4.64 1.96 4.96c.24.32 3.38 5.16 8.2 7.24 1.14.5 2.04.8 2.74 1.02 1.15.36 2.2.31 3.02.19.92-.14 2.84-1.16 3.24-2.28.4-1.12.4-2.08.28-2.28-.12-.2-.44-.32-.92-.56z" />
        </svg>
      </motion.a>
    </div>
  );
}
