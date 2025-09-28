import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Calendar, FilterX } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DataTableProps {
  title: string;
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  onEdit?: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
  editFields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  editFields = []
}) => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date>();

  // Filter data by selected date
  const filteredData = dateFilter
    ? data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === dateFilter.toDateString();
      })
    : data;

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditFormData(item);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (onEdit && editingItem) {
      onEdit(editingItem.id, editFormData);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditFormData({});
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const renderEditField = (field: any) => {
    const value = editFormData[field.key] || '';

    switch (field.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setEditFormData(prev => ({
              ...prev,
              [field.key]: parseFloat(e.target.value) || 0
            }))}
          />
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "dd/MM/yyyy") : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => setEditFormData(prev => ({
                  ...prev,
                  [field.key]: date?.toISOString().split('T')[0] || ''
                }))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'select':
        return (
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={value}
            onChange={(e) => setEditFormData(prev => ({
              ...prev,
              [field.key]: e.target.value
            }))}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => setEditFormData(prev => ({
              ...prev,
              [field.key]: e.target.value
            }))}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Filter Tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {dateFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateFilter(undefined)}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead>Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {dateFilter ? 'Tidak ada data untuk tanggal yang dipilih' : 'Tidak ada data'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render 
                          ? column.render(item[column.key], item)
                          : item[column.key]
                        }
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {onEdit && (
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Data</DialogTitle>
                                  <DialogDescription>
                                    Ubah data yang diperlukan
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {editFields.map((field) => (
                                    <div key={field.key} className="space-y-2">
                                      <Label>{field.label}</Label>
                                      {renderEditField(field)}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                  >
                                    Batal
                                  </Button>
                                  <Button onClick={handleEditSubmit}>
                                    Simpan
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {onDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Yakin ingin menghapus?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Data yang dihapus tidak dapat dikembalikan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};