import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { mockCalidad } from '@/data/mockData.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const QualityPage = () => {
  const [records, setRecords] = useState(mockCalidad);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [aceptada, setAceptada] = useState('');
  const [rechazada, setRechazada] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setAceptada(record.cantidadAceptada.toString());
    setRechazada(record.cantidadRechazada.toString());
    setObservaciones(record.observaciones || '');
    setIsModalOpen(true);
  };

  const handleAceptadaChange = (e) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
    const max = selectedRecord.cantidadOriginal;
    const safeVal = val > max ? max : val;
    setAceptada(safeVal.toString());
    setRechazada((max - safeVal).toString());
  };

  const handleRechazadaChange = (e) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
    const max = selectedRecord.cantidadOriginal;
    const safeVal = val > max ? max : val;
    setRechazada(safeVal.toString());
    setAceptada((max - safeVal).toString());
  };

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      const numAceptada = parseInt(aceptada, 10) || 0;
      const numRechazada = parseInt(rechazada, 10) || 0;
      const pct = selectedRecord.cantidadOriginal > 0 
        ? (numRechazada / selectedRecord.cantidadOriginal) * 100 
        : 0;

      setRecords(records.map(r => {
        if (r.id === selectedRecord.id) {
          return {
            ...r,
            cantidadAceptada: numAceptada,
            cantidadRechazada: numRechazada,
            porcentajeRechazo: parseFloat(pct.toFixed(1)),
            observaciones: observaciones,
            estado: 'Clasificado'
          };
        }
        return r;
      }));

      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Clasificación guardada exitosamente.');
    }, 500);
  };

  const getRejectionBadge = (pct) => {
    if (pct > 10) return <Badge className="bg-red-100 text-red-800 border-red-200 font-mono text-sm px-2.5 py-1">{pct}%</Badge>;
    if (pct >= 5) return <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-mono text-sm px-2.5 py-1">{pct}%</Badge>;
    return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-mono text-sm px-2.5 py-1">{pct}%</Badge>;
  };

  const currentPct = selectedRecord && selectedRecord.cantidadOriginal > 0 
    ? ((parseInt(rechazada, 10) || 0) / selectedRecord.cantidadOriginal) * 100 
    : 0;

  return (
    <>
      <Helmet><title>Control de Calidad | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Control de Calidad</h1>
          <p className="text-slate-500 mt-1">Clasificación de mermas y rechazos por lote.</p>
        </div>

        <Card className="shadow-sm overflow-hidden border-t-4 border-t-primary">
          <div className="overflow-x-auto">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Lote ID</th>
                  <th>Proveedor</th>
                  <th className="text-right">Cantidad Original (Kg)</th>
                  <th>Fecha</th>
                  <th className="text-center">% Rechazo</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} onClick={() => handleRowClick(record)} className="cursor-pointer">
                    <td className="font-medium text-slate-900">{record.loteId}</td>
                    <td className="text-slate-700">{record.proveedor}</td>
                    <td className="text-right font-mono text-slate-700 text-base">{record.cantidadOriginal.toLocaleString()}</td>
                    <td className="text-slate-600">{record.fecha}</td>
                    <td className="text-center">
                      {getRejectionBadge(record.porcentajeRechazo)}
                    </td>
                    <td className="text-center">
                      <Badge variant="outline" className="text-slate-600 bg-slate-50">
                        {record.estado || 'Pendiente'}
                      </Badge>
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
              <DialogTitle className="text-2xl font-bold text-slate-900">Clasificar Lote</DialogTitle>
            </DialogHeader>
            
            {selectedRecord && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Lote ID</Label>
                    <div className="font-medium text-slate-900">{selectedRecord.loteId}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Proveedor</Label>
                    <div className="font-medium text-slate-900">{selectedRecord.proveedor}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Fecha</Label>
                    <div className="font-medium text-slate-900">{selectedRecord.fecha}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Cantidad Original</Label>
                    <div className="font-mono font-bold text-slate-900">{selectedRecord.cantidadOriginal.toLocaleString()} Kg</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-900">
                      Cantidad Aceptada (Kg)
                    </Label>
                    <Input
                      type="text"
                      className="font-mono font-medium h-11 text-emerald-700 border-emerald-200 focus-visible:ring-emerald-500"
                      value={aceptada}
                      onChange={handleAceptadaChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-900">
                      Cantidad Rechazada (Kg)
                    </Label>
                    <Input
                      type="text"
                      className="font-mono font-medium h-11 text-red-700 border-red-200 focus-visible:ring-red-500"
                      value={rechazada}
                      onChange={handleRechazadaChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700">Porcentaje de Rechazo Calculado:</span>
                  <span className={`font-mono text-xl font-bold ${currentPct > 10 ? 'text-red-600' : currentPct >= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {currentPct.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-900">Observaciones</Label>
                  <Textarea 
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Detalles sobre el rechazo, estado del producto..."
                    className="resize-none h-24"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar Clasificación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default QualityPage;