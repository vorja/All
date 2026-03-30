import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Clock, User, ChevronDown, ChevronUp, Plus, X, Edit2, 
  AlertCircle, TrendingUp, Calendar, CheckCircle, Trash2, Save
} from 'lucide-react';
import { toast } from 'sonner';

// --- Core Calculation Functions ---

const timeToMins = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h * 60) + m;
};

const minsToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const calcularMinutos = (horaInicio, horaFin) => {
  return Math.max(0, timeToMins(horaFin) - timeToMins(horaInicio));
};

const formatearHora = (minutos) => {
  if (minutos === 0) return '0h 0m';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const calcularJornada = (marcas = [], horarioBaseHoras = 8) => {
  // Sort marks chronologically
  const sorted = [...marcas].sort((a, b) => timeToMins(a.hora) - timeToMins(b.hora));
  
  let bloques = [];
  let totalMinutos = 0;
  let tiempoInactividad = 0;
  let lastSalidaMins = null;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].tipo === 'entrada') {
      // Find the next matching salida
      let nextSalidaIdx = i + 1;
      while (nextSalidaIdx < sorted.length && sorted[nextSalidaIdx].tipo !== 'salida') {
        nextSalidaIdx++;
      }

      if (nextSalidaIdx < sorted.length) {
        const startMins = timeToMins(sorted[i].hora);
        const endMins = timeToMins(sorted[nextSalidaIdx].hora);
        const duration = endMins - startMins;

        // Calculate inactivity if there was a previous block
        if (lastSalidaMins !== null && startMins > lastSalidaMins) {
          tiempoInactividad += (startMins - lastSalidaMins);
        }

        // Split block for timeline visualization (regular vs overtime)
        const baseMins = horarioBaseHoras * 60;
        
        if (totalMinutos >= baseMins) {
          // Entire block is overtime
          bloques.push({
            start: startMins, end: endMins, duration, type: 'extra',
            startStr: sorted[i].hora, endStr: sorted[nextSalidaIdx].hora
          });
        } else if (totalMinutos + duration > baseMins) {
          // Block crosses the regular/overtime threshold
          const regDuration = baseMins - totalMinutos;
          const splitPoint = startMins + regDuration;
          
          bloques.push({
            start: startMins, end: splitPoint, duration: regDuration, type: 'regular',
            startStr: sorted[i].hora, endStr: minsToTime(splitPoint)
          });
          bloques.push({
            start: splitPoint, end: endMins, duration: duration - regDuration, type: 'extra',
            startStr: minsToTime(splitPoint), endStr: sorted[nextSalidaIdx].hora
          });
        } else {
          // Entire block is regular
          bloques.push({
            start: startMins, end: endMins, duration, type: 'regular',
            startStr: sorted[i].hora, endStr: sorted[nextSalidaIdx].hora
          });
        }

        totalMinutos += duration;
        lastSalidaMins = endMins;
        i = nextSalidaIdx; // Skip processed marks
      }
    }
  }

  const baseMinsTotal = horarioBaseHoras * 60;
  const horasExtra = Math.max(0, totalMinutos - baseMinsTotal);
  const faltanteMins = Math.max(0, baseMinsTotal - totalMinutos);

  let estado = 'normal';
  if (horasExtra > 0) estado = 'extra';
  if (faltanteMins > 0 && totalMinutos > 0) estado = 'faltante';
  if (totalMinutos === 0) estado = 'ausente';

  return {
    totalMinutos,
    totalHoras: formatearHora(totalMinutos),
    horasExtraMins: horasExtra,
    horasExtra: formatearHora(horasExtra),
    tiempoInactividad,
    tiempoInactividadStr: formatearHora(tiempoInactividad),
    bloques,
    estado
  };
};

// --- Mock Data Generation ---
const generateMockData = () => {
  const dates = ['2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29'];
  const depts = ['Producción', 'Empaque', 'Mantenimiento', 'Calidad', 'Logística'];
  const names = [
    'Carlos Rodríguez', 'María Fernanda López', 'Jorge Martínez', 'Ana Lucía Gómez',
    'Pedro Sánchez', 'Diana Ramírez', 'Luis Fernando Torres', 'Carmen Ruiz'
  ];

  return names.map((nombre, i) => {
    const asistencia = {};
    dates.forEach(date => {
      // Generate realistic variations
      const isLate = Math.random() > 0.8;
      const hasOvertime = Math.random() > 0.6;
      const isAbsent = Math.random() > 0.95;

      if (isAbsent) {
        asistencia[date] = [];
        return;
      }

      const entrada1 = isLate ? '08:15' : '08:00';
      const salida1 = '12:00';
      const entrada2 = '13:00';
      const salida2 = hasOvertime ? '18:30' : '17:00';

      asistencia[date] = [
        { hora: entrada1, tipo: 'entrada' },
        { hora: salida1, tipo: 'salida' },
        { hora: entrada2, tipo: 'entrada' },
        { hora: salida2, tipo: 'salida' }
      ];
    });

    return {
      id: `EMP-00${i + 1}`,
      nombre,
      departamento: depts[i % depts.length],
      horarioBase: 8,
      asistencia
    };
  });
};

const initialMockData = generateMockData();
const availableDates = ['2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29'];

// --- Main Component ---
export default function ControlHorasPage() {
  const [empleados, setEmpleados] = useState(initialMockData);
  const [expandedEmpleado, setExpandedEmpleado] = useState(null);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  
  // Edit States
  const [editingMarca, setEditingMarca] = useState(null); // { empId, date, index }
  const [editValue, setEditValue] = useState('');
  
  // Add States
  const [isAdding, setIsAdding] = useState(false);
  const [newMarca, setNewMarca] = useState({ hora: '', tipo: 'entrada' });
  
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleExpandEmpleado = (id) => {
    setExpandedEmpleado(expandedEmpleado === id ? null : id);
    setEditingMarca(null);
    setIsAdding(false);
  };

  const handleSelectDate = (fecha) => {
    setSelectedDate(fecha);
    setEditingMarca(null);
    setIsAdding(false);
  };

  const validateTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  const handleEditMarcaStart = (empId, date, index, currentHora) => {
    setEditingMarca({ empId, date, index });
    setEditValue(currentHora);
  };

  const handleEditMarcaSave = async () => {
    if (!validateTime(editValue)) {
      toast.error('Formato de hora inválido (HH:MM)');
      return;
    }

    setLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 400));

    setEmpleados(prev => prev.map(emp => {
      if (emp.id === editingMarca.empId) {
        const newAsistencia = { ...emp.asistencia };
        const dayMarks = [...newAsistencia[editingMarca.date]];
        dayMarks[editingMarca.index].hora = editValue;
        // Re-sort after edit
        dayMarks.sort((a, b) => timeToMins(a.hora) - timeToMins(b.hora));
        newAsistencia[editingMarca.date] = dayMarks;
        return { ...emp, asistencia: newAsistencia };
      }
      return emp;
    }));

    toast.success('Marca actualizada');
    setEditingMarca(null);
    setLoading(false);
  };

  const handleDeleteMarca = async (empId, date, index) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    setEmpleados(prev => prev.map(emp => {
      if (emp.id === empId) {
        const newAsistencia = { ...emp.asistencia };
        const dayMarks = [...newAsistencia[date]];
        dayMarks.splice(index, 1);
        newAsistencia[date] = dayMarks;
        return { ...emp, asistencia: newAsistencia };
      }
      return emp;
    }));

    toast.success('Marca eliminada');
    setLoading(false);
  };

  const handleAddMarca = async (empId, date) => {
    if (!validateTime(newMarca.hora)) {
      toast.error('Formato de hora inválido (HH:MM)');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    setEmpleados(prev => prev.map(emp => {
      if (emp.id === empId) {
        const newAsistencia = { ...emp.asistencia };
        const dayMarks = [...(newAsistencia[date] || [])];
        
        // Check for duplicates
        if (dayMarks.some(m => m.hora === newMarca.hora)) {
          toast.error('Ya existe una marca a esa hora');
          return emp;
        }

        dayMarks.push({ ...newMarca });
        dayMarks.sort((a, b) => timeToMins(a.hora) - timeToMins(b.hora));
        newAsistencia[date] = dayMarks;
        return { ...emp, asistencia: newAsistencia };
      }
      return emp;
    }));

    toast.success('Marca agregada');
    setIsAdding(false);
    setNewMarca({ hora: '', tipo: 'entrada' });
    setLoading(false);
  };

  // --- Render Helpers ---
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const renderStatusBadge = (estado) => {
    switch (estado) {
      case 'extra':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Horas Extra</Badge>;
      case 'faltante':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200">Incompleto</Badge>;
      case 'ausente':
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">Ausente</Badge>;
      default:
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">Normal</Badge>;
    }
  };

  // Calculate weekly summary for an employee
  const getWeeklySummary = (emp) => {
    let totalMins = 0;
    let extraMins = 0;
    let hasFaltante = false;

    Object.values(emp.asistencia).forEach(marcas => {
      const stats = calcularJornada(marcas, emp.horarioBase);
      totalMins += stats.totalMinutos;
      extraMins += stats.horasExtraMins;
      if (stats.estado === 'faltante') hasFaltante = true;
    });

    let estado = 'normal';
    if (extraMins > 0) estado = 'extra';
    if (hasFaltante) estado = 'faltante';

    return {
      trabajadas: formatearHora(totalMins),
      extra: formatearHora(extraMins),
      estado
    };
  };

  return (
    <TooltipProvider>
      <Helmet><title>Control de Asistencias | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="h-8 w-8 text-blue-600" />
              Control de Asistencias
            </h1>
            <p className="text-slate-500 mt-1">Biométrico Hikvision - Gestión de Marcas</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-slate-600 font-medium">Sincronizado: Hace 5 min</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Empleado</th>
                  <th className="px-6 py-4 font-semibold">Departamento</th>
                  <th className="px-6 py-4 font-semibold text-center">Horas Semanales</th>
                  <th className="px-6 py-4 font-semibold text-center">Horas Extra</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado General</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {empleados.map((emp) => {
                  const isExpanded = expandedEmpleado === emp.id;
                  const weeklyStats = getWeeklySummary(emp);
                  const dailyMarks = emp.asistencia[selectedDate] || [];
                  const dailyStats = calcularJornada(dailyMarks, emp.horarioBase);

                  return (
                    <React.Fragment key={emp.id}>
                      {/* Summary Row */}
                      <tr 
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : 'bg-white'}`}
                        onClick={() => handleExpandEmpleado(emp.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-slate-200">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {getInitials(emp.nombre)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-900">{emp.nombre}</p>
                              <p className="text-xs text-slate-500 font-mono">{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {emp.departamento}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                          {weeklyStats.trabajadas}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-slate-600">
                          {weeklyStats.extra !== '0h 0m' ? weeklyStats.extra : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {renderStatusBadge(weeklyStats.estado)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </Button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="p-0 border-b border-slate-200 bg-slate-50/50">
                            <div className="p-6 md:p-8 space-y-6">
                              
                              {/* Expanded Header & Date Selector */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-slate-400" />
                                  <h4 className="text-base font-semibold text-slate-800">
                                    Detalle Diario
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                                  {availableDates.map(date => (
                                    <button
                                      key={date}
                                      onClick={() => handleSelectDate(date)}
                                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        selectedDate === date 
                                          ? 'bg-blue-600 text-white shadow-sm' 
                                          : 'text-slate-600 hover:bg-slate-100'
                                      }`}
                                    >
                                      {date.split('-')[2]} {/* Just show day number */}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Daily Stats Cards */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Clock className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Horas</p>
                                    <p className="text-lg font-bold text-slate-900">{dailyStats.totalHoras}</p>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                  <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                                    <TrendingUp className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Horas Extra</p>
                                    <p className="text-lg font-bold text-slate-900">{dailyStats.horasExtra}</p>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                  <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
                                    <AlertCircle className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Inactividad</p>
                                    <p className="text-lg font-bold text-slate-900">{dailyStats.tiempoInactividadStr}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Visual Timeline */}
                              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                                <div className="flex justify-between text-xs font-medium text-slate-500">
                                  <span>00:00</span>
                                  <span>06:00</span>
                                  <span>12:00</span>
                                  <span>18:00</span>
                                  <span>24:00</span>
                                </div>
                                <div className="relative h-10 bg-slate-100 rounded-lg w-full overflow-hidden border border-slate-200/50">
                                  {/* Grid lines */}
                                  {[25, 50, 75].map(pct => (
                                    <div key={pct} className="absolute top-0 bottom-0 w-px bg-slate-200/80" style={{ left: `${pct}%` }} />
                                  ))}
                                  
                                  {/* Time Blocks */}
                                  {dailyStats.bloques.map((b, i) => (
                                    <Tooltip key={i}>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={`absolute h-full transition-all hover:brightness-110 cursor-help border-y border-transparent ${
                                            b.type === 'regular' 
                                              ? 'bg-blue-500 border-blue-600/20' 
                                              : 'bg-amber-500 border-amber-600/20'
                                          }`}
                                          style={{ 
                                            left: `${(b.start / 1440) * 100}%`, 
                                            width: `${(b.duration / 1440) * 100}%`,
                                            // Add tiny gap between adjacent blocks for visual clarity
                                            borderRightWidth: i < dailyStats.bloques.length - 1 && dailyStats.bloques[i+1].start === b.end ? '1px' : '0',
                                            borderRightColor: 'rgba(255,255,255,0.3)'
                                          }}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-slate-900 text-white border-none shadow-xl">
                                        <p className="font-medium">{b.startStr} - {b.endStr}</p>
                                        <p className="text-xs text-slate-300">{formatearHora(b.duration)} ({b.type === 'regular' ? 'Regular' : 'Extra'})</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500 justify-end pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                    <span>Jornada Regular</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
                                    <span>Horas Extra</span>
                                  </div>
                                </div>
                              </div>

                              {/* Marks Table Editor */}
                              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                  <h5 className="font-semibold text-slate-800">Registro de Marcas</h5>
                                  {!isAdding && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => setIsAdding(true)}
                                      className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <Plus className="h-4 w-4 mr-1.5" />
                                      Agregar Marca
                                    </Button>
                                  )}
                                </div>
                                
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs">
                                    <tr>
                                      <th className="px-5 py-3 font-medium w-24">Orden</th>
                                      <th className="px-5 py-3 font-medium">Hora</th>
                                      <th className="px-5 py-3 font-medium">Tipo</th>
                                      <th className="px-5 py-3 font-medium text-right">Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {dailyMarks.length === 0 && !isAdding && (
                                      <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                                          No hay marcas registradas para este día.
                                        </td>
                                      </tr>
                                    )}
                                    
                                    {dailyMarks.map((marca, idx) => {
                                      const isEditingThis = editingMarca?.empId === emp.id && editingMarca?.date === selectedDate && editingMarca?.index === idx;
                                      
                                      return (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                          <td className="px-5 py-3 text-slate-400 font-mono text-xs">#{idx + 1}</td>
                                          <td className="px-5 py-3">
                                            {isEditingThis ? (
                                              <Input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value.replace(/[^0-9:]/g, '').substring(0, 5))}
                                                className="w-24 h-8 font-mono text-center"
                                                placeholder="HH:MM"
                                                autoFocus
                                              />
                                            ) : (
                                              <span className="font-mono font-medium text-slate-700">{marca.hora}</span>
                                            )}
                                          </td>
                                          <td className="px-5 py-3">
                                            {marca.tipo === 'entrada' ? (
                                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Entrada</Badge>
                                            ) : (
                                              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Salida</Badge>
                                            )}
                                          </td>
                                          <td className="px-5 py-3 text-right">
                                            {isEditingThis ? (
                                              <div className="flex items-center justify-end gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" onClick={handleEditMarcaSave} disabled={loading}>
                                                  <Save className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => setEditingMarca(null)} disabled={loading}>
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ) : (
                                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEditMarcaStart(emp.id, selectedDate, idx, marca.hora)}>
                                                  <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteMarca(emp.id, selectedDate, idx)}>
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}

                                    {/* Add New Mark Row */}
                                    {isAdding && (
                                      <tr className="bg-blue-50/30">
                                        <td className="px-5 py-3 text-blue-400 font-mono text-xs">Nuevo</td>
                                        <td className="px-5 py-3">
                                          <Input
                                            value={newMarca.hora}
                                            onChange={(e) => setNewMarca({...newMarca, hora: e.target.value.replace(/[^0-9:]/g, '').substring(0, 5)})}
                                            className="w-24 h-8 font-mono text-center border-blue-200 focus-visible:ring-blue-500"
                                            placeholder="HH:MM"
                                            autoFocus
                                          />
                                        </td>
                                        <td className="px-5 py-3">
                                          <Select value={newMarca.tipo} onValueChange={(v) => setNewMarca({...newMarca, tipo: v})}>
                                            <SelectTrigger className="w-28 h-8 text-xs border-blue-200">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="entrada">Entrada</SelectItem>
                                              <SelectItem value="salida">Salida</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                          <div className="flex items-center justify-end gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-100" onClick={() => handleAddMarca(emp.id, selectedDate)} disabled={loading || newMarca.hora.length < 5}>
                                              <Save className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => setIsAdding(false)} disabled={loading}>
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}