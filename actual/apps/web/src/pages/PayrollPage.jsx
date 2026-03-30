import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, FilterX, Plus, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createNomina, listNomina } from '@/repositories/nominaRepository.js';
import { getPeriodoEstado } from '@/repositories/periodosRepository.js';

const PayrollPage = () => {
  const MESES = [
    { valor: 1, label: 'Enero' }, { valor: 2, label: 'Febrero' }, { valor: 3, label: 'Marzo' },
    { valor: 4, label: 'Abril' }, { valor: 5, label: 'Mayo' }, { valor: 6, label: 'Junio' },
    { valor: 7, label: 'Julio' }, { valor: 8, label: 'Agosto' }, { valor: 9, label: 'Septiembre' },
    { valor: 10, label: 'Octubre' }, { valor: 11, label: 'Noviembre' }, { valor: 12, label: 'Diciembre' }
  ];
  const QUINCENAS = [{ valor: 1, label: 'Primera Quincena' }, { valor: 2, label: 'Segunda Quincena' }];
  const [data, setData] = useState([]);
  const [selectedMes, setSelectedMes] = useState(Number(new Date().toISOString().slice(5, 7)));
  const [selectedQuincena, setSelectedQuincena] = useState(1);
  
  const [formData, setFormData] = useState({
    empleado_id: '',
    mesNumero: '',
    quincena: '',
    horas_regulares_trabajadas: '',
    valor_hora_regular: '',
    cantidad_horas_extras: '',
    valor_hora_extra: '',
    recargos_nocturnos: '',
    recargos_dominicales: '',
    deducciones: '',
    estado: 'Pendiente'
  });

  // Filters state
  const [filterEmpleado, setFilterEmpleado] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');

  useEffect(() => {
    listNomina('').then(setData).catch((e) => toast.error(e.message));
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0 
    }).format(value);
  };

  const calculateTotal = (n) => {
    const regular = (n.horas_regulares_trabajadas || 0) * (n.valor_hora_regular || 0);
    const extra = (n.cantidad_horas_extras || 0) * (n.valor_hora_extra || 0);
    const recargos = (n.recargos_nocturnos || 0) + (n.recargos_dominicales || 0);
    const deducciones = n.deducciones || 0;
    return regular + extra + recargos - deducciones;
  };

  const clearFilters = () => {
    setFilterEmpleado('');
    setFilterEstado('Todos');
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const rowDate = item.fecha ? new Date(item.fecha) : null;
      const rowMonth = rowDate ? rowDate.getUTCMonth() + 1 : selectedMes;
      const day = rowDate ? rowDate.getUTCDate() : 1;
      const rowQuincena = day <= 15 ? 1 : 2;
      const matchMes = rowMonth === selectedMes;
      const matchQuincena = rowQuincena === selectedQuincena;
      const matchEmpleado = String(item.empleado_id || '').toLowerCase().includes(filterEmpleado.toLowerCase());
      const matchEstado = filterEstado === 'Todos' || item.estado === filterEstado;
      
      return matchMes && matchQuincena && matchEmpleado && matchEstado;
    });
  }, [data, selectedMes, selectedQuincena, filterEmpleado, filterEstado]);

  // Calculate summary stats
  const totalNomina = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + calculateTotal(item), 0);
  }, [filteredData]);

  const empleadosPagados = useMemo(() => {
    return filteredData.filter(item => item.estado === 'Pagado').length;
  }, [filteredData]);

  const empleadosPendientes = useMemo(() => {
    return filteredData.filter(item => item.estado === 'Pendiente').length;
  }, [filteredData]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    
    if (!formData.empleado_id || !formData.mesNumero || !formData.quincena || 
        !formData.horas_regulares_trabajadas || !formData.valor_hora_regular || 
        !formData.valor_hora_extra) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }
    const month = Number(formData.mesNumero);
    const day = Number(formData.quincena) === 1 ? 15 : 28;
    const periodo = await getPeriodoEstado(2026, month, Number(formData.quincena));
    if (periodo?.estado === 'cerrado') {
      toast.error('Periodo contable cerrado: no se permite editar nómina.');
      return;
    }
    const fecha = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 00:00:00.000Z`;
    const payload = {
      empleado_id: formData.empleado_id,
      fecha,
      horas_regulares_trabajadas: Number(formData.horas_regulares_trabajadas),
      valor_hora_regular: Number(formData.valor_hora_regular),
      cantidad_horas_extras: Number(formData.cantidad_horas_extras || 0),
      valor_hora_extra: Number(formData.valor_hora_extra || 0),
      recargos_nocturnos: Number(formData.recargos_nocturnos || 0),
      recargos_dominicales: Number(formData.recargos_dominicales || 0),
      deducciones: Number(formData.deducciones || 0),
      estado: formData.estado
    };
    const created = await createNomina(payload);
    setData((prev) => [created, ...prev]);
    toast.success('Registro guardado en PocketBase');
    
    setFormData({
      empleado_id: '',
      mesNumero: '',
      quincena: '',
      horas_regulares_trabajadas: '',
      valor_hora_regular: '',
      cantidad_horas_extras: '',
      valor_hora_extra: '',
      recargos_nocturnos: '',
      recargos_dominicales: '',
      deducciones: '',
      estado: 'Pendiente'
    });
  };

  const calculatedTotal = useMemo(() => {
    if (!formData.horas_regulares_trabajadas || !formData.valor_hora_regular) return 0;
    
    const regular = parseFloat(formData.horas_regulares_trabajadas || 0) * parseFloat(formData.valor_hora_regular || 0);
    const extra = parseFloat(formData.cantidad_horas_extras || 0) * parseFloat(formData.valor_hora_extra || 0);
    const recargos = parseFloat(formData.recargos_nocturnos || 0) + parseFloat(formData.recargos_dominicales || 0);
    const deducciones = parseFloat(formData.deducciones || 0);
    
    return regular + extra + recargos - deducciones;
  }, [formData]);

  return (
    <>
      <Helmet><title>Gestión de Nóminas | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Nóminas</h1>
            <p className="text-slate-500 mt-1">Registros reales con cálculo automático de costo total.</p>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="p-5 shadow-sm border border-slate-200 bg-white rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes</Label>
              <Select value={String(selectedMes)} onValueChange={(v) => setSelectedMes(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map(mes => (
                    <SelectItem key={mes.valor} value={String(mes.valor)}>{mes.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quincena</Label>
              <Select value={String(selectedQuincena)} onValueChange={(v) => setSelectedQuincena(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUINCENAS.map(q => (
                    <SelectItem key={q.valor} value={String(q.valor)}>{q.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Buscar Empleado</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Nombre del empleado..." 
                  className="pl-9"
                  value={filterEmpleado}
                  onChange={(e) => setFilterEmpleado(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon" onClick={clearFilters} title="Limpiar filtros" className="shrink-0">
              <FilterX className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Total Nómina del Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalNomina)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Empleados Pagados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{empleadosPagados}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Empleados Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">{empleadosPendientes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="shadow-sm overflow-hidden border-t-4 border-t-blue-600">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Empleado</th>
                  <th className="px-4 py-3 font-semibold text-center">H. Reg.</th>
                  <th className="px-4 py-3 font-semibold text-right">Valor H.R.</th>
                  <th className="px-4 py-3 font-semibold text-center">H. Ext.</th>
                  <th className="px-4 py-3 font-semibold text-right">Valor H.E.</th>
                  <th className="px-4 py-3 font-semibold text-right">Recargos</th>
                  <th className="px-4 py-3 font-semibold text-right text-rose-600">Deducciones</th>
                  <th className="px-4 py-3 font-semibold text-right">Costo Total</th>
                  <th className="px-4 py-3 font-semibold text-center">Estado</th>
                  <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8 text-slate-500">
                      No se encontraron registros para el período seleccionado.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {n.empleado_id}
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{n.id}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{n.horas_regulares_trabajadas}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(n.valor_hora_regular)}</td>
                      <td className="px-4 py-3 text-center font-mono">{n.cantidad_horas_extras}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(n.valor_hora_extra)}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600">
                        {formatCurrency(n.recargos_nocturnos + n.recargos_dominicales)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-rose-600">{formatCurrency(n.deducciones)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 text-base">
                        {formatCurrency(calculateTotal(n))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {n.estado === 'Pagado' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
                            {n.estado}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
                            {n.estado}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-slate-500">Gestionar en editor de nómina</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nuevo registro de nómina</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div><Label>Empleado ID</Label><Input value={formData.empleado_id} onChange={(e) => setFormData({ ...formData, empleado_id: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Mes</Label><Select value={formData.mesNumero} onValueChange={(v) => setFormData({ ...formData, mesNumero: v })}><SelectTrigger><SelectValue placeholder="Mes" /></SelectTrigger><SelectContent>{MESES.map((m) => <SelectItem key={m.valor} value={String(m.valor)}>{m.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Quincena</Label><Select value={formData.quincena} onValueChange={(v) => setFormData({ ...formData, quincena: v })}><SelectTrigger><SelectValue placeholder="Quincena" /></SelectTrigger><SelectContent>{QUINCENAS.map((q) => <SelectItem key={q.valor} value={String(q.valor)}>{q.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Horas regulares</Label><Input type="number" value={formData.horas_regulares_trabajadas} onChange={(e) => setFormData({ ...formData, horas_regulares_trabajadas: e.target.value })} required /></div>
              <div><Label>Valor H.R.</Label><Input type="number" value={formData.valor_hora_regular} onChange={(e) => setFormData({ ...formData, valor_hora_regular: e.target.value })} required /></div>
              <div><Label>Horas extra</Label><Input type="number" value={formData.cantidad_horas_extras} onChange={(e) => setFormData({ ...formData, cantidad_horas_extras: e.target.value })} /></div>
              <div><Label>Valor H.E.</Label><Input type="number" value={formData.valor_hora_extra} onChange={(e) => setFormData({ ...formData, valor_hora_extra: e.target.value })} required /></div>
              <div><Label>Deducciones</Label><Input type="number" value={formData.deducciones} onChange={(e) => setFormData({ ...formData, deducciones: e.target.value })} /></div>
              <div className="md:col-span-4"><Button type="submit" className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Guardar nómina ({formatCurrency(calculatedTotal)})</Button></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PayrollPage;