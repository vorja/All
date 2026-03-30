/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const createOrSave = (collection) => {
    try {
      return app.save(collection);
    } catch (e) {
      if (e.message.includes("Collection name must be unique")) {
        return;
      }
      throw e;
    }
  };

  const fases = new Collection({
    "name": "fases_produccion",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "codigo", "name": "codigo", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": true },
      { "id": "nombre", "name": "nombre", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": true },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ],
    "indexes": ["CREATE UNIQUE INDEX IF NOT EXISTS idx_fases_codigo ON fases_produccion (codigo)"]
  });
  createOrSave(fases);

  const ordenes = new Collection({
    "name": "ordenes_produccion_ext",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "orden", "name": "orden", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": true },
      { "id": "fechaInicio", "name": "fecha_inicio", "type": "date", "required": false, "min": "", "max": "", "hidden": false, "presentable": false },
      { "id": "fechaFin", "name": "fecha_fin", "type": "date", "required": false, "min": "", "max": "", "hidden": false, "presentable": false },
      { "id": "proveedorPrincipal", "name": "proveedor_principal", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "estado", "name": "estado", "type": "select", "required": true, "maxSelect": 1, "values": ["pendiente", "en_proceso", "cerrada"], "hidden": false, "presentable": false },
      { "id": "periodoCerrado", "name": "periodo_cerrado", "type": "bool", "required": false, "hidden": false, "presentable": false },
      { "id": "sourceId", "name": "source_id", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "sourceVersion", "name": "source_version", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ],
    "indexes": ["CREATE UNIQUE INDEX IF NOT EXISTS idx_ordenes_orden ON ordenes_produccion_ext (orden)"]
  });
  createOrSave(ordenes);

  const ordenesCol = app.findCollectionByNameOrId("ordenes_produccion_ext");
  const fasesCol = app.findCollectionByNameOrId("fases_produccion");

  const lotes = new Collection({
    "name": "lotes_produccion_ext",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "loteProduccion", "name": "lote_produccion", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": true },
      { "id": "loteProveedor", "name": "lote_proveedor", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "ordenRef", "name": "orden_ref", "type": "relation", "required": false, "collectionId": ordenesCol.id, "cascadeDelete": false, "minSelect": 0, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "fechaProduccion", "name": "fecha_produccion", "type": "date", "required": false, "min": "", "max": "", "hidden": false, "presentable": false },
      { "id": "tipoProducto", "name": "tipo_producto", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "kgEntrada", "name": "kg_entrada", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "kgSalida", "name": "kg_salida", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "cajasSalida", "name": "cajas_salida", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "costoMateria", "name": "costo_materia_prima_total", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "costoTotal", "name": "costo_total_lote", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "ingresoTotal", "name": "ingreso_total_lote", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "margenLote", "name": "margen_lote", "type": "number", "required": false, "min": null, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "sourceId", "name": "source_id", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ],
    "indexes": ["CREATE UNIQUE INDEX IF NOT EXISTS idx_lotes_prod_unique ON lotes_produccion_ext (lote_produccion)"]
  });
  createOrSave(lotes);

  const lotesCol = app.findCollectionByNameOrId("lotes_produccion_ext");

  const hechos = new Collection({
    "name": "hechos_fase_diarios",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "fecha", "name": "fecha", "type": "date", "required": true, "min": "", "max": "", "hidden": false, "presentable": true },
      { "id": "faseRef", "name": "fase_ref", "type": "relation", "required": true, "collectionId": fasesCol.id, "cascadeDelete": false, "minSelect": 1, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "ordenRef", "name": "orden_ref", "type": "relation", "required": false, "collectionId": ordenesCol.id, "cascadeDelete": false, "minSelect": 0, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "loteRef", "name": "lote_ref", "type": "relation", "required": false, "collectionId": lotesCol.id, "cascadeDelete": false, "minSelect": 0, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "horasHombre", "name": "horas_hombre", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "kgProc", "name": "kg_procesados", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "kgRechazo", "name": "kg_rechazo", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "canastillas", "name": "canastillas", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "cajas", "name": "cajas", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "gas", "name": "gas_m3", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "energia", "name": "energia_kwh", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "agua", "name": "agua_m3", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "sourceId", "name": "source_id", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "sourceVersion", "name": "source_version", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ]
  });
  createOrSave(hechos);

  const hechosCol = app.findCollectionByNameOrId("hechos_fase_diarios");

  const costos = new Collection({
    "name": "costos_fase_diarios",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "fecha", "name": "fecha", "type": "date", "required": true, "min": "", "max": "", "hidden": false, "presentable": true },
      { "id": "faseRef", "name": "fase_ref", "type": "relation", "required": true, "collectionId": fasesCol.id, "cascadeDelete": false, "minSelect": 1, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "ordenRef", "name": "orden_ref", "type": "relation", "required": false, "collectionId": ordenesCol.id, "cascadeDelete": false, "minSelect": 0, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "loteRef", "name": "lote_ref", "type": "relation", "required": false, "collectionId": lotesCol.id, "cascadeDelete": false, "minSelect": 0, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "hechoRef", "name": "hecho_ref", "type": "relation", "required": false, "collectionId": hechosCol.id, "cascadeDelete": false, "minSelect": 0, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "manoObra", "name": "mano_obra", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "insumos", "name": "insumos", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "servicios", "name": "servicios", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "mantenimiento", "name": "mantenimiento", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "saneamiento", "name": "saneamiento", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "indirectos", "name": "indirectos", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "totalFase", "name": "costo_total_fase", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ]
  });
  createOrSave(costos);

  const empleadosCol = app.findCollectionByNameOrId("empleados");
  const nominaFase = new Collection({
    "name": "asignacion_nomina_fase",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "empleadoRef", "name": "empleado_ref", "type": "relation", "required": true, "collectionId": empleadosCol.id, "cascadeDelete": false, "minSelect": 1, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "faseRef", "name": "fase_ref", "type": "relation", "required": true, "collectionId": fasesCol.id, "cascadeDelete": false, "minSelect": 1, "maxSelect": 1, "displayFields": [], "hidden": false, "presentable": false },
      { "id": "fecha", "name": "fecha", "type": "date", "required": true, "min": "", "max": "", "hidden": false, "presentable": true },
      { "id": "horasReg", "name": "horas_regulares", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "horasExt", "name": "horas_extra", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "recargos", "name": "recargos", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "costoAsignado", "name": "costo_asignado", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": false, "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ]
  });
  createOrSave(nominaFase);

  const rawEventos = new Collection({
    "name": "raw_eventos_produccion",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.role = 'admin'",
    "viewRule": "@request.auth.role = 'admin'",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "sourceSystem", "name": "source_system", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "sourceId", "name": "source_id", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "payload", "name": "payload", "type": "json", "required": true, "maxSize": 0, "hidden": false, "presentable": false },
      { "id": "estado", "name": "estado", "type": "select", "required": true, "maxSelect": 1, "values": ["pendiente_mapeo", "procesado", "error"], "hidden": false, "presentable": false },
      { "id": "errorMsg", "name": "error_msg", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ]
  });
  createOrSave(rawEventos);

  const integrationState = new Collection({
    "name": "integration_state",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.role = 'admin'",
    "viewRule": "@request.auth.role = 'admin'",
    "createRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "integrationKey", "name": "integration_key", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": true },
      { "id": "cursorDate", "name": "cursor_date", "type": "date", "required": false, "min": "", "max": "", "hidden": false, "presentable": false },
      { "id": "cursorValue", "name": "cursor_value", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "lastStatus", "name": "last_status", "type": "select", "required": false, "maxSelect": 1, "values": ["ok", "error"], "hidden": false, "presentable": false },
      { "id": "lastError", "name": "last_error", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ],
    "indexes": ["CREATE UNIQUE INDEX IF NOT EXISTS idx_integration_state_key ON integration_state (integration_key)"]
  });
  createOrSave(integrationState);

  const integrationRuns = new Collection({
    "name": "integration_runs",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.role = 'admin'",
    "viewRule": "@request.auth.role = 'admin'",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "integrationKey", "name": "integration_key", "type": "text", "required": true, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "startedAt", "name": "started_at", "type": "date", "required": true, "min": "", "max": "", "hidden": false, "presentable": false },
      { "id": "finishedAt", "name": "finished_at", "type": "date", "required": false, "min": "", "max": "", "hidden": false, "presentable": false },
      { "id": "regOk", "name": "registros_ok", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": true, "hidden": false, "presentable": false },
      { "id": "regErr", "name": "registros_error", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": true, "hidden": false, "presentable": false },
      { "id": "latency", "name": "latencia_ms", "type": "number", "required": false, "min": 0, "max": null, "onlyInt": true, "hidden": false, "presentable": false },
      { "id": "status", "name": "status", "type": "select", "required": true, "maxSelect": 1, "values": ["running", "ok", "error"], "hidden": false, "presentable": false },
      { "id": "errorMsg", "name": "error_msg", "type": "text", "required": false, "min": 0, "max": 0, "pattern": "", "hidden": false, "presentable": false },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ]
  });
  createOrSave(integrationRuns);

  const periodos = new Collection({
    "name": "periodos_contables",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      { "id": "textId", "name": "id", "type": "text", "system": true, "required": true, "primaryKey": true, "autogeneratePattern": "[a-z0-9]{15}", "min": 15, "max": 15, "pattern": "^[a-z0-9]+$", "hidden": false, "presentable": false },
      { "id": "anio", "name": "anio", "type": "number", "required": true, "min": 2000, "max": 3000, "onlyInt": true, "hidden": false, "presentable": true },
      { "id": "mes", "name": "mes", "type": "number", "required": true, "min": 1, "max": 12, "onlyInt": true, "hidden": false, "presentable": true },
      { "id": "quincena", "name": "quincena", "type": "number", "required": true, "min": 1, "max": 2, "onlyInt": true, "hidden": false, "presentable": true },
      { "id": "estado", "name": "estado", "type": "select", "required": true, "maxSelect": 1, "values": ["borrador", "validado", "cerrado"], "hidden": false, "presentable": true },
      { "id": "created", "name": "created", "type": "autodate", "system": false, "onCreate": true, "onUpdate": false, "hidden": false, "presentable": false },
      { "id": "updated", "name": "updated", "type": "autodate", "system": false, "onCreate": true, "onUpdate": true, "hidden": false, "presentable": false }
    ],
    "indexes": ["CREATE UNIQUE INDEX IF NOT EXISTS idx_periodos_unique ON periodos_contables (anio, mes, quincena)"]
  });
  createOrSave(periodos);
}, (app) => {
  const names = [
    "periodos_contables",
    "integration_runs",
    "integration_state",
    "raw_eventos_produccion",
    "asignacion_nomina_fase",
    "costos_fase_diarios",
    "hechos_fase_diarios",
    "lotes_produccion_ext",
    "ordenes_produccion_ext",
    "fases_produccion"
  ];
  names.forEach((name) => {
    try {
      const c = app.findCollectionByNameOrId(name);
      app.delete(c);
    } catch (_) {
      // noop
    }
  });
})
