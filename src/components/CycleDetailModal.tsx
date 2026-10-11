'use client';

import React from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { CapitalCycle, ExpenseItem, IncomeItem, CHANNEL_CONFIG } from '@/types';
import { formatRupiah, formatDateTime, formatDateShort } from '@/lib/format';

interface CycleDetailModalProps {
  cycle: CapitalCycle | null;
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const CycleDetailModal: React.FC<CycleDetailModalProps> = ({
  cycle,
  expenses,
  incomes,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !cycle) return null;

  const cycleExpenses = expenses.filter((e) => e.cycleId === cycle.id);
  const cycleIncomes = incomes.filter((i) => i.cycleId === cycle.id);

  const isLunas = cycle.status === 'closed_profit';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[440px] bg-[#141416] border border-[#242426] rounded-t-3xl sm:rounded-3xl p-6 z-10 shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242426]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider bg-[#D4F634] text-[#0D0D0D] px-2.5 py-0.5 rounded-full">
                Siklus #{cycle.cycleNumber}
              </span>
              {isLunas ? (
                <span className="text-[11px] font-bold text-[#D4F634] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Berjalan
                </span>
              )}
            </div>
            <p className="text-xs text-[#8E8E93] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Mulai: {formatDateShort(cycle.startDate)}
              {cycle.settledDate && ` • Lunas: ${formatDateShort(cycle.settledDate)}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1F1F23] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick summary cards */}
        <div className="grid grid-cols-3 gap-2 py-4 border-b border-[#242426]">
          <div className="bg-[#1A1A1C] rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold block mb-0.5">
              Total Belanja
            </span>
            <span className="text-xs font-bold text-white">
              {formatRupiah(cycle.totalExpense)}
            </span>
          </div>

          <div className="bg-[#1A1A1C] rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold block mb-0.5">
              Total Omzet
            </span>
            <span className="text-xs font-bold text-[#D4F634]">
              {formatRupiah(cycle.totalIncome)}
            </span>
          </div>

          <div className="bg-[#1A1A1C] rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold block mb-0.5">
              Profit Bersih
            </span>
            <span className={`text-xs font-black ${cycle.netProfit >= 0 ? 'text-[#D4F634]' : 'text-amber-400'}`}>
              {cycle.netProfit >= 0 ? `+${formatRupiah(cycle.netProfit)}` : formatRupiah(cycle.netProfit)}
            </span>
          </div>
        </div>

        {/* Scrollable logs */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Expenses section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Belanja Modal ({cycleExpenses.length})</span>
            </h4>
            {cycleExpenses.length === 0 ? (
              <p className="text-xs text-[#8E8E93] italic">Tidak ada catatan belanja modal.</p>
            ) : (
              <div className="space-y-2">
                {cycleExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-[#1A1A1C] border border-[#242426] rounded-xl p-3 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {exp.notes || 'Bahan produksi martabak'}
                      </p>
                      <p className="text-[10px] text-[#8E8E93]">{formatDateTime(exp.createdAt)}</p>
                    </div>
                    <span className="text-xs font-extrabold text-amber-400">
                      -{formatRupiah(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incomes section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4F634]" />
              <span>Log Omzet Penjualan ({cycleIncomes.length})</span>
            </h4>
            {cycleIncomes.length === 0 ? (
              <p className="text-xs text-[#8E8E93] italic">Belum ada catatan omzet pada siklus ini.</p>
            ) : (
              <div className="space-y-2">
                {cycleIncomes.map((inc) => {
                  const meta = CHANNEL_CONFIG[inc.channel];
                  return (
                    <div
                      key={inc.id}
                      className="bg-[#1A1A1C] border border-[#242426] rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">{meta.label}</p>
                          <p className="text-[10px] text-[#8E8E93]">{formatDateTime(inc.createdAt)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#D4F634]">
                        +{formatRupiah(inc.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-[#242426]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#1F1F23] hover:bg-[#28282D] text-white font-bold text-xs transition-colors"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
