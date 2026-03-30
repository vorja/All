import pocketbaseClient from '../utils/pocketbaseClient.js';

const PHASE_MAP = {
  recepcion: "recepcion",
  alistamiento: "alistamiento",
  corte: "corte",
  fritura: "fritura",
  empaque: "empaque",
  inventario: "inventario"
};

const getOrCreateByFilter = async (collection, filter, payload) => {
  try {
    const found = await pocketbaseClient.collection(collection).getFirstListItem(filter);
    await pocketbaseClient.collection(collection).update(found.id, payload);
    return { id: found.id, created: false };
  } catch (_) {
    const created = await pocketbaseClient.collection(collection).create(payload);
    return { id: created.id, created: true };
  }
};

const getPhaseId = async (faseCodigo) => {
  const code = PHASE_MAP[faseCodigo] || "fritura";
  const phase = await pocketbaseClient
    .collection("fases_produccion")
    .getFirstListItem(`codigo='${code}'`);
  return phase.id;
};

const upsertIntegrationEvents = async (events) => {
  let ok = 0;
  let failed = 0;

  for (const event of events) {
    try {
      const orderResult = await getOrCreateByFilter(
        "ordenes_produccion_ext",
        `orden='${event.orden}'`,
        {
          orden: event.orden,
          fecha_inicio: event.fecha,
          estado: "en_proceso",
          source_id: event.sourceId,
          source_version: event.sourceVersion
        }
      );

      const loteKey = event.loteProduccion || `${event.orden}-${event.fecha}`;
      const loteResult = await getOrCreateByFilter(
        "lotes_produccion_ext",
        `lote_produccion='${loteKey}'`,
        {
          lote_produccion: loteKey,
          orden_ref: orderResult.id,
          fecha_produccion: event.fecha,
          kg_salida: event.kgProcesados,
          cajas_salida: event.cajas,
          source_id: event.sourceId
        }
      );

      const phaseId = await getPhaseId(event.faseCodigo);
      await getOrCreateByFilter(
        "hechos_fase_diarios",
        `source_id='${event.sourceId}'`,
        {
          fecha: event.fecha,
          fase_ref: phaseId,
          orden_ref: orderResult.id,
          lote_ref: loteResult.id,
          kg_procesados: event.kgProcesados,
          kg_rechazo: event.kgRechazo,
          canastillas: event.canastillas,
          cajas: event.cajas,
          gas_m3: event.gasM3,
          energia_kwh: event.energiaKwh,
          agua_m3: event.aguaM3,
          source_id: event.sourceId,
          source_version: event.sourceVersion
        }
      );

      await getOrCreateByFilter(
        "raw_eventos_produccion",
        `source_id='${event.sourceId}'`,
        {
          source_system: event.sourceSystem,
          source_id: event.sourceId,
          payload: event.raw,
          estado: event.loteProduccion ? "procesado" : "pendiente_mapeo"
        }
      );

      ok += 1;
    } catch (error) {
      failed += 1;
      await pocketbaseClient.collection("raw_eventos_produccion").create({
        source_system: event.sourceSystem,
        source_id: event.sourceId,
        payload: event.raw || {},
        estado: "error",
        error_msg: error.message
      });
    }
  }

  return { ok, failed };
};

export { upsertIntegrationEvents };
