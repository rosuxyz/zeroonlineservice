-- ═══════════════════════════════════════════════════════════════
-- TopUp Hub — Seed Data
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- GAMES
-- ──────────────────────────────────────────────
insert into public.games (id, slug, name, description, long_description, category, gradient, accent_color, short_name, publisher, rating, players, featured, active) values
('free-fire',     'free-fire',     'Free Fire',       'Top up Diamonds instantly',         'Garena Free Fire is a battle royale game with intense survival gameplay. Upgrade your experience with Diamonds – the in-game currency used for elite passes, skins, characters, and more.',                                                                                              'battle-royale', 'from-yellow-500 to-orange-600', '#f59e0b', 'FF',    'Garena',     4.6, '150M+', true,  true),
('pubg-mobile',   'pubg-mobile',   'PUBG Mobile',     'Get UC in seconds',                 'PLAYERUNKNOWN''S BATTLEGROUNDS Mobile is the iconic battle royale experience on mobile. Use UC (Unknown Cash) to buy Royal Pass seasons, costumes, weapon skins, and exclusive items.',                                                                                              'battle-royale', 'from-blue-500 to-cyan-500',    '#3b82f6', 'PUBG', 'Krafton',    4.5, '100M+', true,  true),
('mobile-legends','mobile-legends','Mobile Legends',  'Instant Diamonds delivery',         'Mobile Legends: Bang Bang is a multiplayer online battle arena game. Diamonds are used to purchase heroes, skins, and other in-game content to dominate the Land of Dawn.',                                                                                                         'moba',          'from-indigo-500 to-purple-600', '#6366f1', 'MLBB', 'Moonton',    4.4, '80M+',  true,  true),
('valorant',      'valorant',      'Valorant',        'Buy Valorant Points',               'Valorant is a tactical first-person shooter from Riot Games. Valorant Points (VP) unlock Agent contracts, weapon skins, and premium battle passes to express your style.',                                                                                                           'fps',           'from-red-500 to-rose-600',     '#ef4444', 'VAL',  'Riot Games', 4.7, '25M+',  true,  true),
('genshin-impact','genshin-impact','Genshin Impact',  'Genesis Crystals & Welkin',         'Genshin Impact is an open-world action RPG. Genesis Crystals convert to Primogems for Wishes (gacha), helping you unlock powerful characters and weapons across the continent of Teyvat.',                                                                                          'rpg',           'from-teal-500 to-emerald-500', '#14b8a6', 'GI',   'HoYoverse',  4.8, '50M+',  false, true),
('steam',         'steam-wallet',  'Steam Wallet',    'Global & Regional Codes',           'Steam is the world''s premier PC gaming platform. Steam Wallet codes let you add funds to your Steam account to purchase games, DLC, in-game items, and software from any region.',                                                                                                  'other',         'from-slate-600 to-slate-800',  '#64748b', 'STEAM','Valve',      4.9, '130M+', false, true)
on conflict (id) do nothing;

-- ──────────────────────────────────────────────
-- PACKAGES
-- ──────────────────────────────────────────────
insert into public.packages (id, game_id, amount, bonus, price, currency, popular, label) values
-- Free Fire
('ff-100',    'free-fire',     '100',  '+10',  0.99,  'Diamonds', false, ''),
('ff-310',    'free-fire',     '310',  '+31',  2.99,  'Diamonds', false, ''),
('ff-520',    'free-fire',     '520',  '+52',  4.99,  'Diamonds', true,  'Best Value'),
('ff-1060',   'free-fire',     '1060', '+106', 9.99,  'Diamonds', false, ''),
('ff-2180',   'free-fire',     '2180', '+218', 19.99, 'Diamonds', false, ''),
('ff-5600',   'free-fire',     '5600', '+560', 49.99, 'Diamonds', false, 'Whale Pack'),
-- PUBG Mobile
('pubg-60',   'pubg-mobile',   '60',   '+6',   0.99,  'UC',       false, ''),
('pubg-180',  'pubg-mobile',   '180',  '+18',  2.99,  'UC',       false, ''),
('pubg-325',  'pubg-mobile',   '325',  '+32',  4.99,  'UC',       true,  'Popular'),
('pubg-660',  'pubg-mobile',   '660',  '+66',  9.99,  'UC',       false, ''),
('pubg-1800', 'pubg-mobile',   '1800', '+180', 24.99, 'UC',       false, ''),
('pubg-3850', 'pubg-mobile',   '3850', '+385', 49.99, 'UC',       false, 'Top Up'),
-- Mobile Legends
('ml-86',     'mobile-legends','86',   '+8',   0.99,  'Diamonds', false, ''),
('ml-172',    'mobile-legends','172',  '+17',  1.99,  'Diamonds', false, ''),
('ml-257',    'mobile-legends','257',  '+25',  2.99,  'Diamonds', false, ''),
('ml-706',    'mobile-legends','706',  '+70',  7.99,  'Diamonds', true,  'Best Value'),
('ml-2195',   'mobile-legends','2195', '+219', 24.99, 'Diamonds', false, ''),
('ml-5532',   'mobile-legends','5532', '+553', 59.99, 'Diamonds', false, ''),
-- Valorant
('val-475',   'valorant',      '475',  '',     4.99,  'VP',       false, ''),
('val-1000',  'valorant',      '1000', '+50',  9.99,  'VP',       false, ''),
('val-2050',  'valorant',      '2050', '+150', 19.99, 'VP',       true,  'Most Popular'),
('val-3650',  'valorant',      '3650', '+350', 34.99, 'VP',       false, ''),
('val-5350',  'valorant',      '5350', '+650', 49.99, 'VP',       false, ''),
('val-11000', 'valorant',      '11000','+1500',99.99, 'VP',       false, 'Mega Pack'),
-- Genshin Impact
('gi-60',     'genshin-impact','60',   '',     0.99,  'Crystals', false, ''),
('gi-300',    'genshin-impact','300',  '+30',  4.99,  'Crystals', false, ''),
('gi-980',    'genshin-impact','980',  '+110', 14.99, 'Crystals', true,  'Popular'),
('gi-1980',   'genshin-impact','1980', '+260', 29.99, 'Crystals', false, ''),
('gi-3280',   'genshin-impact','3280', '+600', 49.99, 'Crystals', false, ''),
('gi-6480',   'genshin-impact','6480', '+1600',99.99, 'Crystals', false, ''),
-- Steam Wallet
('steam-5',   'steam',         '$5',   '',     5.00,  'USD',      false, ''),
('steam-10',  'steam',         '$10',  '',     10.00, 'USD',      false, ''),
('steam-20',  'steam',         '$20',  '',     20.00, 'USD',      true,  'Popular'),
('steam-50',  'steam',         '$50',  '',     50.00, 'USD',      false, ''),
('steam-100', 'steam',         '$100', '',     100.00,'USD',      false, '')
on conflict (id) do nothing;

-- ──────────────────────────────────────────────
-- PROMO CODES
-- ──────────────────────────────────────────────
insert into public.promo_codes (code, discount_pct, active) values
('TOPUP10', 10, true),
('GAMER20', 20, true),
('NEWUSER', 15, true)
on conflict (code) do nothing;
