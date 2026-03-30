/// <reference path="../pb_data/types.d.ts" />
// Auto-calculate costo_total = (horas_regulares_trabajadas * valor_hora_regular) + (cantidad_horas_extras * valor_hora_extra) + recargos_nocturnos + recargos_dominicales - deducciones
onRecordCreate((e) => {
  const horasRegulares = e.record.getFloat("horas_regulares_trabajadas") || 0;
  const valorHoraRegular = e.record.getFloat("valor_hora_regular") || 0;
  const cantidadHorasExtras = e.record.getFloat("cantidad_horas_extras") || 0;
  const valorHoraExtra = e.record.getFloat("valor_hora_extra") || 0;
  const recargosNocturnos = e.record.getFloat("recargos_nocturnos") || 0;
  const recargosDominicales = e.record.getFloat("recargos_dominicales") || 0;
  const deducciones = e.record.getFloat("deducciones") || 0;
  
  const costoTotal = (horasRegulares * valorHoraRegular) + (cantidadHorasExtras * valorHoraExtra) + recargosNocturnos + recargosDominicales - deducciones;
  e.record.set("costo_total", costoTotal);
  e.next();
}, "nomina");

onRecordUpdate((e) => {
  const horasRegulares = e.record.getFloat("horas_regulares_trabajadas") || 0;
  const valorHoraRegular = e.record.getFloat("valor_hora_regular") || 0;
  const cantidadHorasExtras = e.record.getFloat("cantidad_horas_extras") || 0;
  const valorHoraExtra = e.record.getFloat("valor_hora_extra") || 0;
  const recargosNocturnos = e.record.getFloat("recargos_nocturnos") || 0;
  const recargosDominicales = e.record.getFloat("recargos_dominicales") || 0;
  const deducciones = e.record.getFloat("deducciones") || 0;
  
  const costoTotal = (horasRegulares * valorHoraRegular) + (cantidadHorasExtras * valorHoraExtra) + recargosNocturnos + recargosDominicales - deducciones;
  e.record.set("costo_total", costoTotal);
  e.next();
}, "nomina");