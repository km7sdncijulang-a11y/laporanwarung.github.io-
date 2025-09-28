import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calculator, Minus, DollarSign, ChefHat, BookOpen, Scale } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { DataTable } from '@/components/DataTable';
import DailyExpenseForm from '@/components/DailyExpenseForm';
import MonthlyExpenseForm from '@/components/MonthlyExpenseForm';
import DishForm from '@/components/DishForm';
import MonthlySummary from '@/components/MonthlySummary';
import AnnualSummary from '@/components/AnnualSummary';
import DishAnalysis from '@/components/DishAnalysis';
import GeneralJournal from '@/components/GeneralJournal';
import TrialBalance from '@/components/TrialBalance';
import CashFlow from '@/components/CashFlow';
import { format } from 'date-fns';

const expenseCategories = [
  { value: 'bahan-baku', label: 'Bahan Baku' },
  { value: 'operasional', label: 'Operasional' },
  { value: 'gaji', label: 'Gaji Karyawan' },
  { value: 'utilitas', label: 'Listrik & Air' },
  { value: 'transportasi', label: 'Transportasi' },
  { value: 'perawatan', label: 'Perawatan' },
  { value: 'promosi', label: 'Promosi & Marketing' },
  { value: 'lainnya', label: 'Lainnya' },
];

const Dashboard = () => {
  const {
    incomeEntries,
    expenseEntries,
    dishEntries,
    loading,
    addExpenseEntry,
    updateExpenseEntry,
    deleteExpenseEntry,
    addDishEntry,
    updateDishEntry,
    deleteDishEntry,
    updateIncomeEntry,
    deleteIncomeEntry
  } = useSupabaseData();

  const getTotalIncome = () => {
    return incomeEntries.reduce((total, entry) => total + entry.amount, 0);
  };

  const getTotalExpense = () => {
    return expenseEntries.reduce((total, entry) => total + entry.amount, 0);
  };

  const getTotalProfit = () => {
    return getTotalIncome() - getTotalExpense();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  const incomeColumns = [
    { key: 'date', label: 'Tanggal', render: (value: string) => format(new Date(value), 'dd/MM/yyyy') },
    { key: 'amount', label: 'Jumlah', render: (value: number) => `Rp ${value.toLocaleString('id-ID')}` },
    { key: 'description', label: 'Keterangan' },
    { key: 'type', label: 'Tipe', render: (value: string) => value === 'daily' ? 'Harian' : 'Bulanan' },
  ];

  const expenseColumns = [
    { key: 'date', label: 'Tanggal', render: (value: string) => format(new Date(value), 'dd/MM/yyyy') },
    { key: 'amount', label: 'Jumlah', render: (value: number) => `Rp ${value.toLocaleString('id-ID')}` },
    { key: 'description', label: 'Keterangan' },
    { key: 'category', label: 'Kategori', render: (value: string) => {
      const category = expenseCategories.find(cat => cat.value === value);
      return category ? category.label : value;
    }},
    { key: 'type', label: 'Tipe', render: (value: string) => value === 'daily' ? 'Harian' : 'Bulanan' },
  ];

  const dishColumns = [
    { key: 'date', label: 'Tanggal', render: (value: string) => format(new Date(value), 'dd/MM/yyyy') },
    { key: 'name', label: 'Nama Menu' },
    { key: 'revenue', label: 'Pendapatan', render: (value: number) => `Rp ${value.toLocaleString('id-ID')}` },
    { key: 'cost', label: 'Biaya', render: (value: number) => `Rp ${value.toLocaleString('id-ID')}` },
    { key: 'quantity', label: 'Kuantitas' },
    { key: 'profit', label: 'Keuntungan', render: (_: any, row: any) => {
      const profit = row.revenue - row.cost;
      return `Rp ${profit.toLocaleString('id-ID')}`;
    }},
  ];

  const incomeEditFields = [
    { key: 'date', label: 'Tanggal', type: 'date' as const },
    { key: 'amount', label: 'Jumlah', type: 'number' as const },
    { key: 'description', label: 'Keterangan', type: 'text' as const },
    { 
      key: 'type', 
      label: 'Tipe', 
      type: 'select' as const, 
      options: [
        { value: 'daily', label: 'Harian' },
        { value: 'monthly', label: 'Bulanan' }
      ]
    },
  ];

  const expenseEditFields = [
    { key: 'date', label: 'Tanggal', type: 'date' as const },
    { key: 'amount', label: 'Jumlah', type: 'number' as const },
    { key: 'description', label: 'Keterangan', type: 'text' as const },
    { 
      key: 'category', 
      label: 'Kategori', 
      type: 'select' as const, 
      options: expenseCategories
    },
    { 
      key: 'type', 
      label: 'Tipe', 
      type: 'select' as const, 
      options: [
        { value: 'daily', label: 'Harian' },
        { value: 'monthly', label: 'Bulanan' }
      ]
    },
  ];

  const dishEditFields = [
    { key: 'date', label: 'Tanggal', type: 'date' as const },
    { key: 'name', label: 'Nama Menu', type: 'text' as const },
    { key: 'revenue', label: 'Pendapatan', type: 'number' as const },
    { key: 'cost', label: 'Biaya', type: 'number' as const },
    { key: 'quantity', label: 'Kuantitas', type: 'number' as const },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-profit" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">
              Rp {getTotalIncome().toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari {incomeEntries.length} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <Minus className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              Rp {getTotalExpense().toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari {expenseEntries.length} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-profit' : 'text-destructive'}`}>
              Rp {getTotalProfit().toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">
              Pemasukan - Pengeluaran
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Tercatat</CardTitle>
            <ChefHat className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {dishEntries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Jenis menu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="income" className="space-y-6">
        <TabsList className="flex flex-wrap justify-start gap-1 bg-muted/50 p-1 rounded-lg border shadow-sm h-auto">
          {/* Data Management */}
          <TabsTrigger value="income" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <TrendingUp className="h-4 w-4" />
            Data Pemasukan
          </TabsTrigger>
          <TabsTrigger value="expense" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <Minus className="h-4 w-4" />
            Pengeluaran
          </TabsTrigger>
          <TabsTrigger value="dish" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <ChefHat className="h-4 w-4" />
            Menu
          </TabsTrigger>
          
          {/* Input Forms */}
          <TabsTrigger value="monthly" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <Calculator className="h-4 w-4" />
            Input Bulanan
          </TabsTrigger>
          
          {/* Reports */}
          <TabsTrigger value="monthly-recap" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <TrendingUp className="h-4 w-4" />
            Rekap Bulanan
          </TabsTrigger>
          <TabsTrigger value="annual-recap" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <DollarSign className="h-4 w-4" />
            Rekap Tahunan
          </TabsTrigger>
          <TabsTrigger value="dish-analysis" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <ChefHat className="h-4 w-4" />
            Analisis Menu
          </TabsTrigger>
          
          {/* Accounting */}
          <TabsTrigger value="journal" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <BookOpen className="h-4 w-4" />
            Jurnal Umum
          </TabsTrigger>
          <TabsTrigger value="trial-balance" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <Scale className="h-4 w-4" />
            Neraca Saldo
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover-scale">
            <DollarSign className="h-4 w-4" />
            Arus Kas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <DataTable 
            title="Data Pemasukan"
            data={incomeEntries}
            columns={incomeColumns}
            onEdit={updateIncomeEntry}
            onDelete={deleteIncomeEntry}
            editFields={incomeEditFields}
          />
        </TabsContent>

        <TabsContent value="expense">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailyExpenseForm onSubmit={addExpenseEntry} />
            </div>
            <DataTable 
              title="Data Pengeluaran"
              data={expenseEntries}
              columns={expenseColumns}
              onEdit={updateExpenseEntry}
              onDelete={deleteExpenseEntry}
              editFields={expenseEditFields}
            />
          </div>
        </TabsContent>

        <TabsContent value="dish">
          <div className="space-y-6">
            <DishForm onSubmit={addDishEntry} />
            <DataTable 
              title="Data Menu"
              data={dishEntries}
              columns={dishColumns}
              onEdit={updateDishEntry}
              onDelete={deleteDishEntry}
              editFields={dishEditFields}
            />
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyExpenseForm onSubmit={addExpenseEntry} />
          </div>
        </TabsContent>

        <TabsContent value="monthly-recap">
          <MonthlySummary 
            incomeEntries={incomeEntries} 
            expenseEntries={expenseEntries}
          />
        </TabsContent>

        <TabsContent value="annual-recap">
          <AnnualSummary 
            incomeEntries={incomeEntries}
            expenseEntries={expenseEntries}
          />
        </TabsContent>

        <TabsContent value="dish-analysis">
          <DishAnalysis dishEntries={dishEntries} />
        </TabsContent>

        <TabsContent value="journal">
          <GeneralJournal 
            incomeEntries={incomeEntries}
            expenseEntries={expenseEntries}
            dishEntries={dishEntries}
          />
        </TabsContent>

        <TabsContent value="trial-balance">
          <TrialBalance 
            incomeEntries={incomeEntries}
            expenseEntries={expenseEntries}
            dishEntries={dishEntries}
          />
        </TabsContent>

        <TabsContent value="cash-flow">
          <CashFlow 
            incomeEntries={incomeEntries}
            expenseEntries={expenseEntries}
            dishEntries={dishEntries}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;