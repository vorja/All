import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, AlertCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const PayrollEditorPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    setLoading(true);
    setError(null);
    
    const user = pb.authStore.model;
    if (!user || (user.rol !== 'admin' && user.rol !== 'recursos_humanos')) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }
    
    setIsAuthorized(true);
    await fetchData();
  };

  const fetchData = async () => {
    try {
      // Fetch all employees
      const empleados = await pb.collection('empleados').getFullList({ 
        sort: 'nombre',
        $autoCancel: false 
      });
      
      // Fetch current month's payroll records (simplified for this view)
      const nominas = await pb.collection('nomina').getFullList({ 
        $autoCancel: false 
      });

      const mergedData = empleados.map(emp => {
        // Find existing payroll record for this employee, or create a template
        const nom = nominas.find(n => n.empleado_id === emp.id) || {};
        
        return {
          empleado_id: emp.id,
          nombre: emp.nombre,
          nomina_id: nom.id || null,
          horas_regulares_trabajadas: nom.horas_regulares_trabajadas || 0,
          valor_hora_regular: nom.valor_hora_regular || emp.valor_hora || 0,
          horas_extra: nom.horas_extra || 0,
          valor_hora_extra: nom.valor_hora_extra || (emp.valor_hora ? emp.valor_hora * 1.5 : 0),
          horas_faltantes: nom.horas_faltantes || 0,
        };
      });

      setData(mergedData);
    } catch (err) {
      console.error('Error fetching payroll data:', err);
      setError('No se pudo cargar la información de nómina.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (empleadoId, field, value) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => prev.map(row => {
      if (row.empleado_id === empleadoId) {
        return { ...row, [field]: numValue };
      }
      return row;
    }));
  };

  const calculateTotal = (row) => {
    const regulares = row.horas_regulares_trabajadas * row.valor_hora_regular;
    const extras = row.horas_extra * row.valor_hora_extra;
    const faltantes = row.horas_faltantes * row.valor_hora_regular;
    return regulares + extras - faltantes;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const promises = data.map(async (row) => {
        const payload = {
          empleado_id: row.empleado_id,
          fecha: today,
          horas_regulares_trabajadas: row.horas_regulares_trabajadas,
          valor_hora_regular: row.valor_hora_regular,
          horas_extra: row.horas_extra,
          valor_hora_extra: row.valor_hora_extra,
          horas_faltantes: row.horas_faltantes,
          costo_total: calculateTotal(row)
        };

        if (row.nomina_id) {
          return pb.collection('nomina').update(row.nomina_id, payload, { $autoCancel: false });
        } else {
          return pb.collection('nomina').create(payload, { $autoCancel: false });
        }
      });

      await Promise.all(promises);
      toast.success('Nómina guardada exitosamente.');
      await fetchData(); // Refresh to get new IDs
    } catch (err) {
      console.error('Error saving payroll:', err);
      toast.error('Ocurrió un error al guardar la nómina.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <ShieldAlert className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-slate-900">Acceso Restringido</h2>
        <p className="text-slate-500">Esta página es exclusiva para el departamento de Recursos Humanos.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-slate-700 font-medium">{error}</p>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Editor de Nómina | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Editor de Nómina</h1>
            <p className="text-slate-500 mt-1">Gestión detallada de horas y valores por empleado.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
          </Button>
        </div>

        <Card className="shadow-sm overflow-hidden border-t-4 border-t-primary">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Empleado</th>
                    <th className="px-4 py-3 font-semibold text-center">Horas Regulares</th>
                    <th className="px-4 py-3 font-semibold text-center">Valor Hora Reg.</th>
                    <th className="px-4 py-3 font-semibold text-center">Horas Extra</th>
                    <th className="px-4 py-3 font-semibold text-center">Valor Hora Ext.</th>
                    <th className="px-4 py-3 font-semibold text-center">Horas Faltantes</th>
                    <th className="px-4 py-3 font-semibold text-right">Costo Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-500">
                        No hay empleados registrados.
                      </td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr key={row.empleado_id} className="hover:bg-slate-50/50 transition-colors bg-white">
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                          {row.nombre}
                        </td>
                        <td className="px-4 py-2 w-32">
                          <Input
                            type="number"
                            min="0"
                            className="h-9 text-center font-mono"
                            value={row.horas_regulares_trabajadas || ''}
                            onChange={(e) => handleInputChange(row.empleado_id, 'horas_regulares_trabajadas', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 w-36">
                          <Input
                            type="number"
                            min="0"
                            className="h-9 text-right font-mono"
                            value={row.valor_hora_regular || ''}
                            onChange={(e) => handleInputChange(row.empleado_id, 'valor_hora_regular', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 w-32">
                          <Input
                            type="number"
                            min="0"
                            className="h-9 text-center font-mono"
                            value={row.horas_extra || ''}
                            onChange={(e) => handleInputChange(row.empleado_id, 'horas_extra', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 w-36">
                          <Input
                            type="number"
                            min="0"
                            className="h-9 text-right font-mono"
                            value={row.valor_hora_extra || ''}
                            onChange={(e) => handleInputChange(row.empleado_id, 'valor_hora_extra', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 w-32">
                          <Input
                            type="number"
                            min="0"
                            className="h-9 text-center font-mono text-red-600"
                            value={row.horas_faltantes || ''}
                            onChange={(e) => handleInputChange(row.empleado_id, 'horas_faltantes', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 text-base whitespace-nowrap">
                          {formatCurrency(calculateTotal(row))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PayrollEditorPage;