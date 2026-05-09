"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { ShieldCheck, Tag, CheckCircle2, Gem, AlertCircle, UploadCloud, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { createOrder } from "@/lib/actions/orders";
import { getSiteSettings } from "@/lib/actions/admin";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const PAYMENT_METHODS = [
  { id: "khalti", name: "Khalti", description: "Nepal's digital wallet", color: "from-purple-600 to-purple-800", icon: "₨" },
  { id: "esewa", name: "eSewa", description: "Fastest digital payment", color: "from-green-600 to-emerald-700", icon: "₨" },
  { id: "paypal", name: "PayPal", description: "Global payment", color: "from-blue-500 to-blue-700", icon: "P" },
  { id: "stripe", name: "Stripe", description: "Credit & debit cards", color: "from-indigo-500 to-violet-600", icon: "S" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    selectedGame,
    selectedPackage,
    playerId,
    serverRegion,
    promoCode: storedPromo,
    promoDiscount,
    paymentMethod,
    applyPromoCode,
    setPaymentMethod,
    clearCart,
  } = useCartStore();

  const [promo, setPromo] = useState(storedPromo);
  const [promoApplied, setPromoApplied] = useState(!!storedPromo && promoDiscount > 0);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [qrUrls, setQrUrls] = useState<{ esewa_url: string; khalti_url: string }>({ esewa_url: "", khalti_url: "" });

  // Load QR URLs set by admin from site_settings
  useEffect(() => {
    getSiteSettings("qr_codes").then((data) => {
      if (data) setQrUrls(data);
    });
  }, []);

  const basePrice = selectedPackage?.price ?? 0;
  const discount = promoApplied ? (basePrice * promoDiscount) / 100 : 0;
  const total = basePrice - discount;

  // PDF receipt is required for every payment method
  const requiresReceipt = !!paymentMethod;

  const handleApplyPromo = () => {
    applyPromoCode(promo);
    // simulate checking
    const validCodes = ["TOPUP10", "GAMER20", "NEWUSER"];
    if (validCodes.includes(promo.toUpperCase())) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Try: TOPUP10, GAMER20, NEWUSER");
    }
  };

  const handleCompletePurchase = async () => {
    if (!paymentMethod || !selectedGame || !selectedPackage) return;

    if (!receiptFile) {
      alert("Please upload your payment receipt (PDF) before placing the order.");
      return;
    }

    if (receiptFile.type !== "application/pdf") {
      alert("Only PDF files are accepted as payment proof.");
      return;
    }

    setLoading(true);
    try {
      let receiptUrl = "";

      // Upload PDF receipt — required for all payment methods
      const supabase = getSupabaseBrowserClient();
      const fileName = `receipt-${Date.now()}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, receiptFile, { contentType: "application/pdf" });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload receipt PDF. Please make sure the 'receipts' storage bucket exists and is public.");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      receiptUrl = publicUrlData.publicUrl;

      await createOrder({
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        packageId: selectedPackage.id,
        packageLabel: `${selectedPackage.amount} ${selectedPackage.currency}`,
        playerId: playerId,
        serverRegion: serverRegion,
        amount: total,
        discount: discount,
        promoCode: promoApplied ? promo : "",
        paymentMethod: paymentMethod,
        receiptUrl: receiptUrl,
      });
      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center px-6 py-12 max-w-md"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Order Placed!</h2>
            <p className="text-gray-400 mb-2">Your top-up for <span className="text-white font-semibold">{selectedGame?.name}</span> is being processed.</p>
            <p className="text-gray-500 text-sm mb-8">Player ID: <span className="text-primary-400 font-mono">{playerId}</span></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" onClick={() => { clearCart(); router.push("/orders"); }}>View Orders</Button>
              <Button variant="outline" onClick={() => { clearCart(); router.push("/games"); }}>Top Up Again</Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-8 sm:mb-10">
            Checkout
          </h1>

          {!selectedPackage ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No package selected. Please choose a game and package first.</p>
              <Button variant="primary" onClick={() => router.push("/games")}>Browse Games</Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Payment Selection */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Order Info */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-primary-400" /> Order Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 mb-1">Game</p>
                      <p className="text-white font-bold text-lg">{selectedGame?.name}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 mb-1">Package</p>
                      <p className="text-white font-bold text-lg">{selectedPackage.amount} {selectedPackage.currency}</p>
                      {selectedPackage.bonus && <p className="text-emerald-400 text-xs mt-0.5">+{selectedPackage.bonus} Bonus</p>}
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 mb-1">Player ID</p>
                      <p className="text-white font-mono">{playerId || "—"}</p>
                    </div>
                    {serverRegion && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-gray-400 mb-1">Server Region</p>
                        <p className="text-white font-mono">{serverRegion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-5">Select Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => { setPaymentMethod(pm.id); setReceiptFile(null); }}
                        aria-pressed={paymentMethod === pm.id}
                        aria-label={`Pay with ${pm.name}`}
                        className={cn(
                          "relative rounded-2xl p-4 sm:p-5 text-left border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                          paymentMethod === pm.id
                            ? "border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
                            : "border-white/10 bg-white/5 hover:border-primary-500/40 hover:bg-white/8"
                        )}
                      >
                        {paymentMethod === pm.id && (
                          <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary-400" aria-hidden="true" />
                        )}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${pm.color} flex items-center justify-center text-white text-lg sm:text-xl font-black mb-3`} aria-hidden="true">
                          {pm.icon}
                        </div>
                        <p className="text-white font-bold text-sm sm:text-base">{pm.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{pm.description}</p>
                      </button>
                    ))}
                  </div>

                  {/* PDF Receipt Upload — required for ALL payment methods */}
                  {paymentMethod && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-white/10 pt-6"
                    >
                      {/* QR code for local payment methods */}
                      {(paymentMethod === "esewa" || paymentMethod === "khalti") && (
                        <>
                          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-primary-400" />
                            Scan to Pay with {paymentMethod === "esewa" ? "eSewa" : "Khalti"}
                          </h4>

                          {/* ── QR CODE PLACEHOLDER ──────────────────────────────────────
                               Replace the src below with your actual QR PNG path.
                               eSewa  → src="/qr-esewa.png"
                               Khalti → src="/qr-khalti.png"
                               Put the PNG files inside the  /public  folder.
                          ─────────────────────────────────────────────────────────────── */}
                          <div className="bg-white p-3 rounded-2xl w-max mb-4 relative">
                            {(() => {
                              const qrSrc = paymentMethod === "esewa" ? qrUrls.esewa_url : qrUrls.khalti_url;
                              return qrSrc ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={qrSrc}
                                  alt={`${paymentMethod === "esewa" ? "eSewa" : "Khalti"} QR Code`}
                                  className="w-36 h-36 object-contain"
                                />
                              ) : (
                                <div className="w-36 h-36 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl">
                                  <QrCode className="w-10 h-10 text-gray-400" />
                                  <span className="text-[10px] text-gray-500 text-center px-2 leading-tight">
                                    QR not set by admin yet
                                  </span>
                                </div>
                              );
                            })()}
                          </div>

                          <p className="text-sm text-gray-300 mb-4">
                            Scan and pay exactly{" "}
                            <strong className="text-emerald-400 font-mono">${total.toFixed(2)}</strong>.
                            Then upload your receipt PDF below.
                          </p>
                        </>
                      )}

                      {/* PDF Upload */}
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-primary-400" />
                        Upload Payment Receipt
                        <span className="text-red-400 text-xs font-normal ml-1">(PDF required)</span>
                      </h4>
                      <label className="block w-full">
                        <span className="sr-only">Choose PDF receipt</span>
                        <div className={cn(
                          "w-full flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
                          receiptFile
                            ? "border-emerald-500/60 bg-emerald-500/5"
                            : "border-white/20 bg-white/5 hover:border-primary-500/50 hover:bg-white/10"
                        )}>
                          {receiptFile ? (
                            <>
                              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                              <span className="text-sm text-emerald-400 font-semibold text-center truncate w-full px-4">
                                {receiptFile.name}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">Click to replace</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                              <span className="text-sm text-white font-semibold">Click to upload PDF receipt</span>
                              <span className="text-xs text-gray-500 mt-1">PDF format only · Max 10 MB</span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file && file.type !== "application/pdf") {
                                alert("Only PDF files are accepted.");
                                return;
                              }
                              setReceiptFile(file);
                            }}
                          />
                        </div>
                      </label>
                      {!receiptFile && (
                        <p className="text-xs text-yellow-400/80 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          You must upload a PDF receipt to complete your order.
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="flex flex-col gap-4">
                <div className="glass-card rounded-2xl p-6 border border-white/10 sticky top-24">
                  <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>
                  <div className="flex flex-col gap-3 text-sm mb-5">
                    <div className="flex justify-between text-gray-400">
                      <span>Package</span>
                      <span className="text-white">${basePrice.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Promo ({promoDiscount}% off)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2">
                      <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                      <label htmlFor="promo-code">Promo Code</label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        id="promo-code"
                        type="text"
                        value={promo}
                        onChange={(e) => { setPromo(e.target.value.toUpperCase()); setPromoApplied(false); setPromoError(""); }}
                        placeholder="e.g. TOPUP10"
                        aria-describedby={promoError ? "promo-error" : promoApplied ? "promo-success" : undefined}
                        className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder-gray-600"
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyPromo} type="button">Apply</Button>
                    </div>
                    {promoApplied && <p id="promo-success" className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1" role="status"><CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Promo applied!</p>}
                    {promoError && <p id="promo-error" className="text-red-400 text-xs mt-1.5" role="alert">{promoError}</p>}
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!paymentMethod || !receiptFile}
                    onClick={handleCompletePurchase}
                  >
                    Complete Purchase
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
