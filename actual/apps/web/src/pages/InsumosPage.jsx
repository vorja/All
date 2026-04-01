import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { mockInsumos } from '@/data/mockData.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Minus, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const InsumosPage = () => {
  const [insumos, setInsumos] = useState(mockInsumos);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'entrada' or 'salida'
  const [cantidad, setCantidad] = useState('');
  const [observacion, setObservacion] = useState('');

  const categories = ['Aceites y Químicos', 'Empaque', 'Utilidades'];

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setCantidad('');
    setObservacion('');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const handleTransaction = () => {
    const qty = Number(cantidad);
    if (!qty || qty <= 0) {
      toast.error('Ingrese una cantidad válida mayor a 0');
      return;
    }

    if (modalType === 'salida' && qty > selectedItem.stockActual) {
      toast.error(`Stock insuficiente. Máximo disponible: ${selectedItem.stockActual}`);
      return;
    }

    setInsumos(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        const newStock = modalType === 'entrada' 
          ? item.stockActual + qty 
          : item.stockActual - qty;
        return { ...item, stockActual: newStock };
      }
      return item;
    }));

    toast.success(`${modalType === 'entrada' ? 'Entrada' : 'Salida'} registrada exitosamente`);
    closeModal();
  };

  const getStockStatus = (actual, min) => {
    if (actual < min) return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, text: 'Crítico' };
    if (actual === min) return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle, text: 'Al Límite' };
    return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2, text: 'Óptimo' };
  };

  return (
    <>
      <Helmet><title>Control de Insumos | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Control de Insumos</h1>
          <p className="text-slate-500 mt-1">Gestión dinámica de inventario con conversiones de unidades.</p>
        </div>

        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto bg-slate-100 p-1 rounded-xl h-auto flex-wrap gap-1">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-5 py-2.5 text-sm font-medium transition-all"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat} value={cat} className="mt-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {insumos.filter(i => i.categoria === cat).map(item => {
                  const status = getStockStatus(item.stockActual, item.stockMinimo);
                  const StatusIcon = status.icon;
                  const altStock = item.stockActual * item.factorConversion;
                  const altMin = item.stockMinimo * item.factorConversion;
                  
                  return (
                    <Card key={item.id} className="card-shadow overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
                      <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                        <img 
                          src={item.imagen} 
                          alt={item.nombre} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={`${status.color} shadow-sm gap-1.5 px-2.5 py-1 font-medium`}>
                            <StatusIcon className="h-3.5 w-3.5" /> {status.text}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <div className="mb-5 flex-1">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 line-clamp-2" title={item.nombre}>
                            {item.nombre}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mt-1">{item.id}</p>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Stock Actual</p>
                            <div className="flex flex-col">
                              <span className="text-2xl font-mono font-bold text-slate-900">
                                {item.stockActual} <span className="text-sm font-sans font-normal text-slate-500">{item.unidad}</span>
                              </span>
                              <span className="text-sm font-mono text-slate-500 mt-0.5">
                                = {altStock.toLocaleString()} {item.unidadAlternativa}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-medium text-slate-500">Mínimo requerido:</span>
                            <span className="text-sm font-mono font-medium text-slate-700">
                              {item.stockMinimo} {item.unidad} <span className="text-slate-400">({altMin.toLocaleString()} {item.unidadAlternativa})</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <Button 
                            variant="outline" 
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300 h-11 font-semibold"
                            onClick={() => openModal(item, 'salida')}
                          >
                            <Minus className="mr-1.5 h-4 w-4" /> SALIDA
                          </Button>
                          <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-semibold"
                            onClick={() => openModal(item, 'entrada')}
                          >
                            <Plus className="mr-1.5 h-4 w-4" /> ENTRADA
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!modalType} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className={`text-2xl font-bold flex items-center gap-2 ${modalType === 'entrada' ? 'text-emerald-700' : 'text-red-700'}`}>
                {modalType === 'entrada' ? <Plus className="h-6 w-6" /> : <Minus className="h-6 w-6" />}
                Registrar {modalType === 'entrada' ? 'Entrada' : 'Salida'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-6 py-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-lg">{selectedItem.nombre}</h4>
                  <p className="text-sm text-slate-500 font-mono mt-1">Stock actual: {selectedItem.stockActual} {selectedItem.unidad}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-slate-900">
                    Cantidad a {modalType === 'entrada' ? 'ingresar' : 'retirar'}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      className="input-large-numeric flex-1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      placeholder="0"
                      min="1"
                      autoFocus
                    />
                    <span className="text-lg font-medium text-slate-500 w-24">{selectedItem.unidad}</span>
                  </div>
                  {cantidad && !isNaN(cantidad) && (
                    <p className="text-sm text-slate-500 font-mono">
                      Equivale a: {(Number(cantidad) * selectedItem.factorConversion).toLocaleString()} {selectedItem.unidadAlternativa}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Observación (Opcional)</Label>
                  <Input 
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Motivo, proveedor, o destino..."
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button 
                onClick={handleTransaction} 
                className={`w-full sm:w-auto text-white ${modalType === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Confirmar {modalType === 'entrada' ? 'Entrada' : 'Salida'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default InsumosPage;