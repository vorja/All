import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SupplyIncomePage = () => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedInsumo, setSelectedInsumo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [costoTotal, setCostoTotal] = useState('');
  const [factura, setFactura] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const records = await pb.collection('insumos').getFullList({
        sort: 'nombre',
        $autoCancel: false
      });
      setInsumos(records);
    } catch (error) {
      console.error('Error fetching insumos:', error);
      toast.error('No se pudieron cargar los insumos.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 20971520) {
        toast.error('El archivo excede el límite de 20MB');
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedInsumo || !cantidad || !costoTotal || !factura || !file) {
      toast.error('Por favor complete todos los campos requeridos.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create ingresos_insumos record
      const formData = new FormData();
      formData.append('insumo_id', selectedInsumo);
      formData.append('cantidad_ingresada', cantidad);
      formData.append('costo_total_ingreso', costoTotal);
      formData.append('numero_factura', factura);
      formData.append('evidencia_factura', file);

      await pb.collection('ingresos_insumos').create(formData, { $autoCancel: false });

      // 2. Update insumos stock
      const insumo = insumos.find(i => i.id === selectedInsumo);
      if (insumo) {
        const newStock = (insumo.stock_actual || 0) + Number(cantidad);
        await pb.collection('insumos').update(selectedInsumo, {
          stock_actual: newStock
        }, { $autoCancel: false });
      }

      toast.success('Ingreso de insumo registrado exitosamente.');
      
      // Reset form
      setSelectedInsumo('');
      setCantidad('');
      setCostoTotal('');
      setFactura('');
      setFile(null);
      document.getElementById('file-upload').value = '';
      
      // Refresh insumos to get updated stock
      fetchInsumos();

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocurrió un error al registrar el ingreso.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Ingreso de Insumos | AGRICOL</title></Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ingreso de Insumos</h1>
          <p className="text-slate-500 mt-1">Registre la entrada de nuevos insumos con su respectiva factura.</p>
        </div>

        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Formulario de Ingreso
            </CardTitle>
            <CardDescription>
              Todos los campos son obligatorios. Adjunte la factura en formato PDF o imagen.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="insumo" className="text-slate-700 font-semibold">Insumo <span className="text-red-500">*</span></Label>
                <Select value={selectedInsumo} onValueChange={setSelectedInsumo}>
                  <SelectTrigger id="insumo" className="w-full bg-white">
                    <SelectValue placeholder="Seleccione el insumo a ingresar" />
                  </SelectTrigger>
                  <SelectContent>
                    {insumos.map(insumo => (
                      <SelectItem key={insumo.id} value={insumo.id}>
                        {insumo.nombre} ({insumo.unidad}) - Stock actual: {insumo.stock_actual}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cantidad" className="text-slate-700 font-semibold">Cantidad Ingresada <span className="text-red-500">*</span></Label>
                  <Input 
                    id="cantidad" 
                    type="number" 
                    min="1"
                    step="any"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Ej: 100"
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="costo" className="text-slate-700 font-semibold">Costo Total (COP) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                    <Input 
                      id="costo" 
                      type="number" 
                      min="0"
                      value={costoTotal}
                      onChange={(e) => setCostoTotal(e.target.value)}
                      placeholder="0"
                      className="pl-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="factura" className="text-slate-700 font-semibold">Número de Factura <span className="text-red-500">*</span></Label>
                <Input 
                  id="factura" 
                  type="text" 
                  value={factura}
                  onChange={(e) => setFactura(e.target.value)}
                  placeholder="Ej: FAC-2026-001"
                  className="font-mono uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-slate-700 font-semibold">Evidencia de Factura <span className="text-red-500">*</span></Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-center relative">
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept="application/pdf,image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                    <div className="text-sm font-medium text-slate-700">
                      {file ? file.name : 'Haga clic o arrastre el archivo aquí'}
                    </div>
                    <div className="text-xs text-slate-500">
                      PDF, JPG, PNG, GIF, WEBP (Max. 20MB)
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-white min-w-[150px]"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    'Registrar Ingreso'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SupplyIncomePage;