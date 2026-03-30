/// <reference path="../pb_data/types.d.ts" />
// Auto-calculate costo_total_ingreso = cantidad_ingresada * costo_unitario
onRecordCreate((e) => {
  const cantidadIngresada = e.record.getFloat("cantidad_ingresada") || 0;
  const costoUnitario = e.record.getFloat("costo_unitario") || 0;
  const costoTotal = cantidadIngresada * costoUnitario;
  e.record.set("costo_total_ingreso", costoTotal);
  e.next();
}, "ingresos_insumos");

onRecordUpdate((e) => {
  const cantidadIngresada = e.record.getFloat("cantidad_ingresada") || 0;
  const costoUnitario = e.record.getFloat("costo_unitario") || 0;
  const costoTotal = cantidadIngresada * costoUnitario;
  e.record.set("costo_total_ingreso", costoTotal);
  e.next();
}, "ingresos_insumos");