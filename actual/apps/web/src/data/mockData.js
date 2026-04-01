const AREAS = ['Producción', 'Administración', 'Empaque', 'Logística', 'Ventas'];

const MESES = [
  { valor: 1, label: 'Enero' },
  { valor: 2, label: 'Febrero' },
  { valor: 3, label: 'Marzo' },
  { valor: 4, label: 'Abril' },
  { valor: 5, label: 'Mayo' },
  { valor: 6, label: 'Junio' },
  { valor: 7, label: 'Julio' },
  { valor: 8, label: 'Agosto' },
  { valor: 9, label: 'Septiembre' },
  { valor: 10, label: 'Octubre' },
  { valor: 11, label: 'Noviembre' },
  { valor: 12, label: 'Diciembre' }
];

const QUINCENAS = [
  { valor: 1, label: 'Primera Quincena (1-15)' },
  { valor: 2, label: 'Segunda Quincena (16-fin)' }
];

const mockLotes = [
  { id: 'L-20260325-01', loteId: 'L-20260325-01', proveedor: 'Finca El Sol', cantidad: 5000, precioUnitario: 1200, valorTotal: 6000000, fecha: '2026-03-25', estado: 'Valorizado', variedad: 'Guayabo', tipo: 'Primera' },
  { id: 'L-20260325-02', loteId: 'L-20260325-02', proveedor: 'Hacienda La Verde', cantidad: 7500, precioUnitario: 1000, valorTotal: 7500000, fecha: '2026-03-25', estado: 'Valorizado', variedad: 'Hawaiano', tipo: 'Segunda' },
  { id: 'L-20260324-01', loteId: 'L-20260324-01', proveedor: 'Agropecuaria Los Andes', cantidad: 10000, precioUnitario: 900, valorTotal: 9000000, fecha: '2026-03-24', estado: 'Valorizado', variedad: 'Guayabo', tipo: 'Segunda' },
  { id: 'L-20260324-02', loteId: 'L-20260324-02', proveedor: 'Finca Tropical', cantidad: 6000, precioUnitario: 1850, valorTotal: 11100000, fecha: '2026-03-24', estado: 'Valorizado', variedad: 'Hawaiano', tipo: 'Primera' },
  { id: 'L-20260326-01', loteId: 'L-20260326-01', proveedor: 'Cultivos del Valle', cantidad: 8000, precioUnitario: 0, valorTotal: 0, fecha: '2026-03-26', estado: 'Pendiente', variedad: 'Guayabo', tipo: 'Primera' },
  { id: 'L-20260322-01', loteId: 'L-20260322-01', proveedor: 'Finca El Sol', cantidad: 12000, precioUnitario: 1250, valorTotal: 15000000, fecha: '2026-03-22', estado: 'Valorizado', variedad: 'Hawaiano', tipo: 'Primera' },
  { id: 'L-20260321-01', loteId: 'L-20260321-01', proveedor: 'Hacienda La Verde', cantidad: 5500, precioUnitario: 0, valorTotal: 0, fecha: '2026-03-21', estado: 'Pendiente', variedad: 'Guayabo', tipo: 'Segunda' },
  { id: 'L-20260320-01', loteId: 'L-20260320-01', proveedor: 'Agropecuaria Los Andes', cantidad: 9000, precioUnitario: 1150, valorTotal: 10350000, fecha: '2026-03-20', estado: 'Valorizado', variedad: 'Hawaiano', tipo: 'Primera' },
  { id: 'L-20260319-01', loteId: 'L-20260319-01', proveedor: 'Finca Tropical', cantidad: 11000, precioUnitario: 1200, valorTotal: 13200000, fecha: '2026-03-19', estado: 'Valorizado', variedad: 'Guayabo', tipo: 'Primera' },
  { id: 'L-20260318-01', loteId: 'L-20260318-01', proveedor: 'Cultivos del Valle', cantidad: 7000, precioUnitario: 0, valorTotal: 0, fecha: '2026-03-18', estado: 'Pendiente', variedad: 'Hawaiano', tipo: 'Primera' },
  { id: 'L-20260315-01', loteId: 'L-20260315-01', proveedor: 'Finca El Sol', cantidad: 8500, precioUnitario: 1200, valorTotal: 10200000, fecha: '2026-03-15', estado: 'Valorizado', variedad: 'Guayabo', tipo: 'Primera' },
  { id: 'L-20260314-01', loteId: 'L-20260314-01', proveedor: 'Hacienda La Verde', cantidad: 6500, precioUnitario: 1300, valorTotal: 8450000, fecha: '2026-03-14', estado: 'Valorizado', variedad: 'Hawaiano', tipo: 'Primera' },
  { id: 'L-20260312-01', loteId: 'L-20260312-01', proveedor: 'Agropecuaria Los Andes', cantidad: 9500, precioUnitario: 0, valorTotal: 0, fecha: '2026-03-12', estado: 'Pendiente', variedad: 'Guayabo', tipo: 'Segunda' },
  { id: 'L-20260310-01', loteId: 'L-20260310-01', proveedor: 'Finca Tropical', cantidad: 10500, precioUnitario: 1250, valorTotal: 13125000, fecha: '2026-03-10', estado: 'Valorizado', variedad: 'Hawaiano', tipo: 'Primera' },
  { id: 'L-20260308-01', loteId: 'L-20260308-01', proveedor: 'Cultivos del Valle', cantidad: 6000, precioUnitario: 1100, valorTotal: 6600000, fecha: '2026-03-08', estado: 'Valorizado', variedad: 'Guayabo', tipo: 'Primera' },
];

const mockCalidad = [
  { id: 'CQ-001', loteId: 'L-20260325-01', proveedor: 'Finca El Sol', cantidadOriginal: 5000, cantidadAceptada: 4900, cantidadRechazada: 100, porcentajeRechazo: 2.0, observaciones: 'Calidad óptima, maduración ideal', fecha: '2026-03-25', estado: 'Revisado' },
  { id: 'CQ-002', loteId: 'L-20260325-02', proveedor: 'Hacienda La Verde', cantidadOriginal: 7500, cantidadAceptada: 7125, cantidadRechazada: 375, porcentajeRechazo: 5.0, observaciones: 'Plátano verde con golpes mecánicos', fecha: '2026-03-25', estado: 'Revisado' },
  { id: 'CQ-003', loteId: 'L-20260324-01', proveedor: 'Agropecuaria Los Andes', cantidadOriginal: 10000, cantidadAceptada: 9200, cantidadRechazada: 800, porcentajeRechazo: 8.0, observaciones: 'Daño por transporte y sobremaduración', fecha: '2026-03-24', estado: 'Revisado' },
  { id: 'CQ-004', loteId: 'L-20260324-02', proveedor: 'Finca Tropical', cantidadOriginal: 6000, cantidadAceptada: 5820, cantidadRechazada: 180, porcentajeRechazo: 3.0, observaciones: 'Maduración uniforme, excelente calibre', fecha: '2026-03-24', estado: 'Revisado' },
  { id: 'CQ-005', loteId: 'L-20260326-01', proveedor: 'Cultivos del Valle', cantidadOriginal: 8000, cantidadAceptada: 7000, cantidadRechazada: 1000, porcentajeRechazo: 12.5, observaciones: 'Exceso de maduración, rechazo alto', fecha: '2026-03-26', estado: 'Revisado' },
  { id: 'CQ-006', loteId: 'L-20260322-01', proveedor: 'Finca El Sol', cantidadOriginal: 12000, cantidadAceptada: 11760, cantidadRechazada: 240, porcentajeRechazo: 2.0, observaciones: 'Lote limpio, sin plagas', fecha: '2026-03-22', estado: 'Revisado' },
  { id: 'CQ-007', loteId: 'L-20260321-01', proveedor: 'Hacienda La Verde', cantidadOriginal: 5500, cantidadAceptada: 5170, cantidadRechazada: 330, porcentajeRechazo: 6.0, observaciones: 'Manchas por látex', fecha: '2026-03-21', estado: 'Revisado' },
  { id: 'CQ-008', loteId: 'L-20260320-01', proveedor: 'Agropecuaria Los Andes', cantidadOriginal: 9000, cantidadAceptada: 8820, cantidadRechazada: 180, porcentajeRechazo: 2.0, observaciones: 'Buen estado general', fecha: '2026-03-20', estado: 'Revisado' },
  { id: 'CQ-009', loteId: 'L-20260319-01', proveedor: 'Finca Tropical', cantidadOriginal: 11000, cantidadAceptada: 10560, cantidadRechazada: 440, porcentajeRechazo: 4.0, observaciones: 'Algunos racimos pequeños', fecha: '2026-03-19', estado: 'Revisado' },
  { id: 'CQ-010', loteId: 'L-20260318-01', proveedor: 'Cultivos del Valle', cantidadOriginal: 7000, cantidadAceptada: 6300, cantidadRechazada: 700, porcentajeRechazo: 10.0, observaciones: 'Punta de cigarro detectada', fecha: '2026-03-18', estado: 'Revisado' },
  { id: 'CQ-011', loteId: 'L-20260315-01', proveedor: 'Finca El Sol', cantidadOriginal: 8500, cantidadAceptada: 8330, cantidadRechazada: 170, porcentajeRechazo: 2.0, observaciones: 'Calidad estándar', fecha: '2026-03-15', estado: 'Revisado' },
  { id: 'CQ-012', loteId: 'L-20260314-01', proveedor: 'Hacienda La Verde', cantidadOriginal: 6500, cantidadAceptada: 6110, cantidadRechazada: 390, porcentajeRechazo: 6.0, observaciones: 'Golpes de sol', fecha: '2026-03-14', estado: 'Revisado' },
];

const mockMedidores = [
  { 
    id: 'MED-AGUA-01', 
    nombre: 'Medidor Principal Planta', 
    tipo: 'Agua', 
    lecturaActual: 1150, 
    unidad: 'm³', 
    precioUnitario: 3200,
    ultimaActualizacion: '2026-03-25',
    historial: [
      { fecha: '2026-03-25', lectura: 1150, diferencia: 45, costoEstimado: 144000 },
      { fecha: '2026-03-24', lectura: 1105, diferencia: 42, costoEstimado: 134400 },
      { fecha: '2026-03-23', lectura: 1063, diferencia: 48, costoEstimado: 153600 },
      { fecha: '2026-03-22', lectura: 1015, diferencia: 40, costoEstimado: 128000 },
      { fecha: '2026-03-21', lectura: 975, diferencia: 45, costoEstimado: 144000 }
    ]
  },
  { 
    id: 'MED-GAS-01', 
    nombre: 'Medidor Calderas', 
    tipo: 'Gas', 
    lecturaActual: 560, 
    unidad: 'm³', 
    precioUnitario: 2150,
    ultimaActualizacion: '2026-03-25',
    historial: [
      { fecha: '2026-03-25', lectura: 560, diferencia: 12, costoEstimado: 25800 },
      { fecha: '2026-03-24', lectura: 548, diferencia: 14, costoEstimado: 30100 },
      { fecha: '2026-03-23', lectura: 534, diferencia: 10, costoEstimado: 21500 },
      { fecha: '2026-03-22', lectura: 524, diferencia: 15, costoEstimado: 32250 },
      { fecha: '2026-03-21', lectura: 509, diferencia: 11, costoEstimado: 23650 }
    ]
  },
  { 
    id: 'MED-ELEC-01', 
    nombre: 'Transformador General', 
    tipo: 'Energía', 
    lecturaActual: 5600, 
    unidad: 'kWh', 
    precioUnitario: 850,
    ultimaActualizacion: '2026-03-25',
    historial: [
      { fecha: '2026-03-25', lectura: 5600, diferencia: 85, costoEstimado: 72250 },
      { fecha: '2026-03-24', lectura: 5515, diferencia: 90, costoEstimado: 76500 },
      { fecha: '2026-03-23', lectura: 5425, diferencia: 80, costoEstimado: 68000 },
      { fecha: '2026-03-22', lectura: 5345, diferencia: 88, costoEstimado: 74800 },
      { fecha: '2026-03-21', lectura: 5257, diferencia: 82, costoEstimado: 69700 }
    ]
  },
];

const mockInsumos = [
  // Aceites y Químicos
  { id: 'INS-001', nombre: 'Aceite de Palma', categoria: 'Aceites y Químicos', imagen: 'https://images.unsplash.com/photo-1646152586935-1343e96bec7b?auto=format&fit=crop&w=400&q=80', stockActual: 45, stockMinimo: 20, unidad: 'Canecas', unidadAlternativa: 'Litros', factorConversion: 20, costoUnitario: 185000 },
  { id: 'INS-002', nombre: 'Desinfectante Industrial', categoria: 'Aceites y Químicos', imagen: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=400&q=80', stockActual: 15, stockMinimo: 10, unidad: 'Galones', unidadAlternativa: 'Litros', factorConversion: 3.78, costoUnitario: 45000 },
  { id: 'INS-003', nombre: 'Detergente Alcalino', categoria: 'Aceites y Químicos', imagen: 'https://images.unsplash.com/photo-1671700679623-1d1bbca323bd?auto=format&fit=crop&w=400&q=80', stockActual: 5, stockMinimo: 8, unidad: 'Bultos', unidadAlternativa: 'Kg', factorConversion: 25, costoUnitario: 125000 },
  { id: 'INS-004', nombre: 'Hipoclorito de Sodio', categoria: 'Aceites y Químicos', imagen: 'https://images.unsplash.com/photo-1671700679623-1d1bbca323bd?auto=format&fit=crop&w=400&q=80', stockActual: 20, stockMinimo: 15, unidad: 'Garrafas', unidadAlternativa: 'Litros', factorConversion: 20, costoUnitario: 65000 },
  { id: 'INS-005', nombre: 'Ácido Cítrico', categoria: 'Aceites y Químicos', imagen: 'https://images.unsplash.com/photo-1695406091852-fd2de416d853?auto=format&fit=crop&w=400&q=80', stockActual: 8, stockMinimo: 5, unidad: 'Sacos', unidadAlternativa: 'Kg', factorConversion: 25, costoUnitario: 210000 },
  
  // Empaque
  { id: 'INS-006', nombre: 'Bolsas de Empaque 500g', categoria: 'Empaque', imagen: 'https://images.unsplash.com/photo-1661912427421-12395ac25f92?auto=format&fit=crop&w=400&q=80', stockActual: 25, stockMinimo: 10, unidad: 'Millares', unidadAlternativa: 'Unidades', factorConversion: 1000, costoUnitario: 150000 },
  { id: 'INS-007', nombre: 'Cajas Corrugadas', categoria: 'Empaque', imagen: 'https://images.unsplash.com/photo-1507560461415-997cd00bfd45?auto=format&fit=crop&w=400&q=80', stockActual: 500, stockMinimo: 200, unidad: 'Paquetes', unidadAlternativa: 'Unidades', factorConversion: 50, costoUnitario: 85000 },
  { id: 'INS-008', nombre: 'Cinta de Embalaje', categoria: 'Empaque', imagen: 'https://images.unsplash.com/photo-1573869017246-c95157926f95?auto=format&fit=crop&w=400&q=80', stockActual: 45, stockMinimo: 50, unidad: 'Cajas', unidadAlternativa: 'Rollos', factorConversion: 36, costoUnitario: 125000 },
  { id: 'INS-009', nombre: 'Etiquetas Adhesivas', categoria: 'Empaque', imagen: 'https://images.unsplash.com/photo-1573869017246-c95157926f95?auto=format&fit=crop&w=400&q=80', stockActual: 12, stockMinimo: 5, unidad: 'Rollos', unidadAlternativa: 'Unidades', factorConversion: 5000, costoUnitario: 45000 },
  
  // Utilidades
  { id: 'INS-010', nombre: 'Guantes de Nitrilo', categoria: 'Utilidades', imagen: 'https://images.unsplash.com/photo-1484999691661-51b16a51d1d1?auto=format&fit=crop&w=400&q=80', stockActual: 15, stockMinimo: 5, unidad: 'Cajas', unidadAlternativa: 'Pares', factorConversion: 100, costoUnitario: 35000 },
  { id: 'INS-011', nombre: 'Cofias Desechables', categoria: 'Utilidades', imagen: 'https://images.unsplash.com/photo-1678626667639-de9c676e8222?auto=format&fit=crop&w=400&q=80', stockActual: 30, stockMinimo: 15, unidad: 'Paquetes', unidadAlternativa: 'Unidades', factorConversion: 100, costoUnitario: 18000 },
  { id: 'INS-012', nombre: 'Tapabocas', categoria: 'Utilidades', imagen: 'https://images.unsplash.com/photo-1585411821516-4267944c8dcf?auto=format&fit=crop&w=400&q=80', stockActual: 20, stockMinimo: 10, unidad: 'Cajas', unidadAlternativa: 'Unidades', factorConversion: 50, costoUnitario: 12000 },
  { id: 'INS-013', nombre: 'Cuchillos de Acero', categoria: 'Utilidades', imagen: 'https://images.unsplash.com/photo-1670729001232-e6d78fc52059?auto=format&fit=crop&w=400&q=80', stockActual: 25, stockMinimo: 20, unidad: 'Docenas', unidadAlternativa: 'Unidades', factorConversion: 12, costoUnitario: 180000 },
  { id: 'INS-014', nombre: 'Delantales Plásticos', categoria: 'Utilidades', imagen: 'https://images.unsplash.com/photo-1678626667639-de9c676e8222?auto=format&fit=crop&w=400&q=80', stockActual: 40, stockMinimo: 20, unidad: 'Paquetes', unidadAlternativa: 'Unidades', factorConversion: 10, costoUnitario: 45000 },
];

const mockIngresos_insumos = [
  { id: 'ING-001', insumo_id: 'INS-001', cantidad_ingresada: 10, costo_unitario: 185000, numero_factura: 'FAC-2026-001', fecha: '2026-03-20', estado: 'Registrado' },
  { id: 'ING-002', insumo_id: 'INS-002', cantidad_ingresada: 5, costo_unitario: 45000, numero_factura: 'FAC-2026-002', fecha: '2026-03-21', estado: 'Verificado' },
  { id: 'ING-003', insumo_id: 'INS-006', cantidad_ingresada: 15, costo_unitario: 150000, numero_factura: 'FAC-2026-003', fecha: '2026-03-22', estado: 'Pagado' },
  { id: 'ING-004', insumo_id: 'INS-010', cantidad_ingresada: 20, costo_unitario: 35000, numero_factura: 'FAC-2026-004', fecha: '2026-03-23', estado: 'Registrado' },
  { id: 'ING-005', insumo_id: 'INS-003', cantidad_ingresada: 8, costo_unitario: 125000, numero_factura: 'FAC-2026-005', fecha: '2026-03-24', estado: 'Verificado' },
];

const mockEmpleados = [
  // Producción
  { id: 'EMP-001', nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@agricol.com', telefono: '3001234567', area: 'Producción', salario: 1800000, fechaIngreso: '2024-01-15' },
  { id: 'EMP-002', nombre: 'María Fernanda López', email: 'maria.lopez@agricol.com', telefono: '3009876543', area: 'Producción', salario: 1950000, fechaIngreso: '2024-02-20' },
  { id: 'EMP-003', nombre: 'Jorge Martínez', email: 'jorge.martinez@agricol.com', telefono: '3005551234', area: 'Producción', salario: 1800000, fechaIngreso: '2023-11-10' },
  { id: 'EMP-004', nombre: 'Ana Lucía Gómez', email: 'ana.gomez@agricol.com', telefono: '3007778888', area: 'Producción', salario: 2200000, fechaIngreso: '2023-08-05' },
  
  // Administración
  { id: 'EMP-005', nombre: 'Pedro Sánchez', email: 'pedro.sanchez@agricol.com', telefono: '3002223333', area: 'Administración', salario: 2500000, fechaIngreso: '2023-05-12' },
  { id: 'EMP-006', nombre: 'Diana Ramírez', email: 'diana.ramirez@agricol.com', telefono: '3004445555', area: 'Administración', salario: 2300000, fechaIngreso: '2024-01-08' },
  { id: 'EMP-007', nombre: 'Luis Fernando Torres', email: 'luis.torres@agricol.com', telefono: '3006667777', area: 'Administración', salario: 2100000, fechaIngreso: '2023-09-22' },
  { id: 'EMP-008', nombre: 'Carmen Ruiz', email: 'carmen.ruiz@agricol.com', telefono: '3008889999', area: 'Administración', salario: 2800000, fechaIngreso: '2023-03-15' },
  
  // Empaque
  { id: 'EMP-009', nombre: 'Andrés Felipe Castro', email: 'andres.castro@agricol.com', telefono: '3001112222', area: 'Empaque', salario: 1700000, fechaIngreso: '2024-03-01' },
  { id: 'EMP-010', nombre: 'Valentina Morales', email: 'valentina.morales@agricol.com', telefono: '3003334444', area: 'Empaque', salario: 1850000, fechaIngreso: '2023-12-10' },
  { id: 'EMP-011', nombre: 'Santiago Vargas', email: 'santiago.vargas@agricol.com', telefono: '3005556666', area: 'Empaque', salario: 1750000, fechaIngreso: '2024-02-14' },
  { id: 'EMP-012', nombre: 'Isabella Herrera', email: 'isabella.herrera@agricol.com', telefono: '3007778899', area: 'Empaque', salario: 1900000, fechaIngreso: '2023-10-20' },
  
  // Logística
  { id: 'EMP-013', nombre: 'Miguel Ángel Rojas', email: 'miguel.rojas@agricol.com', telefono: '3009990000', area: 'Logística', salario: 2000000, fechaIngreso: '2023-07-18' },
  { id: 'EMP-014', nombre: 'Camila Ortiz', email: 'camila.ortiz@agricol.com', telefono: '3001231234', area: 'Logística', salario: 1950000, fechaIngreso: '2024-01-25' },
  { id: 'EMP-015', nombre: 'Daniel Mendoza', email: 'daniel.mendoza@agricol.com', telefono: '3004564567', area: 'Logística', salario: 2100000, fechaIngreso: '2023-06-30' },
  
  // Ventas
  { id: 'EMP-016', nombre: 'Sofía Restrepo', email: 'sofia.restrepo@agricol.com', telefono: '3007897890', area: 'Ventas', salario: 2400000, fechaIngreso: '2023-04-12' },
  { id: 'EMP-017', nombre: 'Julián Pérez', email: 'julian.perez@agricol.com', telefono: '3002342345', area: 'Ventas', salario: 2300000, fechaIngreso: '2024-02-05' },
  { id: 'EMP-018', nombre: 'Laura Gutiérrez', email: 'laura.gutierrez@agricol.com', telefono: '3005675678', area: 'Ventas', salario: 2500000, fechaIngreso: '2023-11-28' },
  { id: 'EMP-019', nombre: 'Sebastián Molina', email: 'sebastian.molina@agricol.com', telefono: '3008908901', area: 'Ventas', salario: 2200000, fechaIngreso: '2024-03-10' },
];

const mockNomina = [
  // Marzo - Primera Quincena
  { id: 'NOM-001', empleado_id: 'EMP-001', empleado: 'Carlos Rodríguez', mes: 'Marzo', mesNumero: 3, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 6500, cantidad_horas_extras: 6, valor_hora_extra: 9750, recargos_nocturnos: 25000, recargos_dominicales: 37500, deducciones: 50000, fecha: '2026-03-15', estado: 'Pagado' },
  { id: 'NOM-002', empleado_id: 'EMP-002', empleado: 'María Fernanda López', mes: 'Marzo', mesNumero: 3, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 7200, cantidad_horas_extras: 2, valor_hora_extra: 10800, recargos_nocturnos: 15000, recargos_dominicales: 0, deducciones: 40000, fecha: '2026-03-15', estado: 'Pagado' },
  { id: 'NOM-003', empleado_id: 'EMP-003', empleado: 'Jorge Martínez', mes: 'Marzo', mesNumero: 3, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 6500, cantidad_horas_extras: 10, valor_hora_extra: 9750, recargos_nocturnos: 30000, recargos_dominicales: 25000, deducciones: 60000, fecha: '2026-03-15', estado: 'Pagado' },
  { id: 'NOM-004', empleado_id: 'EMP-004', empleado: 'Ana Lucía Gómez', mes: 'Marzo', mesNumero: 3, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 8500, cantidad_horas_extras: 0, valor_hora_extra: 12750, recargos_nocturnos: 0, recargos_dominicales: 0, deducciones: 75000, fecha: '2026-03-15', estado: 'Pagado' },
  { id: 'NOM-005', empleado_id: 'EMP-005', empleado: 'Pedro Sánchez', mes: 'Marzo', mesNumero: 3, quincena: 1, horas_regulares_trabajadas: 72, valor_hora_regular: 6500, cantidad_horas_extras: 4, valor_hora_extra: 9750, recargos_nocturnos: 10000, recargos_dominicales: 12500, deducciones: 45000, fecha: '2026-03-15', estado: 'Pendiente' },
  
  // Marzo - Segunda Quincena
  { id: 'NOM-006', empleado_id: 'EMP-001', empleado: 'Carlos Rodríguez', mes: 'Marzo', mesNumero: 3, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 6500, cantidad_horas_extras: 6, valor_hora_extra: 9750, recargos_nocturnos: 25000, recargos_dominicales: 37500, deducciones: 50000, fecha: '2026-03-31', estado: 'Pendiente' },
  { id: 'NOM-007', empleado_id: 'EMP-006', empleado: 'Diana Ramírez', mes: 'Marzo', mesNumero: 3, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 7200, cantidad_horas_extras: 7, valor_hora_extra: 10800, recargos_nocturnos: 22500, recargos_dominicales: 30000, deducciones: 55000, fecha: '2026-03-31', estado: 'Pendiente' },
  { id: 'NOM-008', empleado_id: 'EMP-007', empleado: 'Luis Fernando Torres', mes: 'Marzo', mesNumero: 3, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 6500, cantidad_horas_extras: 0, valor_hora_extra: 9750, recargos_nocturnos: 0, recargos_dominicales: 0, deducciones: 42500, fecha: '2026-03-31', estado: 'Pendiente' },
  
  // Febrero - Primera Quincena
  { id: 'NOM-009', empleado_id: 'EMP-008', empleado: 'Carmen Ruiz', mes: 'Febrero', mesNumero: 2, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 9000, cantidad_horas_extras: 5, valor_hora_extra: 13500, recargos_nocturnos: 40000, recargos_dominicales: 45000, deducciones: 90000, fecha: '2026-02-15', estado: 'Pagado' },
  { id: 'NOM-010', empleado_id: 'EMP-009', empleado: 'Andrés Felipe Castro', mes: 'Febrero', mesNumero: 2, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 6800, cantidad_horas_extras: 2, valor_hora_extra: 10200, recargos_nocturnos: 7500, recargos_dominicales: 0, deducciones: 47500, fecha: '2026-02-15', estado: 'Pagado' },
  
  // Febrero - Segunda Quincena
  { id: 'NOM-011', empleado_id: 'EMP-010', empleado: 'Valentina Morales', mes: 'Febrero', mesNumero: 2, quincena: 2, horas_regulares_trabajadas: 78, valor_hora_regular: 7500, cantidad_horas_extras: 0, valor_hora_extra: 11250, recargos_nocturnos: 0, recargos_dominicales: 0, deducciones: 52500, fecha: '2026-02-28', estado: 'Pagado' },
  { id: 'NOM-012', empleado_id: 'EMP-011', empleado: 'Santiago Vargas', mes: 'Febrero', mesNumero: 2, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 6900, cantidad_horas_extras: 3, valor_hora_extra: 10350, recargos_nocturnos: 12000, recargos_dominicales: 15000, deducciones: 48000, fecha: '2026-02-28', estado: 'Pagado' },
  
  // Enero - Primera Quincena
  { id: 'NOM-013', empleado_id: 'EMP-012', empleado: 'Isabella Herrera', mes: 'Enero', mesNumero: 1, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 7100, cantidad_horas_extras: 4, valor_hora_extra: 10650, recargos_nocturnos: 18000, recargos_dominicales: 20000, deducciones: 51000, fecha: '2026-01-15', estado: 'Pagado' },
  { id: 'NOM-014', empleado_id: 'EMP-013', empleado: 'Miguel Ángel Rojas', mes: 'Enero', mesNumero: 1, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 7800, cantidad_horas_extras: 6, valor_hora_extra: 11700, recargos_nocturnos: 28000, recargos_dominicales: 32000, deducciones: 58000, fecha: '2026-01-15', estado: 'Pagado' },
  
  // Enero - Segunda Quincena
  { id: 'NOM-015', empleado_id: 'EMP-014', empleado: 'Camila Ortiz', mes: 'Enero', mesNumero: 1, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 7500, cantidad_horas_extras: 2, valor_hora_extra: 11250, recargos_nocturnos: 10000, recargos_dominicales: 0, deducciones: 53000, fecha: '2026-01-31', estado: 'Pagado' },
  { id: 'NOM-016', empleado_id: 'EMP-015', empleado: 'Daniel Mendoza', mes: 'Enero', mesNumero: 1, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 8000, cantidad_horas_extras: 8, valor_hora_extra: 12000, recargos_nocturnos: 35000, recargos_dominicales: 40000, deducciones: 62000, fecha: '2026-01-31', estado: 'Pagado' },
  
  // Diciembre - Primera Quincena
  { id: 'NOM-017', empleado_id: 'EMP-016', empleado: 'Sofía Restrepo', mes: 'Diciembre', mesNumero: 12, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 8500, cantidad_horas_extras: 5, valor_hora_extra: 12750, recargos_nocturnos: 30000, recargos_dominicales: 35000, deducciones: 70000, fecha: '2025-12-15', estado: 'Pagado' },
  { id: 'NOM-018', empleado_id: 'EMP-017', empleado: 'Julián Pérez', mes: 'Diciembre', mesNumero: 12, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 8200, cantidad_horas_extras: 3, valor_hora_extra: 12300, recargos_nocturnos: 20000, recargos_dominicales: 25000, deducciones: 65000, fecha: '2025-12-15', estado: 'Pagado' },
  
  // Diciembre - Segunda Quincena
  { id: 'NOM-019', empleado_id: 'EMP-018', empleado: 'Laura Gutiérrez', mes: 'Diciembre', mesNumero: 12, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 8700, cantidad_horas_extras: 7, valor_hora_extra: 13050, recargos_nocturnos: 38000, recargos_dominicales: 42000, deducciones: 75000, fecha: '2025-12-31', estado: 'Pagado' },
  { id: 'NOM-020', empleado_id: 'EMP-019', empleado: 'Sebastián Molina', mes: 'Diciembre', mesNumero: 12, quincena: 2, horas_regulares_trabajadas: 80, valor_hora_regular: 8000, cantidad_horas_extras: 4, valor_hora_extra: 12000, recargos_nocturnos: 22000, recargos_dominicales: 28000, deducciones: 60000, fecha: '2025-12-31', estado: 'Pagado' },
  
  // Noviembre - Primera Quincena
  { id: 'NOM-021', empleado_id: 'EMP-001', empleado: 'Carlos Rodríguez', mes: 'Noviembre', mesNumero: 11, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 6500, cantidad_horas_extras: 5, valor_hora_extra: 9750, recargos_nocturnos: 20000, recargos_dominicales: 30000, deducciones: 48000, fecha: '2025-11-15', estado: 'Pagado' },
  { id: 'NOM-022', empleado_id: 'EMP-002', empleado: 'María Fernanda López', mes: 'Noviembre', mesNumero: 11, quincena: 1, horas_regulares_trabajadas: 80, valor_hora_regular: 7200, cantidad_horas_extras: 3, valor_hora_extra: 10800, recargos_nocturnos: 16000, recargos_dominicales: 0, deducciones: 42000, fecha: '2025-11-15', estado: 'Pagado' },
];

const mockMantenimiento = [
  { id: 'M-001', maquina_id: 'MAQ-PELADORA-01', tipo: 'Preventivo', descripcion: 'Cambio de cuchillas peladora', cantidad: 2, unidad: 'Unidades', costo: 450000, fecha: '2026-03-20' },
  { id: 'M-002', maquina_id: 'MAQ-FREIDORA-01', tipo: 'Correctivo', descripcion: 'Limpieza de filtros freidora', cantidad: 1, unidad: 'Servicio', costo: 150000, fecha: '2026-03-24' },
  { id: 'M-003', maquina_id: 'MAQ-BANDA-01', tipo: 'Preventivo', descripcion: 'Lubricación banda transportadora', cantidad: 3, unidad: 'Litros', costo: 85000, fecha: '2026-03-25' },
  { id: 'M-004', maquina_id: 'MAQ-COMPRESOR-01', tipo: 'Correctivo', descripcion: 'Reparación compresor aire', cantidad: 1, unidad: 'Servicio', costo: 280000, fecha: '2026-03-22' },
  { id: 'M-005', maquina_id: 'MAQ-MOTOR-01', tipo: 'Preventivo', descripcion: 'Cambio de aceite motor principal', cantidad: 5, unidad: 'Litros', costo: 125000, fecha: '2026-03-18' },
];

const mockSaneamiento = [
  { id: 'S-001', area: 'Bodega Principal', fecha: '2026-03-22', tipo_plaga: 'Roedores', costo_contratista: 280000, observaciones: 'Fumigación mensual bodega', cantidad: 1, unidad: 'Servicio' },
  { id: 'S-002', area: 'Área de Procesamiento', fecha: '2026-03-15', tipo_plaga: 'Insectos voladores', costo_contratista: 120000, observaciones: 'Trampas para roedores instaladas', cantidad: 10, unidad: 'Unidades' },
  { id: 'S-003', area: 'Zona de Empaque', fecha: '2026-03-20', tipo_plaga: 'Plagas varias', costo_contratista: 95000, observaciones: 'Desinfección general', cantidad: 1, unidad: 'Servicio' },
  { id: 'S-004', area: 'Oficinas', fecha: '2026-03-10', tipo_plaga: 'Hormigas', costo_contratista: 65000, observaciones: 'Control preventivo', cantidad: 1, unidad: 'Servicio' },
  { id: 'S-005', area: 'Bodega Principal', fecha: '2026-03-25', tipo_plaga: 'Roedores', costo_contratista: 280000, observaciones: 'Revisión y reposición de trampas', cantidad: 1, unidad: 'Servicio' },
];

const mockHistoricalCosts = [
  { mes: 'Oct 2025', costo: 2500000 },
  { mes: 'Nov 2025', costo: 2650000 },
  { mes: 'Dic 2025', costo: 2800000 },
  { mes: 'Ene 2026', costo: 2950000 },
  { mes: 'Feb 2026', costo: 3100000 },
  { mes: 'Mar 2026', costo: 3250000 },
];

const mockServiceCostsHistory = [
  { dia: '16 Mar', costo: 45000 },
  { dia: '17 Mar', costo: 46500 },
  { dia: '18 Mar', costo: 48000 },
  { dia: '19 Mar', costo: 47500 },
  { dia: '20 Mar', costo: 49000 },
  { dia: '21 Mar', costo: 51000 },
  { dia: '22 Mar', costo: 52500 },
  { dia: '23 Mar', costo: 54000 },
  { dia: '24 Mar', costo: 55500 },
  { dia: '25 Mar', costo: 57000 },
];

export { 
  AREAS,
  MESES,
  QUINCENAS,
  mockLotes, 
  mockCalidad, 
  mockInsumos, 
  mockIngresos_insumos,
  mockMedidores,
  mockEmpleados,
  mockNomina,
  mockMantenimiento,
  mockSaneamiento,
  mockHistoricalCosts,
  mockServiceCostsHistory
};