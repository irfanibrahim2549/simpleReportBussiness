export type PlatformChannel = 'shopee' | 'grab' | 'gojek' | 'offline';
export type CycleStatus = 'active' | 'closed_profit';

export interface CapitalCycle {
  id: string;
  cycleNumber: number;
  startDate: string; // ISO 8601
  settledDate: string | null; // ISO 8601
  status: CycleStatus;
  totalExpense: number;
  totalIncome: number;
  netProfit: number;
}

export interface ExpenseItem {
  id: string;
  cycleId: string;
  amount: number;
  notes: string;
  createdAt: string; // ISO 8601
}

export interface IncomeItem {
  id: string;
  cycleId: string;
  channel: PlatformChannel;
  amount: number;
  createdAt: string; // ISO 8601
}

export interface ChannelMeta {
  id: PlatformChannel;
  label: string;
  shortLabel: string;
  color: string;
  bgLight: string;
  textColor: string;
  badgeBg: string;
}

export const CHANNEL_CONFIG: Record<PlatformChannel, ChannelMeta> = {
  shopee: {
    id: 'shopee',
    label: 'ShopeeFood',
    shortLabel: 'Shopee',
    color: '#EE4D2D',
    bgLight: 'rgba(238, 77, 45, 0.15)',
    textColor: '#FF7B60',
    badgeBg: '#3E1914',
  },
  grab: {
    id: 'grab',
    label: 'GrabFood',
    shortLabel: 'Grab',
    color: '#00B14F',
    bgLight: 'rgba(0, 177, 79, 0.15)',
    textColor: '#22C55E',
    badgeBg: '#13351F',
  },
  gojek: {
    id: 'gojek',
    label: 'GoFood',
    shortLabel: 'Gojek',
    color: '#E11A2B',
    bgLight: 'rgba(225, 26, 43, 0.15)',
    textColor: '#FB7185',
    badgeBg: '#3A141A',
  },
  offline: {
    id: 'offline',
    label: 'Offline / QRIS',
    shortLabel: 'Offline',
    color: '#00A3FF',
    bgLight: 'rgba(0, 163, 255, 0.15)',
    textColor: '#38BDF8',
    badgeBg: '#102A3C',
  },
};
