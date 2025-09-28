import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Minus } from "lucide-react";

interface MonthlyExpenseFormProps {
  onSubmit: (entry: {
    date: string;
    amount: number;
    description: string;
    category: string;
    type: 'monthly';
  }) => void;
}

const expenseCategories = [
  { value: "sewa", label: "Sewa Tempat" },
  { value: "gaji", label: "Gaji Bulanan" },
  { value: "utilities", label: "Listrik & Air" },
  { value: "maintenance", label: "Perawatan Rutin" },
  { value: "insurance", label: "Asuransi" },
  { value: "marketing", label: "Marketing" },
  { value: "lainnya", label: "Lainnya" }
];

const MonthlyExpenseForm = ({ onSubmit }: MonthlyExpenseFormProps) => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const months = [
    { value: "0", label: "Januari" },
    { value: "1", label: "Februari" },
    { value: "2", label: "Maret" },
    { value: "3", label: "April" },
    { value: "4", label: "Mei" },
    { value: "5", label: "Juni" },
    { value: "6", label: "Juli" },
    { value: "7", label: "Agustus" },
    { value: "8", label: "September" },
    { value: "9", label: "Oktober" },
    { value: "10", label: "November" },
    { value: "11", label: "Desember" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!month || !year || !amount || !category) {
      return;
    }

    // Create date for the first day of the selected month/year
    const date = new Date(parseInt(year), parseInt(month), 1);

    onSubmit({
      date: date.toISOString(),
      amount: parseFloat(amount),
      description: description || `Pengeluaran bulanan ${months[parseInt(month)].label} ${year}`,
      category,
      type: 'monthly'
    });

    // Reset form
    setMonth("");
    setYear("");
    setAmount("");
    setDescription("");
    setCategory("");
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minus className="h-5 w-5 text-destructive" />
          Input Pengeluaran Bulanan
        </CardTitle>
        <CardDescription>
          Catat pengeluaran bulanan tetap warung makan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Pengeluaran (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori pengeluaran" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Keterangan (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Contoh: Sewa warung, gaji karyawan, dll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-destructive hover:bg-destructive/90 transition-colors"
            disabled={!month || !year || !amount || !category}
          >
            <Minus className="mr-2 h-4 w-4" />
            Tambah Pengeluaran Bulanan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseForm;