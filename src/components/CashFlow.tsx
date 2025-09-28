import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO } from "date-fns";
import { id } from "date-fns/locale";

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

interface DishEntry {
  id: string;
  date: string;
  name: string;
  revenue: number;
  cost: number;
  quantity: number;
}

interface CashFlowProps {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
  dishEntries: DishEntry[];
}

interface CashFlowItem {
  description: string;
  amount: number;
  type: 'inflow' | 'outflow';
}

interface MonthlyCashFlow {
  month: string;
  year: number;
  operatingInflows: CashFlowItem[];
  operatingOutflows: CashFlowItem[];
  netOperatingCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

const CashFlow = ({ incomeEntries, expenseEntries, dishEntries }: CashFlowProps) => {
  const getMonthlyCashFlow = (): MonthlyCashFlow[] => {
    // Get all unique months from transactions
    const allDates = [
      ...incomeEntries.map(e => e.date),
      ...expenseEntries.map(e => e.date),
      ...dishEntries.map(e => e.date)
    ];

    if (allDates.length === 0) return [];

    const sortedDates = allDates.sort();
    const startDate = startOfMonth(parseISO(sortedDates[0]));
    const endDate = endOfMonth(parseISO(sortedDates[sortedDates.length - 1]));
    
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    const monthlyFlows: MonthlyCashFlow[] = [];
    let runningCashBalance = 0;

    months.forEach(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const operatingInflows: CashFlowItem[] = [];
      const operatingOutflows: CashFlowItem[] = [];

      // Process income entries for this month
      const monthIncomes = incomeEntries.filter(income => {
        const incomeDate = parseISO(income.date);
        return incomeDate >= monthStart && incomeDate <= monthEnd;
      });

      if (monthIncomes.length > 0) {
        const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
        operatingInflows.push({
          description: `Pendapatan Penjualan (${monthIncomes.length} transaksi)`,
          amount: totalIncome,
          type: 'inflow'
        });
      }

      // Process dish entries for this month
      const monthDishes = dishEntries.filter(dish => {
        const dishDate = parseISO(dish.date);
        return dishDate >= monthStart && dishDate <= monthEnd;
      });

      if (monthDishes.length > 0) {
        const totalDishRevenue = monthDishes.reduce((sum, dish) => sum + (dish.revenue * dish.quantity), 0);
        operatingInflows.push({
          description: `Penjualan Menu (${monthDishes.length} item)`,
          amount: totalDishRevenue,
          type: 'inflow'
        });
      }

      // Process expense entries for this month
      const monthExpenses = expenseEntries.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });

      // Group expenses by category
      const expensesByCategory: { [key: string]: number } = {};
      monthExpenses.forEach(expense => {
        const categoryName = getCategoryDisplayName(expense.category);
        expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + expense.amount;
      });

      Object.entries(expensesByCategory).forEach(([category, amount]) => {
        operatingOutflows.push({
          description: category,
          amount,
          type: 'outflow'
        });
      });

      // Add dish costs
      if (monthDishes.length > 0) {
        const totalDishCost = monthDishes.reduce((sum, dish) => sum + (dish.cost * dish.quantity), 0);
        operatingOutflows.push({
          description: `Biaya Bahan Baku Menu (${monthDishes.length} item)`,
          amount: totalDishCost,
          type: 'outflow'
        });
      }

      const totalInflows = operatingInflows.reduce((sum, item) => sum + item.amount, 0);
      const totalOutflows = operatingOutflows.reduce((sum, item) => sum + item.amount, 0);
      const netOperatingCashFlow = totalInflows - totalOutflows;
      
      const beginningCash = runningCashBalance;
      const endingCash = beginningCash + netOperatingCashFlow;
      runningCashBalance = endingCash;

      monthlyFlows.push({
        month: format(month, "MMMM yyyy", { locale: id }),
        year: month.getFullYear(),
        operatingInflows,
        operatingOutflows,
        netOperatingCashFlow,
        beginningCash,
        endingCash
      });
    });

    return monthlyFlows.reverse(); // Show latest months first
  };

  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'bahan_baku': 'Pembelian Bahan Baku',
      'operasional': 'Beban Operasional',
      'gaji': 'Pembayaran Gaji',
      'sewa': 'Pembayaran Sewa',
      'listrik': 'Pembayaran Listrik',
      'air': 'Pembayaran Air',
      'gas': 'Pembayaran Gas',
      'transportasi': 'Biaya Transportasi',
      'pemasaran': 'Biaya Pemasaran',
      'perlengkapan': 'Pembelian Perlengkapan',
      'maintenance': 'Biaya Pemeliharaan',
      'lainnya': 'Pengeluaran Lainnya'
    };
    return categoryMap[category] || 'Pengeluaran Lainnya';
  };

  const monthlyFlows = getMonthlyCashFlow();
  const totalNetCashFlow = monthlyFlows.reduce((sum, month) => sum + month.netOperatingCashFlow, 0);
  const currentCashBalance = monthlyFlows.length > 0 ? monthlyFlows[0].endingCash : 0;

  // Summary for all periods
  const totalInflows = monthlyFlows.reduce((sum, month) => 
    sum + month.operatingInflows.reduce((monthSum, item) => monthSum + item.amount, 0), 0
  );
  const totalOutflows = monthlyFlows.reduce((sum, month) => 
    sum + month.operatingOutflows.reduce((monthSum, item) => monthSum + item.amount, 0), 0
  );

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Laporan Arus Kas
        </CardTitle>
        <CardDescription>
          Analisis aliran kas masuk dan keluar dari aktivitas operasional warung
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Total Arus Masuk</span>
              </div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">
                Rp {totalInflows.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">Total Arus Keluar</span>
              </div>
              <div className="text-lg font-bold text-red-800 dark:text-red-200">
                Rp {totalOutflows.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Arus Kas Bersih</span>
              </div>
              <div className={`text-lg font-bold ${totalNetCashFlow >= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                Rp {totalNetCashFlow.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Saldo Kas Akhir</span>
              </div>
              <div className={`text-lg font-bold ${currentCashBalance >= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                Rp {currentCashBalance.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>
        </div>

        {monthlyFlows.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Belum Ada Data Arus Kas</p>
            <p className="text-sm">Mulai catat transaksi untuk melihat laporan arus kas</p>
          </div>
        ) : (
          <Tabs defaultValue={monthlyFlows[0]?.month.replace(' ', '-').toLowerCase()} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1">
              {monthlyFlows.slice(0, 6).map((monthData) => (
                <TabsTrigger
                  key={monthData.month}
                  value={monthData.month.replace(' ', '-').toLowerCase()}
                  className="text-xs"
                >
                  {monthData.month.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {monthlyFlows.map((monthData) => (
              <TabsContent
                key={monthData.month}
                value={monthData.month.replace(' ', '-').toLowerCase()}
                className="space-y-4"
              >
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b">
                    <h3 className="font-semibold text-lg">Arus Kas Operasional - {monthData.month}</h3>
                  </div>
                  
                  <Table>
                    <TableBody>
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={2} className="font-semibold text-green-700 dark:text-green-400">
                          <TrendingUp className="inline h-4 w-4 mr-2" />
                          ARUS KAS MASUK
                        </TableCell>
                      </TableRow>
                      {monthData.operatingInflows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-muted-foreground italic pl-8">
                            Tidak ada arus kas masuk
                          </TableCell>
                        </TableRow>
                      ) : (
                        monthData.operatingInflows.map((item, index) => (
                          <TableRow key={`inflow-${index}`}>
                            <TableCell className="pl-8">{item.description}</TableCell>
                            <TableCell className="text-right font-mono text-green-700 dark:text-green-400">
                              Rp {item.amount.toLocaleString('id-ID')}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={2} className="font-semibold text-red-700 dark:text-red-400">
                          <TrendingDown className="inline h-4 w-4 mr-2" />
                          ARUS KAS KELUAR
                        </TableCell>
                      </TableRow>
                      {monthData.operatingOutflows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-muted-foreground italic pl-8">
                            Tidak ada arus kas keluar
                          </TableCell>
                        </TableRow>
                      ) : (
                        monthData.operatingOutflows.map((item, index) => (
                          <TableRow key={`outflow-${index}`}>
                            <TableCell className="pl-8">{item.description}</TableCell>
                            <TableCell className="text-right font-mono text-red-700 dark:text-red-400">
                              (Rp {item.amount.toLocaleString('id-ID')})
                            </TableCell>
                          </TableRow>
                        ))
                      )}

                      <TableRow className="border-t-2 bg-muted/50">
                        <TableCell className="font-bold">ARUS KAS BERSIH OPERASIONAL</TableCell>
                        <TableCell className={`text-right font-mono font-bold ${monthData.netOperatingCashFlow >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          Rp {monthData.netOperatingCashFlow.toLocaleString('id-ID')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Saldo Kas Awal Periode</TableCell>
                        <TableCell className="text-right font-mono">
                          Rp {monthData.beginningCash.toLocaleString('id-ID')}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-t bg-primary/10">
                        <TableCell className="font-bold">SALDO KAS AKHIR PERIODE</TableCell>
                        <TableCell className={`text-right font-mono font-bold ${monthData.endingCash >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          Rp {monthData.endingCash.toLocaleString('id-ID')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlow;