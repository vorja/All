import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Users, Plus, Search, Mail, Phone, Building, 
  Trash2, Edit, Factory, Briefcase, Package, Truck, TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AREAS = ['Producción', 'Administración', 'Empaque', 'Logística', 'Ventas'];

const AREA_ICONS = {
  'Producción': Factory,
  'Administración': Briefcase,
  'Empaque': Package,
  'Logística': Truck,
  'Ventas': TrendingUp
};

const initialMockEmpleados = [
  { id: 'EMP-001', nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@agricol.com', telefono: '3001234567', area: 'Producción', salario: 1800000, estado: 'Activo', fechaIngreso: '2024-01-15' },
  { id: 'EMP-002', nombre: 'María Fernanda López', email: 'maria.lopez@agricol.com', telefono: '3009876543', area: 'Producción', salario: 1950000, estado: 'Activo', fechaIngreso: '2024-02-20' },
  { id: 'EMP-003', nombre: 'Jorge Martínez', email: 'jorge.martinez@agricol.com', telefono: '3005551234', area: 'Producción', salario: 1800000, estado: 'Activo', fechaIngreso: '2023-11-10' },
  { id: 'EMP-004', nombre: 'Ana Lucía Gómez', email: 'ana.gomez@agricol.com', telefono: '3007778888', area: 'Producción', salario: 2200000, estado: 'Activo', fechaIngreso: '2023-08-05' },
  { id: 'EMP-005', nombre: 'Pedro Sánchez', email: 'pedro.sanchez@agricol.com', telefono: '3002223333', area: 'Administración', salario: 2500000, estado: 'Activo', fechaIngreso: '2023-05-12' },
  { id: 'EMP-006', nombre: 'Diana Ramírez', email: 'diana.ramirez@agricol.com', telefono: '3004445555', area: 'Administración', salario: 2300000, estado: 'Activo', fechaIngreso: '2024-01-08' },
  { id: 'EMP-007', nombre: 'Luis Fernando Torres', email: 'luis.torres@agricol.com', telefono: '3006667777', area: 'Administración', salario: 2100000, estado: 'Activo', fechaIngreso: '2023-09-22' },
  { id: 'EMP-008', nombre: 'Carmen Ruiz', email: 'carmen.ruiz@agricol.com', telefono: '3008889999', area: 'Administración', salario: 2800000, estado: 'Activo', fechaIngreso: '2023-03-15' },
  { id: 'EMP-009', nombre: 'Andrés Felipe Castro', email: 'andres.castro@agricol.com', telefono: '3001112222', area: 'Empaque', salario: 1700000, estado: 'Activo', fechaIngreso: '2024-03-01' },
  { id: 'EMP-010', nombre: 'Valentina Morales', email: 'valentina.morales@agricol.com', telefono: '3003334444', area: 'Empaque', salario: 1850000, estado: 'Activo', fechaIngreso: '2023-12-10' },
  { id: 'EMP-011', nombre: 'Santiago Vargas', email: 'santiago.vargas@agricol.com', telefono: '3005556666', area: 'Empaque', salario: 1750000, estado: 'Activo', fechaIngreso: '2024-02-14' },
  { id: 'EMP-012', nombre: 'Isabella Herrera', email: 'isabella.herrera@agricol.com', telefono: '3007778899', area: 'Empaque', salario: 1900000, estado: 'Activo', fechaIngreso: '2023-10-20' },
  { id: 'EMP-013', nombre: 'Miguel Ángel Rojas', email: 'miguel.rojas@agricol.com', telefono: '3009990000', area: 'Logística', salario: 2000000, estado: 'Activo', fechaIngreso: '2023-07-18' },
  { id: 'EMP-014', nombre: 'Camila Ortiz', email: 'camila.ortiz@agricol.com', telefono: '3001231234', area: 'Logística', salario: 1950000, estado: 'Activo', fechaIngreso: '2024-01-25' },
  { id: 'EMP-015', nombre: 'Daniel Mendoza', email: 'daniel.mendoza@agricol.com', telefono: '3004564567', area: 'Logística', salario: 2100000, estado: 'Activo', fechaIngreso: '2023-06-30' },
  { id: 'EMP-016', nombre: 'Sofía Restrepo', email: 'sofia.restrepo@agricol.com', telefono: '3007897890', area: 'Ventas', salario: 2400000, estado: 'Activo', fechaIngreso: '2023-04-12' },
  { id: 'EMP-017', nombre: 'Julián Pérez', email: 'julian.perez@agricol.com', telefono: '3002342345', area: 'Ventas', salario: 2300000, estado: 'Activo', fechaIngreso: '2024-02-05' },
  { id: 'EMP-018', nombre: 'Laura Gutiérrez', email: 'laura.gutierrez@agricol.com', telefono: '3005675678', area: 'Ventas', salario: 2500000, estado: 'Activo', fechaIngreso: '2023-11-28' }
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(value);
};

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState(initialMockEmpleados);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedEmployeeId, setDraggedEmployeeId] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    area: '',
    salario: '',
    fechaIngreso: ''
  });

  const filteredEmpleados = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return empleados.filter(emp => 
      emp.nombre.toLowerCase().includes(term) ||
      emp.area.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }, [empleados, searchTerm]);

  const handleDragStart = (e, id) => {
    setDraggedEmployeeId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    if (!draggedEmployeeId) return;

    setEmpleados(prev => prev.map(emp => {
      if (emp.id === draggedEmployeeId && emp.area !== targetArea) {
        toast.success(`${emp.nombre} reasignado a ${targetArea}`);
        return { ...emp, area: targetArea };
      }
      return emp;
    }));
    setDraggedEmployeeId(null);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.area || !formData.salario || !formData.fechaIngreso) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const newEmployee = {
      id: `EMP-${String(empleados.length + 1).padStart(3, '0')}`,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      area: formData.area,
      salario: parseFloat(formData.salario),
      estado: 'Activo',
      fechaIngreso: formData.fechaIngreso
    };

    setEmpleados(prev => [...prev, newEmployee]);
    toast.success(`Empleado ${newEmployee.nombre} agregado exitosamente`);
    
    setFormData({ nombre: '', email: '', telefono: '', area: '', salario: '', fechaIngreso: '' });
    setIsDialogOpen(false);
  };

  const handleDeleteEmployee = (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar a ${nombre}?`)) {
      setEmpleados(prev => prev.filter(emp => emp.id !== id));
      toast.success(`Empleado ${nombre} eliminado`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <Helmet><title>Gestión de Personal | AGRICOL</title></Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Gestión de Personal
          </h1>
          <p className="text-slate-500 mt-1">
            Directorio completo y organigrama interactivo de empleados.
          </p>
        </div>
      </div>

      <Tabs defaultValue="directorio" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="directorio">Directorio</TabsTrigger>
          <TabsTrigger value="organigrama">Organigrama</TabsTrigger>
        </TabsList>

        {/* TAB 1: DIRECTORIO */}
        <TabsContent value="directorio" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Listado Maestro</CardTitle>
                <CardDescription>Visualiza y gestiona la información detallada de todo el personal.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="Buscar empleado..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 shrink-0">
                      <Plus className="mr-2 h-4 w-4" /> Agregar Empleado
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Nuevo Empleado</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddEmployee} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Juan Pérez" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="juan@agricol.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} placeholder="3001234567" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Área Asignada</Label>
                        <Select value={formData.area} onValueChange={(v) => setFormData({...formData, area: v})}>
                          <SelectTrigger><SelectValue placeholder="Seleccione un área" /></SelectTrigger>
                          <SelectContent>
                            {AREAS.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salario">Salario Base (COP)</Label>
                        <Input id="salario" type="number" value={formData.salario} onChange={(e) => setFormData({...formData, salario: e.target.value})} placeholder="1800000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                        <Input id="fechaIngreso" type="date" value={formData.fechaIngreso} onChange={(e) => setFormData({...formData, fechaIngreso: e.target.value})} required />
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar Empleado</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">Nombre</TableHead>
                      <TableHead className="font-semibold text-slate-600">Área</TableHead>
                      <TableHead className="font-semibold text-slate-600">Contacto</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-right">Salario</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmpleados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                          No se encontraron empleados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmpleados.map((emp) => (
                        <TableRow key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                          <TableCell>
                            <div className="font-medium text-slate-900">{emp.nombre}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{emp.id}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                              <Building className="mr-1.5 h-3 w-3" /> {emp.area}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-sm text-slate-600">
                                <Mail className="mr-2 h-3.5 w-3.5 text-slate-400" /> {emp.email}
                              </div>
                              <div className="flex items-center text-sm text-slate-600">
                                <Phone className="mr-2 h-3.5 w-3.5 text-slate-400" /> {emp.telefono}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium text-slate-700">
                            {formatCurrency(emp.salario)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => toast.info('Edición próximamente')}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteEmployee(emp.id, emp.nombre)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ORGANIGRAMA (KANBAN) */}
        <TabsContent value="organigrama" className="space-y-4">
          <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[calc(100vh-240px)] items-start">
            {AREAS.map(area => {
              const AreaIcon = AREA_ICONS[area] || Users;
              const areaEmployees = empleados.filter(emp => emp.area === area);
              
              return (
                <div 
                  key={area}
                  className="flex-shrink-0 w-80 bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex flex-col h-full max-h-[calc(100vh-260px)]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, area)}
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-md shadow-sm text-slate-600">
                        <AreaIcon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-slate-800">{area}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-mono">
                      {areaEmployees.length}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {areaEmployees.length === 0 ? (
                      <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                        <p className="text-sm text-slate-400 font-medium">Arrastra empleados aquí</p>
                      </div>
                    ) : (
                      areaEmployees.map(emp => (
                        <Card 
                          key={emp.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, emp.id)}
                          className="cursor-move border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-200 bg-white"
                        >
                          <CardContent className="p-3.5">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-slate-900 text-sm leading-tight">{emp.nombre}</h4>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center text-xs text-slate-500">
                                <Mail className="h-3 w-3 mr-1.5 shrink-0" />
                                <span className="truncate">{emp.email}</span>
                              </div>
                              <div className="flex items-center text-xs text-slate-500">
                                <Phone className="h-3 w-3 mr-1.5 shrink-0" />
                                <span>{emp.telefono}</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-xs font-mono text-slate-400">{emp.id}</span>
                              <span className="text-xs font-medium text-slate-700">{formatCurrency(emp.salario)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}