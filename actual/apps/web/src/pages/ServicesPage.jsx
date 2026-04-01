import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { mockMedidores } from '@/data/mockData.js';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplets, Zap, Flame, History, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ServicesPage = () => {
  const [medidores, setMedidores] = useState(mockMedidores);
  const [selectedMedidor, setSelectedMedidor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingReading, setIsAddingReading] = useState(false);
  const [newReading, setNewReading] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTipoConfig = (tipo) => {
    switch(tipo.toLowerCase()) {
      case 'agua': return { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'energía': return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'gas': return { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
      default: return { icon: Zap, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const handleOpenHistory = (medidor) => {
    setSelectedMedidor(medidor);
    setIsModalOpen(true);
    setIsAddingReading(false);
    setNewReading('');
  };

  const handleSaveReading = () => {
    const readingVal = parseFloat(newReading);
    if (isNaN(readingVal) || readingVal <= selectedMedidor.lecturaActual) {
      toast.error('La nueva lectura debe ser mayor a la lectura actual.');
      return;
    }

    const diferencia = readingVal - selectedMedidor.lecturaActual;
    const costoEstimado = diferencia * selectedMedidor.precioUnitario;
    const today = new Date().toISOString().split('T')[0];

    const newHistoryEntry = {
      fecha: today,
      lectura: readingVal,
      diferencia,
      costoEstimado
    };

    const updatedMedidor = {
      ...selectedMedidor,
      lecturaActual: readingVal,
      ultimaActualizacion: today,
      historial: [newHistoryEntry, ...selectedMedidor.historial].slice(0, 5) // Keep last 5
    };

    setMedidores(medidores.map(m => m.id === selectedMedidor.id ? updatedMedidor : m));
    setSelectedMedidor(updatedMedidor);
    setIsAddingReading(false);
    setNewReading('');
    toast.success('Lectura actualizada exitosamente.');
  };

  return (
    <>
      <Helmet><title>Servicios y Medidores | AGRICOL</title></Helmet>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Servicios y Medidores</h1>
          <p className="text-slate-500 mt-1">Control de lecturas y consumos de servicios públicos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medidores.map((m) => {
            const config = getTipoConfig(m.tipo);
            const Icon = config.icon;
            
            return (
              <Card key={m.id} className={`card-shadow overflow-hidden border-t-4 ${config.border.replace('border-', 'border-t-')}`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl leading-tight">{m.nombre}</h3>
                      <p className="text-sm text-slate-500 font-mono mt-1">{m.id}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="mb-6 flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lectura Actual</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-mono text-slate-900 tracking-tight">
                        {m.lecturaActual.toLocaleString()}
                      </span>
                      <span className="text-lg font-medium text-slate-500">{m.unidad}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Actualizado: <span className="font-medium text-slate-700">{m.ultimaActualizacion}</span>
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-auto border-slate-200 hover:bg-slate-50 text-slate-700"
                    onClick={() => handleOpenHistory(m)}
                  >
                    <History className="w-4 h-4 mr-2" /> Ver Historial
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {selectedMedidor && getTipoConfig(selectedMedidor.tipo).icon && React.createElement(getTipoConfig(selectedMedidor.tipo).icon, { className: `w-6 h-6 ${getTipoConfig(selectedMedidor.tipo).color}` })}
                {selectedMedidor?.nombre}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMedidor && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Unidad de Medida</Label>
                    <div className="font-medium text-slate-900">{selectedMedidor.unidad}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Precio Unitario</Label>
                    <div className="font-medium text-slate-900 font-mono">{formatCurrency(selectedMedidor.precioUnitario)}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Última Lectura</Label>
                    <div className="font-mono text-lg font-bold text-primary">{selectedMedidor.lecturaActual.toLocaleString()}</div>
                  </div>
                </div>

                {!isAddingReading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-slate-800">Historial de Consumo</h3>
                      <Button onClick={() => setIsAddingReading(true)} className="bg-primary hover:bg-primary/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Actualizar Lectura
                      </Button>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Fecha</th>
                            <th className="px-4 py-3 font-semibold text-right">Lectura</th>
                            <th className="px-4 py-3 font-semibold text-right">Diferencia</th>
                            <th className="px-4 py-3 font-semibold text-right">Costo Estimado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedMedidor.historial.map((h, idx) => (
                            <tr key={idx} className="bg-white hover:bg-slate-50/50">
                              <td className="px-4 py-3 text-slate-600">{h.fecha}</td>
                              <td className="px-4 py-3 text-right font-mono font-medium">{h.lectura.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-600">+{h.diferencia.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(h.costoEstimado)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-slate-800 text-lg">Registrar Nueva Lectura</h3>
                    <div className="space-y-2">
                      <Label htmlFor="newReading" className="text-slate-600">
                        Lectura Actual ({selectedMedidor.unidad})
                      </Label>
                      <Input
                        id="newReading"
                        type="number"
                        className="input-large-numeric"
                        value={newReading}
                        onChange={(e) => setNewReading(e.target.value)}
                        placeholder={`Mayor a ${selectedMedidor.lecturaActual}`}
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={() => setIsAddingReading(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveReading} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                        Guardar Registro
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ServicesPage;