import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { format } from "date-fns";
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

interface GeneralJournalProps {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
  dishEntries: DishEntry[];
}

interface JournalEntry {
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference: string;
  type: 'income' | 'expense' | 'dish';
}

const GeneralJournal = ({ incomeEntries, expenseEntries, dishEntries }: GeneralJournalProps) => {
  const createJournalEntries = (): JournalEntry[] => {
    const entries: JournalEntry[] = [];

    // Process income entries
    incomeEntries.forEach(income => {
      entries.push({
        date: income.date,
        description: income.description,
        debitAccount: "Kas",
        creditAccount: "Pendapatan Penjualan",
        amount: income.amount,
        reference: `INC-${income.id.slice(-6)}`,
        type: 'income'
      });
    });

    // Process expense entries
    expenseEntries.forEach(expense => {
      const expenseAccount = getExpenseAccount(expense.category);
      entries.push({
        date: expense.date,
        description: expense.description,
        debitAccount: expenseAccount,
        creditAccount: "Kas",
        amount: expense.amount,
        reference: `EXP-${expense.id.slice(-6)}`,
        type: 'expense'
      });
    });

    // Process dish entries (revenue)
    dishEntries.forEach(dish => {
      const totalRevenue = dish.revenue * dish.quantity;
      const totalCost = dish.cost * dish.quantity;

      // Revenue entry
      entries.push({
        date: dish.date,
        description: `Penjualan ${dish.name} (${dish.quantity} porsi)`,
        debitAccount: "Kas",
        creditAccount: "Pendapatan Penjualan",
        amount: totalRevenue,
        reference: `DISH-${dish.id.slice(-6)}-R`,
        type: 'dish'
      });

      // Cost entry
      entries.push({
        date: dish.date,
        description: `HPP ${dish.name} (${dish.quantity} porsi)`,
        debitAccount: "Harga Pokok Penjualan",
        creditAccount: "Persediaan Bahan Baku",
        amount: totalCost,
        reference: `DISH-${dish.id.slice(-6)}-C`,
        type: 'dish'
      });
    });

    // Sort by date
    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getExpenseAccount = (category: string): string => {
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

  const journalEntries = createJournalEntries();
  let runningNumber = 1;

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Jurnal Umum
        </CardTitle>
        <CardDescription>
          Catatan kronologis semua transaksi keuangan dengan sistem debit-kredit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">No</TableHead>
                <TableHead className="w-32">Tanggal</TableHead>
                <TableHead className="w-24">Ref</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="w-40">Akun Debit</TableHead>
                <TableHead className="w-40">Akun Kredit</TableHead>
                <TableHead className="w-32 text-right">Jumlah (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Belum ada transaksi yang dicatat
                  </TableCell>
                </TableRow>
              ) : (
                journalEntries.map((entry, index) => (
                  <TableRow key={`${entry.reference}-${index}`} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{runningNumber++}</TableCell>
                    <TableCell>
                      {format(new Date(entry.date), "dd/MM/yyyy", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {entry.reference}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={entry.description}>
                        {entry.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        {entry.debitAccount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        {entry.creditAccount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {entry.amount.toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {journalEntries.length > 0 && (
          <div className="mt-6 bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Transaksi:</span>
                <div className="font-semibold text-primary">
                  {journalEntries.length} entri
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Debit:</span>
                <div className="font-semibold text-green-700 dark:text-green-400">
                  Rp {journalEntries.reduce((total, entry) => total + entry.amount, 0).toLocaleString('id-ID')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Kredit:</span>
                <div className="font-semibold text-red-700 dark:text-red-400">
                  Rp {journalEntries.reduce((total, entry) => total + entry.amount, 0).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralJournal;