import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Package, Activity, Box, Users, Wrench, ShieldCheck, DollarSign } from 'lucide-react';
import { 
  mockLotes, 
  mockMedidores, 
  mockInsumos, 
  mockNomina, 
  mockMantenimiento, 
  mockSaneamiento,
  mockHistoricalCosts,
  mockServiceCostsHistory
} from '@/data/mockData.js';
import CostDetailModal from '@/components/CostDetailModal.jsx';
import { usePayrollCalculation } from '@/hooks/useCalculations.js';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
};

const DashboardPage = () => {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });

  // --- Calculations ---
  const lotesTotal = useMemo(() => mockLotes.filter(l => l.estado === 'Valorizado').reduce((sum, l) => sum + l.valorTotal, 0), []);
  const serviciosTotal = useMemo(() => mockMedidores.reduce((sum, m) => sum + m.historial.reduce((hSum, h) => hSum + h.costoEstimado, 0), 0), []);
  const insumosTotal = useMemo(() => mockInsumos.reduce((sum, i) => sum + (i.stockActual * i.costoUnitario), 0), []);
  
  const { totalCostGeneral: nominasTotal } = usePayrollCalculation(mockNomina);
  
  const mantenimientoTotal = useMemo(() => mockMantenimiento.reduce((sum, m) => sum + m.costo, 0), []);
  const saneamientoTotal = useMemo(() => mockSaneamiento.reduce((sum, s) => sum + s.costo_contratista, 0), []);
  
  const generalTotal = lotesTotal + serviciosTotal + insumosTotal + nominasTotal + mantenimientoTotal + saneamientoTotal;

  // --- Chart Data Prep ---
  const distribucionCostosData = [
    { name: 'Lotes', value: lotesTotal },
    { name: 'Servicios', value: serviciosTotal },
    { name: 'Insumos', value: insumosTotal },
    { name: 'Nóminas', value: nominasTotal },
    { name: 'Mantenimiento', value: mantenimientoTotal },
    { name: 'Saneamiento', value: saneamientoTotal },
  ];

  const topProveedoresData = useMemo(() => {
    const provMap = mockLotes.reduce((acc, lote) => {
      if (lote.estado === 'Valorizado') {
        acc[lote.proveedor] = (acc[lote.proveedor] || 0) + lote.valorTotal;
      }
      return acc;
    }, {});
    return Object.entries(provMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  const fijosVsVariablesData = useMemo(() => {
    const mantPreventivo = mockMantenimiento.filter(m => m.tipo === 'Preventivo').reduce((sum, m) => sum + m.costo, 0);
    const mantCorrectivo = mockMantenimiento.filter(m => m.tipo === 'Correctivo').reduce((sum, m) => sum + m.costo, 0);
    
    const fijos = nominasTotal + mantPreventivo;
    const variables = lotesTotal + serviciosTotal + insumosTotal + mantCorrectivo + saneamientoTotal;
    
    return [
      { name: 'Costos Fijos', value: fijos },
      { name: 'Costos Variables', value: variables }
    ];
  }, [nominasTotal, lotesTotal, serviciosTotal, insumosTotal, saneamientoTotal]);

  const horasTrabajoData = useMemo(() => {
    const reg = mockNomina.reduce((sum, n) => sum + (Number(n.horas_regulares_trabajadas) || 0), 0);
    const ext = mockNomina.reduce((sum, n) => sum + (Number(n.cantidad_horas_extras) || 0), 0);
    return [
      { name: 'Regulares', value: reg },
      { name: 'Extra', value: ext }
    ];
  }, []);

  // --- Modal Handlers ---
  const openModal = (type) => setModalConfig({ isOpen: true, type });
  const closeModal = () => setModalConfig({ isOpen: false, type: null });

  const getModalProps = () => {
    switch (modalConfig.type) {
      case 'lotes':
        return {
          title: 'Detalle de Costos: Lotes',
          totalCost: lotesTotal,
          tableData: mockLotes.filter(l => l.estado === 'Valorizado'),
          columns: [
            { header: 'Lote ID', accessor: 'loteId', isBold: true },
            { header: 'Proveedor', accessor: 'proveedor' },
            { header: 'Variedad', accessor: 'variedad' },
            { header: 'Cantidad (kg)', accessor: 'cantidad', align: 'right' },
            { header: 'Valor Total', accessor: 'valorTotal', align: 'right', format: 'currency' }
          ],
          chartType: 'bar',
          chartData: topProveedoresData
        };
      case 'servicios':
        return {
          title: 'Detalle de Costos: Servicios',
          totalCost: serviciosTotal,
          tableData: mockMedidores.flatMap(m => m.historial.map(h => ({ ...h, medidor: m.nombre, tipo: m.tipo }))),
          columns: [
            { header: 'Fecha', accessor: 'fecha' },
            { header: 'Medidor', accessor: 'medidor', isBold: true },
            { header: 'Tipo', accessor: 'tipo' },
            { header: 'Consumo', accessor: 'diferencia', align: 'right' },
            { header: 'Costo Estimado', accessor: 'costoEstimado', align: 'right', format: 'currency' }
          ],
          chartType: 'pie',
          chartData: mockMedidores.map(m => ({
            name: m.tipo,
            value: m.historial.reduce((sum, h) => sum + h.costoEstimado, 0)
          }))
        };
      case 'insumos':
        return {
          title: 'Detalle de Costos: Insumos (Valorizado en Stock)',
          totalCost: insumosTotal,
          tableData: mockInsumos.map(i => ({ ...i, valorTotal: i.stockActual * i.costoUnitario })),
          columns: [
            { header: 'Insumo', accessor: 'nombre', isBold: true },
            { header: 'Categoría', accessor: 'categoria' },
            { header: 'Stock Actual', accessor: 'stockActual', align: 'right' },
            { header: 'Costo Unitario', accessor: 'costoUnitario', align: 'right', format: 'currency' },
            { header: 'Valor Total', accessor: 'valorTotal', align: 'right', format: 'currency' }
          ],
          chartType: 'pie',
          chartData: Object.entries(mockInsumos.reduce((acc, i) => {
            acc[i.categoria] = (acc[i.categoria] || 0) + (i.stockActual * i.costoUnitario);
            return acc;
          }, {})).map(([name, value]) => ({ name, value }))
        };
      case 'nominas':
        return {
          title: 'Detalle de Costos: Nóminas',
          dataType: 'nominas',
          rawData: mockNomina
        };
      case 'mantenimiento':
        return {
          title: 'Detalle de Costos: Mantenimiento',
          totalCost: mantenimientoTotal,
          tableData: mockMantenimiento,
          columns: [
            { header: 'Fecha', accessor: 'fecha' },
            { header: 'Máquina', accessor: 'maquina_id', isBold: true },
            { header: 'Tipo', accessor: 'tipo' },
            { header: 'Descripción', accessor: 'descripcion' },
            { header: 'Costo', accessor: 'costo', align: 'right', format: 'currency' }
          ],
          chartType: 'pie',
          chartData: [
            { name: 'Preventivo', value: mockMantenimiento.filter(m => m.tipo === 'Preventivo').reduce((sum, m) => sum + m.costo, 0) },
            { name: 'Correctivo', value: mockMantenimiento.filter(m => m.tipo === 'Correctivo').reduce((sum, m) => sum + m.costo, 0) }
          ]
        };
      case 'saneamiento':
        return {
          title: 'Detalle de Costos: Saneamiento',
          totalCost: saneamientoTotal,
          tableData: mockSaneamiento,
          columns: [
            { header: 'Fecha', accessor: 'fecha' },
            { header: 'Área', accessor: 'area', isBold: true },
            { header: 'Tipo Plaga', accessor: 'tipo_plaga' },
            { header: 'Costo', accessor: 'costo_contratista', align: 'right', format: 'currency' }
          ],
          chartType: 'bar',
          chartData: Object.entries(mockSaneamiento.reduce((acc, s) => {
            acc[s.area] = (acc[s.area] || 0) + s.costo_contratista;
            return acc;
          }, {})).map(([name, value]) => ({ name, value }))
        };
      case 'general':
        return {
          title: 'Resumen General de Costos',
          totalCost: generalTotal,
          tableData: distribucionCostosData.map(d => ({ categoria: d.name, costo: d.value })),
          columns: [
            { header: 'Categoría', accessor: 'categoria', isBold: true },
            { header: 'Costo Total', accessor: 'costo', align: 'right', format: 'currency' }
          ],
          chartType: 'pie',
          chartData: distribucionCostosData
        };
      default:
        return {};
    }
  };

  const KPICard = ({ title, value, icon: Icon, onClick, colorClass }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 hover:-translate-y-1 bg-white"
      style={{ borderLeftColor: colorClass }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between pb-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorClass}20` }}>
            <Icon className="h-5 w-5" style={{ color: colorClass }} />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{formatCurrency(value)}</div>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          Ver detalles <span className="text-[10px]">→</span>
        </p>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet><title>Dashboard de Costos | AGRICOL</title></Helmet>
      <div className="space-y-10 max-w-7xl mx-auto pb-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard de Costos</h1>
          <p className="text-slate-500 mt-1">Análisis integral de gastos operativos y administrativos.</p>
        </div>

        {/* Section 1: KPIs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Indicadores Principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard title="Costo Total Lotes" value={lotesTotal} icon={Package} colorClass="#10B981" onClick={() => openModal('lotes')} />
            <KPICard title="Costo Total Servicios" value={serviciosTotal} icon={Activity} colorClass="#3B82F6" onClick={() => openModal('servicios')} />
            <KPICard title="Costo Total Insumos" value={insumosTotal} icon={Box} colorClass="#F59E0B" onClick={() => openModal('insumos')} />
            <KPICard title="Costo Total Nóminas" value={nominasTotal} icon={Users} colorClass="#8B5CF6" onClick={() => openModal('nominas')} />
            <KPICard title="Costo Total Mantenimiento" value={mantenimientoTotal} icon={Wrench} colorClass="#EC4899" onClick={() => openModal('mantenimiento')} />
            <KPICard title="Costo Total Saneamiento" value={saneamientoTotal} icon={ShieldCheck} colorClass="#14B8A6" onClick={() => openModal('saneamiento')} />
          </div>
          
          <div className="mt-6">
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-200 border-t-4 border-t-slate-800 bg-slate-900 text-white hover:-translate-y-1"
              onClick={() => openModal('general')}
            >
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-slate-400 font-medium uppercase tracking-wider text-sm">Costo Total General</p>
                  <div className="text-4xl md:text-5xl font-extrabold mt-2">{formatCurrency(generalTotal)}</div>
                </div>
                <div className="mt-4 md:mt-0 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Charts */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Análisis Gráfico</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Distribución de Costos */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Distribución de Costos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribucionCostosData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distribucionCostosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: Costos por Mes */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Evolución de Costos (6 Meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHistoricalCosts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(val) => `$${val/1000000}M`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="costo" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 3: Top Proveedores */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Top 5 Proveedores por Costo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProveedoresData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                      <XAxis type="number" tickFormatter={(val) => `$${val/1000000}M`} axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                      <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                      <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 4: Fijos vs Variables */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Costos Fijos vs Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fijosVsVariablesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} tickFormatter={(val) => `$${val/1000000}M`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={60}>
                        {fijosVsVariablesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#64748B' : '#8B5CF6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 5: Evolución Servicios */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Evolución Costos de Servicios (10 Días)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockServiceCostsHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(val) => `$${val/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="costo" stroke="#F59E0B" strokeWidth={3} dot={{ r: 3, fill: '#F59E0B' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 6: Horas de Trabajo */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Distribución de Horas de Trabajo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={horasTrabajoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={100}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" /> {/* Regulares */}
                        <Cell fill="#3B82F6" /> {/* Extra */}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} hrs`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Detail Modal */}
        <CostDetailModal 
          isOpen={modalConfig.isOpen} 
          onClose={closeModal} 
          {...getModalProps()} 
        />

      </div>
    </>
  );
};

export default DashboardPage;