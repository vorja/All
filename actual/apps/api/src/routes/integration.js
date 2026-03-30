import { Router } from 'express';
import { runSync } from '../services/integrationService.js';
import { fetchLotesFrituraFromApi, fetchLotesFrituraFromDb, fetchProduccionByDate } from '../services/agricolFetchService.js';
import { mapToIntegrationEvents } from '../services/mappingService.js';
import pocketbaseClient from '../utils/pocketbaseClient.js';
import { query as agricolQuery } from '../utils/agricolDbClient.js';

const router = Router();

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
    const source = String(req.query?.source || 'auto').toLowerCase();

    let lotesProduccion = [];
    let sourceUsed = 'api';
    let sourceWarning = '';
    let dbErrorDetail = '';

    if (source === 'db') {
      sourceUsed = 'db';
      try {
        lotesProduccion = await fetchLotesFrituraFromDb({ from, to });
      } catch (error) {
        lotesProduccion = [];
        dbErrorDetail = error.message;
      }
    } else {
      lotesProduccion = await fetchLotesFrituraFromApi().catch(() => []);
      if ((!Array.isArray(lotesProduccion) || lotesProduccion.length === 0) && source !== 'api') {
        let lotesDb = [];
        try {
          lotesDb = await fetchLotesFrituraFromDb({ from, to });
        } catch (error) {
          dbErrorDetail = error.message;
        }
        if (Array.isArray(lotesDb) && lotesDb.length > 0) {
          lotesProduccion = lotesDb;
          sourceUsed = 'db';
          sourceWarning = 'API de produccion sin respuesta/datos. Mostrando lotes desde DB de produccion.';
        }
      }
    }

    if (!Array.isArray(lotesProduccion)) {
      lotesProduccion = [];
    }
    if (lotesProduccion.length === 0 && !sourceWarning) {
      sourceWarning = source === 'db'
        ? 'No fue posible leer lotes desde DB de produccion (o no hay datos para los filtros).'
        : 'No fue posible leer lotes desde API de produccion (o no hay datos en este momento).';
      if (dbErrorDetail) {
        sourceWarning = `${sourceWarning} Detalle DB: ${dbErrorDetail}`;
      }
    }

    const lotesCostos = await pocketbaseClient.collection('lotes_produccion_ext').getFullList({
      sort: '-fecha_produccion'
    }).catch(() => []);

    const costosMap = new Map(
      lotesCostos.map((row) => [
        row.lote_produccion,
        {
          costoMateriaPrima: Number(row.costo_materia_prima_total || 0),
          costoTotal: Number(row.costo_total_lote || 0),
          margen: Number(row.margen_lote || 0)
        }
      ])
    );

    const merged = lotesProduccion.map((row, idx) => {
      const loteProduccion = row.lote_produccion || row.lote || `lote-${idx}`;
      const costo = costosMap.get(loteProduccion);
      const fecha = row.fecha_produccion || null;
      return {
        id: `${loteProduccion}-${idx}`,
        lote_produccion: loteProduccion,
        orden: row.orden || '-',
        fecha_produccion: fecha,
        kg_salida: Number(row.cantidad_kg || 0),
        cajas_salida: Number(row.total_cajas || 0),
        canastas: Number(row.canastas || 0),
        estado_valorizacion: costo && costo.costoMateriaPrima > 0 ? 'Valorizado' : 'Pendiente',
        estado_origen: Number(row.estado || 0) === 1 ? 'Activo' : 'Inactivo',
        costo_materia_prima_total: costo?.costoMateriaPrima || 0,
        costo_total_lote: costo?.costoTotal || 0,
        margen_lote: costo?.margen || 0
      };
    });

    const filtered = merged.filter((item) => {
      if (from && item.fecha_produccion && item.fecha_produccion < from) return false;
      if (to && item.fecha_produccion && item.fecha_produccion > to) return false;
      if (estado === 'pendiente' && item.estado_valorizacion !== 'Pendiente') return false;
      if (estado === 'valorizado' && item.estado_valorizacion !== 'Valorizado') return false;
      return true;
    });

    res.json({
      total: filtered.length,
      pendientes: filtered.filter((l) => l.estado_valorizacion === 'Pendiente').length,
      lotes: filtered,
      sourceWarning,
      filters: { from, to, estado, source },
      sourceUsed
    });
  } catch (error) {
    // Absolute fallback: never fail this route in UI.
    res.json({
      total: 0,
      pendientes: 0,
      lotes: [],
      sourceWarning: `Fallback activado en lotes: ${error.message}`
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
    const rows = await agricolQuery('SELECT COUNT(*) AS total FROM lotes_fritura');
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
