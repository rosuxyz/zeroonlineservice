"use client";

import { useState } from "react";
import { 
  User, Mail, Calendar, Shield, ShieldAlert, 
  MoreVertical, ShoppingBag, DollarSign, Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateUserRole } from "@/lib/actions/admin";

interface UserListProps {
  users: any[];
}

export function UserList({ users }: UserListProps) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleToggle = async (user: any) => {
    if (!confirm(`Are you sure you want to change ${user.full_name}'s role to ${user.role === 'admin' ? 'user' : 'admin'}?`)) return;
    
    setLoadingId(user.id);
    try {
      await updateUserRole(user.id, user.role === "admin" ? "user" : "admin");
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {users.length} Total Registered Users
          </span>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((u) => (
          <div key={u.id} className="glass-card rounded-[2rem] border border-white/8 overflow-hidden group hover:border-primary-500/30 transition-all duration-300">
            {/* Header / Avatar Section */}
            <div className="p-6 pb-0 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight truncate max-w-[150px]">
                    {u.full_name || "New User"}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {u.role === "admin" ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-500/10 border border-secondary-500/20 text-[10px] font-black text-secondary-400 uppercase tracking-tighter">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                         User
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleRoleToggle(u)}
                disabled={loadingId === u.id}
                className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all disabled:opacity-50"
                title="Toggle Admin Role"
              >
                {loadingId === u.id ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldAlert className={cn("w-5 h-5", u.role === 'admin' ? 'text-secondary-400' : 'text-gray-600')} />
                )}
              </button>
            </div>

            {/* Contact Info */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-xs truncate">{u.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-xs">Joined {new Date(u.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase font-black">
                  <ShoppingBag className="w-3 h-3" /> Orders
                </div>
                <span className="text-sm font-bold text-white">{u.totalOrders} total</span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 uppercase font-black">
                   Spent <DollarSign className="w-3 h-3" />
                </div>
                <span className="text-sm font-bold text-emerald-400">${u.totalSpent.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center glass-card rounded-[2.5rem] border border-white/5">
          <User className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No users found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
