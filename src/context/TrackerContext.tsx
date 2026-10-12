'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CapitalCycle, ExpenseItem, IncomeItem, PlatformChannel } from '@/types';
import { INITIAL_CYCLES, INITIAL_EXPENSES, INITIAL_INCOMES } from '@/lib/seedData';
import { isSupabaseConfigured } from '@/lib/supabase';
import { 
  fetchAllFromSupabase, 
  syncUpsertCycle, 
  syncInsertExpense, 
  syncInsertIncome, 
  syncDeleteExpense, 
  syncDeleteIncome, 
  syncSeedInitialData 
} from '@/lib/supabaseSync';

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'production';
const STORAGE_PREFIX = APP_ENV === 'staging' ? 'martabak_staging_' : 'martabak_live_';

const STORAGE_KEYS = {
  CYCLES: `${STORAGE_PREFIX}cycles_v1`,
  EXPENSES: `${STORAGE_PREFIX}expenses_v1`,
  INCOMES: `${STORAGE_PREFIX}incomes_v1`,
};

export type RecentTransaction = 
  | ({ type: 'expense' } & ExpenseItem)
  | ({ type: 'income' } & IncomeItem);

export type SyncStatus = 'local' | 'synced' | 'syncing' | 'error';

interface TrackerContextType {
  appEnv: string;
  isSupabaseConnected: boolean;
  syncStatus: SyncStatus;
  cycles: CapitalCycle[];
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  activeCycle: CapitalCycle | null;
  averageTurnoverDays: number;
  totalAccumulatedProfit: number;
  todayExpenseTotal: number;
  todayIncomeTotal: number;
  todayChannelTotals: Record<PlatformChannel, number>;
  recentTransactions: RecentTransaction[];
  isLoading: boolean;
  addExpense: (data: { amount: number; notes?: string; createdAt?: string }) => { cycleId: string };
  addIncome: (data: { channel: PlatformChannel; amount: number; createdAt?: string }) => { cycleId: string; settledJustNow: boolean };
  deleteExpense: (id: string) => void;
  deleteIncome: (id: string) => void;
  resetToDefaultData: () => void;
  clearAllData: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

function recalculateCycles(
  cyclesList: CapitalCycle[],
  expensesList: ExpenseItem[],
  incomesList: IncomeItem[]
): CapitalCycle[] {
  return cyclesList.map((cycle) => {
    const cycleExpenses = expensesList.filter((e) => e.cycleId === cycle.id);
    const cycleIncomes = incomesList.filter((i) => i.cycleId === cycle.id);

    const totalExpense = cycleExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = cycleIncomes.reduce((sum, i) => sum + i.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const isSettled = totalIncome >= totalExpense && totalExpense > 0;

    return {
      ...cycle,
      totalExpense,
      totalIncome,
      netProfit,
      status: isSettled ? 'closed_profit' : cycle.status === 'closed_profit' ? 'closed_profit' : 'active',
      settledDate: isSettled ? (cycle.settledDate || new Date().toISOString()) : cycle.settledDate,
    };
  });
}

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cycles, setCycles] = useState<CapitalCycle[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isSupabaseConfigured ? 'syncing' : 'local');

  // Save changes to LocalStorage
  const persist = useCallback((newCycles: CapitalCycle[], newExpenses: ExpenseItem[], newIncomes: IncomeItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(newCycles));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(newExpenses));
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(newIncomes));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, []);

  // Initialize from LocalStorage or Supabase
  useEffect(() => {
    async function initializeData() {
      let initialCycles = INITIAL_CYCLES;
      let initialExpenses = INITIAL_EXPENSES;
      let initialIncomes = INITIAL_INCOMES;

      try {
        const storedCycles = localStorage.getItem(STORAGE_KEYS.CYCLES);
        const storedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        const storedIncomes = localStorage.getItem(STORAGE_KEYS.INCOMES);

        if (storedCycles && storedExpenses && storedIncomes) {
          initialCycles = JSON.parse(storedCycles);
          initialExpenses = JSON.parse(storedExpenses);
          initialIncomes = JSON.parse(storedIncomes);
        } else {
          localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(INITIAL_CYCLES));
          localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
          localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(INITIAL_INCOMES));
        }
      } catch (e) {
        console.error('Error loading data from localStorage:', e);
      } finally {
        setCycles(initialCycles);
        setExpenses(initialExpenses);
        setIncomes(initialIncomes);
        setIsLoading(false);
      }

      // Check & sync with Supabase if configured
      if (isSupabaseConfigured) {
        setSyncStatus('syncing');
        const remote = await fetchAllFromSupabase();
        if (remote) {
          if (remote.cycles.length > 0) {
            setCycles(remote.cycles);
            setExpenses(remote.expenses);
            setIncomes(remote.incomes);
            persist(remote.cycles, remote.expenses, remote.incomes);
            setSyncStatus('synced');
          } else {
            // Supabase is empty, seed initial data
            await syncSeedInitialData(initialCycles, initialExpenses, initialIncomes);
            setSyncStatus('synced');
          }
        } else {
          setSyncStatus('error');
        }
      } else {
        setSyncStatus('local');
      }
    }

    initializeData();
  }, [persist]);

  // Find active or latest cycle
  const activeCycle = useMemo(() => {
    const active = cycles.find((c) => c.status === 'active');
    if (active) return active;
    if (cycles.length > 0) {
      return [...cycles].sort((a, b) => b.cycleNumber - a.cycleNumber)[0];
    }
    return null;
  }, [cycles]);

  // Average turnover metric (FR-01.5)
  const averageTurnoverDays = useMemo(() => {
    const settled = cycles.filter((c) => c.status === 'closed_profit' && c.settledDate && c.startDate);
    if (settled.length === 0) return 0;

    const totalDays = settled.reduce((sum, c) => {
      const start = new Date(c.startDate).getTime();
      const end = new Date(c.settledDate!).getTime();
      const diffDays = Math.max(0.1, (end - start) / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);

    return Number((totalDays / settled.length).toFixed(1));
  }, [cycles]);

  // Total accumulated net profit across all cycles
  const totalAccumulatedProfit = useMemo(() => {
    return cycles.reduce((sum, c) => sum + c.netProfit, 0);
  }, [cycles]);

  // Today calculations
  const [todayDateString, setTodayDateString] = useState<string>('2026-10-11');

  useEffect(() => {
    const now = new Date();
    const str = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setTodayDateString(str);
  }, []);

  const todayExpenseTotal = useMemo(() => {
    return expenses
      .filter((e) => e.createdAt.startsWith(todayDateString))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, todayDateString]);

  const todayIncomeTotal = useMemo(() => {
    return incomes
      .filter((i) => i.createdAt.startsWith(todayDateString))
      .reduce((sum, i) => sum + i.amount, 0);
  }, [incomes, todayDateString]);

  const todayChannelTotals = useMemo(() => {
    const initial: Record<PlatformChannel, number> = {
      shopee: 0,
      grab: 0,
      gojek: 0,
      offline: 0,
    };

    return incomes
      .filter((i) => i.createdAt.startsWith(todayDateString))
      .reduce((acc, item) => {
        acc[item.channel] = (acc[item.channel] || 0) + item.amount;
        return acc;
      }, initial);
  }, [incomes, todayDateString]);

  // Recent 5 transactions
  const recentTransactions = useMemo<RecentTransaction[]>(() => {
    const mappedExpenses: RecentTransaction[] = expenses.map((e) => ({
      ...e,
      type: 'expense' as const,
    }));
    const mappedIncomes: RecentTransaction[] = incomes.map((i) => ({
      ...i,
      type: 'income' as const,
    }));

    const combined = [...mappedExpenses, ...mappedIncomes];
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return combined.slice(0, 5);
  }, [expenses, incomes]);

  // Action: Add Expense (FR-01.1 & FR-01.2)
  const addExpense = useCallback(
    ({ amount, notes = '', createdAt }: { amount: number; notes?: string; createdAt?: string }) => {
      const nowIso = createdAt || new Date().toISOString();
      const expenseId = 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

      let targetCycleId: string;
      let updatedCycles = [...cycles];

      // Check if current cycle is active or if we need a new cycle
      const currentActive = updatedCycles.find((c) => c.status === 'active');

      if (!currentActive) {
        // Create new cycle (FR-01.1)
        const highestNum = updatedCycles.reduce((max, c) => Math.max(max, c.cycleNumber), 0);
        targetCycleId = 'cycle-' + (highestNum + 1) + '-' + Date.now();
        const newCycle: CapitalCycle = {
          id: targetCycleId,
          cycleNumber: highestNum + 1,
          startDate: nowIso,
          settledDate: null,
          status: 'active',
          totalExpense: amount,
          totalIncome: 0,
          netProfit: -amount,
        };
        updatedCycles.push(newCycle);
      } else {
        // Aggregation: add expense to existing active cycle (FR-01.2)
        targetCycleId = currentActive.id;
        updatedCycles = updatedCycles.map((c) => {
          if (c.id === targetCycleId) {
            const newTotalExpense = c.totalExpense + amount;
            const newNetProfit = c.totalIncome - newTotalExpense;
            return {
              ...c,
              totalExpense: newTotalExpense,
              netProfit: newNetProfit,
              status: c.totalIncome >= newTotalExpense && newTotalExpense > 0 ? 'closed_profit' : 'active',
            };
          }
          return c;
        });
      }

      const newExpenseItem: ExpenseItem = {
        id: expenseId,
        cycleId: targetCycleId,
        amount,
        notes: notes.trim(),
        createdAt: nowIso,
      };

      const updatedExpenses = [newExpenseItem, ...expenses];

      setCycles(updatedCycles);
      setExpenses(updatedExpenses);
      persist(updatedCycles, updatedExpenses, incomes);

      // Async sync to Supabase
      const affectedCycle = updatedCycles.find((c) => c.id === targetCycleId);
      if (affectedCycle) {
        syncUpsertCycle(affectedCycle);
      }
      syncInsertExpense(newExpenseItem);

      return { cycleId: targetCycleId };
    },
    [cycles, expenses, incomes, persist]
  );

  // Action: Add Income (FR-01.3 & FR-01.4)
  const addIncome = useCallback(
    ({ channel, amount, createdAt }: { channel: PlatformChannel; amount: number; createdAt?: string }) => {
      const nowIso = createdAt || new Date().toISOString();
      const incomeId = 'inc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

      let settledJustNow = false;
      let targetCycleId: string;
      let updatedCycles = [...cycles];

      // Find target cycle: active cycle first, or latest cycle for overflow profit
      let targetCycle = updatedCycles.find((c) => c.status === 'active');

      if (!targetCycle) {
        if (updatedCycles.length > 0) {
          targetCycle = [...updatedCycles].sort((a, b) => b.cycleNumber - a.cycleNumber)[0];
          targetCycleId = targetCycle.id;
        } else {
          targetCycleId = 'cycle-1-' + Date.now();
          const firstCycle: CapitalCycle = {
            id: targetCycleId,
            cycleNumber: 1,
            startDate: nowIso,
            settledDate: nowIso,
            status: 'closed_profit',
            totalExpense: 0,
            totalIncome: amount,
            netProfit: amount,
          };
          updatedCycles = [firstCycle];
          targetCycle = firstCycle;
        }
      } else {
        targetCycleId = targetCycle.id;
      }

      // Update cycle totals
      updatedCycles = updatedCycles.map((c) => {
        if (c.id === targetCycleId) {
          const newTotalIncome = c.totalIncome + amount;
          const newNetProfit = newTotalIncome - c.totalExpense;
          const wasActive = c.status === 'active';
          const reachedBEP = newTotalIncome >= c.totalExpense && c.totalExpense > 0;

          if (wasActive && reachedBEP) {
            settledJustNow = true;
          }

          return {
            ...c,
            totalIncome: newTotalIncome,
            netProfit: newNetProfit,
            status: reachedBEP ? 'closed_profit' : c.status,
            settledDate: reachedBEP && !c.settledDate ? nowIso : c.settledDate,
          };
        }
        return c;
      });

      const newIncomeItem: IncomeItem = {
        id: incomeId,
        cycleId: targetCycleId,
        channel,
        amount,
        createdAt: nowIso,
      };

      const updatedIncomes = [newIncomeItem, ...incomes];

      setCycles(updatedCycles);
      setIncomes(updatedIncomes);
      persist(updatedCycles, expenses, updatedIncomes);

      // Async sync to Supabase
      const affectedCycle = updatedCycles.find((c) => c.id === targetCycleId);
      if (affectedCycle) {
        syncUpsertCycle(affectedCycle);
      }
      syncInsertIncome(newIncomeItem);

      return { cycleId: targetCycleId, settledJustNow };
    },
    [cycles, expenses, incomes, persist]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      const remainingExpenses = expenses.filter((e) => e.id !== id);
      const recomputed = recalculateCycles(cycles, remainingExpenses, incomes);
      setExpenses(remainingExpenses);
      setCycles(recomputed);
      persist(recomputed, remainingExpenses, incomes);

      // Async sync to Supabase
      syncDeleteExpense(id);
      recomputed.forEach((c) => syncUpsertCycle(c));
    },
    [expenses, cycles, incomes, persist]
  );

  const deleteIncome = useCallback(
    (id: string) => {
      const remainingIncomes = incomes.filter((i) => i.id !== id);
      const recomputed = recalculateCycles(cycles, expenses, remainingIncomes);
      setIncomes(remainingIncomes);
      setCycles(recomputed);
      persist(recomputed, expenses, remainingIncomes);

      // Async sync to Supabase
      syncDeleteIncome(id);
      recomputed.forEach((c) => syncUpsertCycle(c));
    },
    [incomes, cycles, expenses, persist]
  );

  const resetToDefaultData = useCallback(() => {
    setCycles(INITIAL_CYCLES);
    setExpenses(INITIAL_EXPENSES);
    setIncomes(INITIAL_INCOMES);
    persist(INITIAL_CYCLES, INITIAL_EXPENSES, INITIAL_INCOMES);
    syncSeedInitialData(INITIAL_CYCLES, INITIAL_EXPENSES, INITIAL_INCOMES);
  }, [persist]);

  const clearAllData = useCallback(() => {
    setCycles([]);
    setExpenses([]);
    setIncomes([]);
    persist([], [], []);
  }, [persist]);

  return (
    <TrackerContext.Provider
      value={{
        appEnv: APP_ENV,
        isSupabaseConnected: isSupabaseConfigured,
        syncStatus,
        cycles,
        expenses,
        incomes,
        activeCycle,
        averageTurnoverDays,
        totalAccumulatedProfit,
        todayExpenseTotal,
        todayIncomeTotal,
        todayChannelTotals,
        recentTransactions,
        isLoading,
        addExpense,
        addIncome,
        deleteExpense,
        deleteIncome,
        resetToDefaultData,
        clearAllData,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
}
