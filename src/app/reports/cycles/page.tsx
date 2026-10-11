'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Repeat, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  ChevronRight, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CycleDetailModal } from '@/components/CycleDetailModal';
import { CycleFilterBar, FilterMode } from '@/components/CycleFilterBar';
import { useTracker } from '@/context/TrackerContext';
import { CapitalCycle } from '@/types';
import { formatRupiah, formatDateShort } from '@/lib/format';

export default function CycleHistoryPage() {
  const { 
    cycles, 
    expenses, 
    incomes, 
    isLoading 
  } = useTracker();

  const [selectedCycle, setSelectedCycle] = useState<CapitalCycle | null>(null);

  // Filter States: Default is 'week' (1 minggu dari today)
  const [filterMode, setFilterMode] = useState<FilterMode>('week');
  const [startDate, setStartDate] = useState<string>('2026-10-04');
  const [endDate, setEndDate] = useState<string>('2026-10-11');
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 0-indexed (9 = Oktober)
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Compute 1 week window safely in useEffect
  useEffect(() => {
    const today = new Date();
    const endStr = today.toISOString().slice(0, 10);
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 7);
    const startStr = pastWeek.toISOString().slice(0, 10);

    setEndDate(endStr);
    setStartDate(startStr);
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  }, []);

  const handleResetToDefault = () => {
    const today = new Date();
    const endStr = today.toISOString().slice(0, 10);
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 7);
    const startStr = pastWeek.toISOString().slice(0, 10);

    setFilterMode('week');
    setEndDate(endStr);
    setStartDate(startStr);
  };

  // Sort cycles descending by cycleNumber (newest first)
  const sortedCycles = useMemo(() => {
    return [...cycles].sort((a, b) => b.cycleNumber - a.cycleNumber);
  }, [cycles]);

  // Filter cycles according to selected mode
  const filteredCycles = useMemo(() => {
    if (filterMode === 'all') {
      return sortedCycles;
    }

    if (filterMode === 'month') {
      const prefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      return sortedCycles.filter((c) => {
        const startMonth = c.startDate.slice(0, 7);
        const settledMonth = c.settledDate ? c.settledDate.slice(0, 7) : null;
        return startMonth === prefix || settledMonth === prefix;
      });
    }

    // 'week' or 'custom'
    return sortedCycles.filter((c) => {
      const cStart = c.startDate.slice(0, 10);
      const cEnd = c.settledDate ? c.settledDate.slice(0, 10) : '9999-12-31';
      return cStart <= endDate && cEnd >= startDate;
    });
  }, [sortedCycles, filterMode, selectedYear, selectedMonth, startDate, endDate]);

  // Recalculate stats based on filtered cycles
  const filteredProfit = useMemo(() => {
    return filteredCycles.reduce((sum, c) => sum + c.netProfit, 0);
  }, [filteredCycles]);

  const filteredSettledCycles = useMemo(() => {
    return filteredCycles.filter((c) => c.status === 'closed_profit' && c.settledDate && c.startDate);
  }, [filteredCycles]);

  const filteredAverageTurnoverDays = useMemo(() => {
    if (filteredSettledCycles.length === 0) return 0;
    const totalDays = filteredSettledCycles.reduce((sum, c) => {
      const start = new Date(c.startDate).getTime();
      const end = new Date(c.settledDate!).getTime();
      const diff = Math.max(0.1, (end - start) / (1000 * 60 * 60 * 24));
      return sum + diff;
    }, 0);
    return Number((totalDays / filteredSettledCycles.length).toFixed(1));
  }, [filteredSettledCycles]);

  // Helper to get summary of major ingredients / notes for a cycle
  const getMainIngredients = (cycleId: string) => {
    const cycleExpenses = expenses.filter((e) => e.cycleId === cycleId);
    if (cycleExpenses.length === 0) return 'Belum ada catatan belanja';
    const sorted = [...cycleExpenses].sort((a, b) => b.amount - a.amount);
    return sorted[0].notes || 'Bahan produksi martabak';
  };

  // Helper to calculate cycle duration in days
  const getCycleDays = (cycle: CapitalCycle) => {
    if (!cycle.settledDate || !cycle.startDate) return null;
    const diff = (new Date(cycle.settledDate).getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0.1, Number(diff.toFixed(1)));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#242426] border-t-[#D4F634] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#8E8E93]">Memuat riwayat siklus modal...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar title="Riwayat Siklus Modal" showBack={true} />

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Filter Bar (Filter Bulan & Range Tanggal, Default 1 Minggu) */}
        <CycleFilterBar
          mode={filterMode}
          onModeChange={setFilterMode}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onResetToDefault={handleResetToDefault}
          matchedCount={filteredCycles.length}
        />

        {/* FR-05.1 Header Statistik Agregat (Dinamis Berdasarkan Filter Periode) */}
        <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242426]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] block">
                Total Profit Siklus ({filterMode === 'week' ? '1 Minggu' : filterMode === 'month' ? 'Bulan Ini' : filterMode === 'custom' ? 'Rentang Terpilih' : 'Semua'})
              </span>
              <div className="text-2xl font-black text-[#D4F634] mt-0.5">
                {filteredProfit >= 0 ? `+${formatRupiah(filteredProfit)}` : formatRupiah(filteredProfit)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#D4F634]/15 text-[#D4F634] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Turnover metric badge */}
            <div className="bg-[#242426]/70 rounded-2xl p-3 border border-[#2C2C30]">
              <span className="text-[11px] text-[#8E8E93] font-semibold flex items-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-[#D4F634] fill-[#D4F634]" />
                <span>Rata-rata Balik Modal</span>
              </span>
              <span className="text-base font-black text-white">
                {filteredAverageTurnoverDays > 0 ? `${filteredAverageTurnoverDays} Hari` : '- Hari'}
              </span>
            </div>

            {/* Total cycles count */}
            <div className="bg-[#242426]/70 rounded-2xl p-3 border border-[#2C2C30]">
              <span className="text-[11px] text-[#8E8E93] font-semibold flex items-center gap-1 mb-1">
                <Repeat className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span>Total Siklus</span>
              </span>
              <span className="text-base font-black text-white">
                {filteredSettledCycles.length} Lunas / {filteredCycles.length} Total
              </span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
            Daftar Siklus Modal
          </h2>
          <span className="text-[11px] text-[#8E8E93]">
            Klik kartu untuk rincian transaksi
          </span>
        </div>

        {/* FR-05.2 List Kartu Siklus */}
        <div className="space-y-3">
          {filteredCycles.length === 0 ? (
            <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-8 text-center text-[#8E8E93] text-sm">
              <p className="font-semibold text-white mb-1">Tidak ada siklus modal dalam periode ini.</p>
              <p className="text-xs">Coba pilih &quot;Semua&quot; atau perpanjang rentang tanggal filter.</p>
            </div>
          ) : (
            filteredCycles.map((cycle) => {
              const isLunas = cycle.status === 'closed_profit';
              const durationDays = getCycleDays(cycle);
              const mainIngredients = getMainIngredients(cycle.id);

              return (
                <button
                  type="button"
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle)}
                  className="w-full text-left bg-[#1A1A1C] border border-[#242426] hover:border-[#38383E] rounded-3xl p-4.5 transition-all active:scale-[0.99] group block"
                >
                  {/* Card Header: Identitas siklus & status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">
                        Siklus #{cycle.cycleNumber}
                      </span>
                      <span className="text-[11px] text-[#8E8E93]">
                        ({formatDateShort(cycle.startDate)} {cycle.settledDate ? `- ${formatDateShort(cycle.settledDate)}` : '- Sekarang'})
                      </span>
                    </div>

                    {isLunas ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#D4F634]/15 text-[#D4F634] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#D4F634]/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Lunas {durationDays ? `(${durationDays} hari)` : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-400 px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-400/30">
                        <Clock className="w-3 h-3" />
                        Masih Berjalan
                      </span>
                    )}
                  </div>

                  {/* Breakdown financial figures */}
                  <div className="grid grid-cols-2 gap-2 mb-3 bg-[#242426]/50 rounded-2xl p-2.5 border border-[#2A2A2E]">
                    <div>
                      <span className="text-[10px] text-[#8E8E93] uppercase font-bold block flex items-center gap-1">
                        <ArrowDownLeft className="w-3 h-3 text-amber-400" />
                        Belanja Modal
                      </span>
                      <span className="text-xs font-bold text-white">
                        {formatRupiah(cycle.totalExpense)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8E8E93] uppercase font-bold block flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-[#D4F634]" />
                        Total Omzet
                      </span>
                      <span className="text-xs font-bold text-[#D4F634]">
                        {formatRupiah(cycle.totalIncome)}
                      </span>
                    </div>
                  </div>

                  {/* Keterangan Bahan Terbanyak & Highlight Untung Bersih */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="truncate max-w-[220px]">
                      <span className="text-[10px] text-[#8E8E93] block">Bahan Utama:</span>
                      <span className="text-white font-medium truncate block">
                        {mainIngredients}
                      </span>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <span className="text-[10px] text-[#8E8E93] block">
                          {isLunas ? 'Untung Bersih' : 'Sisa Balik Modal'}
                        </span>
                        <span className={`font-black ${cycle.netProfit >= 0 ? 'text-[#D4F634]' : 'text-amber-400'}`}>
                          {cycle.netProfit >= 0 ? `+${formatRupiah(cycle.netProfit)}` : formatRupiah(cycle.netProfit)}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </main>

      {/* FR-05.3 Drill-Down Detail Modal */}
      <CycleDetailModal
        cycle={selectedCycle}
        expenses={expenses}
        incomes={incomes}
        isOpen={!!selectedCycle}
        onClose={() => setSelectedCycle(null)}
      />
    </>
  );
}
