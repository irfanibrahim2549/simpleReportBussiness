'use client';

import React from 'react';
import { 
  Calendar, 
  CalendarRange, 
  Clock, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw 
} from 'lucide-react';
import { formatDateShort } from '@/lib/format';

export type FilterMode = 'week' | 'month' | 'custom' | 'all';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

interface CycleFilterBarProps {
  mode: FilterMode;
  onModeChange: (mode: FilterMode) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onResetToDefault: () => void;
  matchedCount: number;
}

export const CycleFilterBar: React.FC<CycleFilterBarProps> = ({
  mode,
  onModeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onResetToDefault,
  matchedCount,
}) => {
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const setQuickDays = (days: number) => {
    const today = new Date();
    const endStr = today.toISOString().slice(0, 10);
    const past = new Date(today);
    past.setDate(today.getDate() - days);
    const startStr = past.toISOString().slice(0, 10);
    onStartDateChange(startStr);
    onEndDateChange(endStr);
  };

  return (
    <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-4.5 space-y-3.5 shadow-md">
      {/* Segmented Filter Mode Tabs */}
      <div className="flex items-center justify-between gap-1 bg-[#141416] p-1 rounded-2xl border border-[#242426]">
        <button
          type="button"
          onClick={() => onModeChange('week')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
            mode === 'week'
              ? 'bg-[#D4F634] text-[#0D0D0D] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          1 Minggu
        </button>

        <button
          type="button"
          onClick={() => onModeChange('month')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
            mode === 'month'
              ? 'bg-[#D4F634] text-[#0D0D0D] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Bulan
        </button>

        <button
          type="button"
          onClick={() => onModeChange('custom')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
            mode === 'custom'
              ? 'bg-[#D4F634] text-[#0D0D0D] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Range Tgl
        </button>

        <button
          type="button"
          onClick={() => onModeChange('all')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
            mode === 'all'
              ? 'bg-[#D4F634] text-[#0D0D0D] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Semua
        </button>
      </div>

      {/* Mode 1: 1 Minggu (Default) */}
      {mode === 'week' && (
        <div className="bg-[#242426]/60 border border-[#2C2C30] rounded-2xl p-3 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4F634]" />
            <div>
              <span className="font-extrabold text-white block">
                Default 1 Minggu Terakhir
              </span>
              <span className="text-[11px] text-[#8E8E93]">
                {formatDateShort(startDate)} – {formatDateShort(endDate)}
              </span>
            </div>
          </div>
          <span className="bg-[#D4F634]/15 text-[#D4F634] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#D4F634]/30">
            Aktif
          </span>
        </div>
      )}

      {/* Mode 2: Filter Bulan */}
      {mode === 'month' && (
        <div className="bg-[#242426]/60 border border-[#2C2C30] rounded-2xl p-3 flex items-center justify-between animate-fade-in">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full bg-[#1A1A1C] hover:bg-[#2F2F34] text-white flex items-center justify-center transition-colors"
            aria-label="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Pilihan Bulan
            </span>
            <div className="text-sm font-black text-white flex items-center gap-1.5 justify-center">
              <Calendar className="w-3.5 h-3.5 text-[#D4F634]" />
              <span>{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full bg-[#1A1A1C] hover:bg-[#2F2F34] text-white flex items-center justify-center transition-colors"
            aria-label="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mode 3: Custom Date Range */}
      {mode === 'custom' && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#242426]/60 border border-[#2C2C30] rounded-2xl p-2.5">
              <label className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
              />
            </div>

            <div className="bg-[#242426]/60 border border-[#2C2C30] rounded-2xl p-2.5">
              <label className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setQuickDays(7)}
              className="px-2.5 py-1 rounded-full bg-[#1A1A1C] hover:bg-[#2F2F34] text-[10px] font-semibold text-white/90 border border-[#2C2C30] transition-colors"
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setQuickDays(14)}
              className="px-2.5 py-1 rounded-full bg-[#1A1A1C] hover:bg-[#2F2F34] text-[10px] font-semibold text-white/90 border border-[#2C2C30] transition-colors"
            >
              14 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setQuickDays(30)}
              className="px-2.5 py-1 rounded-full bg-[#1A1A1C] hover:bg-[#2F2F34] text-[10px] font-semibold text-white/90 border border-[#2C2C30] transition-colors"
            >
              30 Hari Terakhir
            </button>
          </div>
        </div>
      )}

      {/* Mode 4: Semua (All time info) */}
      {mode === 'all' && (
        <div className="bg-[#242426]/60 border border-[#2C2C30] rounded-2xl p-3 flex items-center justify-between text-xs animate-fade-in">
          <span className="text-[#8E8E93]">
            Menampilkan seluruh riwayat siklus tanpa batasan waktu.
          </span>
          <span className="bg-[#D4F634]/15 text-[#D4F634] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#D4F634]/30">
            Semua
          </span>
        </div>
      )}

      {/* Filter Status & Reset Action */}
      <div className="flex items-center justify-between pt-1 border-t border-[#242426] text-[11px]">
        <div className="flex items-center gap-1.5 text-[#8E8E93]">
          <Filter className="w-3.5 h-3.5 text-[#D4F634]" />
          <span>
            Ditemukan <strong className="text-white">{matchedCount}</strong> siklus modal
          </span>
        </div>

        {mode !== 'week' && (
          <button
            type="button"
            onClick={onResetToDefault}
            className="text-xs text-[#D4F634] hover:underline flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ke 1 Minggu</span>
          </button>
        )}
      </div>
    </div>
  );
};
