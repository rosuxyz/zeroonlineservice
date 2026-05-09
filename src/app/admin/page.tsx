"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OrderTable } from "@/components/ui/OrderTable";
import { StatsCard } from "@/components/ui/StatsCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { UserList } from "@/components/admin/UserList";
import { useAuthStore } from "@/lib/store";
import { getDashboardStats, getAllOrders, getAllGames, upsertPackage, getPackagesByGameId, upsertGame, getSiteSettings, updateSiteSettings, deletePackage, deleteGame, getAllUsers } from "@/lib/actions/admin";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, ShoppingBag, Package, Users as UsersIcon, Settings,
  BarChart2, DollarSign, TrendingUp, PlusCircle,
  Pencil, Trash2, Menu, Gem, AlertCircle, ArrowLeft, UploadCloud, QrCode, CheckCircle2,
  ShieldCheck, Eye, EyeOff, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for Recharts — prevents SSR hydration errors
const RevenueChart = dynamic(() => import("@/components/admin/RevenueChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const sidebarLinks = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "users", label: "Users", icon: UsersIcon },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

interface PackageFormData {
  id?: string;
  game: string;
  amount: string;
  bonus: string;
  price: string;
  currency: string;
  popular: boolean;
}

interface GameFormData {
  id?: string;
  name: string;
  short_name: string;
  category: string;
  publisher: string;
  rating: string;
  active: boolean;
  gradient?: string;
  image_url?: string;
  banner_url?: string;
}

const defaultForm: PackageFormData = {
  game: "",
  amount: "",
  bonus: "",
  price: "",
  currency: "Diamonds",
  popular: false,
};

const defaultGameForm: GameFormData = {
  name: "",
  short_name: "",
  category: "Action",
  publisher: "",
  rating: "4.5",
  active: true,
  image_url: "",
  banner_url: "",
};

// Separate stats component to prevent JSX-in-array hydration issues
function AdminStats({ stats }: { stats: any }) {
  if (!stats) return null;

  const statsData = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5" aria-hidden="true" />,
      change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
      positive: stats.revenueChange >= 0,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag className="w-5 h-5" aria-hidden="true" />,
      change: `+${stats.ordersChange}`,
      positive: true,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <UsersIcon className="w-5 h-5" aria-hidden="true" />,
      change: `+${stats.usersChange}`,
      positive: true,
    },
    {
      title: "Games Listed",
      value: stats.gamesListed,
      icon: <Package className="w-5 h-5" aria-hidden="true" />,
      change: `+${stats.gamesChange}`,
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsData.map((s, i) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <StatsCard
            title={s.title}
            value={s.value}
            icon={s.icon}
            change={s.change}
            positive={s.positive}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<PackageFormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuthStore();

  // ── Admin login modal state ──
  const [adminUnlocked, setAdminUnlocked] = useState(false); // always false on page load
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [gamesList, setGamesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [gamePackages, setGamePackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [gameForm, setGameForm] = useState<GameFormData>(defaultGameForm);
  const [siteSettings, setSiteSettings] = useState<any>({ hero: { title: "", subtitle: "" } });
  const [qrSettings, setQrSettings] = useState<{ esewa_url: string; khalti_url: string }>({ esewa_url: "", khalti_url: "" });
  const [qrUploading, setQrUploading] = useState<{ esewa: boolean; khalti: boolean }>({ esewa: false, khalti: false });
  const [revenuePeriod, setRevenuePeriod] = useState(8);

  const filteredOrders = orders.filter(
    (o) =>
      o.game_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Real-time Revenue Data Calculation ──────────────────────────
  const calculatedRevenueData = useMemo(() => {
    const months = [...Array(revenuePeriod)].map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: d.toLocaleDateString("en-US", { month: "short" }),
        key: `${d.getFullYear()}-${d.getMonth() + 1}`,
        revenue: 0
      };
    }).reverse();

    orders.filter(o => o.status === "completed").forEach(order => {
      const d = new Date(order.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const dataPoint = months.find(p => p.key === key);
      if (dataPoint) {
        dataPoint.revenue += order.amount;
      }
    });

    return months;
  }, [orders, revenuePeriod]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [s, o, g, h, qr, u] = await Promise.all([
          getDashboardStats(),
          getAllOrders(),
          getAllGames(),
          getSiteSettings("hero"),
          getSiteSettings("qr_codes"),
          getAllUsers(),
        ]);
        
        console.log("Admin Data Loaded:", { stats: s, ordersCount: o?.length, usersCount: u?.length });
        
        setStats(s);
        setOrders(o || []);
        setGamesList(g || []);
        setUsersList(u || []);
        if (h) setSiteSettings((prev: any) => ({ ...prev, hero: h }));
        if (qr) setQrSettings(qr as { esewa_url: string; khalti_url: string });
      } catch (error) {
        console.error("Admin Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // ── Admin login handler ─────────────────────────────────────────
  // Always verifies credentials fresh — never trusts an existing public session.
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (authError) { setAdminLoginError("Invalid email or password."); return; }
      if (authData.user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();
        if (p?.role !== "admin") {
          await supabase.auth.signOut();
          setAdminLoginError("Access Denied: This account does not have administrator privileges.");
          return;
        }
        // Unlock the panel in local state — no reload needed
        setAdminUnlocked(true);
      }
    } catch (err: any) {
      setAdminLoginError(err.message || "Login failed.");
    } finally {
      setAdminLoginLoading(false);
    }
  };

  // ── Gate: ALWAYS require password — ignore any existing public session ──
  if (!adminUnlocked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-secondary-500/10 rounded-full blur-[130px]" />
          <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[130px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="relative rounded-[2.5rem] border border-white/8 bg-white/[0.025] shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-10 overflow-hidden backdrop-blur-xl">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary-500 to-transparent opacity-60" />

            {/* Icon */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary-500 to-purple-700 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.35)] mb-6">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Admin Access</h1>
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-2">
                Zero topuphub · Restricted Area
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {adminLoginError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 font-medium leading-relaxed">{adminLoginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Email</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={adminEmail}
                  onChange={(e) => { setAdminEmail(e.target.value); setAdminLoginError(null); }}
                  placeholder="admin@topuphub.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-secondary-500/50 focus:ring-1 focus:ring-secondary-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setAdminLoginError(null); }}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-secondary-500/50 focus:ring-1 focus:ring-secondary-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={adminLoginLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full py-4 rounded-2xl bg-gradient-to-r from-secondary-500 to-purple-700 text-white font-bold text-sm shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_10px_40px_rgba(168,85,247,0.5)] transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {adminLoginLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Authenticate Access
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer note */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">System Secure · All access logged</span>
              </div>
              <p className="text-[10px] text-gray-700 text-center max-w-xs leading-relaxed">
                Credentials are managed exclusively through the database. Contact your system administrator for access.
              </p>
            </div>
          </div>

          <p className="text-center mt-6 text-gray-700 text-[10px] font-medium tracking-wide uppercase">
            Authorized Personnel Only
          </p>
        </motion.div>
      </div>
    );
  }

  const handleSelectGame = async (gameId: string | null) => {
    setSelectedGameId(gameId);
    if (gameId) {
      setLoading(true);
      const pkgs = await getPackagesByGameId(gameId);
      setGamePackages(pkgs);
      setLoading(false);
    }
  };

  const handleSavePackage = async () => {
    try {
      setLoading(true);
      await upsertPackage({
        id: editMode ? form.id : `${form.game}-${Date.now()}`,
        game_id: form.game,
        amount: form.amount,
        bonus: form.bonus,
        price: parseFloat(form.price),
        currency: form.currency,
        popular: form.popular,
      });
      
      if (selectedGameId) {
        const pkgs = await getPackagesByGameId(selectedGameId);
        setGamePackages(pkgs);
      }
      
      setPackageModalOpen(false);
      setForm(defaultForm);
      setEditMode(false);
      alert("Package saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      setLoading(true);
      await deletePackage(id);
      if (selectedGameId) {
        const pkgs = await getPackagesByGameId(selectedGameId);
        setGamePackages(pkgs);
      }
    } catch (err) {
      alert("Failed to delete package");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game? This will also delete all its packages!")) return;
    try {
      setLoading(true);
      await deleteGame(id);
      const games = await getAllGames();
      setGamesList(games);
    } catch (err) {
      alert("Failed to delete game");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGame = async () => {
    try {
      setLoading(true);
      await upsertGame({
        ...gameForm,
        id: editMode ? gameForm.id : gameForm.name.toLowerCase().replace(/\s+/g, "-"),
      });
      
      const g = await getAllGames();
      setGamesList(g);
      
      setGameModalOpen(false);
      setGameForm(defaultGameForm);
      setEditMode(false);
      alert("Game saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save game");
    } finally {
      setLoading(false);
    }
  };

  const handleGameImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image_url" | "banner_url") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();
      const fileName = `game-${field}-${Date.now()}.${file.name.split(".").pop()}`;
      const { error: upErr } = await supabase.storage
        .from("receipts") // Reusing receipts bucket or you can use a 'games' bucket if it exists
        .upload(fileName, file, { upsert: true });
      
      if (upErr) throw upErr;
      
      const { data: pub } = supabase.storage.from("receipts").getPublicUrl(fileName);
      setGameForm(prev => ({ ...prev, [field]: pub.publicUrl }));
    } catch (err: any) {
      alert("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#0a0a0c] border-r border-white/8 z-40 flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Admin navigation"
      >
        <div className="p-5 border-b border-white/8 shrink-0">
          <Link href="/" className="flex items-center gap-2" aria-label="Go to site home">
            <Gem className="w-6 h-6 text-secondary-500" aria-hidden="true" />
            <span className="text-lg font-bold text-white">
              Admin<span className="text-secondary-500">Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto" aria-label="Admin sidebar">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-secondary-500/12 text-secondary-400 border border-secondary-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/8 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary-500 to-purple-800 flex items-center justify-center text-white font-bold text-sm shrink-0"
              aria-hidden="true"
            >
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile?.full_name || "Admin User"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-white/8 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/8 transition-colors"
              aria-label="Open admin sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-none">
                Admin Overview
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Zero topuphub Control Panel</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setPackageModalOpen(true)}>
            <PlusCircle className="w-4 h-4" aria-hidden="true" /> Add Package
          </Button>
        </header>

        <main className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 sm:gap-8">
              <AdminStats stats={stats} />
              
              {/* Charts and Activity Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                {/* Revenue Chart - Takes 2 columns */}
                <section
                  aria-labelledby="revenue-heading"
                  className="xl:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-white/8"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      id="revenue-heading"
                      className="text-base sm:text-lg font-bold text-white flex items-center gap-2"
                    >
                      <TrendingUp className="w-5 h-5 text-primary-400" aria-hidden="true" />
                      Revenue Analytics
                    </h2>
                    <select
                      value={revenuePeriod}
                      onChange={(e) => setRevenuePeriod(Number(e.target.value))}
                      className="text-[11px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-secondary-500/50 transition-all cursor-pointer"
                    >
                      <option value={3}>Last 3 Months</option>
                      <option value={6}>Last 6 Months</option>
                      <option value={8}>Last 8 Months</option>
                      <option value={12}>Last 12 Months</option>
                    </select>
                  </div>
                  {/* Recharts loaded client-side only */}
                  <RevenueChart data={calculatedRevenueData} />
                </section>

                {/* Live Activity - Takes 1 column */}
                <section className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 h-[400px] xl:h-auto overflow-hidden">
                  <ActivityLog 
                    orders={orders} 
                    onViewLogs={() => setActiveTab("orders")}
                  />
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              {!selectedGameId ? (
                /* Game Management View */
                <section className="glass-card rounded-2xl p-6 border border-white/8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Game Management</h2>
                      <p className="text-xs text-gray-400 mt-1">Manage active games and their categories</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setGameModalOpen(true)}>
                      <PlusCircle className="w-4 h-4" /> Add Game
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                          <th className="text-left px-4 py-3">Game</th>
                          <th className="text-left px-4 py-3">Category</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-right px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {gamesList.map((game) => (
                          <tr key={game.id} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-8 h-8 rounded bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white", game.gradient || "from-gray-700 to-gray-800")}>
                                  {game.short_name}
                                </div>
                                <span className="text-white font-medium">{game.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-400 capitalize">{game.category}</td>
                            <td className="px-4 py-3">
                              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", game.active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                                {game.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleSelectGame(game.id)}
                                  className="text-xs font-bold text-primary-400 hover:underline px-2 py-1"
                                >
                                  Packages
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditMode(true);
                                    setGameForm(game);
                                    setGameModalOpen(true);
                                  }}
                                  className="p-1.5 hover:bg-white/5 rounded text-gray-400"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteGame(game.id)}
                                  className="p-1.5 hover:bg-red-500/10 rounded text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : (
                /* Package Management View */
                <section className="glass-card rounded-2xl p-6 border border-white/8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleSelectGame(null)}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {gamesList.find(g => g.id === selectedGameId)?.name} Packages
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Manage top-up amounts and prices</p>
                      </div>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => { 
                      setEditMode(false); 
                      setForm({...defaultForm, game: selectedGameId!}); 
                      setPackageModalOpen(true); 
                    }}>
                      <PlusCircle className="w-4 h-4" /> Add Package
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                          <th className="text-left px-4 py-3">Amount</th>
                          <th className="text-left px-4 py-3">Price</th>
                          <th className="text-left px-4 py-3">Popular</th>
                          <th className="text-right px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {gamePackages.length === 0 ? (
                          <tr><td colSpan={4} className="py-10 text-center text-gray-500">No packages found for this game.</td></tr>
                        ) : gamePackages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3">
                              <span className="text-white font-bold">{pkg.amount} {pkg.currency}</span>
                              {pkg.bonus && <span className="text-emerald-400 text-[10px] ml-2">{pkg.bonus} Bonus</span>}
                            </td>
                            <td className="px-4 py-3 text-primary-400 font-mono font-bold">${pkg.price}</td>
                            <td className="px-4 py-3">
                              {pkg.popular && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">Popular</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setEditMode(true);
                                    setForm(pkg);
                                    setPackageModalOpen(true);
                                  }}
                                  className="p-1.5 hover:bg-white/5 rounded text-gray-400"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="p-1.5 hover:bg-red-500/10 rounded text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <section aria-labelledby="all-orders-heading">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <h2 id="all-orders-heading" className="text-base sm:text-lg font-bold text-white">
                    All Orders
                  </h2>
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search orders..."
                    className="sm:max-w-xs"
                  />
                </div>
                <OrderTable orders={filteredOrders} showUser editable />
              </section>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AnalyticsDashboard orders={orders} />
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <UserList users={usersList} />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <section className="glass-card rounded-2xl p-6 border border-white/8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Site Customization</h2>
                    <p className="text-xs text-gray-400 mt-1">Make your frontend flexible and unique</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-secondary-400" /> Hero Section
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5 ml-1">Hero Title</label>
                        <input
                          type="text"
                          value={siteSettings.hero.title}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero: { ...siteSettings.hero, title: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5 ml-1">Hero Subtitle</label>
                        <textarea
                          value={siteSettings.hero.subtitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero: { ...siteSettings.hero, subtitle: e.target.value } })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500/50 resize-none"
                        />
                      </div>
                    </div>

                    <Button 
                      variant="primary" 
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await updateSiteSettings("hero", siteSettings.hero);
                          alert("Site settings updated successfully!");
                        } catch (err) {
                          alert("Failed to update settings");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Apply Changes
                    </Button>
                  </div>

                  <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Live Preview</h3>
                    <div className="aspect-video bg-background rounded-xl border border-white/10 p-6 flex flex-col justify-center text-center">
                      <h4 className="text-xl font-black text-white mb-2 leading-tight">
                        {siteSettings.hero.title || "Your Hero Title"}
                      </h4>
                      <p className="text-[10px] text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                        {siteSettings.hero.subtitle || "Your catchy subtitle goes here..."}
                      </p>
                      <div className="mt-4 flex gap-2 justify-center">
                        <div className="w-12 h-4 bg-primary-500 rounded-full" />
                        <div className="w-12 h-4 bg-white/10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Payment QR Codes ─────────────────────────────── */}
              <section className="glass-card rounded-2xl p-6 border border-white/8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Payment QR Codes</h2>
                    <p className="text-xs text-gray-400 mt-1">Upload your eSewa &amp; Khalti QR code images (PNG). Only admins can change these.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(["esewa", "khalti"] as const).map((method) => {
                    const label = method === "esewa" ? "eSewa" : "Khalti";
                    const urlKey = `${method}_url` as "esewa_url" | "khalti_url";
                    const currentUrl = qrSettings[urlKey];
                    const isUploading = qrUploading[method];

                    return (
                      <div key={method} className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-white">{label} QR Code</p>

                        {/* Preview */}
                        {currentUrl ? (
                          <div className="bg-white p-3 rounded-xl w-max">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={currentUrl} alt={`${label} QR`} className="w-32 h-32 object-contain" />
                          </div>
                        ) : (
                          <div className="w-32 h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-xl">
                            <QrCode className="w-8 h-8 text-gray-500" />
                            <span className="text-[10px] text-gray-500">No QR set</span>
                          </div>
                        )}

                        {/* Upload */}
                        <label className="block w-full max-w-xs cursor-pointer">
                          <div className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                            isUploading
                              ? "border-primary-500/40 bg-primary-500/10 text-primary-400"
                              : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                          )}>
                            {isUploading ? (
                              <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UploadCloud className="w-4 h-4" />
                            )}
                            {isUploading ? "Uploading…" : currentUrl ? "Replace QR" : "Upload QR PNG"}
                          </div>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            disabled={isUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setQrUploading((prev) => ({ ...prev, [method]: true }));
                              try {
                                const supabase = getSupabaseBrowserClient();
                                const fileName = `qr-${method}-${Date.now()}.${file.name.split(".").pop()}`;
                                const { error: upErr } = await supabase.storage
                                  .from("receipts")
                                  .upload(fileName, file, { upsert: true });
                                if (upErr) throw upErr;
                                const { data: pub } = supabase.storage.from("receipts").getPublicUrl(fileName);
                                const newQr = { ...qrSettings, [urlKey]: pub.publicUrl };
                                await updateSiteSettings("qr_codes", newQr);
                                setQrSettings(newQr);
                                alert(`${label} QR updated successfully!`);
                              } catch (err: any) {
                                alert("Upload failed: " + (err.message || "Unknown error"));
                              } finally {
                                setQrUploading((prev) => ({ ...prev, [method]: false }));
                                e.target.value = "";
                              }
                            }}
                          />
                        </label>

                        {currentUrl && (
                          <button
                            className="text-xs text-red-400 hover:underline w-max"
                            onClick={async () => {
                              if (!confirm(`Remove ${label} QR code?`)) return;
                              const newQr = { ...qrSettings, [urlKey]: "" };
                              await updateSiteSettings("qr_codes", newQr);
                              setQrSettings(newQr);
                            }}
                          >
                            Remove QR
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}
        </main>
      </div>

      {/* Add/Edit Package Modal */}
      <Modal
        open={packageModalOpen}
        onClose={() => { setPackageModalOpen(false); setForm(defaultForm); setEditMode(false); }}
        title={editMode ? "Edit Package" : "Add New Package"}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSavePackage(); }}
          className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="modal-game" className="text-xs font-semibold text-gray-400 block mb-1.5">
              Game
            </label>
            <select
              id="modal-game"
              value={form.game}
              onChange={(e) => setForm((f) => ({ ...f, game: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
            >
              {gamesList.map((g) => (
                <option key={g.id} value={g.id} className="bg-[#18181b]">
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "modal-amount", label: "Amount", key: "amount", placeholder: "e.g. 520" },
              { id: "modal-bonus", label: "Bonus", key: "bonus", placeholder: "e.g. +52" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="text-xs font-semibold text-gray-400 block mb-1.5">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="text"
                  value={form[field.key as keyof PackageFormData] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-price" className="text-xs font-semibold text-gray-400 block mb-1.5">
                Price ($)
              </label>
              <input
                id="modal-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="4.99"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="modal-currency" className="text-xs font-semibold text-gray-400 block mb-1.5">
                Currency
              </label>
              <input
                id="modal-currency"
                type="text"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                placeholder="Diamonds"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="modal-popular"
              type="checkbox"
              checked={form.popular}
              onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))}
              className="w-4 h-4 accent-primary-500 cursor-pointer"
            />
            <label htmlFor="modal-popular" className="text-sm text-gray-300 cursor-pointer select-none">
              Mark as Popular
            </label>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => { setModalOpen(false); setForm(defaultForm); }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editMode ? "Save Changes" : "Add Package"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add/Edit Game Modal */}
      <Modal
        open={gameModalOpen}
        onClose={() => { setGameModalOpen(false); setGameForm(defaultGameForm); setEditMode(false); }}
        title={editMode ? "Edit Game" : "Add New Game"}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSaveGame(); }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">Game Name</label>
              <input
                type="text"
                value={gameForm.name}
                onChange={(e) => setGameForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. PUBG Mobile"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">Short Name</label>
              <input
                type="text"
                value={gameForm.short_name}
                onChange={(e) => setGameForm((f) => ({ ...f, short_name: e.target.value }))}
                placeholder="e.g. PUBG"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">Category</label>
              <input
                type="text"
                value={gameForm.category}
                onChange={(e) => setGameForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Battle Royale"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">Publisher</label>
              <input
                type="text"
                value={gameForm.publisher}
                onChange={(e) => setGameForm((f) => ({ ...f, publisher: e.target.value }))}
                placeholder="e.g. Tencent"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block">Game Logo (1:1)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  {gameForm.image_url ? (
                    <img src={gameForm.image_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Gem className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-all flex items-center gap-2">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Logo
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleGameImageUpload(e, "image_url")}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block">Game Banner (16:9)</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  {gameForm.banner_url ? (
                    <img src={gameForm.banner_url} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <LayoutDashboard className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-all flex items-center gap-2">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Banner
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleGameImageUpload(e, "banner_url")}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={gameForm.active}
              onChange={(e) => setGameForm((f) => ({ ...f, active: e.target.checked }))}
              className="w-4 h-4 accent-primary-500 cursor-pointer"
            />
            <label className="text-sm text-gray-300 cursor-pointer select-none">Active</label>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => { setGameModalOpen(false); setGameForm(defaultGameForm); }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" fullWidth>
              {editMode ? "Save Changes" : "Create Game"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete">
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" aria-hidden="true" />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Are you sure you want to delete{" "}
            <strong className="text-white">
              {gamesList.find((g) => g.id === deleteConfirm)?.name ?? "this game"}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" fullWidth onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={() => setDeleteConfirm(null)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
