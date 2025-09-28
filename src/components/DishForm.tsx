import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChefHat } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

const MENU_ITEMS = {
  "Makanan": [
    { name: "Nasi putih", price: 3000 },
    { name: "Ayam bakar", price: 10000 },
    { name: "Ayam goreng", price: 10000 },
    { name: "Ayam kecap", price: 10000 },
    { name: "Ayam cabe ijo", price: 10000 },
    { name: "Ayam cabe merah", price: 10000 },
    { name: "Ayam sayur", price: 10000 },
    { name: "Ayam saus padang", price: 10000 },
    { name: "Rendang", price: 12000 },
    { name: "Cincang", price: 12000 },
    { name: "Telur dadar", price: 7000 },
    { name: "Telur bulat", price: 5000 },
    { name: "Ikan nila", price: 10000 },
    { name: "Ikan lele", price: 10000 },
    { name: "Ikan mas", price: 10000 },
    { name: "Ikan kembung", price: 10000 },
    { name: "Ikan tuna", price: 10000 },
    { name: "Kepala ikan tuna", price: 15000 },
    { name: "Udang balado", price: 15000 },
    { name: "Udang crispy", price: 15000 },
    { name: "Udang peyek", price: 8000 },
    { name: "Ati ampela", price: 10000 },
    { name: "Perkedel", price: 4000 },
    { name: "Tahu", price: 2000 },
    { name: "Tempe", price: 2000 },
    { name: "Bakwan jagung", price: 2000 },
    { name: "Kerupuk", price: 3000 },
    { name: "Peyek kacang", price: 5000 },
    { name: "Tumis tahu kacang", price: 3000 },
    { name: "Gulai tunjang", price: 25000 },
    { name: "Sop iga sapi", price: 25000 },
    { name: "Jengkol balado", price: 10000 },
    { name: "Cumi", price: 15000 },
    { name: "Telur asin", price: 8000 },
    { name: "Sop ayam", price: 10000 },
    { name: "Gulai kepala kakap", price: 25000 },
    { name: "Terong balado", price: 4000 }
  ],
  "Minuman": [
    { name: "Air mineral", price: 5000 },
    { name: "Teh pucuk", price: 5000 },
    { name: "Floridina", price: 5000 },
    { name: "Teh botol", price: 5000 },
    { name: "Kratindeng", price: 7000 },
    { name: "Susu ultra", price: 5000 },
    { name: "Mi-zone", price: 7000 },
    { name: "Sprite", price: 7000 },
    { name: "Larutan", price: 8000 },
    { name: "Teh rio", price: 2000 },
    { name: "Teh botol plastik", price: 7000 },
    { name: "Golda coffee", price: 5000 },
    { name: "Pulpy orange", price: 8000 },
    { name: "Pocari", price: 8000 },
    { name: "Fanta", price: 7000 },
    { name: "Adem sari cingku", price: 8000 },
    { name: "Teds", price: 8000 },
    { name: "Yakult", price: 3000 },
    { name: "Aqua tanggung", price: 5000 },
    { name: "Kaki 3 besar", price: 8000 },
    { name: "Kaki 3 kecil", price: 4000 },
    { name: "Kopi kapal", price: 2000 },
    { name: "Milo", price: 5000 },
    { name: "Bonteh", price: 5000 },
    { name: "Aquaviva", price: 5000 }
  ]
};

interface DishFormProps {
  onSubmit: (entry: {
    date: string;
    name: string;
    revenue: number;
    cost: number;
    quantity: number;
  }) => void;
}

const DishForm = ({ onSubmit }: DishFormProps) => {
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState("");
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleMenuSelect = (value: string) => {
    if (value === "custom") {
      setName("");
      setRevenue("");
      return;
    }

    // Find the selected menu item
    for (const category of Object.values(MENU_ITEMS)) {
      const item = category.find(item => `${item.name}-${item.price}` === value);
      if (item) {
        setName(item.name);
        setRevenue(item.price.toString());
        break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !name || !revenue || !cost || !quantity) {
      return;
    }

    onSubmit({
      date: date.toISOString(),
      name,
      revenue: parseFloat(revenue),
      cost: parseFloat(cost),
      quantity: parseInt(quantity)
    });

    // Reset form
    setDate(undefined);
    setName("");
    setRevenue("");
    setCost("");
    setQuantity("");
  };

  const profit = revenue && cost ? parseFloat(revenue) - parseFloat(cost) : 0;
  const profitMargin = revenue && cost ? ((parseFloat(revenue) - parseFloat(cost)) / parseFloat(revenue) * 100) : 0;

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-secondary" />
          Input Data Menu
        </CardTitle>
        <CardDescription>
          Catat data penjualan dan biaya per menu untuk analisis keuntungan
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
              <Label>Pilih Menu (Opsional)</Label>
              <Select onValueChange={handleMenuSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih dari menu atau input manual" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-[300px]">
                  <SelectItem value="custom">Input Manual</SelectItem>
                  {Object.entries(MENU_ITEMS).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        {category}
                      </div>
                      {items.map((item) => (
                        <SelectItem 
                          key={`${item.name}-${item.price}`} 
                          value={`${item.name}-${item.price}`}
                        >
                          {item.name} - Rp {item.price.toLocaleString('id-ID')}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Menu</Label>
            <Input
              id="name"
              type="text"
              placeholder="Contoh: Nasi Gudeg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah Terjual</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Harga Jual per Porsi (Rp)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="0"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="text-lg font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Biaya per Porsi (Rp)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="text-lg font-semibold"
                required
              />
            </div>
          </div>

          {revenue && cost && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Keuntungan per Porsi:</span>
                  <div className={`font-semibold ${profit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                    Rp {profit.toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Margin Keuntungan:</span>
                  <div className={`font-semibold ${profitMargin >= 0 ? 'text-profit' : 'text-destructive'}`}>
                    {profitMargin.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Keuntungan:</span>
                  <div className={`font-semibold ${profit >= 0 ? 'text-profit' : 'text-destructive'}`}>
                    Rp {quantity ? (profit * parseInt(quantity)).toLocaleString('id-ID') : '0'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-secondary hover:opacity-90 transition-opacity"
            disabled={!date || !name || !revenue || !cost || !quantity}
          >
            <ChefHat className="mr-2 h-4 w-4" />
            Tambah Data Menu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DishForm;