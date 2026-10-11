'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Calendar, Sparkles } from 'lucide-react';
import { useTracker } from '@/context/TrackerContext';
import { toLocalDatetimeInputValue } from '@/lib/format';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense } = useTracker();
  const [rawAmount, setRawAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setRawAmount('');
      setNotes('');
      setDatetime(toLocalDatetimeInputValue(new Date()));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const numericValue = parseInt(rawAmount.replace(/\D/g, '') || '0', 10);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setRawAmount(val ? parseInt(val, 10).toLocaleString('id-ID') : '');
  };

  const handleAddPreset = (addon: number) => {
    const current = numericValue;
    const updated = current + addon;
    setRawAmount(updated.toLocaleString('id-ID'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericValue <= 0) {
      alert('Masukkan nominal belanja modal yang valid.');
      return;
    }

    const isoDate = datetime ? new Date(datetime).toISOString() : new Date().toISOString();
    addExpense({
      amount: numericValue,
      notes,
      createdAt: isoDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div className="relative w-full max-w-[440px] bg-[#141416] border-t border-[#242426] rounded-t-3xl p-6 z-10 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#2E2E32] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Catat Belanja Modal</h2>
              <p className="text-[11px] text-[#8E8E93]">Ditambahkan ke target siklus aktif</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1F1F23] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Big Rp Input (FR-03.1) */}
          <div className="bg-[#1A1A1C] border border-[#26262A] rounded-2xl p-4 focus-within:border-amber-400/60 transition-colors">
            <label className="text-[11px] font-semibold text-[#8E8E93] block uppercase tracking-wider mb-1">
              Nominal Belanja Modal
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-amber-400">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="0"
                value={rawAmount}
                onChange={handleAmountChange}
                className="w-full bg-transparent text-3xl font-black text-white focus:outline-none placeholder:text-[#38383E]"
              />
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[50_000, 100_000, 250_000, 500_000].map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => handleAddPreset(amt)}
                className="px-3 py-1.5 rounded-full bg-[#242426] hover:bg-[#2C2C32] text-xs font-semibold text-white/90 shrink-0 transition-colors border border-[#2E2E34]"
              >
                +{(amt / 1000).toLocaleString('id-ID')}rb
              </button>
            ))}
          </div>

          {/* Notes Input */}
          <div>
            <label className="text-xs font-semibold text-[#8E8E93] block mb-1.5">
              Keterangan / Bahan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Tepung terigu, keju kraft, telur bebek..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1A1A1C] border border-[#26262A] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 placeholder:text-[#4A4A52]"
            />
          </div>

          {/* Date & Time Picker */}
          <div>
            <label className="text-xs font-semibold text-[#8E8E93] block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tanggal & Waktu Belanja</span>
            </label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full bg-[#1A1A1C] border border-[#26262A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={numericValue <= 0}
              className="w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 disabled:bg-[#242426] disabled:text-[#52525A] text-[#0D0D0D] font-extrabold text-sm transition-all shadow-[0_4px_20px_rgba(251,191,36,0.25)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan Belanja Modal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
