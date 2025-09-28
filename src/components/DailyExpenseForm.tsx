import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Minus } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DailyExpenseFormProps {
  onSubmit: (entry: {
    date: string;
    amount: number;
    description: string;
    category: string;
    type: 'daily';
  }) => void;
}

const expenseCategories = [
  { value: "bahan-baku", label: "Bahan Baku" },
  { value: "gas", label: "Gas" },
  { value: "listrik", label: "Listrik" },
  { value: "air", label: "Air" },
  { value: "kemasan", label: "Kemasan" },
  { value: "gaji", label: "Gaji Karyawan" },
  { value: "transportasi", label: "Transportasi" },
  { value: "maintenance", label: "Perawatan" },
  { value: "lainnya", label: "Lainnya" }
];

const DailyExpenseForm = ({ onSubmit }: DailyExpenseFormProps) => {
  const [date, setDate] = useState<Date>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !amount || !category) {
      return;
    }

    onSubmit({
      date: date.toISOString(),
      amount: parseFloat(amount),
      description: description || "Pengeluaran harian",
      category,
      type: 'daily'
    });

    // Reset form
    setDate(undefined);
    setAmount("");
    setDescription("");
    setCategory("");
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minus className="h-5 w-5 text-destructive" />
          Input Pengeluaran Harian
        </CardTitle>
        <CardDescription>
          Catat pengeluaran harian warung makan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
              placeholder="Contoh: Beli beras 25kg, bayar listrik, dll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-destructive hover:bg-destructive/90 transition-colors"
            disabled={!date || !amount || !category}
          >
            <Minus className="mr-2 h-4 w-4" />
            Tambah Pengeluaran
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailyExpenseForm;