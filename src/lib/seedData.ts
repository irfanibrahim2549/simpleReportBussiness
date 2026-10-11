import { CapitalCycle, ExpenseItem, IncomeItem } from '@/types';

export const INITIAL_CYCLES: CapitalCycle[] = [
  {
    id: 'cycle-1',
    cycleNumber: 1,
    startDate: '2026-10-01T08:30:00.000Z',
    settledDate: '2026-10-03T20:15:00.000Z',
    status: 'closed_profit',
    totalExpense: 1200000,
    totalIncome: 1850000,
    netProfit: 650000,
  },
  {
    id: 'cycle-2',
    cycleNumber: 2,
    startDate: '2026-10-04T09:00:00.000Z',
    settledDate: '2026-10-06T19:40:00.000Z',
    status: 'closed_profit',
    totalExpense: 1450000,
    totalIncome: 2320000,
    netProfit: 870000,
  },
  {
    id: 'cycle-3',
    cycleNumber: 3,
    startDate: '2026-10-07T08:15:00.000Z',
    settledDate: '2026-10-09T21:10:00.000Z',
    status: 'closed_profit',
    totalExpense: 1300000,
    totalIncome: 2150000,
    netProfit: 850000,
  },
  {
    id: 'cycle-4',
    cycleNumber: 4,
    startDate: '2026-10-10T08:00:00.000Z',
    settledDate: null,
    status: 'active',
    totalExpense: 1250000,
    totalIncome: 1050000,
    netProfit: -200000,
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // Cycle 1
  {
    id: 'exp-1',
    cycleId: 'cycle-1',
    amount: 1200000,
    notes: 'Tepung cakra, mentega wijsman, coklat ceres & susu kental',
    createdAt: '2026-10-01T08:30:00.000Z',
  },
  // Cycle 2
  {
    id: 'exp-2',
    cycleId: 'cycle-2',
    amount: 1450000,
    notes: 'Keju kraft cheddar 4 blok, minyak samin, kacang sangrai',
    createdAt: '2026-10-04T09:00:00.000Z',
  },
  // Cycle 3
  {
    id: 'exp-3',
    cycleId: 'cycle-3',
    amount: 1300000,
    notes: 'Telur bebek 3 krat, daging cincang giling, daun bawang segar',
    createdAt: '2026-10-07T08:15:00.000Z',
  },
  // Cycle 4 (Active)
  {
    id: 'exp-4',
    cycleId: 'cycle-4',
    amount: 850000,
    notes: 'Tepung terigu protein tinggi, ragi fermipan, gula pasir & mentega',
    createdAt: '2026-10-10T08:00:00.000Z',
  },
  {
    id: 'exp-5',
    cycleId: 'cycle-4',
    amount: 400000,
    notes: 'Telur bebek 2 krat & rempah kari martabak',
    createdAt: '2026-10-11T09:30:00.000Z',
  },
];

export const INITIAL_INCOMES: IncomeItem[] = [
  // Cycle 1
  {
    id: 'inc-1',
    cycleId: 'cycle-1',
    channel: 'grab',
    amount: 450000,
    createdAt: '2026-10-01T21:00:00.000Z',
  },
  {
    id: 'inc-2',
    cycleId: 'cycle-1',
    channel: 'shopee',
    amount: 380000,
    createdAt: '2026-10-02T20:30:00.000Z',
  },
  {
    id: 'inc-3',
    cycleId: 'cycle-1',
    channel: 'gojek',
    amount: 420000,
    createdAt: '2026-10-03T19:00:00.000Z',
  },
  {
    id: 'inc-4',
    cycleId: 'cycle-1',
    channel: 'offline',
    amount: 600000,
    createdAt: '2026-10-03T21:30:00.000Z',
  },

  // Cycle 2
  {
    id: 'inc-5',
    cycleId: 'cycle-2',
    channel: 'shopee',
    amount: 550000,
    createdAt: '2026-10-04T21:00:00.000Z',
  },
  {
    id: 'inc-6',
    cycleId: 'cycle-2',
    channel: 'grab',
    amount: 620000,
    createdAt: '2026-10-05T20:45:00.000Z',
  },
  {
    id: 'inc-7',
    cycleId: 'cycle-2',
    channel: 'gojek',
    amount: 480000,
    createdAt: '2026-10-06T19:15:00.000Z',
  },
  {
    id: 'inc-8',
    cycleId: 'cycle-2',
    channel: 'offline',
    amount: 670000,
    createdAt: '2026-10-06T21:40:00.000Z',
  },

  // Cycle 3
  {
    id: 'inc-9',
    cycleId: 'cycle-3',
    channel: 'offline',
    amount: 720000,
    createdAt: '2026-10-07T21:00:00.000Z',
  },
  {
    id: 'inc-10',
    cycleId: 'cycle-3',
    channel: 'grab',
    amount: 510000,
    createdAt: '2026-10-08T20:00:00.000Z',
  },
  {
    id: 'inc-11',
    cycleId: 'cycle-3',
    channel: 'gojek',
    amount: 490000,
    createdAt: '2026-10-09T19:30:00.000Z',
  },
  {
    id: 'inc-12',
    cycleId: 'cycle-3',
    channel: 'shopee',
    amount: 430000,
    createdAt: '2026-10-09T21:10:00.000Z',
  },

  // Cycle 4 (Current)
  {
    id: 'inc-13',
    cycleId: 'cycle-4',
    channel: 'shopee',
    amount: 180000,
    createdAt: '2026-10-10T19:00:00.000Z',
  },
  {
    id: 'inc-14',
    cycleId: 'cycle-4',
    channel: 'grab',
    amount: 250000,
    createdAt: '2026-10-10T20:30:00.000Z',
  },
  {
    id: 'inc-15',
    cycleId: 'cycle-4',
    channel: 'offline',
    amount: 120000,
    createdAt: '2026-10-10T21:45:00.000Z',
  },
  // Today's Incomes (11 Oct 2026)
  {
    id: 'inc-16',
    cycleId: 'cycle-4',
    channel: 'gojek',
    amount: 160000,
    createdAt: '2026-10-11T12:15:00.000Z',
  },
  {
    id: 'inc-17',
    cycleId: 'cycle-4',
    channel: 'grab',
    amount: 140000,
    createdAt: '2026-10-11T14:20:00.000Z',
  },
  {
    id: 'inc-18',
    cycleId: 'cycle-4',
    channel: 'shopee',
    amount: 90000,
    createdAt: '2026-10-11T15:10:00.000Z',
  },
  {
    id: 'inc-19',
    cycleId: 'cycle-4',
    channel: 'offline',
    amount: 110000,
    createdAt: '2026-10-11T16:00:00.000Z',
  },
];
