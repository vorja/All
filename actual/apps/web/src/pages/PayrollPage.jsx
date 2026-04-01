import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { MESES, QUINCENAS, mockNomina, mockEmpleados } from '@/data/mockData.js';
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Search, FilterX, Plus, Edit2, Trash2, Eye, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PayrollPage = () => {
  const [data, setData] = useState(mockNomina);
  const [selectedMes, setSelectedMes] = useState(3); // Current month (March)
  const [selectedQuincena, setSelectedQuincena] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    empleado_id: '',
    mes: '',
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
      const matchMes = item.mesNumero === selectedMes;
      const matchQuincena = item.quincena === selectedQuincena;
      const matchEmpleado = item.empleado.toLowerCase().includes(filterEmpleado.toLowerCase());
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

  const handleAddRecord = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.empleado_id || !formData.mes || !formData.quincena || 
        !formData.horas_regulares_trabajadas || !formData.valor_hora_regular || 
        !formData.valor_hora_extra) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    const empleado = mockEmpleados.find(emp => emp.id === formData.empleado_id);
    const mesObj = MESES.find(m => m.valor === parseInt(formData.mesNumero));

    const newRecord = {
      id: `NOM-${String(data.length + 1).padStart(3, '0')}`,
      empleado_id: formData.empleado_id,
      empleado: empleado?.nombre || 'Desconocido',
      mes: mesObj?.label || '',
      mesNumero: parseInt(formData.mesNumero),
      quincena: parseInt(formData.quincena),
      horas_regulares_trabajadas: parseFloat(formData.horas_regulares_trabajadas),
      valor_hora_regular: parseFloat(formData.valor_hora_regular),
      cantidad_horas_extras: parseFloat(formData.cantidad_horas_extras) || 0,
      valor_hora_extra: parseFloat(formData.valor_hora_extra),
      recargos_nocturnos: parseFloat(formData.recargos_nocturnos) || 0,
      recargos_dominicales: parseFloat(formData.recargos_dominicales) || 0,
      deducciones: parseFloat(formData.deducciones) || 0,
      fecha: new Date().toISOString().split('T')[0],
      estado: formData.estado
    };

    setData(prev => [...prev, newRecord]);
    toast.success('Registro de nómina agregado exitosamente');
    
    // Reset form
    setFormData({
      empleado_id: '',
      mes: '',
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
    setIsDialogOpen(false);
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
            <p className="text-slate-500 mt-1">Visualización y edición de registros de nómina de empleados.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Registro de Nómina
          </Button>
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
                        {n.empleado}
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
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Ver Detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Record Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Registro de Nómina</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRecord}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empleado_id">Empleado *</Label>
                    <Select 
                      value={formData.empleado_id} 
                      onValueChange={(value) => setFormData({ ...formData, empleado_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockEmpleados.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mes">Mes *</Label>
                    <Select 
                      value={formData.mesNumero} 
                      onValueChange={(value) => {
                        const mesObj = MESES.find(m => m.valor === parseInt(value));
                        setFormData({ ...formData, mesNumero: value, mes: mesObj?.label || '' });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {MESES.map(mes => (
                          <SelectItem key={mes.valor} value={String(mes.valor)}>{mes.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quincena">Quincena *</Label>
                  <Select 
                    value={formData.quincena} 
                    onValueChange={(value) => setFormData({ ...formData, quincena: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione quincena" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUINCENAS.map(q => (
                        <SelectItem key={q.valor} value={String(q.valor)}>{q.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horas_regulares">Horas Regulares *</Label>
                    <Input
                      id="horas_regulares"
                      type="number"
                      value={formData.horas_regulares_trabajadas}
                      onChange={(e) => setFormData({ ...formData, horas_regulares_trabajadas: e.target.value })}
                      placeholder="80"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_hora_regular">Valor Hora Regular *</Label>
                    <Input
                      id="valor_hora_regular"
                      type="number"
                      value={formData.valor_hora_regular}
                      onChange={(e) => setFormData({ ...formData, valor_hora_regular: e.target.value })}
                      placeholder="6500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horas_extras">Horas Extra</Label>
                    <Input
                      id="horas_extras"
                      type="number"
                      value={formData.cantidad_horas_extras}
                      onChange={(e) => setFormData({ ...formData, cantidad_horas_extras: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_hora_extra">Valor Hora Extra *</Label>
                    <Input
                      id="valor_hora_extra"
                      type="number"
                      value={formData.valor_hora_extra}
                      onChange={(e) => setFormData({ ...formData, valor_hora_extra: e.target.value })}
                      placeholder="9750"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recargos_nocturnos">Recargos Nocturnos</Label>
                    <Input
                      id="recargos_nocturnos"
                      type="number"
                      value={formData.recargos_nocturnos}
                      onChange={(e) => setFormData({ ...formData, recargos_nocturnos: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recargos_dominicales">Recargos Dominicales</Label>
                    <Input
                      id="recargos_dominicales"
                      type="number"
                      value={formData.recargos_dominicales}
                      onChange={(e) => setFormData({ ...formData, recargos_dominicales: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deducciones">Deducciones</Label>
                  <Input
                    id="deducciones"
                    type="number"
                    value={formData.deducciones}
                    onChange={(e) => setFormData({ ...formData, deducciones: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select 
                    value={formData.estado} 
                    onValueChange={(value) => setFormData({ ...formData, estado: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pagado">Pagado</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Calculated Total Display */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Costo Total Calculado:</span>
                    <span className="text-xl font-bold text-blue-700">{formatCurrency(calculatedTotal)}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Agregar Registro
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PayrollPage;