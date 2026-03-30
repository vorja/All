/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const countRecords = (collectionName) => {
    try {
      const rows = app.findRecordsByFilter(collectionName, "id != ''");
      return rows.length;
    } catch (_) {
      return 0;
    }
  };

  if (countRecords("insumos") === 0) {
    const c = app.findCollectionByNameOrId("insumos");
    const r = new Record(c);
    r.set("nombre", "Aceite de prueba");
    r.set("categoria", "Aceites y Químicos");
    r.set("stock_actual", 120);
    r.set("stock_minimo", 20);
    r.set("unidad", "L");
    r.set("costoUnitario", 9000);
    app.save(r);
  }

  if (countRecords("medidores") === 0) {
    const c = app.findCollectionByNameOrId("medidores");
    const r = new Record(c);
    r.set("fecha", new Date().toISOString());
    r.set("agua_lectura", 1000);
    r.set("agua_consumo", 45);
    r.set("gas_lectura", 500);
    r.set("gas_consumo", 20);
    r.set("energia_lectura", 3200);
    r.set("energia_consumo", 110);
    r.set("arriendo", 0);
    app.save(r);
  }

  const fases = app.findRecordsByFilter("fases_produccion", "id != ''");
  const faseFritura = fases.find((f) => f.get("codigo") === "fritura");

  if (countRecords("ordenes_produccion_ext") === 0) {
    const c = app.findCollectionByNameOrId("ordenes_produccion_ext");
    const r = new Record(c);
    r.set("orden", "ORD-DEMO-001");
    r.set("fecha_inicio", new Date().toISOString());
    r.set("estado", "en_proceso");
    r.set("periodo_cerrado", false);
    app.save(r);
  }

  const orden = app.findRecordsByFilter("ordenes_produccion_ext", "id != ''")[0];

  if (countRecords("lotes_produccion_ext") === 0 && orden) {
    const c = app.findCollectionByNameOrId("lotes_produccion_ext");
    const r = new Record(c);
    r.set("lote_produccion", "LOTE-DEMO-001");
    r.set("orden_ref", orden.id);
    r.set("fecha_produccion", new Date().toISOString());
    r.set("kg_salida", 850);
    r.set("cajas_salida", 170);
    r.set("costo_materia_prima_total", 5000000);
    r.set("costo_total_lote", 7200000);
    r.set("ingreso_total_lote", 9500000);
    app.save(r);
  }

  const lote = app.findRecordsByFilter("lotes_produccion_ext", "id != ''")[0];

  if (countRecords("hechos_fase_diarios") === 0 && orden && lote && faseFritura) {
    const c = app.findCollectionByNameOrId("hechos_fase_diarios");
    const r = new Record(c);
    r.set("fecha", new Date().toISOString());
    r.set("fase_ref", faseFritura.id);
    r.set("orden_ref", orden.id);
    r.set("lote_ref", lote.id);
    r.set("horas_hombre", 32);
    r.set("kg_procesados", 850);
    r.set("kg_rechazo", 35);
    r.set("canastillas", 42);
    r.set("cajas", 170);
    r.set("gas_m3", 18);
    r.set("energia_kwh", 115);
    r.set("agua_m3", 9);
    app.save(r);
  }

  if (countRecords("costos_fase_diarios") === 0 && orden && lote && faseFritura) {
    const c = app.findCollectionByNameOrId("costos_fase_diarios");
    const r = new Record(c);
    r.set("fecha", new Date().toISOString());
    r.set("fase_ref", faseFritura.id);
    r.set("orden_ref", orden.id);
    r.set("lote_ref", lote.id);
    r.set("mano_obra", 1700000);
    r.set("insumos", 2600000);
    r.set("servicios", 750000);
    r.set("mantenimiento", 240000);
    r.set("saneamiento", 120000);
    r.set("indirectos", 300000);
    app.save(r);
  }
}, (app) => {
  const wipe = [
    "costos_fase_diarios",
    "hechos_fase_diarios",
    "lotes_produccion_ext",
    "ordenes_produccion_ext",
    "medidores",
    "insumos"
  ];
  wipe.forEach((name) => {
    try {
      const rows = app.findRecordsByFilter(name, "id != ''");
      rows.forEach((r) => app.delete(r));
    } catch (_) {}
  });
})
