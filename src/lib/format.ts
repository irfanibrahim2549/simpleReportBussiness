/**
 * Utility functions for currency and date formatting
 */

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  return 'Rp ' + rounded.toLocaleString('id-ID');
}

export function formatCompactRupiah(amount: number): string {
  const rounded = Math.round(amount);
  if (Math.abs(rounded) >= 1_000_000) {
    const jt = (rounded / 1_000_000).toFixed(1).replace('.0', '');
    return `Rp ${jt} jt`;
  }
  if (Math.abs(rounded) >= 1_000) {
    const rb = (rounded / 1_000).toFixed(0);
    return `Rp ${rb} rb`;
  }
  return `Rp ${rounded}`;
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateFull(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimeShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return `${formatDateShort(dateString)}, ${formatTimeShort(dateString)}`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLocalDatetimeInputValue(date: Date = new Date()): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  return localISOTime;
}
