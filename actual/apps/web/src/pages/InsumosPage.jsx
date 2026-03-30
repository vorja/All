import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Minus, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { listInsumos, updateInsumo } from '@/repositories/insumosRepository.js';

const InsumosPage = () => {
  const [insumos, setInsumos] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'entrada' or 'salida'
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listInsumos().then(setInsumos).catch((e) => setError(e.message));
  }, []);

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setCantidad('');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const handleTransaction = async () => {
    const qty = Number(cantidad);
    if (!qty || qty <= 0) {
      toast.error('Ingrese una cantidad válida mayor a 0');
      return;
    }

    const currentStock = Number(selectedItem.stock_actual || 0);
    if (modalType === 'salida' && qty > currentStock) {
      toast.error(`Stock insuficiente. Máximo disponible: ${currentStock}`);
      return;
    }

    const newStock = modalType === 'entrada' ? currentStock + qty : currentStock - qty;
    try {
      const updated = await updateInsumo(selectedItem.id, { stock_actual: newStock });
      setInsumos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      toast.error(e.message);
      return;
    }

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
          <p className="text-slate-500 mt-1">Gestión sobre colección real `insumos`.</p>
        </div>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {insumos.map((item) => {
                  const stockActual = Number(item.stock_actual || 0);
                  const stockMinimo = Number(item.stock_minimo || item.minimo || 0);
                  const status = getStockStatus(stockActual, stockMinimo);
                  const StatusIcon = status.icon;
                  const costoUnitario = Number(item.costoUnitario || 0);
                  
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
                                {stockActual} <span className="text-sm font-sans font-normal text-slate-500">{item.unidad || '-'}</span>
                              </span>
                              <span className="text-sm font-mono text-slate-500 mt-0.5">Costo unitario: {costoUnitario.toLocaleString('es-CO')}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-medium text-slate-500">Mínimo requerido:</span>
                            <span className="text-sm font-mono font-medium text-slate-700">
                              {stockMinimo} {item.unidad || '-'}
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
                  <p className="text-sm text-slate-500 font-mono mt-1">Stock actual: {selectedItem.stock_actual} {selectedItem.unidad || '-'}</p>
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