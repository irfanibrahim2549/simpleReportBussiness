'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ArrowLeft, Store } from 'lucide-react';
import { NavigationDrawer } from './NavigationDrawer';
import { useTracker } from '@/context/TrackerContext';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ title, showBack = false }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { appEnv } = useTracker();
  const isHome = pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#1A1A1C] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && !isHome ? (
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-[#1A1A1C] text-white flex items-center justify-center hover:bg-[#242426] transition-colors"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-[#D4F634] text-[#0D0D0D] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(212,246,52,0.35)]">
              <Store className="w-5 h-5 text-[#0D0D0D]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white">
                {title || 'Martabak Mantab'}
              </h1>
              {appEnv === 'staging' ? (
                <span className="text-[9px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  STAGING
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#D4F634] inline-block animate-ping" />
              )}
            </div>
            <p className="text-[10px] text-[#8E8E93] tracking-wide uppercase font-semibold">
              {appEnv === 'staging' ? 'Staging Environment' : 'Sales & Capital Tracker'}
            </p>
          </div>
        </div>

        {/* Hamburger Menu (FR-02.1) */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 rounded-2xl bg-[#1A1A1C] border border-[#242426] text-white flex items-center justify-center hover:bg-[#242426] active:scale-95 transition-all"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
