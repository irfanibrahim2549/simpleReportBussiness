'use client';

import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';
import { CHANNEL_CONFIG } from '@/types';
import { formatRupiah, formatDateTime } from '@/lib/format';

export const RecentActivityCard: React.FC = () => {
  const { recentTransactions, deleteExpense, deleteIncome } = useTracker();

  return (
    <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#D4F634]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Aktivitas Terakhir
          </h3>
        </div>
        <span className="text-[11px] text-[#8E8E93] font-semibold">
          5 Transaksi Terkini
        </span>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-6 text-sm text-[#8E8E93]">
          Belum ada riwayat transaksi.
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentTransactions.map((item) => {
            const isExpense = item.type === 'expense';
            const channelMeta = !isExpense ? CHANNEL_CONFIG[item.channel] : null;

            return (
              <div
                key={item.id}
                className="group flex items-center justify-between p-3 rounded-2xl bg-[#242426]/60 border border-[#2A2A2E] hover:border-[#38383E] transition-all"
              >
                {/* Icon & Details */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpense
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-[#D4F634]/15 text-[#D4F634]'
                    }`}
                  >
                    {isExpense ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {isExpense ? 'Belanja Modal' : channelMeta?.label || 'Omzet'}
                      </span>
                      {!isExpense && channelMeta && (
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide"
                          style={{
                            backgroundColor: channelMeta.badgeBg,
                            color: channelMeta.textColor,
                          }}
                        >
                          {channelMeta.shortLabel}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#8E8E93] truncate">
                      {isExpense
                        ? item.notes || 'Bahan produksi'
                        : formatDateTime(item.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Amount & Delete */}
                <div className="flex items-center gap-2.5 shrink-0 pl-2">
                  <div className="text-right">
                    <div
                      className={`text-xs font-black ${
                        isExpense ? 'text-white' : 'text-[#D4F634]'
                      }`}
                    >
                      {isExpense ? `-${formatRupiah(item.amount)}` : `+${formatRupiah(item.amount)}`}
                    </div>
                    {isExpense && (
                      <span className="text-[10px] text-[#8E8E93] block">
                        {formatDateTime(item.createdAt)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Hapus transaksi ini? Kalkulasi siklus akan disesuaikan.')) {
                        if (isExpense) {
                          deleteExpense(item.id);
                        } else {
                          deleteIncome(item.id);
                        }
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 text-[#8E8E93] transition-opacity p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
