/// <reference path="../pb_data/types.d.ts" />
const calcularMargen = (record) => {
  const ingreso = record.getFloat("ingreso_total_lote") || 0;
  const costo = record.getFloat("costo_total_lote") || 0;
  return ingreso - costo;
};

onRecordCreate((e) => {
  e.record.set("margen_lote", calcularMargen(e.record));
  e.next();
}, "lotes_produccion_ext");

onRecordUpdate((e) => {
  e.record.set("margen_lote", calcularMargen(e.record));
  e.next();
}, "lotes_produccion_ext");
