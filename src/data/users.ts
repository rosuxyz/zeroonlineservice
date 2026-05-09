import type { User } from "@/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    email: "alex.chen@email.com",
    avatar: "AC",
    role: "user",
    joinedAt: "2025-01-15T08:00:00Z",
    totalSpent: 72.95,
    totalOrders: 5,
  },
  {
    id: "user-2",
    name: "Sarah Jenkins",
    email: "sarah.j@email.com",
    avatar: "SJ",
    role: "user",
    joinedAt: "2025-03-22T10:00:00Z",
    totalSpent: 29.99,
    totalOrders: 2,
  },
  {
    id: "user-3",
    name: "Marcus Rossi",
    email: "marcus.r@email.com",
    avatar: "MR",
    role: "user",
    joinedAt: "2025-06-10T14:00:00Z",
    totalSpent: 19.98,
    totalOrders: 2,
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@topuphub.com",
    avatar: "AD",
    role: "admin",
    joinedAt: "2024-01-01T00:00:00Z",
    totalSpent: 0,
    totalOrders: 0,
  },
];

export const currentUser = users[0];
export const adminUser = users[3];

export const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1900 },
  { month: "Mar", revenue: 1400 },
  { month: "Apr", revenue: 2800 },
  { month: "May", revenue: 3200 },
  { month: "Jun", revenue: 2600 },
  { month: "Jul", revenue: 3900 },
  { month: "Aug", revenue: 4200 },
];
