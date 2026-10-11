'use client';

import React from 'react';
import { PieChart } from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';
import { CHANNEL_CONFIG } from '@/types';
import { formatRupiah } from '@/lib/format';

export const ChannelDistributionCard: React.FC = () => {
  const { todayChannelTotals, todayIncomeTotal } = useTracker();

  const channels = (['shopee', 'grab', 'gojek', 'offline'] as const).map((key) => {
    const config = CHANNEL_CONFIG[key];
    const amount = todayChannelTotals[key] || 0;
    const percent = todayIncomeTotal > 0 ? Math.round((amount / todayIncomeTotal) * 100) : 0;
    return {
      ...config,
      amount,
      percent,
    };
  });

  return (
    <div className="bg-[#1A1A1C] border border-[#242426] rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#D4F634]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            Sumber Pendapatan Hari Ini
          </h3>
        </div>
        <span className="text-xs font-extrabold text-[#D4F634]">
          {formatRupiah(todayIncomeTotal)}
        </span>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="w-full h-3 bg-[#242426] rounded-full overflow-hidden flex mb-4 p-0.5">
        {todayIncomeTotal === 0 ? (
          <div className="w-full h-full bg-[#242426] rounded-full text-center" />
        ) : (
          channels.map((ch) => {
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

      {/* 4-Channel Grid Legend */}
      <div className="grid grid-cols-2 gap-2.5">
        {channels.map((ch) => (
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
                  {ch.shortLabel}
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
  );
};
