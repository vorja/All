/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const ingreso = e.record.getFloat("ingreso_total_lote") || 0;
  const costo = e.record.getFloat("costo_total_lote") || 0;
  e.record.set("margen_lote", ingreso - costo);
  e.next();
}, "lotes_produccion_ext");

onRecordUpdate((e) => {
  const ingreso = e.record.getFloat("ingreso_total_lote") || 0;
  const costo = e.record.getFloat("costo_total_lote") || 0;
  e.record.set("margen_lote", ingreso - costo);
  e.next();
}, "lotes_produccion_ext");
