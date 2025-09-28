import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

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

interface AnnualSummaryProps {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
}

const AnnualSummary = ({ incomeEntries, expenseEntries }: AnnualSummaryProps) => {
  // Get yearly data for income and expenses
  const yearlyData = [...incomeEntries, ...expenseEntries].reduce((acc, entry) => {
    const year = new Date(entry.date).getFullYear();
    if (!acc[year]) {
      acc[year] = {
        year,
        income: 0,
        expense: 0,
        profit: 0,
        transactions: 0
      };
    }
    
    if ('category' in entry) {
      // This is an expense entry
      acc[year].expense += entry.amount;
    } else {
      // This is an income entry
      acc[year].income += entry.amount;
    }
    
    acc[year].profit = acc[year].income - acc[year].expense;
    acc[year].transactions += 1;
    
    return acc;
  }, {} as Record<number, any>);

  const sortedYearlyData = Object.values(yearlyData).sort((a: any, b: any) => a.year - b.year);

  // Calculate statistics
  const totalAllTimeProfit = sortedYearlyData.reduce((sum: number, year: any) => sum + year.profit, 0);
  const avgYearlyProfit = sortedYearlyData.length > 0 ? totalAllTimeProfit / sortedYearlyData.length : 0;
  const totalTransactions = sortedYearlyData.reduce((sum: number, year: any) => sum + year.transactions, 0);
  
  // Find best performing year
  const bestYear = sortedYearlyData.reduce((best: any, current: any) => 
    current.profit > (best?.profit || 0) ? current : best, null);

  // Calculate growth rate (if we have more than one year)
  const growthRate = sortedYearlyData.length > 1 ? 
    ((sortedYearlyData[sortedYearlyData.length - 1].profit - sortedYearlyData[0].profit) / Math.abs(sortedYearlyData[0].profit) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Rekap Tahunan
          </CardTitle>
          <CardDescription>
            Analisis pemasukan tahunan dan tren pertumbuhan warung makan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-profit-light p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-profit" />
                <span className="text-sm font-medium">Total Keuntungan</span>
              </div>
              <div className={`text-xl font-bold ${totalAllTimeProfit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                Rp {totalAllTimeProfit.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Rata-rata Tahunan</span>
              </div>
              <div className={`text-xl font-bold ${avgYearlyProfit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                Rp {Math.round(avgYearlyProfit).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Tahun Terbaik</span>
              </div>
              <div className="text-xl font-bold text-secondary">
                {bestYear ? bestYear.year : 'N/A'}
              </div>
              {bestYear && (
                <div className="text-xs text-muted-foreground">
                  Rp {bestYear.profit.toLocaleString('id-ID')}
                </div>
              )}
            </div>

            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Pertumbuhan</span>
              </div>
              <div className="text-xl font-bold text-accent">
                {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Total {totalTransactions} transaksi
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly Profit Trend Line Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Tren Keuntungan Tahunan</CardTitle>
            <CardDescription>Perkembangan keuntungan dari tahun ke tahun</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedYearlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sortedYearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const label = name === 'income' ? 'Pemasukan' : 
                                   name === 'expense' ? 'Pengeluaran' : 'Keuntungan';
                      return [`Rp ${value.toLocaleString('id-ID')}`, label];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--profit))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--profit))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Belum ada data untuk ditampilkan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income vs Expense Area Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Komposisi Keuangan Tahunan</CardTitle>
            <CardDescription>Perbandingan pemasukan vs pengeluaran per tahun</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedYearlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sortedYearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `Rp ${value.toLocaleString('id-ID')}`, 
                      name === 'income' ? 'Pemasukan' : 'Pengeluaran'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stackId="1" 
                    stroke="hsl(var(--profit))" 
                    fill="hsl(var(--profit))"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stackId="1" 
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Belum ada data untuk ditampilkan
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Yearly Table */}
      {sortedYearlyData.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Detail Tahunan</CardTitle>
            <CardDescription>Ringkasan lengkap pemasukan per tahun</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Tahun</th>
                    <th className="text-right py-2">Pemasukan</th>
                    <th className="text-right py-2">Pengeluaran</th>
                    <th className="text-right py-2">Keuntungan</th>
                    <th className="text-right py-2">Transaksi</th>
                    <th className="text-right py-2">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedYearlyData.map((yearData: any) => (
                    <tr key={yearData.year} className="border-b hover:bg-muted/50">
                      <td className="py-2 font-medium">{yearData.year}</td>
                      <td className="text-right py-2 text-profit">Rp {yearData.income.toLocaleString('id-ID')}</td>
                      <td className="text-right py-2 text-destructive">Rp {yearData.expense.toLocaleString('id-ID')}</td>
                      <td className={`text-right py-2 font-semibold ${yearData.profit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                        Rp {yearData.profit.toLocaleString('id-ID')}
                      </td>
                      <td className="text-right py-2">{yearData.transactions}</td>
                      <td className="text-right py-2">
                        {yearData.income > 0 ? ((yearData.profit / yearData.income) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnnualSummary;