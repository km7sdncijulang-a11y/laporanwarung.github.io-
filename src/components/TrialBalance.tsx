import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

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

interface TrialBalanceProps {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
  dishEntries: DishEntry[];
}

interface AccountBalance {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debit: number;
  credit: number;
  balance: number;
}

const TrialBalance = ({ incomeEntries, expenseEntries, dishEntries }: TrialBalanceProps) => {
  const calculateAccountBalances = (): AccountBalance[] => {
    const accounts: { [key: string]: AccountBalance } = {};

    // Initialize accounts
    const initAccount = (code: string, name: string, type: AccountBalance['type']) => {
      if (!accounts[code]) {
        accounts[code] = { code, name, type, debit: 0, credit: 0, balance: 0 };
      }
    };

    // Asset accounts
    initAccount('110', 'Kas', 'asset');
    initAccount('120', 'Persediaan Bahan Baku', 'asset');

    // Revenue accounts
    initAccount('410', 'Pendapatan Penjualan', 'revenue');

    // Expense accounts
    initAccount('510', 'Harga Pokok Penjualan', 'expense');
    initAccount('520', 'Beban Bahan Baku', 'expense');
    initAccount('530', 'Beban Operasional', 'expense');
    initAccount('540', 'Beban Gaji', 'expense');
    initAccount('550', 'Beban Sewa', 'expense');
    initAccount('560', 'Beban Listrik', 'expense');
    initAccount('570', 'Beban Air', 'expense');
    initAccount('580', 'Beban Gas', 'expense');
    initAccount('590', 'Beban Transportasi', 'expense');
    initAccount('600', 'Beban Pemasaran', 'expense');
    initAccount('610', 'Beban Perlengkapan', 'expense');
    initAccount('620', 'Beban Pemeliharaan', 'expense');
    initAccount('690', 'Beban Lain-lain', 'expense');

    // Process income entries
    incomeEntries.forEach(income => {
      accounts['110'].debit += income.amount; // Kas
      accounts['410'].credit += income.amount; // Pendapatan Penjualan
    });

    // Process dish entries
    dishEntries.forEach(dish => {
      const totalRevenue = dish.revenue * dish.quantity;
      const totalCost = dish.cost * dish.quantity;

      // Revenue
      accounts['110'].debit += totalRevenue; // Kas
      accounts['410'].credit += totalRevenue; // Pendapatan Penjualan

      // Cost
      accounts['510'].debit += totalCost; // HPP
      accounts['120'].credit += totalCost; // Persediaan
    });

    // Process expense entries
    expenseEntries.forEach(expense => {
      const accountCode = getExpenseAccountCode(expense.category);
      initAccount(accountCode, getExpenseAccountName(expense.category), 'expense');
      
      accounts[accountCode].debit += expense.amount;
      accounts['110'].credit += expense.amount; // Kas
    });

    // Calculate balances
    Object.values(accounts).forEach(account => {
      if (account.type === 'asset' || account.type === 'expense') {
        account.balance = account.debit - account.credit;
      } else {
        account.balance = account.credit - account.debit;
      }
    });

    // Filter out accounts with zero balance and sort by code
    return Object.values(accounts)
      .filter(account => account.debit !== 0 || account.credit !== 0)
      .sort((a, b) => a.code.localeCompare(b.code));
  };

  const getExpenseAccountCode = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'bahan_baku': '520',
      'operasional': '530',
      'gaji': '540',
      'sewa': '550',
      'listrik': '560',
      'air': '570',
      'gas': '580',
      'transportasi': '590',
      'pemasaran': '600',
      'perlengkapan': '610',
      'maintenance': '620',
      'lainnya': '690'
    };
    return categoryMap[category] || '690';
  };

  const getExpenseAccountName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'bahan_baku': 'Beban Bahan Baku',
      'operasional': 'Beban Operasional',
      'gaji': 'Beban Gaji',
      'sewa': 'Beban Sewa',
      'listrik': 'Beban Listrik',
      'air': 'Beban Air',
      'gas': 'Beban Gas',
      'transportasi': 'Beban Transportasi',
      'pemasaran': 'Beban Pemasaran',
      'perlengkapan': 'Beban Perlengkapan',
      'maintenance': 'Beban Pemeliharaan',
      'lainnya': 'Beban Lain-lain'
    };
    return categoryMap[category] || 'Beban Lain-lain';
  };

  const getAccountTypeLabel = (type: AccountBalance['type']): string => {
    const typeMap = {
      'asset': 'Aset',
      'liability': 'Kewajiban',
      'equity': 'Ekuitas',
      'revenue': 'Pendapatan',
      'expense': 'Beban'
    };
    return typeMap[type];
  };

  const getAccountTypeColor = (type: AccountBalance['type']): string => {
    const colorMap = {
      'asset': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'liability': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'equity': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'revenue': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'expense': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colorMap[type];
  };

  const accounts = calculateAccountBalances();
  const totalDebit = accounts.reduce((total, account) => total + account.debit, 0);
  const totalCredit = accounts.reduce((total, account) => total + account.credit, 0);

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Neraca Saldo
        </CardTitle>
        <CardDescription>
          Daftar saldo semua akun untuk memastikan keseimbangan debit dan kredit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20">Kode</TableHead>
                <TableHead>Nama Akun</TableHead>
                <TableHead className="w-32">Jenis</TableHead>
                <TableHead className="w-32 text-right">Debit (Rp)</TableHead>
                <TableHead className="w-32 text-right">Kredit (Rp)</TableHead>
                <TableHead className="w-32 text-right">Saldo (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada saldo akun yang tercatat
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.code} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-medium">{account.code}</TableCell>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getAccountTypeColor(account.type)}`}
                      >
                        {getAccountTypeLabel(account.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {account.debit > 0 ? account.debit.toLocaleString('id-ID') : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {account.credit > 0 ? account.credit.toLocaleString('id-ID') : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      <span className={account.balance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        {Math.abs(account.balance).toLocaleString('id-ID')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {accounts.length > 0 && (
                <TableRow className="bg-muted/80 font-bold border-t-2">
                  <TableCell colSpan={3} className="text-right">TOTAL</TableCell>
                  <TableCell className="text-right font-mono">
                    {totalDebit.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {totalCredit.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={totalDebit === totalCredit ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {totalDebit === totalCredit ? "SEIMBANG" : "TIDAK SEIMBANG"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {accounts.length > 0 && (
          <div className="mt-6 bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Jumlah Akun:</span>
                <div className="font-semibold text-primary">
                  {accounts.length} akun
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Selisih:</span>
                <div className={`font-semibold ${totalDebit === totalCredit ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                  Rp {Math.abs(totalDebit - totalCredit).toLocaleString('id-ID')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className={`font-semibold ${totalDebit === totalCredit ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                  {totalDebit === totalCredit ? 'Seimbang ✓' : 'Perlu Koreksi ⚠️'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialBalance;