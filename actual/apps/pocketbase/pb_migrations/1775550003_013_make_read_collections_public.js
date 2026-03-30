/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const setPublicRead = (name) => {
    const c = app.findCollectionByNameOrId(name);
    c.listRule = "";
    c.viewRule = "";
    app.save(c);
  };

  [
    "fases_produccion",
    "ordenes_produccion_ext",
    "lotes_produccion_ext",
    "hechos_fase_diarios",
    "costos_fase_diarios",
    "insumos",
    "ingresos_insumos",
    "medidores",
    "mantenimiento",
    "saneamiento",
    "calidad",
    "nomina",
    "empleados"
  ].forEach(setPublicRead);
}, (app) => {
  // keep rules as-is on rollback to avoid accidental lockouts
})
