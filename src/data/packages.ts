import type { Package } from "@/types";

export const packages: Package[] = [
  // Free Fire
  { id: "ff-100", gameId: "free-fire", amount: "100", bonus: "+10", price: 0.99, currency: "Diamonds", popular: false },
  { id: "ff-310", gameId: "free-fire", amount: "310", bonus: "+31", price: 2.99, currency: "Diamonds", popular: false },
  { id: "ff-520", gameId: "free-fire", amount: "520", bonus: "+52", price: 4.99, currency: "Diamonds", popular: true, label: "Best Value" },
  { id: "ff-1060", gameId: "free-fire", amount: "1060", bonus: "+106", price: 9.99, currency: "Diamonds", popular: false },
  { id: "ff-2180", gameId: "free-fire", amount: "2180", bonus: "+218", price: 19.99, currency: "Diamonds", popular: false },
  { id: "ff-5600", gameId: "free-fire", amount: "5600", bonus: "+560", price: 49.99, currency: "Diamonds", popular: false, label: "Whale Pack" },

  // PUBG Mobile
  { id: "pubg-60", gameId: "pubg-mobile", amount: "60", bonus: "+6", price: 0.99, currency: "UC", popular: false },
  { id: "pubg-180", gameId: "pubg-mobile", amount: "180", bonus: "+18", price: 2.99, currency: "UC", popular: false },
  { id: "pubg-325", gameId: "pubg-mobile", amount: "325", bonus: "+32", price: 4.99, currency: "UC", popular: true, label: "Popular" },
  { id: "pubg-660", gameId: "pubg-mobile", amount: "660", bonus: "+66", price: 9.99, currency: "UC", popular: false },
  { id: "pubg-1800", gameId: "pubg-mobile", amount: "1800", bonus: "+180", price: 24.99, currency: "UC", popular: false },
  { id: "pubg-3850", gameId: "pubg-mobile", amount: "3850", bonus: "+385", price: 49.99, currency: "UC", popular: false, label: "Top Up" },

  // Mobile Legends
  { id: "ml-86", gameId: "mobile-legends", amount: "86", bonus: "+8", price: 0.99, currency: "Diamonds", popular: false },
  { id: "ml-172", gameId: "mobile-legends", amount: "172", bonus: "+17", price: 1.99, currency: "Diamonds", popular: false },
  { id: "ml-257", gameId: "mobile-legends", amount: "257", bonus: "+25", price: 2.99, currency: "Diamonds", popular: false },
  { id: "ml-706", gameId: "mobile-legends", amount: "706", bonus: "+70", price: 7.99, currency: "Diamonds", popular: true, label: "Best Value" },
  { id: "ml-2195", gameId: "mobile-legends", amount: "2195", bonus: "+219", price: 24.99, currency: "Diamonds", popular: false },
  { id: "ml-5532", gameId: "mobile-legends", amount: "5532", bonus: "+553", price: 59.99, currency: "Diamonds", popular: false },

  // Valorant
  { id: "val-475", gameId: "valorant", amount: "475", bonus: "", price: 4.99, currency: "VP", popular: false },
  { id: "val-1000", gameId: "valorant", amount: "1000", bonus: "+50", price: 9.99, currency: "VP", popular: false },
  { id: "val-2050", gameId: "valorant", amount: "2050", bonus: "+150", price: 19.99, currency: "VP", popular: true, label: "Most Popular" },
  { id: "val-3650", gameId: "valorant", amount: "3650", bonus: "+350", price: 34.99, currency: "VP", popular: false },
  { id: "val-5350", gameId: "valorant", amount: "5350", bonus: "+650", price: 49.99, currency: "VP", popular: false },
  { id: "val-11000", gameId: "valorant", amount: "11000", bonus: "+1500", price: 99.99, currency: "VP", popular: false, label: "Mega Pack" },

  // Genshin Impact
  { id: "gi-60", gameId: "genshin-impact", amount: "60", bonus: "", price: 0.99, currency: "Crystals", popular: false },
  { id: "gi-300", gameId: "genshin-impact", amount: "300", bonus: "+30", price: 4.99, currency: "Crystals", popular: false },
  { id: "gi-980", gameId: "genshin-impact", amount: "980", bonus: "+110", price: 14.99, currency: "Crystals", popular: true, label: "Popular" },
  { id: "gi-1980", gameId: "genshin-impact", amount: "1980", bonus: "+260", price: 29.99, currency: "Crystals", popular: false },
  { id: "gi-3280", gameId: "genshin-impact", amount: "3280", bonus: "+600", price: 49.99, currency: "Crystals", popular: false },
  { id: "gi-6480", gameId: "genshin-impact", amount: "6480", bonus: "+1600", price: 99.99, currency: "Crystals", popular: false },

  // Steam
  { id: "steam-5", gameId: "steam", amount: "$5", bonus: "", price: 5.00, currency: "USD", popular: false },
  { id: "steam-10", gameId: "steam", amount: "$10", bonus: "", price: 10.00, currency: "USD", popular: false },
  { id: "steam-20", gameId: "steam", amount: "$20", bonus: "", price: 20.00, currency: "USD", popular: true, label: "Popular" },
  { id: "steam-50", gameId: "steam", amount: "$50", bonus: "", price: 50.00, currency: "USD", popular: false },
  { id: "steam-100", gameId: "steam", amount: "$100", bonus: "", price: 100.00, currency: "USD", popular: false },
];

export const getPackagesByGame = (gameId: string) =>
  packages.filter((p) => p.gameId === gameId);
