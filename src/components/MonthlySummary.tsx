import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, DollarSign, Minus } from "lucide-react";
import { useState } from "react";

interface IncomeEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'daily' | 'monthly';
}

interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'daily' | 'monthly';
}

interface MonthlySummaryProps {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
}

const MonthlySummary = ({ incomeEntries, expenseEntries }: MonthlySummaryProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Get available years from income entries
  const availableYears = Array.from(
    new Set(incomeEntries.map(entry => new Date(entry.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Process monthly data for the selected year
  const monthlyData = months.map((month, index) => {
    const monthlyIncomes = incomeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === parseInt(selectedYear) && 
             entryDate.getMonth() === index;
    });

    const monthlyExpenses = expenseEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === parseInt(selectedYear) && 
             entryDate.getMonth() === index;
    });

    const dailyIncome = monthlyIncomes
      .filter(entry => entry.type === 'daily')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const monthlyIncome = monthlyIncomes
      .filter(entry => entry.type === 'monthly')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const dailyExpense = monthlyExpenses
      .filter(entry => entry.type === 'daily')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const monthlyExpense = monthlyExpenses
      .filter(entry => entry.type === 'monthly')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalIncome = dailyIncome + monthlyIncome;
    const totalExpense = dailyExpense + monthlyExpense;

    return {
      month: month.substring(0, 3),
      fullMonth: month,
      income: totalIncome,
      expense: totalExpense,
      profit: totalIncome - totalExpense,
      transactions: monthlyIncomes.length + monthlyExpenses.length
    };
  });

  const totalYearIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalYearExpense = monthlyData.reduce((sum, month) => sum + month.expense, 0);
  const totalYearProfit = totalYearIncome - totalYearExpense;
  const avgMonthlyProfit = totalYearProfit / 12;
  const totalTransactions = monthlyData.reduce((sum, month) => sum + month.transactions, 0);

  // Data for pie chart (income vs expense)
  const incomeVsExpenseData = [
    {
      name: "Total Pemasukan",
      value: monthlyData.reduce((sum, month) => sum + month.income, 0),
      color: "#10b981"
    },
    {
      name: "Total Pengeluaran", 
      value: monthlyData.reduce((sum, month) => sum + month.expense, 0),
      color: "#ef4444"
    }
  ];

  const COLORS = ["#10b981", "#3b82f6"];

  return (
    <div className="space-y-6">
      {/* Year Selection */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Rekap Bulanan
          </CardTitle>
          <CardDescription>
            Analisis pemasukan bulanan warung makan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Pilih Tahun:</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.length > 0 ? (
                  availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={new Date().getFullYear().toString()}>
                    {new Date().getFullYear()}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-profit-light p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-profit" />
                <span className="text-sm font-medium">Pemasukan</span>
              </div>
              <div className="text-2xl font-bold text-profit">
                Rp {totalYearIncome.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-destructive/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Minus className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Pengeluaran</span>
              </div>
              <div className="text-2xl font-bold text-destructive">
                Rp {totalYearExpense.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Keuntungan</span>
              </div>
              <div className={`text-2xl font-bold ${totalYearProfit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                Rp {totalYearProfit.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Avg Bulanan</span>
              </div>
              <div className={`text-2xl font-bold ${avgMonthlyProfit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                Rp {Math.round(avgMonthlyProfit).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Profit Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Keuntungan per Bulan</CardTitle>
            <CardDescription>Grafik keuntungan bulanan tahun {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === 'income' ? 'Pemasukan' : 
                                 name === 'expense' ? 'Pengeluaran' : 'Keuntungan';
                    return [`Rp ${value.toLocaleString('id-ID')}`, label];
                  }}
                  labelFormatter={(label) => {
                    const monthData = monthlyData.find(m => m.month === label);
                    return monthData?.fullMonth || label;
                  }}
                />
                <Bar dataKey="income" fill="hsl(var(--profit))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income vs Expense Pie Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Komposisi Keuangan</CardTitle>
            <CardDescription>Perbandingan pemasukan vs pengeluaran</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeVsExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeVsExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlySummary;