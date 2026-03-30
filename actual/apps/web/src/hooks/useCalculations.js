import { useMemo } from 'react';

export const useMeasurementDelta = (readings) => {
  return useMemo(() => {
    if (!readings || readings.length === 0) return [];
    return readings.map((reading, index) => {
      if (index === 0) return { ...reading, delta: 0 };
      const prevReading = readings[index - 1];
      const delta = Math.max(0, reading.value - prevReading.value);
      return { ...reading, delta };
    });
  }, [readings]);
};

export const useCostCalculation = (data) => {
  return useMemo(() => {
    if (!data) return 0;
    const { materiaPrima, cajasTotales, manoObra, servicios, variables, cajasContenedor } = data;
    if (!cajasContenedor || cajasContenedor === 0) return 0;
    
    const costoTotal = materiaPrima + (cajasTotales * manoObra + servicios + variables);
    return costoTotal / cajasContenedor;
  }, [data]);
};

export const usePayrollCalculation = (nominaArray) => {
  return useMemo(() => {
    if (!nominaArray || !Array.isArray(nominaArray)) {
      return { calculatedData: [], totalCostGeneral: 0, employeeNames: [] };
    }

    let totalCostGeneral = 0;
    const employeeNames = [];
    
    const calculatedData = nominaArray.map(record => {
      const horasRegulares = Number(record.horas_regulares_trabajadas) || 0;
      const valorHoraReg = Number(record.valor_hora_regular) || 0;
      const horasExtra = Number(record.cantidad_horas_extras) || 0;
      const valorHoraExt = Number(record.valor_hora_extra) || 0;
      const recargosNoct = Number(record.recargos_nocturnos) || 0;
      const recargosDom = Number(record.recargos_dominicales) || 0;
      const deducciones = Number(record.deducciones) || 0;

      const costo_total = (horasRegulares * valorHoraReg) + 
                          (horasExtra * valorHoraExt) + 
                          recargosNoct + 
                          recargosDom - 
                          deducciones;
                          
      totalCostGeneral += costo_total;
      employeeNames.push(record.empleado);
      
      return {
        ...record,
        costo_total
      };
    });

    return { calculatedData, totalCostGeneral, employeeNames };
  }, [nominaArray]);
};