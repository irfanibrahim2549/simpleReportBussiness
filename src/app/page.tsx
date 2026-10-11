'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBentoCard } from '@/components/HeroBentoCard';
import { TodayBentoCards } from '@/components/TodayBentoCards';
import { ChannelDistributionCard } from '@/components/ChannelDistributionCard';
import { RecentActivityCard } from '@/components/RecentActivityCard';
import { FloatingDock } from '@/components/FloatingDock';
import { ExpenseModal } from '@/components/ExpenseModal';
import { IncomeModal } from '@/components/IncomeModal';
import { useTracker } from '@/context/TrackerContext';

export default function HomePage() {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const { isLoading } = useTracker();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#242426] border-t-[#D4F634] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#8E8E93]">Memuat data Martabak Mantab...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* FR-02.2 Hero Bento Card */}
        <HeroBentoCard />

        {/* FR-02.3 Dual Bento Card (Kondisi Hari Ini) */}
        <TodayBentoCards />

        {/* FR-02.4 Sumber Pendapatan Hari Ini (4 Channel) */}
        <ChannelDistributionCard />

        {/* FR-02.5 Aktivitas Terakhir */}
        <RecentActivityCard />
      </main>

      {/* FR-02.6 Floating Action Dock (Hanya di Halaman Indeks) */}
      <FloatingDock
        onOpenExpense={() => setIsExpenseOpen(true)}
        onOpenIncome={() => setIsIncomeOpen(true)}
      />

      {/* FR-03 Quick Input Modals */}
      <ExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
      />
      <IncomeModal
        isOpen={isIncomeOpen}
        onClose={() => setIsIncomeOpen(false)}
      />
    </>
  );
}
