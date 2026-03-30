/// <reference path="../pb_data/types.d.ts" />
const computeCostoTotalFase = (record) => {
  const manoObra = record.getFloat("mano_obra") || 0;
  const insumos = record.getFloat("insumos") || 0;
  const servicios = record.getFloat("servicios") || 0;
  const mantenimiento = record.getFloat("mantenimiento") || 0;
  const saneamiento = record.getFloat("saneamiento") || 0;
  const indirectos = record.getFloat("indirectos") || 0;

  return manoObra + insumos + servicios + mantenimiento + saneamiento + indirectos;
};

onRecordCreate((e) => {
  e.record.set("costo_total_fase", computeCostoTotalFase(e.record));
  e.next();
}, "costos_fase_diarios");

onRecordUpdate((e) => {
  e.record.set("costo_total_fase", computeCostoTotalFase(e.record));
  e.next();
}, "costos_fase_diarios");
