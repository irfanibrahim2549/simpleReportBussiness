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
-- Schema selesai. Tabel bersih dan siap digunakan tanpa data demo.
-- ========================================================
