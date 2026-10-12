'use client';

import React, { useState } from 'react';
import { X, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTracker } from '@/context/TrackerContext';
import { PlatformChannel, CHANNEL_CONFIG } from '@/types';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, onClose }) => {
  const { addIncome } = useTracker();
  const [selectedChannel, setSelectedChannel] = useState<PlatformChannel>('offline');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');

  const resetForm = () => {
    setRawAmount('');
    setDatetime('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
      alert('Masukkan nominal pendapatan bersih yang valid.');
      return;
    }

    const isoDate = datetime ? new Date(datetime).toISOString() : new Date().toISOString();
    const result = addIncome({
      channel: selectedChannel,
      amount: numericValue,
      createdAt: isoDate,
    });

    if (result.settledJustNow) {
      // Celebratory BEP confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4F634', '#FFFFFF', '#00B14F', '#FFD700'],
      });
      alert('🎉 SELAMAT! Siklus modal ini resmi LUNAS & mencapai Break-Even Point!');
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-[440px] bg-[#141416] border-t border-[#242426] rounded-t-3xl p-6 z-10 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#2E2E32] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D4F634]/15 text-[#D4F634] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Catat Pendapatan Omzet</h2>
              <p className="text-[11px] text-[#8E8E93]">Pilih channel penjualan martabak</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#1F1F23] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Chips (FR-03.2) */}
          <div>
            <label className="text-xs font-semibold text-[#8E8E93] block mb-2">
              Pilihan Channel Penjualan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['shopee', 'grab', 'gojek', 'offline'] as const).map((channelKey) => {
                const meta = CHANNEL_CONFIG[channelKey];
                const isSelected = selectedChannel === channelKey;

                return (
                  <button
                    type="button"
                    key={channelKey}
                    onClick={() => setSelectedChannel(channelKey)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-[#D4F634] bg-[#D4F634]/15 text-white shadow-[0_0_15px_rgba(212,246,52,0.15)]'
                        : 'border-[#26262A] bg-[#1A1A1C] text-[#8E8E93] hover:border-[#38383E]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big Nominal Input (Rp) */}
          <div className="bg-[#1A1A1C] border border-[#26262A] rounded-2xl p-4 focus-within:border-[#D4F634]/60 transition-colors">
            <label className="text-[11px] font-semibold text-[#8E8E93] block uppercase tracking-wider mb-1">
              Dana Bersih Masuk (Net)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#D4F634]">Rp</span>
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

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[25_000, 50_000, 100_000, 250_000].map((amt) => (
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

          {/* Date & Time Picker */}
          <div>
            <label className="text-xs font-semibold text-[#8E8E93] block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tanggal & Waktu Transaksi</span>
            </label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full bg-[#1A1A1C] border border-[#26262A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4F634]/60"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={numericValue <= 0}
              className="w-full py-3.5 rounded-full bg-[#D4F634] hover:bg-[#bfe228] disabled:bg-[#242426] disabled:text-[#52525A] text-[#0D0D0D] font-black text-sm transition-all shadow-[0_4px_20px_rgba(212,246,52,0.3)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#0D0D0D]" />
              <span>Catat Pendapatan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
