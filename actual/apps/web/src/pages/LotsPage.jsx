import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { mockLotes } from '@/data/mockData.js';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackageOpen, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LotsPage = () => {
  const [lots, setLots] = useState(mockLotes);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [precioInput, setPrecioInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
    setPrecioInput(lot.precioUnitario ? lot.precioUnitario.toString() : '');
    setIsModalOpen(true);
  };

  const handlePriceChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPrecioInput(val);
  };

  const handleSave = () => {
    const price = parseInt(precioInput, 10);
    if (!price || price <= 0) {
      toast.error('El precio por Kg debe ser mayor a 0.');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const valorTotal = selectedLot.cantidad * price;
      
      setLots(lots.map(lot => {
        if (lot.id === selectedLot.id) {
          return {
            ...lot,
            precioUnitario: price,
            valorTotal: valorTotal,
            estado: 'Valorizado'
          };
        }
        return lot;
      }));

      setIsSaving(false);
      setIsModalOpen(false);
      toast.success(`Lote ${selectedLot.loteId} valorizado exitosamente.`);
    }, 600);
  };

  const currentPrice = parseInt(precioInput, 10) || 0;
  const calculatedTotal = selectedLot ? selectedLot.cantidad * currentPrice : 0;

  return (
    <>
      <Helmet><title>Recepción de Lotes | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recepción de Lotes</h1>
          <p className="text-slate-500 mt-1">Gestión y valorización de lotes recibidos.</p>
        </div>

        <Card className="card-shadow overflow-hidden border-t-4 border-t-primary">
          <div className="overflow-x-auto">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Lote ID</th>
                  <th>Proveedor</th>
                  <th className="text-right">Cantidad (Kg)</th>
                  <th className="text-right">Precio por Kg</th>
                  <th className="text-right">Valor Total</th>
                  <th>Fecha</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id} onClick={() => handleRowClick(lot)} className="cursor-pointer">
                    <td className="font-medium text-slate-900 flex items-center gap-2">
                      <PackageOpen className="h-4 w-4 text-slate-400" />
                      {lot.loteId}
                    </td>
                    <td className="text-slate-700">{lot.proveedor}</td>
                    <td className="text-right font-mono text-slate-700 text-base">{lot.cantidad.toLocaleString()}</td>
                    <td className="text-right font-mono text-slate-600">
                      {lot.precioUnitario > 0 ? formatCurrency(lot.precioUnitario) : '-'}
                    </td>
                    <td className="text-right font-mono font-bold text-slate-900 text-base">
                      {lot.valorTotal > 0 ? formatCurrency(lot.valorTotal) : '-'}
                    </td>
                    <td className="text-slate-600">{lot.fecha}</td>
                    <td className="text-center">
                      {lot.estado === 'Valorizado' ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 gap-1.5 px-3 py-1 text-xs font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Valorizado
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 gap-1.5 px-3 py-1 text-xs font-medium">
                          <Clock className="h-3.5 w-3.5" /> Pendiente
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && !isSaving && setIsModalOpen(false)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">Valorizar Lote</DialogTitle>
            </DialogHeader>
            
            {selectedLot && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Lote ID</Label>
                    <div className="font-medium text-slate-900">{selectedLot.loteId}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Proveedor</Label>
                    <div className="font-medium text-slate-900">{selectedLot.proveedor}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Tipo de Plátano</Label>
                    <div className="font-medium text-slate-900">{selectedLot.tipo || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Variedad</Label>
                    <div className="font-medium text-slate-900">{selectedLot.variedad || '-'}</div>
                  </div>
                  <div className="col-span-2 pt-3 border-t border-slate-200">
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Cantidad Recibida</Label>
                    <div className="font-mono text-2xl font-bold text-primary">{selectedLot.cantidad.toLocaleString()} Kg</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="precioUnitario" className="text-sm font-semibold text-slate-900">
                      Precio por Kg (COP) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                      <Input
                        id="precioUnitario"
                        type="text"
                        className="pl-8 font-mono font-medium h-11"
                        value={precioInput ? new Intl.NumberFormat('es-CO').format(precioInput) : ''}
                        onChange={handlePriceChange}
                        placeholder="0"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-900">
                      Valor Total (COP)
                    </Label>
                    <div className="h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md flex items-center text-slate-900 font-mono font-bold text-lg">
                      {formatCurrency(calculatedTotal)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar Valorización
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LotsPage;