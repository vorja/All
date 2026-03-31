import { Router } from 'express';
import { runSync } from '../services/integrationService.js';
import {
  fetchLotesRecepcionMateriaPrimaFromDb,
  fetchRecepcionMateriaPrimaById,
  fetchProduccionByDate
} from '../services/agricolFetchService.js';
import { mapToIntegrationEvents } from '../services/mappingService.js';
import pocketbaseClient from '../utils/pocketbaseClient.js';
import { query as agricolQuery } from '../utils/agricolDbClient.js';

const router = Router();
const ESTADOS_VALIDOS = new Set(['todos', 'pendiente', 'valorizado']);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isIsoDate = (value) => !value || ISO_DATE_RE.test(String(value));

const toDateOnly = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return value.length >= 10 ? value.slice(0, 10) : value;
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const costMetaFromPb = (row) => {
  const kg = Number(row.kg_entrada || 0);
  const precioStored = Number(row.precio_kg_materia || 0);
  const costoMp = Number(row.costo_materia_prima_total || 0);
  const precioKg = precioStored > 0 ? precioStored : (kg > 0 && costoMp > 0 ? costoMp / kg : 0);
  return {
    pocketbaseId: row.id,
    precioKg,
    costoMateriaPrima: costoMp,
    costoTotal: Number(row.costo_total_lote || 0),
    margen: Number(row.margen_lote || 0)
  };
};

router.get('/agricol/status', async (_req, res, next) => {
  try {
    res.json({
      status: 'ready',
      integration: 'agricol_patacon_produccion'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/agricol/sync', async (req, res, next) => {
  try {
    const date = req.body?.date;
    const result = await runSync(date);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/agricol/preview', async (req, res, next) => {
  try {
    const date = req.query?.date || new Date().toISOString().slice(0, 10);
    let events = [];
    let sourceWarning = '';
    try {
      const sourceData = await fetchProduccionByDate(date);
      events = mapToIntegrationEvents(sourceData, date);
    } catch (error) {
      sourceWarning = `No fue posible leer preview desde API de produccion: ${error.message}`;
    }
    res.json({
      date,
      eventsCount: events.length,
      events,
      sourceWarning
    });
  } catch (error) {
    next(error);
  }
});

router.get('/agricol/lotes', async (req, res, next) => {
  try {
    const from = req.query?.from || '';
    const to = req.query?.to || '';
    const estado = String(req.query?.estado || 'todos').toLowerCase();
    const limit = Number(req.query?.limit || 100);

    if (!isIsoDate(from) || !isIsoDate(to)) {
      return res.status(400).json({ message: 'from/to deben usar formato YYYY-MM-DD.' });
    }
    if (!ESTADOS_VALIDOS.has(estado)) {
      return res.status(400).json({ message: 'estado debe ser: todos, pendiente o valorizado.' });
    }

    let recepciones;
    try {
      recepciones = await fetchLotesRecepcionMateriaPrimaFromDb({ from, to, limit });
    } catch (error) {
      console.error(
        '[GET /integration/agricol/lotes] fetchLotesRecepcionMateriaPrimaFromDb FAILED (MySQL):',
        error
      );
      return res.status(500).json({
        error: 'mysql_recepcion',
        message: error.message || String(error),
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState
      });
    }

    if (!Array.isArray(recepciones)) {
      recepciones = [];
    }

    let lotesCostos;
    try {
      lotesCostos = await pocketbaseClient.collection('lotes_produccion_ext').getFullList({
        sort: '-fecha_produccion'
      });
    } catch (error) {
      console.error(
        '[GET /integration/agricol/lotes] PocketBase lotes_produccion_ext getFullList FAILED:',
        error
      );
      return res.status(500).json({
        error: 'pocketbase',
        message: error.message || String(error)
      });
    }

    let sourceWarning = '';
    if (recepciones.length === 0) {
      sourceWarning =
        'Consulta MySQL correcta pero sin filas (tabla vacía o conexión apuntando a otra base).';
    }

    const costosMap = new Map();
    lotesCostos.forEach((row) => {
      const meta = costMetaFromPb(row);
      if (row.source_id) {
        costosMap.set(row.source_id, meta);
      }
      if (row.lote_produccion) {
        costosMap.set(row.lote_produccion, meta);
      }
    });

    const merged = recepciones.map((row) => {
      const sourceId = `rrmp:${row.recepcion_id}`;
      const internalKey = `RRMP-${row.recepcion_id}`;
      const costo = costosMap.get(sourceId) || costosMap.get(internalKey);
      const idLote = row.lote_codigo || internalKey;
      const kg = Number(row.kg_recibidos || 0);
      const precioKg = costo ? Number(costo.precioKg) : 0;
      const valorTotal = costo ? Number(costo.costoMateriaPrima) : 0;
      const fecha = toDateOnly(row.fecha_recepcion);
      const variedad = row.variedad || row.tipo_platano || '';
      const valorizado =
        costo &&
        (Number(costo.precioKg) > 0 || Number(costo.costoMateriaPrima) > 0);

      return {
        id: sourceId,
        recepcion_id: row.recepcion_id,
        id_lote: idLote,
        proveedor: row.proveedor_nombre || '',
        tipo_platano: row.tipo_platano || '',
        variedad,
        cantidad_kg: kg,
        orden_produccion: row.orden_produccion ?? null,
        fecha: fecha,
        precio_kg: precioKg,
        valor_total: valorTotal,
        costo_total_lote: costo ? Number(costo.costoTotal) : 0,
        margen_lote: costo ? Number(costo.margen) : 0,
        pocketbase_id: costo?.pocketbaseId || null,
        estado: valorizado ? 'Valorizado' : 'Pendiente'
      };
    });

    const filtered = merged.filter((item) => {
      if (estado === 'pendiente' && item.estado !== 'Pendiente') return false;
      if (estado === 'valorizado' && item.estado !== 'Valorizado') return false;
      return true;
    });

    res.json({
      total: filtered.length,
      pendientes: filtered.filter((l) => l.estado === 'Pendiente').length,
      lotes: filtered,
      sourceWarning,
      filters: { from, to, estado, limit },
      sourceUsed: 'mysql_recepcion_materia_prima'
    });
  } catch (error) {
    console.error('[GET /integration/agricol/lotes] UNEXPECTED error:', error);
    next(error);
  }
});

router.post('/agricol/lotes/valorizar', async (req, res) => {
  try {
    const recepcionId = Number(req.body?.recepcionId);
    const precioKg = Number(req.body?.precioKg);
    if (!recepcionId || !Number.isFinite(precioKg) || precioKg <= 0 || precioKg > 1000000) {
      return res.status(400).json({ message: 'recepcionId valido y precioKg entre 1 y 1000000 son requeridos.' });
    }

    const row = await fetchRecepcionMateriaPrimaById(recepcionId);
    if (!row) {
      return res.status(404).json({ message: 'Recepcion de materia prima no encontrada en MySQL.' });
    }

    const kg = Number(row.kg_recibidos || 0);
    const costoMp = precioKg * kg;
    const sourceId = `rrmp:${recepcionId}`;
    const variedad = row.variedad || '';

    const payload = {
      lote_produccion: `RRMP-${recepcionId}`,
      lote_proveedor: row.lote_codigo,
      source_id: sourceId,
      tipo_producto: row.tipo_platano,
      variedad,
      fecha_produccion: toDateOnly(row.fecha_recepcion),
      kg_entrada: kg,
      precio_kg_materia: precioKg,
      costo_materia_prima_total: costoMp,
      costo_total_lote: costoMp,
      ingreso_total_lote: 0
    };

    const existing = await pocketbaseClient.collection('lotes_produccion_ext').getFullList({
      filter: `source_id = '${sourceId}'`
    });

    let record;
    if (existing.length > 0) {
      record = await pocketbaseClient.collection('lotes_produccion_ext').update(existing[0].id, payload);
    } else {
      record = await pocketbaseClient.collection('lotes_produccion_ext').create(payload);
    }

    return res.json({
      ok: true,
      record,
      valor_total: costoMp,
      precio_kg: precioKg
    });
  } catch (error) {
    const msg = error?.message || String(error);
    const status = msg.includes('auth') || msg.includes('403') ? 503 : 500;
    return res.status(status).json({
      ok: false,
      message: `No se pudo guardar en PocketBase: ${msg}`
    });
  }
});

router.post('/agricol/lotes/sync-pocketbase', async (req, res) => {
  try {
    const from = req.body?.from || '';
    const to = req.body?.to || '';
    const limit = Number(req.body?.limit || 1000);

    if (!isIsoDate(from) || !isIsoDate(to)) {
      return res.status(400).json({ message: 'from/to deben usar formato YYYY-MM-DD.' });
    }

    const recepciones = await fetchLotesRecepcionMateriaPrimaFromDb({ from, to, limit });
    let created = 0;
    let updated = 0;

    for (const row of recepciones) {
      const sourceId = `rrmp:${row.recepcion_id}`;
      const kg = Number(row.kg_recibidos || 0);
      const payload = {
        lote_produccion: `RRMP-${row.recepcion_id}`,
        lote_proveedor: row.lote_codigo || '',
        source_id: sourceId,
        tipo_producto: row.tipo_platano || '',
        variedad: row.variedad || row.tipo_platano || '',
        fecha_produccion: toDateOnly(row.fecha_recepcion),
        kg_entrada: kg
      };
      const existing = await pocketbaseClient.collection('lotes_produccion_ext').getFullList({
        filter: `source_id = '${sourceId}'`
      });
      if (existing.length > 0) {
        await pocketbaseClient.collection('lotes_produccion_ext').update(existing[0].id, payload);
        updated += 1;
      } else {
        await pocketbaseClient.collection('lotes_produccion_ext').create(payload);
        created += 1;
      }
    }

    return res.json({
      ok: true,
      total_mysql: recepciones.length,
      created,
      updated
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || String(error)
    });
  }
});

router.get('/agricol/diagnostics', async (_req, res) => {
  let apiUp = false;
  let apiDetail = '';
  let mysqlUp = false;
  let mysqlDetail = '';
  let lotesCount = 0;

  try {
    const apiUrl = process.env.AGRICOL_API_URL || '';
    if (apiUrl) {
      const response = await fetch(apiUrl, { method: 'GET' });
      apiUp = response.status < 500;
      apiDetail = `HTTP ${response.status}`;
    } else {
      apiDetail = 'AGRICOL_API_URL no configurada';
    }
  } catch (error) {
    apiDetail = error.message;
  }

  try {
    const rows = await agricolQuery('SELECT COUNT(*) AS total FROM registro_recepcion_materia_prima');
    lotesCount = Number(rows?.[0]?.total || 0);
    mysqlUp = true;
    mysqlDetail = 'OK';
  } catch (error) {
    mysqlDetail = error.message;
  }

  res.json({
    api_up: apiUp,
    api_detail: apiDetail,
    mysql_up: mysqlUp,
    mysql_detail: mysqlDetail,
    lotes_count: lotesCount
  });
});

export default router;
