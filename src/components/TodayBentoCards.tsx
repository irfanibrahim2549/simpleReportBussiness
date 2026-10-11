'use client';

import React from 'react';
import { ShoppingBag, ArrowDownLeft, ArrowUpRight, Coins } from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';
import { formatRupiah } from '@/lib/format';

export const TodayBentoCards: React.FC = () => {
  const { todayExpenseTotal, todayIncomeTotal } = useTracker();

  const netToday = todayIncomeTotal - todayExpenseTotal;

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {/* Kartu Belanja Hari Ini */}
      <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-4.5 flex flex-col justify-between hover:border-[#3A3A3D] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
            Belanja Hari Ini
          </span>
          <div className="w-8 h-8 rounded-full bg-[#242426] text-amber-400 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="text-lg font-black text-white tracking-tight mb-0.5">
            {formatRupiah(todayExpenseTotal)}
          </div>
          <div className="text-[11px] text-[#8E8E93] flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-[#8E8E93]" />
            <span>Bahan Modal Masuk</span>
          </div>
        </div>
      </div>

      {/* Kartu Pendapatan Masuk Hari Ini */}
      <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-4.5 flex flex-col justify-between hover:border-[#3A3A3D] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
            Pendapatan Masuk
          </span>
          <div className="w-8 h-8 rounded-full bg-[#D4F634]/15 text-[#D4F634] flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="text-lg font-black text-[#D4F634] tracking-tight mb-0.5">
            {formatRupiah(todayIncomeTotal)}
          </div>
          <div className="text-[11px] text-[#8E8E93] flex items-center gap-1">
            <Coins className="w-3 h-3 text-[#D4F634]" />
            <span>
              {netToday >= 0 ? `Net +${formatRupiah(netToday)}` : `Net -${formatRupiah(Math.abs(netToday))}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
