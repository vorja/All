import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PayrollEditModal = ({ isOpen, onClose, record, onSave }) => {
  const [formData, setFormData] = useState({
    horas_regulares_trabajadas: 0,
    valor_hora_regular: 0,
    cantidad_horas_extras: 0,
    valor_hora_extra: 0,
    recargos_nocturnos: 0,
    recargos_dominicales: 0,
    deducciones: 0
  });

  useEffect(() => {
    if (record) {
      setFormData({
        horas_regulares_trabajadas: record.horas_regulares_trabajadas || 0,
        valor_hora_regular: record.valor_hora_regular || 0,
        cantidad_horas_extras: record.cantidad_horas_extras || 0,
        valor_hora_extra: record.valor_hora_extra || 0,
        recargos_nocturnos: record.recargos_nocturnos || 0,
        recargos_dominicales: record.recargos_dominicales || 0,
        deducciones: record.deducciones || 0
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateTotal = () => {
    return (formData.horas_regulares_trabajadas * formData.valor_hora_regular) +
           (formData.cantidad_horas_extras * formData.valor_hora_extra) +
           formData.recargos_nocturnos +
           formData.recargos_dominicales -
           formData.deducciones;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do not send costo_total, system calculates it
    onSave({
      ...record,
      ...formData
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  if (!isOpen || !record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Editar Nómina: {record.empleado}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">Horas Regulares</h3>
              <div className="space-y-2">
                <Label htmlFor="horas_regulares_trabajadas">Horas Trabajadas</Label>
                <Input 
                  id="horas_regulares_trabajadas" 
                  name="horas_regulares_trabajadas" 
                  type="number" 
                  value={formData.horas_regulares_trabajadas} 
                  onChange={handleChange} 
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_hora_regular">Valor Hora Regular ($)</Label>
                <Input 
                  id="valor_hora_regular" 
                  name="valor_hora_regular" 
                  type="number" 
                  value={formData.valor_hora_regular} 
                  onChange={handleChange} 
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">Horas Extra</h3>
              <div className="space-y-2">
                <Label htmlFor="cantidad_horas_extras">Cantidad Horas Extra</Label>
                <Input 
                  id="cantidad_horas_extras" 
                  name="cantidad_horas_extras" 
                  type="number" 
                  value={formData.cantidad_horas_extras} 
                  onChange={handleChange} 
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_hora_extra">Valor Hora Extra ($)</Label>
                <Input 
                  id="valor_hora_extra" 
                  name="valor_hora_extra" 
                  type="number" 
                  value={formData.valor_hora_extra} 
                  onChange={handleChange} 
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">Recargos y Deducciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recargos_nocturnos">Recargos Nocturnos ($)</Label>
                  <Input 
                    id="recargos_nocturnos" 
                    name="recargos_nocturnos" 
                    type="number" 
                    value={formData.recargos_nocturnos} 
                    onChange={handleChange} 
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recargos_dominicales">Recargos Dominicales ($)</Label>
                  <Input 
                    id="recargos_dominicales" 
                    name="recargos_dominicales" 
                    type="number" 
                    value={formData.recargos_dominicales} 
                    onChange={handleChange} 
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deducciones" className="text-red-600">Deducciones ($)</Label>
                  <Input 
                    id="deducciones" 
                    name="deducciones" 
                    type="number" 
                    value={formData.deducciones} 
                    onChange={handleChange} 
                    min="0"
                    className="border-red-200 focus-visible:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-slate-700">Costo Total Calculado:</span>
            <span className="text-2xl font-bold text-slate-900 font-mono">{formatCurrency(calculateTotal())}</span>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary text-white">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollEditModal;