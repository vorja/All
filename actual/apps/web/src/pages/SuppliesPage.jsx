import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { mockInsumos } from '@/data/mockData.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const SuppliesPage = () => {
  const [supplies, setSupplies] = useState(mockInsumos);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStockChange = (id, value) => {
    const val = parseInt(value, 10) || 0;
    setSupplies(supplies.map(s => {
      if (s.id === id) {
        return { ...s, stockActual: val, ultimaAct: new Date().toISOString().split('T')[0] };
      }
      return s;
    }));
  };

  const getStockColor = (actual, min) => {
    if (actual <= min) return 'text-red-600 font-bold bg-red-50';
    if (actual <= min * 1.5) return 'text-amber-600 font-bold bg-amber-50';
    return 'text-slate-900';
  };

  return (
    <>
      <Helmet><title>Insumos y Empaque | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventario de Insumos</h1>
            <p className="text-slate-500 mt-1">Control de materiales de empaque y químicos.</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Insumo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Insumo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Nombre</Label>
                  <Input className="col-span-3" placeholder="Ej: Cintas adhesivas" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Unidad</Label>
                  <Input className="col-span-3" placeholder="Ej: rollos" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Stock Inicial</Label>
                  <Input type="number" className="col-span-3" placeholder="0" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Stock Mínimo</Label>
                  <Input type="number" className="col-span-3" placeholder="0" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={() => setIsModalOpen(false)}>Guardar Insumo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nombre del Insumo</th>
                  <th className="px-6 py-4 font-semibold text-center">Stock Actual</th>
                  <th className="px-6 py-4 font-semibold text-center">Mínimo</th>
                  <th className="px-6 py-4 font-semibold text-center">Máximo</th>
                  <th className="px-6 py-4 font-semibold">Última Act.</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplies.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.nombre}
                      <span className="block text-xs text-slate-400 font-normal mt-0.5">({item.unidad})</span>
                    </td>
                    <td className="px-6 py-4">
                      <Input 
                        type="number" 
                        value={item.stockActual} 
                        onChange={(e) => handleStockChange(item.id, e.target.value)}
                        className={`w-24 mx-auto text-center font-mono ${getStockColor(item.stockActual, item.minimo)}`}
                      />
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-500">{item.minimo.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-500">{item.maximo.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{item.ultimaAct}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SuppliesPage;