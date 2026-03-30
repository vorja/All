/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const manoObra = e.record.getFloat("mano_obra") || 0;
  const insumos = e.record.getFloat("insumos") || 0;
  const servicios = e.record.getFloat("servicios") || 0;
  const mantenimiento = e.record.getFloat("mantenimiento") || 0;
  const saneamiento = e.record.getFloat("saneamiento") || 0;
  const indirectos = e.record.getFloat("indirectos") || 0;
  e.record.set("costo_total_fase", manoObra + insumos + servicios + mantenimiento + saneamiento + indirectos);
  e.next();
}, "costos_fase_diarios");

onRecordUpdate((e) => {
  const manoObra = e.record.getFloat("mano_obra") || 0;
  const insumos = e.record.getFloat("insumos") || 0;
  const servicios = e.record.getFloat("servicios") || 0;
  const mantenimiento = e.record.getFloat("mantenimiento") || 0;
  const saneamiento = e.record.getFloat("saneamiento") || 0;
  const indirectos = e.record.getFloat("indirectos") || 0;
  e.record.set("costo_total_fase", manoObra + insumos + servicios + mantenimiento + saneamiento + indirectos);
  e.next();
}, "costos_fase_diarios");
