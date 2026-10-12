import { supabase, isSupabaseConfigured } from './supabase';
import { CapitalCycle, ExpenseItem, IncomeItem } from '@/types';

/**
 * Fetch all data from Supabase tables
 */
export async function fetchAllFromSupabase(): Promise<{
  cycles: CapitalCycle[];
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
} | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const [cyclesRes, expensesRes, incomesRes] = await Promise.all([
      supabase.from('capital_cycles').select('*').order('cycle_number', { ascending: true }),
      supabase.from('expense_items').select('*').order('created_at', { ascending: false }),
      supabase.from('income_items').select('*').order('created_at', { ascending: false }),
    ]);

    if (cyclesRes.error || expensesRes.error || incomesRes.error) {
      console.warn('Supabase query error, fallback ke local storage:', cyclesRes.error || expensesRes.error || incomesRes.error);
      return null;
    }

    const cycles: CapitalCycle[] = (cyclesRes.data || []).map((row) => ({
      id: row.id,
      cycleNumber: row.cycle_number,
      startDate: row.start_date,
      settledDate: row.settled_date,
      status: row.status,
      totalExpense: Number(row.total_expense),
      totalIncome: Number(row.total_income),
      netProfit: Number(row.net_profit),
    }));

    const expenses: ExpenseItem[] = (expensesRes.data || []).map((row) => ({
      id: row.id,
      cycleId: row.cycle_id,
      amount: Number(row.amount),
      notes: row.notes || '',
      createdAt: row.created_at,
    }));

    const incomes: IncomeItem[] = (incomesRes.data || []).map((row) => ({
      id: row.id,
      cycleId: row.cycle_id,
      channel: row.channel,
      amount: Number(row.amount),
      createdAt: row.created_at,
    }));

    return { cycles, expenses, incomes };
  } catch (err) {
    console.error('Supabase fetch failed:', err);
    return null;
  }
}

/**
 * Sync cycle upsert to Supabase
 */
export async function syncUpsertCycle(cycle: CapitalCycle) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('capital_cycles').upsert({
      id: cycle.id,
      cycle_number: cycle.cycleNumber,
      start_date: cycle.startDate,
      settled_date: cycle.settledDate,
      status: cycle.status,
      total_expense: cycle.totalExpense,
      total_income: cycle.totalIncome,
      net_profit: cycle.netProfit,
    });
  } catch (e) {
    console.error('Failed to sync cycle to Supabase:', e);
  }
}

/**
 * Sync new expense to Supabase
 */
export async function syncInsertExpense(item: ExpenseItem) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('expense_items').insert({
      id: item.id,
      cycle_id: item.cycleId,
      amount: item.amount,
      notes: item.notes,
      created_at: item.createdAt,
    });
  } catch (e) {
    console.error('Failed to insert expense to Supabase:', e);
  }
}

/**
 * Sync new income to Supabase
 */
export async function syncInsertIncome(item: IncomeItem) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('income_items').insert({
      id: item.id,
      cycle_id: item.cycleId,
      channel: item.channel,
      amount: item.amount,
      created_at: item.createdAt,
    });
  } catch (e) {
    console.error('Failed to insert income to Supabase:', e);
  }
}

/**
 * Sync expense deletion
 */
export async function syncDeleteExpense(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('expense_items').delete().eq('id', id);
  } catch (e) {
    console.error('Failed to delete expense from Supabase:', e);
  }
}

/**
 * Sync income deletion
 */
export async function syncDeleteIncome(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('income_items').delete().eq('id', id);
  } catch (e) {
    console.error('Failed to delete income from Supabase:', e);
  }
}

/**
 * Bulk seed initial demo data to Supabase if empty
 */
export async function syncSeedInitialData(cycles: CapitalCycle[], expenses: ExpenseItem[], incomes: IncomeItem[]) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const cycleRows = cycles.map((c) => ({
      id: c.id,
      cycle_number: c.cycleNumber,
      start_date: c.startDate,
      settled_date: c.settledDate,
      status: c.status,
      total_expense: c.totalExpense,
      total_income: c.totalIncome,
      net_profit: c.netProfit,
    }));
    await supabase.from('capital_cycles').upsert(cycleRows);

    const expenseRows = expenses.map((e) => ({
      id: e.id,
      cycle_id: e.cycleId,
      amount: e.amount,
      notes: e.notes,
      created_at: e.createdAt,
    }));
    await supabase.from('expense_items').upsert(expenseRows);

    const incomeRows = incomes.map((i) => ({
      id: i.id,
      cycle_id: i.cycleId,
      channel: i.channel,
      amount: i.amount,
      created_at: i.createdAt,
    }));
    await supabase.from('income_items').upsert(incomeRows);
  } catch (e) {
    console.error('Failed to seed Supabase initial data:', e);
  }
}
