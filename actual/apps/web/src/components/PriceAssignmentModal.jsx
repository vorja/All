import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formatCop = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const formatKg = (value) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(Number(value) || 0);

const PriceAssignmentModal = ({ isOpen, onClose, lot, onSave, saving = false }) => {
  const [pricePerKg, setPricePerKg] = useState('');
  const totalValue = useMemo(() => {
    const price = Number(pricePerKg);
    if (!lot || !Number.isFinite(price) || price < 0) return 0;
    return Number(lot.cantidad_kg || 0) * price;
  }, [pricePerKg, lot]);

  const handleSave = () => {
    const parsed = Number(pricePerKg);
    if (lot && Number.isFinite(parsed) && parsed >= 0) {
      onSave({
        ...lot,
        precio_kg: parsed,
        valor_total: totalValue
      });
      setPricePerKg('');
      onClose();
    }
  };

  const handleCancel = () => {
    setPricePerKg('');
    onClose();
  };

  if (!lot) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Asignar Precio de Valorización</DialogTitle>
          <DialogDescription>
            Define el precio por kilogramo para calcular el valor total del lote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lote ID:</span>
              <span className="font-medium font-mono">{lot.id_lote}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Proveedor:</span>
              <span className="font-medium">{lot.proveedor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo de Plátano:</span>
              <span className="font-medium">{lot.tipo_platano || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Variedad:</span>
              <span className="font-medium">{lot.variedad || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cantidad Recibida:</span>
              <span className="font-medium">{formatKg(lot.cantidad_kg)} kg</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Precio por Kg (COP)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                className="pl-8 text-lg h-12 text-gray-900 placeholder:text-gray-400"
                step="1"
                min="0"
              />
            </div>
          </div>

          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Valor Total (COP)</p>
            <p className="text-3xl font-bold text-primary">
              {formatCop(totalValue)}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="transition-colors duration-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !pricePerKg || Number(pricePerKg) < 0}
            className="bg-primary hover:bg-primary/90 transition-colors duration-200 active:scale-[0.98]"
          >
            {saving ? 'Guardando...' : 'Guardar Valorizacion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAssignmentModal;