export type GameCategory = "battle-royale" | "moba" | "fps" | "rpg" | "other";

export interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: GameCategory;
  gradient: string;
  shadowColor: string;
  bgColor: string;
  accentColor: string;
  shortName: string;
  publisher: string;
  rating: number;
  players: string;
  featured: boolean;
  imageUrl?: string;
  bannerUrl?: string;
}

export interface Package {
  id: string;
  gameId: string;
  amount: string;
  bonus: string;
  price: number;
  currency: string;
  popular: boolean;
  label?: string;
}

export type OrderStatus = "Pending" | "Completed" | "Failed";

export interface Order {
  id: string;
  userId: string;
  gameId: string;
  gameName: string;
  packageId: string;
  packageLabel: string;
  playerId: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
  joinedAt: string;
  totalSpent: number;
  totalOrders: number;
}

export interface CartState {
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
  setPromoCode: (code: string) => void;
  applyPromoCode: (code: string) => void;
  setPaymentMethod: (method: string) => void;
  clearCart: () => void;
}
