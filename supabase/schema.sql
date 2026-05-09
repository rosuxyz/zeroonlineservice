-- ═══════════════════════════════════════════════════════════════
-- TopUp Hub — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- 1. PROFILES (extends auth.users)
-- ──────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text not null,
  full_name    text default '',
  avatar_url   text default '',
  role         text not null default 'user' check (role in ('user', 'admin')),
  total_spent  numeric(10,2) default 0,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- ──────────────────────────────────────────────
-- 2. GAMES
-- ──────────────────────────────────────────────
create table if not exists public.games (
  id               text primary key,
  slug             text unique not null,
  name             text not null,
  description      text default '',
  long_description text default '',
  category         text not null check (category in ('battle-royale','moba','fps','rpg','other')),
  gradient         text default 'from-gray-700 to-gray-900',
  accent_color     text default '#0ea5e9',
  short_name       text not null,
  publisher        text default '',
  rating           numeric(3,1) default 4.5,
  players          text default '0',
  description      text default '',
  image_url        text default null,
  banner_url       text default null,
  featured         boolean default false,
  active           boolean default true,
  created_at       timestamptz default now() not null
);

-- ──────────────────────────────────────────────
-- 3. PACKAGES
-- ──────────────────────────────────────────────
create table if not exists public.packages (
  id        text primary key,
  game_id   text references public.games(id) on delete cascade not null,
  amount    text not null,
  bonus     text default '',
  price     numeric(10,2) not null check (price >= 0),
  currency  text not null,
  popular   boolean default false,
  label     text default '',
  active    boolean default true
);

-- ──────────────────────────────────────────────
-- 4. ORDERS
-- ──────────────────────────────────────────────
create table if not exists public.orders (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references public.profiles(id) on delete set null,
  game_id        text references public.games(id) on delete set null,
  game_name      text not null,
  package_id     text references public.packages(id) on delete set null,
  package_label  text not null,
  player_id      text not null,
  server_region  text default '',
  amount         numeric(10,2) not null,
  discount       numeric(10,2) default 0,
  promo_code     text default '',
  payment_method text not null,
  receipt_url    text default null,
  status         text not null default 'pending'
                   check (status in ('pending', 'completed', 'failed')),
  created_at     timestamptz default now() not null
);

-- ──────────────────────────────────────────────
-- 5. PROMO CODES
-- ──────────────────────────────────────────────
create table if not exists public.promo_codes (
  code         text primary key,
  discount_pct integer not null check (discount_pct between 1 and 100),
  active       boolean default true,
  max_uses     integer default null,
  used_count   integer default 0,
  expires_at   timestamptz default null
);

-- ──────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY
-- ──────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.games       enable row level security;
alter table public.packages    enable row level security;
alter table public.orders      enable row level security;
alter table public.promo_codes enable row level security;

-- ──────────────────────────────────────────────
-- 6.1 SETTINGS (Flexible Frontend)
-- ──────────────────────────────────────────────
create table if not exists public.site_settings (
  key   text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

create policy "settings: anyone can read"
  on public.site_settings for select
  using (true);

create policy "settings: admin full access"
  on public.site_settings for all
  using (public.is_admin());

-- Initial Settings
insert into public.site_settings (key, value) values 
('hero', '{"title": "Level Up Your Gaming Experience", "subtitle": "Get instant top-ups for your favorite games with secure payments and lightning-fast delivery."}'),
('contact', '{"email": "support@topuphub.com", "phone": "+977-123456789", "facebook": "https://facebook.com/topuphub"}')
on conflict (key) do nothing;

-- Helper function: check if caller is admin
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES policies
create policy "profiles: own row read/write"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles: admin read all"
  on public.profiles for select
  using (public.is_admin());

-- GAMES policies (public read, admin write)
create policy "games: anyone can read active"
  on public.games for select
  using (active = true);

create policy "games: admin full access"
  on public.games for all
  using (public.is_admin())
  with check (public.is_admin());

-- PACKAGES policies (public read, admin write)
create policy "packages: anyone can read active"
  on public.packages for select
  using (active = true);

create policy "packages: admin full access"
  on public.packages for all
  using (public.is_admin())
  with check (public.is_admin());

-- ORDERS policies
create policy "orders: users see own"
  on public.orders for select
  using (user_id = auth.uid());

create policy "orders: users insert own"
  on public.orders for insert
  with check (user_id = auth.uid());

create policy "orders: admin full access"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- PROMO CODES policies
create policy "promo_codes: anyone can read active"
  on public.promo_codes for select
  using (active = true);

create policy "promo_codes: admin full access"
  on public.promo_codes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ──────────────────────────────────────────────
-- 7. TRIGGERS
-- ──────────────────────────────────────────────

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update total_spent when an order is completed
create or replace function public.update_total_spent()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update public.profiles
    set total_spent = total_spent + new.amount,
        updated_at  = now()
    where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_completed on public.orders;
create trigger on_order_completed
  after update of status on public.orders
  for each row execute procedure public.update_total_spent();

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ──────────────────────────────────────────────
-- 8. INDEXES
-- ──────────────────────────────────────────────
create index if not exists idx_games_slug     on public.games(slug);
create index if not exists idx_games_category on public.games(category);
create index if not exists idx_games_featured on public.games(featured);
create index if not exists idx_packages_game  on public.packages(game_id);
create index if not exists idx_orders_user    on public.orders(user_id);
create index if not exists idx_orders_status  on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);
