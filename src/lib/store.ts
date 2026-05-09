import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game, Package } from "@/types";
import type { User } from "@supabase/supabase-js";
import type { ProfileRow } from "./supabase/types";

interface CartState {
  selectedGame: Game | null;
  selectedPackage: Package | null;
  playerId: string;
  serverRegion: string;
  promoCode: string;
  promoDiscount: number;
  paymentMethod: string;
  setSelectedGame: (game: Game | null) => void;
  setSelectedPackage: (pkg: Package | null) => void;
  setPlayerId: (id: string) => void;
  setServerRegion: (region: string) => void;
  applyPromoCode: (code: string) => void;
  setPaymentMethod: (method: string) => void;
  clearCart: () => void;
}

const PROMO_CODES: Record<string, number> = {
  TOPUP10: 10,
  GAMER20: 20,
  NEWUSER: 15,
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      selectedGame: null,
      selectedPackage: null,
      playerId: "",
      serverRegion: "",
      promoCode: "",
      promoDiscount: 0,
      paymentMethod: "",
      setSelectedGame: (game) => set({ selectedGame: game }),
      setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
      setPlayerId: (id) => set({ playerId: id }),
      setServerRegion: (region) => set({ serverRegion: region }),
      applyPromoCode: (code) => {
        const discount = PROMO_CODES[code.toUpperCase()] ?? 0;
        set({ promoCode: code, promoDiscount: discount });
      },
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      clearCart: () =>
        set({
          selectedGame: null,
          selectedPackage: null,
          playerId: "",
          serverRegion: "",
          promoCode: "",
          promoDiscount: 0,
          paymentMethod: "",
        }),
    }),
    { name: "topup-cart" }
  )
);


interface AuthState {
  user: User | null;
  profile: ProfileRow | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: ProfileRow | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ user: null, profile: null }),
}));
