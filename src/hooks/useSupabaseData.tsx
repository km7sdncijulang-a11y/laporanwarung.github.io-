import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface IncomeEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'daily' | 'monthly';
  created_at?: string;
  updated_at?: string;
}

interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'daily' | 'monthly';
  created_at?: string;
  updated_at?: string;
}

interface DishEntry {
  id: string;
  date: string;
  name: string;
  revenue: number;
  cost: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export const useSupabaseData = () => {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [dishEntries, setDishEntries] = useState<DishEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [incomeRes, expenseRes, dishRes] = await Promise.all([
        supabase.from('income_entries').select('*').order('date', { ascending: false }),
        supabase.from('expense_entries').select('*').order('date', { ascending: false }),
        supabase.from('dish_entries').select('*').order('date', { ascending: false })
      ]);

      if (incomeRes.error) console.error('Income fetch error:', incomeRes.error);
      if (expenseRes.error) console.error('Expense fetch error:', expenseRes.error);
      if (dishRes.error) console.error('Dish fetch error:', dishRes.error);

      setIncomeEntries((incomeRes.data as IncomeEntry[]) || []);
      setExpenseEntries((expenseRes.data as ExpenseEntry[]) || []);
      setDishEntries((dishRes.data as DishEntry[]) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Income operations
  const addIncomeEntry = async (entry: Omit<IncomeEntry, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('income_entries')
        .insert([{ 
          ...entry, 
          user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;

      setIncomeEntries(prev => [data as IncomeEntry, ...prev]);
      toast({
        title: "Pemasukan Ditambahkan",
        description: `Berhasil menambahkan pemasukan sebesar Rp ${entry.amount.toLocaleString('id-ID')}`,
      });
    } catch (error: any) {
      console.error('Error adding income:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pemasukan",
        variant: "destructive"
      });
    }
  };

  const updateIncomeEntry = async (id: string, updates: Partial<IncomeEntry>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('income_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setIncomeEntries(prev => 
        prev.map(entry => entry.id === id ? (data as IncomeEntry) : entry)
      );
      
      toast({
        title: "Berhasil",
        description: "Pemasukan berhasil diupdate",
      });
    } catch (error: any) {
      console.error('Error updating income:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate pemasukan",
        variant: "destructive"
      });
    }
  };

  const deleteIncomeEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('income_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setIncomeEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Berhasil",
        description: "Pemasukan berhasil dihapus",
      });
    } catch (error: any) {
      console.error('Error deleting income:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus pemasukan",
        variant: "destructive"
      });
    }
  };

  // Expense operations
  const addExpenseEntry = async (entry: Omit<ExpenseEntry, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expense_entries')
        .insert([{ 
          ...entry, 
          user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;

      setExpenseEntries(prev => [data as ExpenseEntry, ...prev]);
      toast({
        title: "Pengeluaran Ditambahkan",
        description: `Berhasil menambahkan pengeluaran sebesar Rp ${entry.amount.toLocaleString('id-ID')}`,
      });
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pengeluaran",
        variant: "destructive"
      });
    }
  };

  const updateExpenseEntry = async (id: string, updates: Partial<ExpenseEntry>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expense_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setExpenseEntries(prev => 
        prev.map(entry => entry.id === id ? (data as ExpenseEntry) : entry)
      );
      
      toast({
        title: "Berhasil",
        description: "Pengeluaran berhasil diupdate",
      });
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate pengeluaran",
        variant: "destructive"
      });
    }
  };

  const deleteExpenseEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expense_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenseEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Berhasil",
        description: "Pengeluaran berhasil dihapus",
      });
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus pengeluaran",
        variant: "destructive"
      });
    }
  };

  // Dish operations
  const addDishEntry = async (entry: Omit<DishEntry, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dish_entries')
        .insert([{ 
          ...entry, 
          user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;

      setDishEntries(prev => [data as DishEntry, ...prev]);
      toast({
        title: "Menu Ditambahkan",
        description: `Berhasil menambahkan menu ${entry.name}`,
      });
    } catch (error: any) {
      console.error('Error adding dish:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan menu",
        variant: "destructive"
      });
    }
  };

  const updateDishEntry = async (id: string, updates: Partial<DishEntry>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dish_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setDishEntries(prev => 
        prev.map(entry => entry.id === id ? (data as DishEntry) : entry)
      );
      
      toast({
        title: "Berhasil",
        description: "Menu berhasil diupdate",
      });
    } catch (error: any) {
      console.error('Error updating dish:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate menu",
        variant: "destructive"
      });
    }
  };

  const deleteDishEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dish_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDishEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Berhasil",
        description: "Menu berhasil dihapus",
      });
    } catch (error: any) {
      console.error('Error deleting dish:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus menu",
        variant: "destructive"
      });
    }
  };

  return {
    incomeEntries,
    expenseEntries, 
    dishEntries,
    loading,
    addIncomeEntry,
    updateIncomeEntry,
    deleteIncomeEntry,
    addExpenseEntry,
    updateExpenseEntry,
    deleteExpenseEntry,
    addDishEntry,
    updateDishEntry,
    deleteDishEntry,
    refetch: fetchData
  };
};