import React, { useState, useEffect } from 'react';
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

const PriceAssignmentModal = ({ isOpen, onClose, reception, onSave }) => {
  const [pricePerKg, setPricePerKg] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (pricePerKg && reception) {
      const price = parseFloat(pricePerKg) || 0;
      const total = price * reception.weight;
      setTotalValue(total);
    } else {
      setTotalValue(0);
    }
  }, [pricePerKg, reception]);

  const handleSave = () => {
    if (pricePerKg && parseFloat(pricePerKg) > 0) {
      onSave({
        ...reception,
        pricePerKg: parseFloat(pricePerKg),
        totalValue: totalValue,
      });
      setPricePerKg('');
      setTotalValue(0);
      onClose();
    }
  };

  const handleCancel = () => {
    setPricePerKg('');
    setTotalValue(0);
    onClose();
  };

  if (!reception) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Asignar Precio de Valorización</DialogTitle>
          <DialogDescription>
            Ingrese el precio por kilogramo para calcular el valor total a pagar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reception Summary */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lote:</span>
              <span className="font-medium">{reception.lot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Proveedor:</span>
              <span className="font-medium">{reception.supplier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peso Bruto:</span>
              <span className="font-medium">{reception.weight.toLocaleString('es-CO')} kg</span>
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Precio por Kilogramo (COP)
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
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Total Value Display */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Valor Total a Pagar</p>
            <p className="text-3xl font-bold text-primary">
              ${totalValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP
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
            disabled={!pricePerKg || parseFloat(pricePerKg) <= 0}
            className="bg-primary hover:bg-primary/90 transition-colors duration-200 active:scale-[0.98]"
          >
            Guardar Valorización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAssignmentModal;