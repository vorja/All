import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplets, Zap, Flame, History, Plus } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const ServicesPage = () => {
  const [medidores, setMedidores] = useState([]);
  const [selectedMedidor, setSelectedMedidor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingReading, setIsAddingReading] = useState(false);
  const [newReading, setNewReading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    pb.collection('medidores').getFullList({ sort: '-fecha' })
      .then(setMedidores)
      .catch((e) => setError(e.message));
  }, []);

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

  const handleSaveReading = async () => {
    const readingVal = parseFloat(newReading);
    const currentReading = Number(selectedMedidor.agua_lectura || selectedMedidor.gas_lectura || selectedMedidor.energia_lectura || 0);
    if (isNaN(readingVal) || readingVal <= currentReading) {
      toast.error('La nueva lectura debe ser mayor a la lectura actual.');
      return;
    }
    const basePayload = {};
    if (selectedMedidor.agua_lectura !== undefined) basePayload.agua_lectura = readingVal;
    if (selectedMedidor.gas_lectura !== undefined) basePayload.gas_lectura = readingVal;
    if (selectedMedidor.energia_lectura !== undefined) basePayload.energia_lectura = readingVal;
    try {
      const updated = await pb.collection('medidores').update(selectedMedidor.id, basePayload);
      setMedidores((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setSelectedMedidor(updated);
      setIsAddingReading(false);
      setNewReading('');
      toast.success('Lectura actualizada exitosamente.');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Helmet><title>Servicios y Medidores | AGRICOL</title></Helmet>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Servicios y Medidores</h1>
          <p className="text-slate-500 mt-1">Control de lecturas y consumos de servicios públicos.</p>
        </div>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medidores.map((m) => {
            const tipo = m.gas_lectura !== undefined ? 'Gas' : m.energia_lectura !== undefined ? 'Energía' : 'Agua';
            const config = getTipoConfig(tipo);
            const Icon = config.icon;
            const lecturaActual = Number(m.agua_lectura || m.gas_lectura || m.energia_lectura || 0);
            
            return (
              <Card key={m.id} className={`card-shadow overflow-hidden border-t-4 ${config.border.replace('border-', 'border-t-')}`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl leading-tight">{tipo}</h3>
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
                        {lecturaActual.toLocaleString()}
                      </span>
                      <span className="text-lg font-medium text-slate-500">u</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Fecha: <span className="font-medium text-slate-700">{m.fecha?.slice(0, 10) || '-'}</span>
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
                    <div className="font-medium text-slate-900">u</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Precio Unitario</Label>
                    <div className="font-medium text-slate-900 font-mono">N/A</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Última Lectura</Label>
                    <div className="font-mono text-lg font-bold text-primary">{Number(selectedMedidor.agua_lectura || selectedMedidor.gas_lectura || selectedMedidor.energia_lectura || 0).toLocaleString()}</div>
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
                    
                    <div className="border border-slate-200 rounded-lg p-4 text-sm text-slate-600">Este módulo usa lecturas almacenadas en `medidores`.</div>
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
                        placeholder={`Mayor a ${Number(selectedMedidor.agua_lectura || selectedMedidor.gas_lectura || selectedMedidor.energia_lectura || 0)}`}
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