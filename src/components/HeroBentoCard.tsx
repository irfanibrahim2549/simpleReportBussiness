'use client';

import React from 'react';
import { Zap, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';
import { formatRupiah, formatDateShort } from '@/lib/format';

export const HeroBentoCard: React.FC = () => {
  const { activeCycle, averageTurnoverDays } = useTracker();

  if (!activeCycle) {
    return (
      <div className="bg-[#D4F634] text-[#0D0D0D] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-black/10 px-3 py-1 rounded-full">
            Belum Ada Siklus
          </span>
        </div>
        <h2 className="text-2xl font-black mb-2">Mulai Siklus Pertama</h2>
        <p className="text-sm text-black/75">
          Tekan tombol <strong>+ Belanja</strong> di bawah untuk mencatat belanja modal awal dan memulai pemantauan titik impas.
        </p>
      </div>
    );
  }

  const { cycleNumber, totalExpense, totalIncome, netProfit, status, startDate } = activeCycle;

  // Calculate Progress %
  const progressPercent = totalExpense > 0 
    ? Math.min(100, Math.round((totalIncome / totalExpense) * 100))
    : 100;

  const isLunas = status === 'closed_profit' || totalIncome >= totalExpense;
  const deficitAmount = Math.max(0, totalExpense - totalIncome);

  return (
    <div className="bg-[#D4F634] text-[#0D0D0D] rounded-3xl p-6 shadow-[0_10px_35px_rgba(212,246,52,0.22)] relative overflow-hidden transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider bg-[#0D0D0D] text-white px-3 py-1 rounded-full">
            Siklus #{cycleNumber}
          </span>
          <span className="text-xs font-bold text-[#0D0D0D]/70 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Mulai {formatDateShort(startDate)}
          </span>
        </div>

        {isLunas ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#0D0D0D] text-[#D4F634] px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
          </span>
        ) : (
          <span className="text-[11px] font-extrabold bg-[#0D0D0D]/15 text-[#0D0D0D] px-2.5 py-1 rounded-full">
            Sedang Berjalan
          </span>
        )}
      </div>

      {/* Big Percentage & Metric */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tight">{progressPercent}%</span>
          <span className="text-sm font-bold text-[#0D0D0D]/75">
            {isLunas ? 'Modal Tercapai' : 'Balik Modal'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#0D0D0D]/70 block">Target Modal</span>
          <span className="text-sm font-extrabold">{formatRupiah(totalExpense)}</span>
        </div>
      </div>

      {/* Dual-tone Progress Bar (FR-02.2) */}
      <div className="w-full h-4.5 bg-[#0D0D0D]/20 rounded-full p-1 my-3 flex items-center relative overflow-hidden">
        {/* Realization Progress (Hitam Pekat) */}
        <div
          className="h-full bg-[#0D0D0D] rounded-full transition-all duration-500 ease-out z-10"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Deficit Remaining Motif Bar (Garis Miring Striped) */}
        {progressPercent < 100 && (
          <div
            className="h-full bg-stripes-dark rounded-r-full transition-all duration-500"
            style={{ width: `${100 - progressPercent}%` }}
          />
        )}
      </div>

      {/* Dynamic Status (FR-02.2) */}
      <div className="flex items-center justify-between text-xs font-bold pt-1 mb-4">
        {isLunas ? (
          <div className="flex items-center gap-1.5 text-[#0D0D0D]">
            <TrendingUp className="w-4 h-4" />
            <span className="font-extrabold">Untung Bersih +{formatRupiah(netProfit)}</span>
          </div>
        ) : (
          <div className="text-[#0D0D0D]">
            <span>Kurang <strong className="underline underline-offset-2">{formatRupiah(deficitAmount)}</strong> lagi untuk balik modal</span>
          </div>
        )}

        <span className="text-[11px] font-semibold text-[#0D0D0D]/75">
          Omzet: {formatRupiah(totalIncome)}
        </span>
      </div>

      {/* Turnover Badge (FR-02.2) */}
      <div className="pt-3 border-t border-[#0D0D0D]/15 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 bg-[#0D0D0D] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
          <Zap className="w-3.5 h-3.5 text-[#D4F634] fill-[#D4F634]" />
          <span>⚡ Rata-rata Balik Modal: {averageTurnoverDays > 0 ? `${averageTurnoverDays} Hari` : '- Hari'}</span>
        </div>
      </div>
    </div>
  );
};
