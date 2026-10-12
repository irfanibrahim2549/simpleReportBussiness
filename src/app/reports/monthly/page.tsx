'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkles, 
  PieChart, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useTracker } from '@/context/TrackerContext';
import { CHANNEL_CONFIG, PlatformChannel } from '@/types';
import { formatRupiah, formatCompactRupiah } from '@/lib/format';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function MonthlyReportPage() {
  const { expenses, incomes, isLoading } = useTracker();

  // Current year & month state (Default: October 2026 based on seed data and system time)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 0-indexed (9 = Oktober)
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ day: number; income: number; expense: number; profit: number } | null>(null);

  // Month-year navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDayDetail(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDayDetail(null);
  };

  const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  // Filter items in selected month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => e.createdAt.startsWith(monthPrefix));
  }, [expenses, monthPrefix]);

  const monthlyIncomes = useMemo(() => {
    return incomes.filter((i) => i.createdAt.startsWith(monthPrefix));
  }, [incomes, monthPrefix]);

  // Aggregated P&L
  const totalOmzet = useMemo(() => {
    return monthlyIncomes.reduce((sum, i) => sum + i.amount, 0);
  }, [monthlyIncomes]);

  const totalBelanja = useMemo(() => {
    return monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [monthlyExpenses]);

  const netProfit = totalOmzet - totalBelanja;
  const marginPercent = totalOmzet > 0 ? ((netProfit / totalOmzet) * 100).toFixed(1) : '0';

  // Calculate BEP Achieved Date in Month
  const bepDayAchieved = useMemo(() => {
    if (totalBelanja === 0 && totalOmzet === 0) return null;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    let cumExpense = 0;
    let cumIncome = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${monthPrefix}-${String(d).padStart(2, '0')}`;
      const dayExp = expenses.filter((e) => e.createdAt.startsWith(dayStr)).reduce((s, e) => s + e.amount, 0);
      const dayInc = incomes.filter((i) => i.createdAt.startsWith(dayStr)).reduce((s, i) => s + i.amount, 0);
      cumExpense += dayExp;
      cumIncome += dayInc;

      if (cumExpense > 0 && cumIncome >= cumExpense) {
        return d;
      }
    }
    return null;
  }, [selectedYear, selectedMonth, monthPrefix, expenses, incomes, totalBelanja, totalOmzet]);

  // Daily statistics for Calendar Heatmap
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7; // Monday as 0

  const dailyStats = useMemo(() => {
    const map: Record<number, { expense: number; income: number; profit: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${monthPrefix}-${String(d).padStart(2, '0')}`;
      const dExp = monthlyExpenses
        .filter((e) => e.createdAt.startsWith(dayStr))
        .reduce((sum, e) => sum + e.amount, 0);
      const dInc = monthlyIncomes
        .filter((i) => i.createdAt.startsWith(dayStr))
        .reduce((sum, i) => sum + i.amount, 0);
      const dProfit = dInc - dExp;
      map[d] = { expense: dExp, income: dInc, profit: dProfit };
    }
    return map;
  }, [daysInMonth, monthPrefix, monthlyExpenses, monthlyIncomes]);

  // Channel breakdown for the month
  const monthlyChannelBreakdown = useMemo(() => {
    const initial: Record<PlatformChannel, number> = {
      shopee: 0,
      grab: 0,
      gojek: 0,
      offline: 0,
    };
    const totals = monthlyIncomes.reduce((acc, item) => {
      acc[item.channel] = (acc[item.channel] || 0) + item.amount;
      return acc;
    }, initial);

    return (['shopee', 'grab', 'gojek', 'offline'] as const).map((key) => {
      const config = CHANNEL_CONFIG[key];
      const amount = totals[key] || 0;
      const percent = totalOmzet > 0 ? Math.round((amount / totalOmzet) * 100) : 0;
      return {
        ...config,
        amount,
        percent,
      };
    });
  }, [monthlyIncomes, totalOmzet]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#242426] border-t-[#D4F634] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#8E8E93]">Memuat laporan bulanan...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar title="Laporan Bulanan" showBack={true} />

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* FR-04.1 Filter Periode Dropdown/Header */}
        <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-4 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="w-9 h-9 rounded-full bg-[#242426] hover:bg-[#2F2F34] text-white flex items-center justify-center transition-colors"
            aria-label="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Periode Laporan
            </span>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5 justify-center">
              <Calendar className="w-4 h-4 text-[#D4F634]" />
              <span>{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className="w-9 h-9 rounded-full bg-[#242426] hover:bg-[#2F2F34] text-white flex items-center justify-center transition-colors"
            aria-label="Bulan Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* FR-04.2 Ringkasan P&L Bulanan */}
        <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#242426]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] block">
                Keuntungan Bersih (P&L)
              </span>
              <div className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-2">
                <span className={netProfit >= 0 ? 'text-[#D4F634]' : 'text-red-400'}>
                  {netProfit >= 0 ? `+${formatRupiah(netProfit)}` : formatRupiah(netProfit)}
                </span>
                <span className="text-xs font-bold text-[#8E8E93]">
                  Margin {marginPercent}%
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-[#D4F634]/15 text-[#D4F634] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#242426]/60 rounded-2xl p-3 border border-[#2C2C30]">
              <span className="text-[11px] text-[#8E8E93] font-semibold flex items-center gap-1 mb-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4F634]" />
                <span>Total Omzet Bersih</span>
              </span>
              <span className="text-sm font-extrabold text-white block">
                {formatRupiah(totalOmzet)}
              </span>
            </div>

            <div className="bg-[#242426]/60 rounded-2xl p-3 border border-[#2C2C30]">
              <span className="text-[11px] text-[#8E8E93] font-semibold flex items-center gap-1 mb-1">
                <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>Total Belanja Modal</span>
              </span>
              <span className="text-sm font-extrabold text-white block">
                {formatRupiah(totalBelanja)}
              </span>
            </div>
          </div>

          {/* Indikator Tanggal BEP Bulanan (FR-04.2) */}
          <div className="bg-[#141416] border border-[#2A2A2E] rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4F634]/20 text-[#D4F634] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              {bepDayAchieved ? (
                <p className="text-white font-medium">
                  Titik impas (BEP) bulanan tercapai pada{' '}
                  <strong className="text-[#D4F634] font-extrabold">
                    {bepDayAchieved} {MONTH_NAMES[selectedMonth]}
                  </strong>.
                </p>
              ) : (
                <p className="text-[#8E8E93]">
                  {totalBelanja > 0
                    ? `BEP bulanan belum tercapai (masih kurang ${formatRupiah(Math.max(0, totalBelanja - totalOmzet))}).`
                    : 'Belum ada transaksi belanja bulan ini.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* FR-04.3 Heatmap Kalender Harian */}
        <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4F634]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Heatmap Keuntungan Harian
              </h3>
            </div>
            <span className="text-[10px] text-[#8E8E93] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4F634]" />
              Hari Profit
            </span>
          </div>

          <p className="text-[11px] text-[#8E8E93] mb-3">
            Lingkaran hijau neon menandakan hari yang mencetak laba bersih (omzet &gt; belanja). Ketuk tanggal untuk rincian.
          </p>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-[#8E8E93]">
            <span>SEN</span>
            <span>SEL</span>
            <span>RAB</span>
            <span>KAM</span>
            <span>JUM</span>
            <span>SAB</span>
            <span>MIN</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-10 rounded-xl bg-transparent" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const stats = dailyStats[day];
              const isProfit = stats && stats.profit > 0;
              const hasExpenseOnly = stats && stats.expense > 0 && stats.income === 0;
              const hasActivity = stats && (stats.income > 0 || stats.expense > 0);
              const isSelected = selectedDayDetail?.day === day;

              return (
                <button
                  type="button"
                  key={`day-${day}`}
                  onClick={() => {
                    if (stats) {
                      setSelectedDayDetail({ day, ...stats });
                    }
                  }}
                  className={`h-10 rounded-xl relative flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-white scale-105 z-10'
                      : ''
                  } ${
                    isProfit
                      ? 'bg-[#D4F634] text-[#0D0D0D] font-extrabold shadow-[0_0_12px_rgba(212,246,52,0.3)]'
                      : hasExpenseOnly
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : hasActivity
                      ? 'bg-[#28282E] text-white font-semibold'
                      : 'bg-[#141416] text-[#606068] hover:bg-[#202024]'
                  }`}
                >
                  <span className="text-xs leading-none">{day}</span>
                  {isProfit && (
                    <span className="text-[8px] leading-none mt-0.5 opacity-90">
                      +{formatCompactRupiah(stats.profit).replace('Rp ', '')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail viewer for clicked day */}
          {selectedDayDetail && (
            <div className="mt-4 p-3 bg-[#242426] border border-[#2E2E34] rounded-2xl animate-fade-in text-xs flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white block">
                  Tanggal {selectedDayDetail.day} {MONTH_NAMES[selectedMonth]} {selectedYear}
                </span>
                <span className="text-[11px] text-[#8E8E93]">
                  Omzet: {formatRupiah(selectedDayDetail.income)} • Belanja: {formatRupiah(selectedDayDetail.expense)}
                </span>
              </div>
              <div className="text-right">
                <span className={`font-black ${selectedDayDetail.profit >= 0 ? 'text-[#D4F634]' : 'text-red-400'}`}>
                  {selectedDayDetail.profit >= 0 ? `+${formatRupiah(selectedDayDetail.profit)}` : formatRupiah(selectedDayDetail.profit)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FR-04.4 Bento Kontribusi Penjualan (1 Bulan Penuh) */}
        <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#D4F634]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Kontribusi Channel (1 Bulan)
              </h3>
            </div>
            <span className="text-xs font-black text-[#D4F634]">
              {formatRupiah(totalOmzet)}
            </span>
          </div>

          {/* Distribution multi-color bar */}
          <div className="w-full h-3.5 bg-[#242426] rounded-full overflow-hidden flex mb-4 p-0.5">
            {totalOmzet === 0 ? (
              <div className="w-full h-full bg-[#242426] rounded-full" />
            ) : (
              monthlyChannelBreakdown.map((ch) => {
                if (ch.percent <= 0) return null;
                return (
                  <div
                    key={ch.id}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                    style={{
                      width: `${ch.percent}%`,
                      backgroundColor: ch.color,
                    }}
                    title={`${ch.label}: ${ch.percent}% (${formatRupiah(ch.amount)})`}
                  />
                );
              })
            )}
          </div>

          {/* Channel Detail Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {monthlyChannelBreakdown.map((ch) => (
              <div
                key={ch.id}
                className="bg-[#242426]/60 border border-[#2A2A2E] rounded-2xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ch.color }}
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">
                      {ch.label}
                    </span>
                    <span className="text-[10px] text-[#8E8E93]">
                      {formatRupiah(ch.amount)}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black text-white shrink-0 ml-1">
                  {ch.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
