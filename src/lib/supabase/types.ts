// ─── Supabase Database TypeScript types ──────────────────────────
// Auto-mirrors the schema.sql tables for full type safety.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string;
          role: "user" | "admin";
          total_spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      games: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          long_description: string;
          category: string;
          gradient: string;
          accent_color: string;
          short_name: string;
          publisher: string;
          rating: number;
          players: string;
          image_url: string | null;
          banner_url: string | null;
          featured: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["games"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
        Relationships: [];
      };
      packages: {
        Row: {
          id: string;
          game_id: string;
          amount: string;
          bonus: string;
          price: number;
          currency: string;
          popular: boolean;
          label: string;
          active: boolean;
        };
        Insert: Database["public"]["Tables"]["packages"]["Row"];
        Update: Partial<Database["public"]["Tables"]["packages"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "packages_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          game_id: string | null;
          game_name: string;
          package_id: string | null;
          package_label: string;
          player_id: string;
          server_region: string;
          amount: number;
          discount: number;
          promo_code: string;
          payment_method: string;
          receipt_url: string | null;
          status: "pending" | "completed" | "failed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          }
        ];
      };
      promo_codes: {
        Row: {
          code: string;
          discount_pct: number;
          active: boolean;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
        };
        Insert: Database["public"]["Tables"]["promo_codes"]["Row"];
        Update: Partial<Database["public"]["Tables"]["promo_codes"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["site_settings"]["Row"];
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Convenience row types
export type ProfileRow  = Database["public"]["Tables"]["profiles"]["Row"];
export type GameRow     = Database["public"]["Tables"]["games"]["Row"];
export type PackageRow  = Database["public"]["Tables"]["packages"]["Row"];
export type OrderRow    = Database["public"]["Tables"]["orders"]["Row"];
export type PromoRow    = Database["public"]["Tables"]["promo_codes"]["Row"];
export type SettingRow  = Database["public"]["Tables"]["site_settings"]["Row"];
