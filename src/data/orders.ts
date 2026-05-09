import type { Order } from "@/types";

export const orders: Order[] = [
  { id: "ORD-1001", userId: "user-1", gameId: "free-fire", gameName: "Free Fire", packageId: "ff-520", packageLabel: "520 Diamonds", playerId: "FF123456789", amount: 4.99, status: "Completed", paymentMethod: "Khalti", createdAt: "2026-05-08T10:22:00Z" },
  { id: "ORD-1002", userId: "user-1", gameId: "pubg-mobile", gameName: "PUBG Mobile", packageId: "pubg-325", packageLabel: "325 UC", playerId: "PUBG987654321", amount: 4.99, status: "Completed", paymentMethod: "eSewa", createdAt: "2026-05-07T14:05:00Z" },
  { id: "ORD-1003", userId: "user-1", gameId: "valorant", gameName: "Valorant", packageId: "val-2050", packageLabel: "2050 VP", playerId: "Alex#0001", amount: 19.99, status: "Pending", paymentMethod: "PayPal", createdAt: "2026-05-08T18:45:00Z" },
  { id: "ORD-1004", userId: "user-1", gameId: "mobile-legends", gameName: "Mobile Legends", packageId: "ml-706", packageLabel: "706 Diamonds", playerId: "ML11223344", amount: 7.99, status: "Failed", paymentMethod: "Stripe", createdAt: "2026-05-06T09:12:00Z" },
  { id: "ORD-1005", userId: "user-1", gameId: "genshin-impact", gameName: "Genshin Impact", packageId: "gi-980", packageLabel: "980 Crystals", playerId: "GI700123456", amount: 14.99, status: "Completed", paymentMethod: "Khalti", createdAt: "2026-05-05T20:30:00Z" },
  { id: "ORD-1006", userId: "user-2", gameId: "free-fire", gameName: "Free Fire", packageId: "ff-1060", packageLabel: "1060 Diamonds", playerId: "FF998877665", amount: 9.99, status: "Completed", paymentMethod: "eSewa", createdAt: "2026-05-04T11:00:00Z" },
  { id: "ORD-1007", userId: "user-2", gameId: "steam", gameName: "Steam Wallet", packageId: "steam-20", packageLabel: "$20 Wallet", playerId: "steam_user01", amount: 20.00, status: "Completed", paymentMethod: "Stripe", createdAt: "2026-05-03T16:20:00Z" },
  { id: "ORD-1008", userId: "user-3", gameId: "valorant", gameName: "Valorant", packageId: "val-1000", packageLabel: "1000 VP", playerId: "Pro#9999", amount: 9.99, status: "Pending", paymentMethod: "PayPal", createdAt: "2026-05-08T22:10:00Z" },
  { id: "ORD-1009", userId: "user-3", gameId: "pubg-mobile", gameName: "PUBG Mobile", packageId: "pubg-660", packageLabel: "660 UC", playerId: "KING00112233", amount: 9.99, status: "Failed", paymentMethod: "Khalti", createdAt: "2026-05-02T08:50:00Z" },
  { id: "ORD-1010", userId: "user-1", gameId: "mobile-legends", gameName: "Mobile Legends", packageId: "ml-2195", packageLabel: "2195 Diamonds", playerId: "ML11223344", amount: 24.99, status: "Completed", paymentMethod: "Stripe", createdAt: "2026-05-01T13:30:00Z" },
];
