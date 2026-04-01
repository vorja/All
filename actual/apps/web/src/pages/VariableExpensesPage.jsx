import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { mockMantenimiento, mockSaneamiento } from '@/data/mockData.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Wrench, Bug, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const VariableExpensesPage = () => {
  const [mantenimiento, setMantenimiento] = useState(mockMantenimiento);
  const [saneamiento, setSaneamiento] = useState(mockSaneamiento);
  
  const [isMantModalOpen, setIsMantModalOpen] = useState(false);
  const [isSanModalOpen, setIsSanModalOpen] = useState(false);

  const formatCOP = (value) => new Intl.NumberFormat('es-CO').format(value);

  const handleDelete = (type, id) => {
    if (type === 'mantenimiento') {
      setMantenimiento(mantenimiento.filter(item => item.id !== id));
    } else {
      setSaneamiento(saneamiento.filter(item => item.id !== id));
    }
    toast.success('Registro eliminado');
  };

  const handleAddMantenimiento = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      id: `M-${Date.now()}`,
      maquina_id: formData.get('maquina_id'),
      tipo: formData.get('tipo'),
      descripcion: formData.get('descripcion'),
      cantidad: Number(formData.get('cantidad')),
      unidad: formData.get('unidad'),
      costo: Number(formData.get('costo')),
      fecha: formData.get('fecha')
    };
    setMantenimiento([newItem, ...mantenimiento]);
    setIsMantModalOpen(false);
    toast.success('Gasto de mantenimiento registrado');
  };

  const handleAddSaneamiento = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      id: `S-${Date.now()}`,
      area: formData.get('area'),
      fecha: formData.get('fecha'),
      tipo_plaga: formData.get('tipo_plaga'),
      costo_contratista: Number(formData.get('costo_contratista')),
      observaciones: formData.get('observaciones'),
      cantidad: Number(formData.get('cantidad')),
      unidad: formData.get('unidad')
    };
    setSaneamiento([newItem, ...saneamiento]);
    setIsSanModalOpen(false);
    toast.success('Gasto de saneamiento registrado');
  };

  const renderMantTable = (data) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
          <tr>
            <th className="px-6 py-4 font-semibold">Fecha</th>
            <th className="px-6 py-4 font-semibold">Máquina</th>
            <th className="px-6 py-4 font-semibold">Tipo</th>
            <th className="px-6 py-4 font-semibold">Descripción</th>
            <th className="px-6 py-4 font-semibold text-right">Cantidad</th>
            <th className="px-6 py-4 font-semibold text-right">Costo Total</th>
            <th className="px-6 py-4 font-semibold text-center w-16">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-slate-500">No hay registros.</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{item.fecha}</td>
                <td className="px-6 py-4 font-mono text-slate-700 text-sm">{item.maquina_id}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.tipo === 'Preventivo' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {item.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{item.descripcion}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">{item.cantidad} {item.unidad}</td>
                <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">${formatCOP(item.costo)}</td>
                <td className="px-6 py-4 text-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete('mantenimiento', item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSanTable = (data) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
          <tr>
            <th className="px-6 py-4 font-semibold">Fecha</th>
            <th className="px-6 py-4 font-semibold">Área</th>
            <th className="px-6 py-4 font-semibold">Tipo de Plaga</th>
            <th className="px-6 py-4 font-semibold">Observaciones</th>
            <th className="px-6 py-4 font-semibold text-right">Cantidad</th>
            <th className="px-6 py-4 font-semibold text-right">Costo Total</th>
            <th className="px-6 py-4 font-semibold text-center w-16">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-slate-500">No hay registros.</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{item.fecha}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{item.area}</td>
                <td className="px-6 py-4 text-slate-700">{item.tipo_plaga}</td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={item.observaciones}>{item.observaciones}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">{item.cantidad} {item.unidad}</td>
                <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">${formatCOP(item.costo_contratista)}</td>
                <td className="px-6 py-4 text-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete('saneamiento', item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Helmet><title>Gastos Variables | AGRICOL</title></Helmet>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gastos Variables</h1>
          <p className="text-slate-500 mt-1">Gestión de costos operativos por mantenimiento y saneamiento.</p>
        </div>

        {/* MANTENIMIENTO SECTION */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Wrench className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Mantenimiento</h2>
            </div>
            <Dialog open={isMantModalOpen} onOpenChange={setIsMantModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Mantenimiento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddMantenimiento}>
                  <DialogHeader>
                    <DialogTitle>Registrar Mantenimiento</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>ID Máquina</Label>
                      <Input name="maquina_id" required placeholder="Ej: MAQ-PELADORA-01" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <select name="tipo" required className="w-full px-3 py-2 border border-slate-200 rounded-md text-slate-900 bg-white">
                        <option value="">Seleccionar tipo</option>
                        <option value="Preventivo">Preventivo</option>
                        <option value="Correctivo">Correctivo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input name="descripcion" required placeholder="Ej: Cambio de aceite" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input name="cantidad" type="number" step="0.01" required placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidad</Label>
                        <Input name="unidad" required placeholder="Ej: Galones, Servicio" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Costo Total ($)</Label>
                      <Input name="costo" type="number" required placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Input name="fecha" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsMantModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="shadow-sm border-t-4 border-t-blue-500">
            <CardContent className="p-0">
              {renderMantTable(mantenimiento)}
            </CardContent>
          </Card>
        </section>

        {/* SANEAMIENTO SECTION */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <Bug className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Saneamiento</h2>
            </div>
            <Dialog open={isSanModalOpen} onOpenChange={setIsSanModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Saneamiento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddSaneamiento}>
                  <DialogHeader>
                    <DialogTitle>Registrar Saneamiento</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Área</Label>
                      <Input name="area" required placeholder="Ej: Bodega Principal" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Plaga</Label>
                      <Input name="tipo_plaga" required placeholder="Ej: Roedores, Insectos" />
                    </div>
                    <div className="space-y-2">
                      <Label>Observaciones</Label>
                      <Input name="observaciones" placeholder="Detalles adicionales" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input name="cantidad" type="number" step="0.01" required placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidad</Label>
                        <Input name="unidad" required placeholder="Ej: Servicio, Unidades" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Costo Total ($)</Label>
                      <Input name="costo_contratista" type="number" required placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Input name="fecha" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSanModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Guardar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="shadow-sm border-t-4 border-t-purple-500">
            <CardContent className="p-0">
              {renderSanTable(saneamiento)}
            </CardContent>
          </Card>
        </section>

      </div>
    </>
  );
};

export default VariableExpensesPage;