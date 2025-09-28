import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChefHat, TrendingUp, Award, Target } from "lucide-react";
import { useState } from "react";

interface DishEntry {
  id: string;
  date: string;
  name: string;
  revenue: number;
  cost: number;
  quantity: number;
}

interface DishAnalysisProps {
  dishEntries: DishEntry[];
}

const DishAnalysis = ({ dishEntries }: DishAnalysisProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Filter dishes by period
  const filteredDishes = dishEntries.filter(dish => {
    if (selectedPeriod === "all") return true;
    
    const dishDate = new Date(dish.date);
    const now = new Date();
    
    switch (selectedPeriod) {
      case "thisMonth":
        return dishDate.getMonth() === now.getMonth() && dishDate.getFullYear() === now.getFullYear();
      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return dishDate.getMonth() === lastMonth.getMonth() && dishDate.getFullYear() === lastMonth.getFullYear();
      case "thisYear":
        return dishDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  // Analyze dishes
  const dishAnalysis = filteredDishes.reduce((acc, dish) => {
    if (!acc[dish.name]) {
      acc[dish.name] = {
        name: dish.name,
        totalQuantity: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        avgPrice: 0,
        avgCost: 0,
        profitMargin: 0
      };
    }
    
    const profit = (dish.revenue - dish.cost) * dish.quantity;
    acc[dish.name].totalQuantity += dish.quantity;
    acc[dish.name].totalRevenue += dish.revenue * dish.quantity;
    acc[dish.name].totalCost += dish.cost * dish.quantity;
    acc[dish.name].totalProfit += profit;
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and margins
  Object.values(dishAnalysis).forEach((dish: any) => {
    dish.avgPrice = dish.totalRevenue / dish.totalQuantity;
    dish.avgCost = dish.totalCost / dish.totalQuantity;
    dish.profitMargin = (dish.totalProfit / dish.totalRevenue) * 100;
  });

  const sortedDishes = Object.values(dishAnalysis).sort((a: any, b: any) => b.totalProfit - a.totalProfit);

  // Top performers
  const mostProfitable = sortedDishes[0];
  const highestMargin = sortedDishes.sort((a: any, b: any) => b.profitMargin - a.profitMargin)[0];
  const bestSeller = sortedDishes.sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)[0];

  const totalProfit = sortedDishes.reduce((sum: number, dish: any) => sum + dish.totalProfit, 0);
  const totalRevenue = sortedDishes.reduce((sum: number, dish: any) => sum + dish.totalRevenue, 0);

  // Chart data
  const profitChartData = sortedDishes.slice(0, 8).map((dish: any) => ({
    name: dish.name.length > 15 ? dish.name.substring(0, 15) + '...' : dish.name,
    profit: dish.totalProfit,
    margin: dish.profitMargin
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            Analisis Menu & Keuntungan
          </CardTitle>
          <CardDescription>
            Analisis menu mana yang paling menguntungkan untuk warung makan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Periode:</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="thisMonth">Bulan Ini</SelectItem>
                <SelectItem value="lastMonth">Bulan Lalu</SelectItem>
                <SelectItem value="thisYear">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-profit-light p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-profit" />
                <span className="text-sm font-medium">Total Keuntungan</span>
              </div>
              <div className="text-2xl font-bold text-profit">
                Rp {totalProfit.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Menu Terlaris</span>
              </div>
              <div className="text-lg font-bold text-primary">
                {bestSeller?.name || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                {bestSeller?.totalQuantity || 0} porsi
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Margin Terbaik</span>
              </div>
              <div className="text-lg font-bold text-secondary">
                {highestMargin?.name || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                {highestMargin?.profitMargin?.toFixed(1) || 0}%
              </div>
            </div>

            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Jenis Menu</span>
              </div>
              <div className="text-2xl font-bold text-accent">
                {sortedDishes.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Total menu
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Bar Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Keuntungan per Menu</CardTitle>
            <CardDescription>Menu dengan keuntungan terbesar</CardDescription>
          </CardHeader>
          <CardContent>
            {profitChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Keuntungan']}
                  />
                  <Bar dataKey="profit" fill="hsl(var(--profit))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Belum ada data menu
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profit Distribution Pie Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Distribusi Keuntungan</CardTitle>
            <CardDescription>Kontribusi keuntungan per menu</CardDescription>
          </CardHeader>
          <CardContent>
            {profitChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profitChartData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="profit"
                  >
                    {profitChartData.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Belum ada data menu
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Menu Table */}
      {sortedDishes.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Detail Keuntungan per Menu</CardTitle>
            <CardDescription>Analisis lengkap keuntungan setiap menu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Menu</th>
                    <th className="text-right py-2">Terjual</th>
                    <th className="text-right py-2">Rata² Harga</th>
                    <th className="text-right py-2">Rata² Biaya</th>
                    <th className="text-right py-2">Total Keuntungan</th>
                    <th className="text-right py-2">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDishes.map((dish: any, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-2 font-medium">{dish.name}</td>
                      <td className="text-right py-2">{dish.totalQuantity}</td>
                      <td className="text-right py-2">Rp {Math.round(dish.avgPrice).toLocaleString('id-ID')}</td>
                      <td className="text-right py-2">Rp {Math.round(dish.avgCost).toLocaleString('id-ID')}</td>
                      <td className="text-right py-2 font-semibold text-profit">
                        Rp {dish.totalProfit.toLocaleString('id-ID')}
                      </td>
                      <td className="text-right py-2 font-semibold">
                        {dish.profitMargin.toFixed(1)}%
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

export default DishAnalysis;