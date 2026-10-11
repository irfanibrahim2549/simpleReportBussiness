'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Home, 
  CalendarDays, 
  Repeat, 
  RotateCcw, 
  Trash2, 
  ChefHat, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { resetToDefaultData, clearAllData, appEnv } = useTracker();

  if (!isOpen) return null;

  const navItems = [
    { href: '/', label: 'Beranda Tracker', icon: Home, desc: 'Dashboard & input harian' },
    { href: '/reports/monthly', label: 'Laporan Bulanan', icon: CalendarDays, desc: 'P&L & Heatmap kalender' },
    { href: '/reports/cycles', label: 'Riwayat Siklus Modal', icon: Repeat, desc: 'Audit siklus & durasi BEP' },
  ];

  const handleReset = () => {
    if (window.confirm('Reset data ke sampel default Martabak Mantab? Data manual Anda akan diganti.')) {
      resetToDefaultData();
      onClose();
    }
  };

  const handleClear = () => {
    if (window.confirm('Hapus seluruh data transaksi dan siklus?')) {
      clearAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <aside className="relative w-full max-w-[340px] bg-[#141416] border-l border-[#242426] h-full flex flex-col p-6 z-10 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#242426]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F634] text-[#0D0D0D] flex items-center justify-center font-black">
              <ChefHat className="w-5 h-5 text-[#0D0D0D]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-tight">Martabak Mantab</h2>
              <p className="text-xs text-[#8E8E93]">Gerai Utama • PWA Ready</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1A1A1C] hover:bg-[#242426] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93] px-3 mb-2">
            Menu Navigasi
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#D4F634] text-[#0D0D0D] font-bold shadow-[0_4px_20px_rgba(212,246,52,0.25)]'
                    : 'text-[#FFFFFF] hover:bg-[#1A1A1C] hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? 'bg-[#0D0D0D]/10 text-[#0D0D0D]' : 'bg-[#1A1A1C] text-[#8E8E93]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className={`text-[11px] ${isActive ? 'text-[#0D0D0D]/80 font-normal' : 'text-[#8E8E93]'}`}>
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* System & Data Tools */}
        <div className="pt-4 border-t border-[#242426] space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93] px-3">
            Opsi Data & Demo
          </p>
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-medium text-white hover:bg-[#1A1A1C] transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#D4F634]" />
            <span>Muat Ulang Sampel Demo</span>
          </button>
          <button
            onClick={handleClear}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Hapus Semua Catatan</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-[#242426] flex items-center justify-between text-[11px] text-[#8E8E93]">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${appEnv === 'staging' ? 'bg-amber-400' : 'bg-[#D4F634]'} animate-pulse`}></span>
            {appEnv === 'staging' ? 'Staging LocalDB' : 'Live LocalDB'}
          </span>
          <span className="font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1C] border border-[#242426]">
            {appEnv}
          </span>
        </div>
      </aside>
    </div>
  );
};
