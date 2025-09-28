import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PlusCircle,
  TrendingUp,
  Calculator,
  Calendar,
  Minus,
  DollarSign,
  ChefHat,
  BookOpen,
  Scale,
} from "lucide-react";

import DailyIncomeForm from "@/components/DailyIncomeForm";
import MonthlyIncomeForm from "@/components/MonthlyIncomeForm";
import DailyExpenseForm from "@/components/DailyExpenseForm";
import MonthlyExpenseForm from "@/components/MonthlyExpenseForm";
import DishForm from "@/components/DishForm";
import MonthlySummary from "@/components/MonthlySummary";
import AnnualSummary from "@/components/AnnualSummary";
import DishAnalysis from "@/components/DishAnalysis";
import GeneralJournal from "@/components/GeneralJournal";
import TrialBalance from "@/components/TrialBalance";
import CashFlow from "@/components/CashFlow";
import { useToast } from "@/hooks/use-toast";

interface IncomeEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: "daily" | "monthly";
}

interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: "daily" | "monthly";
}

interface DishEntry {
  id: string;
  date: string;
  name: string;
  revenue: number;
  cost: number;
  quantity: number;
}

const Index = () => {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [dishEntries, setDishEntries] = useState<DishEntry[]>([]);
  const { toast } = useToast();

  const addIncomeEntry = (entry: Omit<IncomeEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setIncomeEntries((prev) => [...prev, newEntry]);
    toast({
      title: "Pemasukan Ditambahkan",
      description: `Berhasil menambahkan pemasukan sebesar Rp ${entry.amount.toLocaleString(
        "id-ID"
      )}`,
    });
  };

  const addExpenseEntry = (entry: Omit<ExpenseEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setExpenseEntries((prev) => [...prev, newEntry]);
    toast({
      title: "Pengeluaran Ditambahkan",
      description: `Berhasil menambahkan pengeluaran sebesar Rp ${entry.amount.toLocaleString(
        "id-ID"
      )}`,
    });
  };

  const addDishEntry = (entry: Omit<DishEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setDishEntries((prev) => [...prev, newEntry]);
    toast({
      title: "Menu Ditambahkan",
      description: `Berhasil menambahkan menu ${entry.name}`,
    });
  };

  const getTotalIncome = () =>
    incomeEntries.reduce((total, entry) => total + entry.amount, 0);

  const getTotalExpense = () =>
    expenseEntries.reduce((total, entry) => total + entry.amount, 0);

  const getTotalProfit = () => getTotalIncome() - getTotalExpense();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Laporan Akuntansi Warung Makan
          </h1>
          <p className="text-primary-foreground/80">
            Kelola keuangan warung dengan mudah dan profesional
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pemasukan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-profit" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-profit">
                Rp {getTotalIncome().toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Dari {incomeEntries.length} transaksi
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pengeluaran
              </CardTitle>
              <Minus className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                Rp {getTotalExpense().toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Dari {expenseEntries.length} transaksi
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Keuntungan Bersih
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  getTotalProfit() >= 0
                    ? "text-profit"
                    : "text-destructive"
                }`}
              >
                Rp {getTotalProfit().toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Pemasukan - Pengeluaran
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Menu Tercatat
              </CardTitle>
              <ChefHat className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {dishEntries.length}
              </div>
              <p className="text-xs text-muted-foreground">Jenis menu</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="daily" className="space-y-6">
          {/* Tabs List */}
          <div className="overflow-x-auto no-scrollbar">
            <TabsList className="flex w-max md:w-full gap-2 bg-muted text-xs px-2 py-3">
              <TabsTrigger value="daily" className="flex items-center gap-1">
                <PlusCircle className="h-3 w-3" />
                Pemasukan
              </TabsTrigger>
              <TabsTrigger value="expense" className="flex items-center gap-1">
                <Minus className="h-3 w-3" />
                Pengeluaran
              </TabsTrigger>
              <TabsTrigger value="dish" className="flex items-center gap-1">
                <ChefHat className="h-3 w-3" />
                Menu
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Bulanan
              </TabsTrigger>
              <TabsTrigger
                value="monthly-recap"
                className="flex items-center gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                Rekap Bulanan
              </TabsTrigger>
              <TabsTrigger
                value="annual-recap"
                className="flex items-center gap-1"
              >
                <DollarSign className="h-3 w-3" />
                Rekap Tahunan
              </TabsTrigger>
              <TabsTrigger
                value="dish-analysis"
                className="flex items-center gap-1"
              >
                <ChefHat className="h-3 w-3" />
                Analisis Menu
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Jurnal Umum
              </TabsTrigger>
              <TabsTrigger
                value="trial-balance"
                className="flex items-center gap-1"
              >
                <Scale className="h-3 w-3" />
                Neraca Saldo
              </TabsTrigger>
              <TabsTrigger value="cash-flow" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Arus Kas
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs Content */}
          <TabsContent value="daily">
            <DailyIncomeForm onSubmit={addIncomeEntry} />
          </TabsContent>

          <TabsContent value="expense">
            <DailyExpenseForm onSubmit={addExpenseEntry} />
          </TabsContent>

          <TabsContent value="dish">
            <DishForm onSubmit={addDishEntry} />
          </TabsContent>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyIncomeForm onSubmit={addIncomeEntry} />
              <MonthlyExpenseForm onSubmit={addExpenseEntry} />
            </div>
          </TabsContent>

          <TabsContent value="monthly-recap">
            <div className="overflow-x-auto">
              <MonthlySummary
                incomeEntries={incomeEntries}
                expenseEntries={expenseEntries}
              />
            </div>
          </TabsContent>

          <TabsContent value="annual-recap">
            <div className="overflow-x-auto">
              <AnnualSummary
                incomeEntries={incomeEntries}
                expenseEntries={expenseEntries}
              />
            </div>
          </TabsContent>

          <TabsContent value="dish-analysis">
            <div className="overflow-x-auto">
              <DishAnalysis dishEntries={dishEntries} />
            </div>
          </TabsContent>

          <TabsContent value="journal">
            <div className="overflow-x-auto">
              <GeneralJournal
                incomeEntries={incomeEntries}
                expenseEntries={expenseEntries}
                dishEntries={dishEntries}
              />
            </div>
          </TabsContent>

          <TabsContent value="trial-balance">
            <div className="overflow-x-auto">
              <TrialBalance
                incomeEntries={incomeEntries}
                expenseEntries={expenseEntries}
                dishEntries={dishEntries}
              />
            </div>
          </TabsContent>

          <TabsContent value="cash-flow">
            <div className="overflow-x-auto">
              <CashFlow
                incomeEntries={incomeEntries}
                expenseEntries={expenseEntries}
                dishEntries={dishEntries}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
