'use client';

import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface FloatingDockProps {
  onOpenExpense: () => void;
  onOpenIncome: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onOpenExpense,
  onOpenIncome,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex justify-center pb-5 px-4">
      <div className="w-full max-w-[410px] pointer-events-auto bg-[#141416]/90 backdrop-blur-xl border border-[#242426] p-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.8)] grid grid-cols-2 gap-2">
        {/* Tombol 1: [+ Belanja] (Dark/Subtle) */}
        <button
          onClick={onOpenExpense}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#1F1F23] hover:bg-[#28282D] active:scale-98 text-white border border-[#2C2C30] transition-all font-bold text-xs shadow-sm"
        >
          <ArrowDownLeft className="w-4 h-4 text-amber-400" />
          <span>+ Belanja</span>
        </button>

        {/* Tombol 2: [+ Pendapatan] (Neon Lime #D4F634 / Kontras Tinggi) */}
        <button
          onClick={onOpenIncome}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#D4F634] hover:bg-[#bfe228] active:scale-98 text-[#0D0D0D] font-extrabold text-xs transition-all shadow-[0_4px_20px_rgba(212,246,52,0.35)]"
        >
          <ArrowUpRight className="w-4 h-4 text-[#0D0D0D] stroke-[2.5]" />
          <span>+ Pendapatan</span>
        </button>
      </div>
    </div>
  );
};
