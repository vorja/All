/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("fases_produccion");
  const fases = [
    { codigo: "recepcion", nombre: "Recepcion" },
    { codigo: "alistamiento", nombre: "Alistamiento" },
    { codigo: "corte", nombre: "Corte" },
    { codigo: "fritura", nombre: "Fritura" },
    { codigo: "empaque", nombre: "Empaque" },
    { codigo: "inventario", nombre: "Inventario" }
  ];

  fases.forEach((fase) => {
    try {
      const record = new Record(collection);
      record.set("codigo", fase.codigo);
      record.set("nombre", fase.nombre);
      app.save(record);
    } catch (e) {
      if (!e.message.includes("Value must be unique")) {
        throw e;
      }
    }
  });
}, (app) => {
  const collection = app.findCollectionByNameOrId("fases_produccion");
  const all = app.findRecordsByFilter("fases_produccion", "codigo != ''");
  all.forEach((record) => {
    app.delete(record);
  });
})
