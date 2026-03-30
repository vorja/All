import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ValorizationModal = ({ isOpen, onClose, lot, onSave }) => {
  const [tipo, setTipo] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');

  useEffect(() => {
    if (lot) {
      setTipo(lot.tipo || '');
      setPrecioUnitario(lot.precioUnitario ? lot.precioUnitario.toString() : '');
    }
  }, [lot]);

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handlePriceChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPrecioUnitario(val);
  };

  const handleSave = () => {
    if (!tipo) {
      toast.error('Debe seleccionar el tipo de plátano.');
      return;
    }

    const price = parseInt(precioUnitario, 10);
    if (!price || price <= 0) {
      toast.error('El precio por Kg debe ser mayor a 0.');
      return;
    }

    const valorTotal = lot.cantidad * price;

    onSave({
      ...lot,
      tipo,
      precioUnitario: price,
      valorTotal,
      estado: 'Valorizado'
    });
  };

  if (!lot) return null;

  const currentPrice = parseInt(precioUnitario, 10) || 0;
  const calculatedTotal = lot.cantidad * currentPrice;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Valorizar Lote</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <Label className="text-slate-500 text-xs uppercase tracking-wider">Lote ID</Label>
              <div className="font-medium text-slate-900">{lot.loteId}</div>
            </div>
            <div>
              <Label className="text-slate-500 text-xs uppercase tracking-wider">Fecha</Label>
              <div className="font-medium text-slate-900">{lot.fecha}</div>
            </div>
            <div>
              <Label className="text-slate-500 text-xs uppercase tracking-wider">Proveedor</Label>
              <div className="font-medium text-slate-900">{lot.proveedor}</div>
            </div>
            <div>
              <Label className="text-slate-500 text-xs uppercase tracking-wider">Variedad</Label>
              <div className="font-medium text-slate-900">{lot.variedad || '-'}</div>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <Label className="text-slate-500 text-xs uppercase tracking-wider">Cantidad Recibida</Label>
              <div className="font-mono text-xl font-semibold text-primary">{lot.cantidad.toLocaleString()} Kg</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-semibold text-slate-900">
                Tipo de Plátano <span className="text-red-500">*</span>
              </Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="tipo" className="w-full bg-white">
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primera">Primera</SelectItem>
                  <SelectItem value="Segunda">Segunda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precioUnitario" className="text-sm font-semibold text-slate-900">
                  Precio por Kg (COP) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                  <Input
                    id="precioUnitario"
                    type="text"
                    className="pl-8 font-mono font-medium"
                    value={precioUnitario ? new Intl.NumberFormat('es-CO').format(precioUnitario) : ''}
                    onChange={handlePriceChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-900">
                  Valor Total (COP)
                </Label>
                <div className="h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md flex items-center text-slate-900 font-mono font-bold">
                  {formatCurrency(calculatedTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
            Guardar Valorización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValorizationModal;