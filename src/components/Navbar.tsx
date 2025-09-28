import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  PlusCircle, 
  User, 
  LogOut, 
  Calendar,
  Minus,
  ChefHat,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DailyIncomeForm from './DailyIncomeForm';
import MonthlyIncomeForm from './MonthlyIncomeForm';
import * as XLSX from 'xlsx';

interface NavbarProps {
  onIncomeSubmit: (entry: any) => void;
  onExportExcel: () => void;
  incomeEntries: any[];
  expenseEntries: any[];
  dishEntries: any[];
}

const Navbar: React.FC<NavbarProps> = ({
  onIncomeSubmit,
  onExportExcel,
  incomeEntries,
  expenseEntries,
  dishEntries
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleIncomeSubmit = (entry: any) => {
    onIncomeSubmit(entry);
    setIsSheetOpen(false);
  };

  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Income sheet
    const incomeData = incomeEntries.map(entry => ({
      'Tanggal': entry.date,
      'Jumlah': entry.amount,
      'Keterangan': entry.description,
      'Tipe': entry.type
    }));
    const incomeWs = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(wb, incomeWs, 'Pemasukan');

    // Expense sheet
    const expenseData = expenseEntries.map(entry => ({
      'Tanggal': entry.date,
      'Jumlah': entry.amount,
      'Keterangan': entry.description,
      'Kategori': entry.category,
      'Tipe': entry.type
    }));
    const expenseWs = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, expenseWs, 'Pengeluaran');

    // Dish sheet
    const dishData = dishEntries.map(entry => ({
      'Tanggal': entry.date,
      'Nama Menu': entry.name,
      'Pendapatan': entry.revenue,
      'Biaya': entry.cost,
      'Kuantitas': entry.quantity,
      'Keuntungan': entry.revenue - entry.cost
    }));
    const dishWs = XLSX.utils.json_to_sheet(dishData);
    XLSX.utils.book_append_sheet(wb, dishWs, 'Menu');

    // Summary sheet
    const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpense = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalProfit = totalIncome - totalExpense;

    const summaryData = [
      { 'Kategori': 'Total Pemasukan', 'Jumlah': totalIncome },
      { 'Kategori': 'Total Pengeluaran', 'Jumlah': totalExpense },
      { 'Kategori': 'Keuntungan Bersih', 'Jumlah': totalProfit }
    ];
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Ringkasan');

    // Save file
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `laporan-warung-${today}.xlsx`);
  };

  if (!user) {
    return (
      <nav className="bg-gradient-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Sistem Warung Makan</h1>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/auth')}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Sistem Warung Makan</h1>
          
          <div className="flex items-center gap-4">
            {/* Quick Add Income Button */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Pemasukan
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Tambah Pemasukan</SheetTitle>
                  <SheetDescription>
                    Pilih tipe pemasukan yang ingin ditambahkan
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Pemasukan Harian</h3>
                    <DailyIncomeForm onSubmit={handleIncomeSubmit} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Pemasukan Bulanan</h3>
                    <MonthlyIncomeForm onSubmit={handleIncomeSubmit} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Export Button */}
            <Button 
              onClick={exportToExcel}
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <User className="h-4 w-4 mr-2" />
                  {profile?.display_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50 bg-background border shadow-lg">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.display_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.role || 'cashier'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;