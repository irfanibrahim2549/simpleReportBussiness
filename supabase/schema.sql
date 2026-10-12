-- ========================================================
-- Schema Supabase: Sales & Capital Cycle Tracker (Martabak Mantab)
-- Salin dan jalankan script ini di SQL Editor Supabase Anda.
-- ========================================================

-- 1. Tabel Siklus Modal (Capital Cycles)
CREATE TABLE IF NOT EXISTS public.capital_cycles (
    id TEXT PRIMARY KEY,
    cycle_number INTEGER NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    settled_date TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('active', 'closed_profit')),
    total_expense NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_income NUMERIC(15, 2) NOT NULL DEFAULT 0,
    net_profit NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa query siklus
CREATE INDEX IF NOT EXISTS idx_capital_cycles_status ON public.capital_cycles(status);
CREATE INDEX IF NOT EXISTS idx_capital_cycles_start_date ON public.capital_cycles(start_date DESC);

-- 2. Tabel Log Belanja Modal (Expense Items)
CREATE TABLE IF NOT EXISTS public.expense_items (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL REFERENCES public.capital_cycles(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index relasi cycle_id
CREATE INDEX IF NOT EXISTS idx_expense_items_cycle_id ON public.expense_items(cycle_id);
CREATE INDEX IF NOT EXISTS idx_expense_items_created_at ON public.expense_items(created_at DESC);

-- 3. Tabel Log Omzet Pendapatan (Income Items)
CREATE TABLE IF NOT EXISTS public.income_items (
    id TEXT PRIMARY KEY,
    cycle_id TEXT NOT NULL REFERENCES public.capital_cycles(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('shopee', 'grab', 'gojek', 'offline')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index relasi cycle_id & channel
CREATE INDEX IF NOT EXISTS idx_income_items_cycle_id ON public.income_items(cycle_id);
CREATE INDEX IF NOT EXISTS idx_income_items_channel ON public.income_items(channel);
CREATE INDEX IF NOT EXISTS idx_income_items_created_at ON public.income_items(created_at DESC);

-- ========================================================
-- 4. Konfigurasi Row Level Security (RLS)
-- Mengizinkan pembacaan & penulisan via Anon Key untuk aplikasi kasir gerai
-- ========================================================

ALTER TABLE public.capital_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_items ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Penuh untuk Client (Anon / Authenticated)
CREATE POLICY "Akses penuh capital_cycles untuk anon"
    ON public.capital_cycles
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Akses penuh expense_items untuk anon"
    ON public.expense_items
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Akses penuh income_items untuk anon"
    ON public.income_items
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ========================================================
-- 5. Data Awal Contoh (Seed Data Martabak Mantab) - Opsional
-- ========================================================

INSERT INTO public.capital_cycles (id, cycle_number, start_date, settled_date, status, total_expense, total_income, net_profit)
VALUES 
    ('cycle-1', 1, '2026-10-01T08:30:00Z', '2026-10-03T20:15:00Z', 'closed_profit', 1200000, 1850000, 650000),
    ('cycle-2', 2, '2026-10-04T09:00:00Z', '2026-10-06T19:40:00Z', 'closed_profit', 1450000, 2320000, 870000),
    ('cycle-3', 3, '2026-10-07T08:15:00Z', '2026-10-09T21:10:00Z', 'closed_profit', 1300000, 2150000, 850000),
    ('cycle-4', 4, '2026-10-10T08:00:00Z', NULL, 'active', 1250000, 1050000, -200000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.expense_items (id, cycle_id, amount, notes, created_at)
VALUES
    ('exp-1', 'cycle-1', 1200000, 'Tepung cakra, mentega wijsman, coklat ceres & susu kental', '2026-10-01T08:30:00Z'),
    ('exp-2', 'cycle-2', 1450000, 'Keju kraft cheddar 4 blok, minyak samin, kacang sangrai', '2026-10-04T09:00:00Z'),
    ('exp-3', 'cycle-3', 1300000, 'Telur bebek 3 krat, daging cincang giling, daun bawang segar', '2026-10-07T08:15:00Z'),
    ('exp-4', 'cycle-4', 850000, 'Tepung terigu protein tinggi, ragi fermipan, gula pasir & mentega', '2026-10-10T08:00:00Z'),
    ('exp-5', 'cycle-4', 400000, 'Telur bebek 2 krat & rempah kari martabak', '2026-10-11T09:30:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.income_items (id, cycle_id, channel, amount, created_at)
VALUES
    ('inc-1', 'cycle-1', 'grab', 450000, '2026-10-01T21:00:00Z'),
    ('inc-2', 'cycle-1', 'shopee', 380000, '2026-10-02T20:30:00Z'),
    ('inc-3', 'cycle-1', 'gojek', 420000, '2026-10-03T19:00:00Z'),
    ('inc-4', 'cycle-1', 'offline', 600000, '2026-10-03T21:30:00Z'),
    ('inc-5', 'cycle-2', 'shopee', 550000, '2026-10-04T21:00:00Z'),
    ('inc-6', 'cycle-2', 'grab', 620000, '2026-10-05T20:45:00Z'),
    ('inc-7', 'cycle-2', 'gojek', 480000, '2026-10-06T19:15:00Z'),
    ('inc-8', 'cycle-2', 'offline', 670000, '2026-10-06T21:40:00Z'),
    ('inc-9', 'cycle-3', 'offline', 720000, '2026-10-07T21:00:00Z'),
    ('inc-10', 'cycle-3', 'grab', 510000, '2026-10-08T20:00:00Z'),
    ('inc-11', 'cycle-3', 'gojek', 490000, '2026-10-09T19:30:00Z'),
    ('inc-12', 'cycle-3', 'shopee', 430000, '2026-10-09T21:10:00Z'),
    ('inc-13', 'cycle-4', 'shopee', 180000, '2026-10-10T19:00:00Z'),
    ('inc-14', 'cycle-4', 'grab', 250000, '2026-10-10T20:30:00Z'),
    ('inc-15', 'cycle-4', 'offline', 120000, '2026-10-10T21:45:00Z'),
    ('inc-16', 'cycle-4', 'gojek', 160000, '2026-10-11T12:15:00Z'),
    ('inc-17', 'cycle-4', 'grab', 140000, '2026-10-11T14:20:00Z'),
    ('inc-18', 'cycle-4', 'shopee', 90000, '2026-10-11T15:10:00Z'),
    ('inc-19', 'cycle-4', 'offline', 110000, '2026-10-11T16:00:00Z')
ON CONFLICT (id) DO NOTHING;
